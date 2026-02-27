import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Vendor { id: number; category: string; name: string; phone: string; address: string; note: string }
interface PhotoItem { id: number; url: string; tag: string; note: string }
interface Guest { id: number; name: string; phone: string; side: string; tableGroup: string }

interface WeddingData {
  guests?: Guest[];
  vendors?: Vendor[];
  photos?: PhotoItem[];
  expenses?: Record<string, number>;
  budgetOverrides?: Record<string, number>;
  enabledSteps?: Record<string, boolean>;
  checkedItems?: Record<string, boolean>;
  notes?: string;
  [key: string]: unknown;
}

interface UserDetail {
  id: string;
  groomName: string | null;
  brideName: string | null;
  groomBirthDate: string | null;
  brideBirthDate: string | null;
  weddingDate: string | null;
  engagementDate: string | null;
  partyTime: string | null;
  region: string | null;
  lang: string | null;
  guestCount: number | null;
  vendorCount: number | null;
  photoCount: number | null;
  checklistProgress: number | null;
  budget: number | null;
  onboardingComplete: boolean | null;
  createdAt: string;
  updatedAt: string;
  weddingData: WeddingData | null;
}

interface Props { userId: string; onClose: () => void }

export function AdminUserDetail({ userId, onClose }: Props) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<"info" | "guests" | "vendors" | "photos" | "steps" | "json">("info");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/data?action=user-detail&id=${encodeURIComponent(userId)}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { if (!cancelled) { setUser(d as UserDetail); setLoading(false); } })
      .catch(() => { if (!cancelled) { setUser(null); setLoading(false); } });
    return () => { cancelled = true; };
  }, [userId]);

  if (loading) return <div className="p-4 text-sm text-muted-foreground">Loading...</div>;
  if (!user) return <div className="p-4 text-sm text-destructive">Failed to load user.</div>;

  const wd = user.weddingData;
  const guests = wd?.guests ?? [];
  const vendors = wd?.vendors ?? [];
  const photos = wd?.photos ?? [];
  const pct = Math.round((user.checklistProgress ?? 0) * 100);

  const enabledSteps = wd?.enabledSteps ?? {};
  const skippedCount = Object.values(enabledSteps).filter((v) => v === false).length;

  const tabs: { id: typeof section; label: string; count?: number }[] = [
    { id: "info", label: "Info" },
    { id: "guests", label: "Guests", count: guests.length },
    { id: "vendors", label: "Vendors", count: vendors.length },
    { id: "photos", label: "Photos", count: photos.length },
    { id: "steps", label: "Steps", count: skippedCount > 0 ? skippedCount : undefined },
    { id: "json", label: "JSON" },
  ];

  return (
    <div className="p-4 space-y-4 text-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-base">
          {user.groomName ?? "?"} & {user.brideName ?? "?"}
        </h2>
        <Button size="sm" variant="ghost" onClick={onClose}>Close</Button>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 border-b pb-1">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setSection(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-t transition-colors ${
              section === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}>
            {tab.label}{tab.count !== undefined ? ` (${tab.count})` : ""}
          </button>
        ))}
      </div>

      {section === "info" && <InfoSection user={user} pct={pct} />}
      {section === "guests" && <GuestsSection guests={guests} />}
      {section === "vendors" && <VendorsSection vendors={vendors} />}
      {section === "photos" && <PhotosSection photos={photos} />}
      {section === "steps" && <StepsSection enabledSteps={enabledSteps} />}
      {section === "json" && <JsonSection data={wd} />}
    </div>
  );
}

/* ---------- Info ---------- */

