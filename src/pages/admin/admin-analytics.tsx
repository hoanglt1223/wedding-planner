import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminBarChart } from "./admin-bar-chart";
import { AdminStatCard } from "./admin-stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EventType { type: string; count: number; }
interface DayCount { day: string; count: number; }

interface AnalyticsData {
  eventsByType: EventType[];
  dailyEvents: DayCount[];
  dailyUsers: DayCount[];
  from: string;
  to: string;
}

function toDateInputValue(d: Date) {
  return d.toISOString().split("T")[0];
}

export default function AdminAnalytics() {
  const now = new Date();
  const defaultFrom = toDateInputValue(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));
  const defaultTo = toDateInputValue(now);

  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ action: "analytics", from, to });
      const res = await fetch(`/api/admin/data?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      setData(await res.json() as AnalyticsData);
    } catch {
      setError("Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const totalEvents = data?.dailyEvents.reduce((s, d) => s + d.count, 0) ?? 0;
  const maxDailyUsers = data?.dailyUsers.length ? Math.max(...data.dailyUsers.map((d) => d.count)) : 0;

  const eventBarData = (data?.eventsByType ?? []).map((e) => ({ label: e.type, value: e.count }));
  const dailyUserBarData = (data?.dailyUsers ?? []).map((d) => ({ label: d.day.slice(5), value: d.count, color: "bg-blue-400" }));

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <h1 className="text-xl font-semibold">Analytics</h1>
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-xs text-muted-foreground">From</label>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-36 text-xs" />
          <label className="text-xs text-muted-foreground">To</label>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-36 text-xs" />
          <Button size="sm" onClick={load}>Apply</Button>
        </div>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {data && !loading && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <AdminStatCard title="Total Events" value={totalEvents} subtitle={`${from} → ${to}`} />
            <AdminStatCard title="Event Types" value={data.eventsByType.length} />
            <AdminStatCard title="Peak Daily Users" value={maxDailyUsers} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Events by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminBarChart data={eventBarData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Daily Unique Users</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminBarChart data={dailyUserBarData} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
