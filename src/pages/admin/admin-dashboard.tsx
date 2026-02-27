import { useEffect, useState } from "react";
import { AdminStatCard } from "./admin-stat-card";
import { AdminBarChart } from "./admin-bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardData {
  totalUsers: number;
  activeToday: number;
  activeWeek: number;
  activeMonth: number;
  avgProgress: number;
  avgBudget: number;
  onboardedCount: number;
  regionBreakdown: Record<string, number>;
  langBreakdown: Record<string, number>;
}

async function fetchDashboard(): Promise<DashboardData> {
  const res = await fetch("/api/admin?action=dashboard", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load dashboard");
  return res.json() as Promise<DashboardData>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setData(await fetchDashboard());
    } catch {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;
  }
  if (error || !data) {
    return (
      <div className="p-6">
        <p className="text-sm text-destructive">{error}</p>
        <Button size="sm" className="mt-2" onClick={load}>Retry</Button>
      </div>
    );
  }

  const regionData = Object.entries(data.regionBreakdown).map(([label, value]) => ({ label, value }));
  const langData = Object.entries(data.langBreakdown).map(([label, value]) => ({ label, value }));
  const onboardedPct = data.totalUsers > 0 ? Math.round((data.onboardedCount / data.totalUsers) * 100) : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <Button size="sm" variant="outline" onClick={load}>Refresh</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard title="Total Users" value={data.totalUsers} />
        <AdminStatCard title="Active Today" value={data.activeToday} />
        <AdminStatCard title="Active This Week" value={data.activeWeek} />
        <AdminStatCard title="Active This Month" value={data.activeMonth} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdminStatCard
          title="Onboarded"
          value={`${data.onboardedCount} (${onboardedPct}%)`}
          subtitle="Completed onboarding"
        />
        <AdminStatCard
          title="Avg. Checklist"
          value={`${Math.round((data.avgProgress ?? 0) * 100)}%`}
          subtitle="Progress among onboarded"
        />
        <AdminStatCard
          title="Avg. Budget"
          value={data.avgBudget ? `${Math.round(data.avgBudget).toLocaleString()} VND` : "—"}
          subtitle="Among users with budget"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Region Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminBarChart data={regionData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Language Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminBarChart data={langData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
