import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SystemData {
  db: string;
  redis: string;
  activeSessions: number;
  lastSync: string | null;
  envVars: Record<string, string>;
  version: string;
}

function StatusDot({ status }: { status: string }) {
  const ok = status === "ok" || status === "set";
  return (
    <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${ok ? "bg-green-500" : "bg-red-500"}`} />
  );
}

export default function AdminSystem() {
  const [data, setData] = useState<SystemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin?action=system", { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      setData(await res.json() as SystemData);
    } catch {
      setError("Failed to load system status.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">System</h1>
        <Button size="sm" variant="outline" onClick={load} disabled={loading}>Refresh</Button>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {data && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Services</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center">
                <StatusDot status={data.db} />
                <span>Database</span>
                <Badge className="ml-auto" variant={data.db === "ok" ? "default" : "destructive"}>{data.db}</Badge>
              </div>
              <div className="flex items-center">
                <StatusDot status={data.redis} />
                <span>Redis</span>
                <Badge className="ml-auto" variant={data.redis === "ok" ? "default" : "destructive"}>{data.redis}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Info</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Sessions</span>
                <span>{data.activeSessions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Sync</span>
                <span>{data.lastSync ? new Date(data.lastSync).toLocaleString() : "Never"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span className="font-mono text-xs">{data.version?.slice(0, 8)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Environment Variables</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(data.envVars).map(([key, status]) => (
                  <div key={key} className="flex items-center text-xs">
                    <StatusDot status={status} />
                    <span className="font-mono truncate">{key}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
