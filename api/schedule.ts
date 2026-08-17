/**
 * Wedding Schedule Share API
 * Handles shared wedding schedule access and authentication
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createDb } from '../src/db/index';
import { userSessions, scheduleShares } from '../src/db/schema';
import { eq, and } from 'drizzle-orm';

interface ScheduleRequest {
  password?: string;
}

interface ScheduleResponse {
  requiresPassword?: boolean;
  showContactInfo?: boolean;
  showVendorNotes?: boolean;
  allowDownload?: boolean;
  scheduleId?: string;
  weddingDate?: string;
  coupleNames?: string;
  timeline?: any[];
  contacts?: any[];
  venues?: any[];
  notes?: string;
  lang?: 'vi' | 'en';
  customMessage?: string;
  theme?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET and POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Invalid token' });
    }

    const db = createDb();

    // Find schedule share by token
    const shares = await db
      .select()
      .from(scheduleShares)
      .where(eq(scheduleShares.shareToken, token))
      .limit(1);

    if (shares.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    const share = shares[0];

    // Check expiry
    if (share.expiryDate && new Date(share.expiryDate) < new Date()) {
      return res.status(410).json({ error: 'Schedule has expired' });
    }

    // If password is set and this is a GET request, return password requirement
    if (share.password && req.method === 'GET') {
      return res.json({
        requiresPassword: true,
        showContactInfo: share.showContactInfo,
        showVendorNotes: share.showVendorNotes,
        allowDownload: share.allowDownload
      } as ScheduleResponse);
    }

    // If password is set, verify it
    if (share.password) {
      const body: ScheduleRequest = req.body || {};
      if (!body.password || body.password !== share.password) {
        return res.status(401).json({ error: 'Incorrect password' });
      }
    }

    // Get wedding session data
    const sessions = await db
      .select({
        weddingData: userSessions.weddingData
      })
      .from(userSessions)
      .where(eq(userSessions.id, share.sessionId))
      .limit(1);

    if (sessions.length === 0) {
      return res.status(404).json({ error: 'Wedding session not found' });
    }

    const weddingData = sessions[0].weddingData as any;

    // Extract relevant schedule data
    const timeline = weddingData.timeline || [];
    const contacts = weddingData.contacts || [];
    const info = weddingData.info || {};

    // Build response
    const response: ScheduleResponse = {
      scheduleId: share.id,
      weddingDate: info.date || '',
      coupleNames: `${info.bride || ''} & ${info.groom || ''}`,
      timeline: timeline,
      contacts: contacts,
      venues: weddingData.venues || [],
      notes: weddingData.notes,
      lang: weddingData.lang || 'vi',
      customMessage: share.customMessage,
      theme: weddingData.themeId || 'traditional-red'
    };

    return res.json(response);

  } catch (error) {
    console.error('Schedule share error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}