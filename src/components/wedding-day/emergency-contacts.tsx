/**
 * Emergency Contacts
 * Quick access to emergency contacts and wedding party
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, AlertTriangle } from "lucide-react";
import type { WeddingContact, WeddingPartyMember } from "@/types/wedding";

interface EmergencyContactsProps {
  contacts: WeddingContact[];
  weddingParty: WeddingPartyMember[];
  lang: string;
}

export function EmergencyContacts({
  contacts,
  weddingParty,
  lang
}: EmergencyContactsProps) {
  const title = lang === "en" ? "Emergency Contacts" : "Liên Hệ Khẩn Cấp";
  const callText = lang === "en" ? "Call" : "Gọi";
  const noContactsText = lang === "en" ? "No emergency contacts" : "Chưa có liên hệ khẩn cấp";

  // Get emergency and family contacts
  const emergencyContacts = contacts.filter(
    c => c.phone && c.phone.trim() !== "" &&
    (c.category === "family" || c.role.toLowerCase().includes("emergency") ||
     c.role.toLowerCase().includes("khẩn cấp"))
  );

  // Get wedding party contacts
  const weddingPartyContacts = weddingParty
    .filter(wp => wp.phone && wp.phone.trim() !== "")
    .map(wp => ({
      id: wp.id,
      name: wp.name,
      role: wp.role,
      phone: wp.phone,
      category: "wedding-party" as const,
      note: "",
    }));

  const allEmergencyContacts = [...emergencyContacts, ...weddingPartyContacts];

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  if (allEmergencyContacts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{noContactsText}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {allEmergencyContacts.map(contact => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-3 border rounded-lg bg-destructive/5"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{contact.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {contact.role}
                  </Badge>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => handleCall(contact.phone)}
                className="ml-2 bg-destructive hover:bg-destructive/90"
              >
                <Phone className="w-4 h-4 mr-1" />
                {callText}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
