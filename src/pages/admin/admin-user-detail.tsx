import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface UserDetail {
  id: string;
  groomName: string | null;
  brideName: string | null;
  groomBirthDate: string | null;
  brideBirthDate: string | null;
  weddingDate: string | null;
  region: string | null;
  lang: string | null;
  guestCount: number | null;
  checklistProgress: number | null;
  budget: number | null;
  onboardingComplete: boolean | null;
  createdAt: string;
  updatedAt: string;
  weddingData: unknown;
}

interface AdminUserDetailProps {
  userId: string;
  onClose: () => void;
}

export function AdminUserDetail({ userId, onClose }: AdminUserDetailProps) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [jsonOpen, setJsonOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/data?action=user-detail&id=${encodeURIComponent(userId)}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { if (!cancelled) { setUser(d as UserDetail); setLoading(false); } })
      .catch(() => { if (!cancelled) { setUser(null); setLoading(false); } });
    return () => { cancelled = true; };
  }, [userId]);

  if (loading) {
    return <div className="p-4 text-sm text-muted-foreground">Loading...</div>;
  }
  if (!user) {
    return <div className="p-4 text-sm text-destructive">Failed to load user.</div>;
  }

  const pct = Math.round((user.checklistProgress ?? 0) * 100);

  return (
    <div className="p-4 space-y-4 text-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-base">User Detail</h2>
        <Button size="sm" variant="ghost" onClick={onClose}>Close</Button>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <span className="text-muted-foreground">ID</span>
        <span className="font-mono text-xs truncate">{user.id}</span>
        <span className="text-muted-foreground">Groom</span>
        <span>{user.groomName ?? "—"}</span>
        <span className="text-muted-foreground">Bride</span>
        <span>{user.brideName ?? "—"}</span>
        <span className="text-muted-foreground">Wedding Date</span>
        <span>{user.weddingDate ?? "—"}</span>
        <span className="text-muted-foreground">Region</span>
        <span>{user.region ?? "—"}</span>
        <span className="text-muted-foreground">Language</span>
        <span>{user.lang ?? "—"}</span>
        <span className="text-muted-foreground">Guests</span>
        <span>{user.guestCount ?? 0}</span>
        <span className="text-muted-foreground">Budget</span>
        <span>{user.budget ? user.budget.toLocaleString() : "—"}</span>
        <span className="text-muted-foreground">Progress</span>
        <span>{pct}%</span>
        <span className="text-muted-foreground">Onboarded</span>
        <span>
          <Badge variant={user.onboardingComplete ? "default" : "secondary"}>
            {user.onboardingComplete ? "Yes" : "No"}
          </Badge>
        </span>
        <span className="text-muted-foreground">Last Active</span>
        <span>{new Date(user.updatedAt).toLocaleString()}</span>
      </div>

      <Collapsible open={jsonOpen} onOpenChange={setJsonOpen}>
        <CollapsibleTrigger asChild>
          <Button size="sm" variant="outline" className="w-full">
            {jsonOpen ? "Hide" : "Show"} Raw Wedding Data
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto max-h-64 whitespace-pre-wrap break-all">
            {JSON.stringify(user.weddingData, null, 2)}
          </pre>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