function InfoSection({ user, pct }: { user: UserDetail; pct: number }) {
  const rows: [string, string][] = [
    ["ID", user.id],
    ["Groom", user.groomName ?? "—"],
    ["Bride", user.brideName ?? "—"],
    ["Groom Birth", user.groomBirthDate ?? "—"],
    ["Bride Birth", user.brideBirthDate ?? "—"],
    ["Wedding Date", user.weddingDate ?? "—"],
    ["Party/Engagement", user.engagementDate ?? "—"],
    ["Region", user.region ?? "—"],
    ["Party Time", user.partyTime ?? "—"],
    ["Language", user.lang ?? "—"],
    ["Budget", user.budget ? `${user.budget.toLocaleString()} VNĐ` : "—"],
    ["Progress", `${pct}%`],
    ["Guests", String(user.guestCount ?? 0)],
    ["Vendors", String(user.vendorCount ?? 0)],
    ["Photos", String(user.photoCount ?? 0)],
    ["Notes", (user.weddingData?.notes || "—") as string],
    ["Created", new Date(user.createdAt).toLocaleString()],
    ["Last Active", new Date(user.updatedAt).toLocaleString()],
  ];
  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
      {rows.map(([label, value]) => (
        <Fragment key={label}>
          <span className="text-muted-foreground whitespace-nowrap">{label}</span>
          <span className={label === "ID" ? "font-mono text-xs truncate" : ""}>{value}</span>
        </Fragment>
      ))}
      <span className="text-muted-foreground">Onboarded</span>
      <span>
        <Badge variant={user.onboardingComplete ? "default" : "secondary"}>
          {user.onboardingComplete ? "Yes" : "No"}
        </Badge>
      </span>
    </div>
  );
}

import { Fragment } from "react";

/* ---------- Guests ---------- */

function GuestsSection({ guests }: { guests: Guest[] }) {
  if (!guests.length) return <p className="text-muted-foreground">No guests added.</p>;
  return (
    <div className="max-h-96 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Side</TableHead>
            <TableHead>Table</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((g, i) => (
            <TableRow key={g.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{g.name}</TableCell>
              <TableCell className="font-mono text-xs">{g.phone || "—"}</TableCell>
              <TableCell>{g.side || "—"}</TableCell>
              <TableCell>{g.tableGroup || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/* ---------- Vendors ---------- */

function VendorsSection({ vendors }: { vendors: Vendor[] }) {
  if (!vendors.length) return <p className="text-muted-foreground">No vendors added.</p>;
  return (
    <div className="max-h-96 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((v, i) => (
            <TableRow key={v.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell><Badge variant="outline">{v.category}</Badge></TableCell>
              <TableCell>{v.name}</TableCell>
              <TableCell className="font-mono text-xs">{v.phone || "—"}</TableCell>
              <TableCell className="max-w-[200px] truncate">{v.address || "—"}</TableCell>
              <TableCell className="max-w-[150px] truncate">{v.note || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/* ---------- Photos ---------- */

function PhotosSection({ photos }: { photos: PhotoItem[] }) {
  if (!photos.length) return <p className="text-muted-foreground">No photos added.</p>;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-auto">
        {photos.map((ph) => (
          <div key={ph.id} className="border rounded-lg overflow-hidden">
            <img src={ph.url} alt={ph.tag || "photo"} className="w-full h-32 object-cover bg-muted"
              onError={(e) => { (e.target as HTMLImageElement).src = ""; (e.target as HTMLImageElement).alt = "Failed to load"; }} />
            <div className="p-2">
              {ph.tag && <Badge variant="outline" className="text-[10px] mb-1">{ph.tag}</Badge>}
              {ph.note && <p className="text-xs text-muted-foreground truncate">{ph.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Steps ---------- */

function StepsSection({ enabledSteps }: { enabledSteps: Record<string, boolean> }) {
  const entries = Object.entries(enabledSteps);
  if (!entries.length) return <p className="text-muted-foreground">All steps enabled (default).</p>;
  return (
    <div className="max-h-96 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Step ID</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map(([id, enabled]) => (
            <TableRow key={id}>
              <TableCell className="font-mono text-xs">{id}</TableCell>
              <TableCell>
                <Badge variant={enabled ? "default" : "secondary"}>
                  {enabled ? "Enabled" : "Skipped"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/* ---------- Raw JSON ---------- */

function JsonSection({ data }: { data: WeddingData | null }) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button size="sm" variant="outline" className="w-full">
          {open ? "Hide" : "Show"} Raw Wedding Data
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto max-h-96 whitespace-pre-wrap break-all">
          {JSON.stringify(data, null, 2)}
        </pre>
      </CollapsibleContent>
    </Collapsible>
  );
}
