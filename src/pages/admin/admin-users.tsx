import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { AdminUserDetail } from "./admin-user-detail";

interface UserRow {
  id: string;
  groomName: string | null;
  brideName: string | null;
  weddingDate: string | null;
  region: string | null;
  lang: string | null;
  guestCount: number | null;
  checklistProgress: number | null;
  budget: number | null;
  onboardingComplete: boolean | null;
  updatedAt: string;
}

interface UsersResponse { users: UserRow[]; total: number; page: number; limit: number; }

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("updated_at");
  const [order, setOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const limit = 50;

  async function load(p: number, s: string, sortCol: string, sortOrder: string) {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(p), limit: String(limit), sort: sortCol, order: sortOrder,
        ...(s ? { search: s } : {}),
      });
      const res = await fetch(`/api/admin/users?${params}`, { credentials: "include" });
      const data = await res.json() as UsersResponse;
      setUsers(data.users);
      setTotal(data.total);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  useEffect(() => { load(page, search, sort, order); }, [page, sort, order]);

  function onSearchChange(val: string) {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setPage(1); load(1, val, sort, order); }, 500);
  }

  function toggleSort(col: string) {
    if (sort === col) { setOrder((o) => (o === "asc" ? "desc" : "asc")); }
    else { setSort(col); setOrder("desc"); }
    setPage(1);
  }

  const totalPages = Math.ceil(total / limit);
  const SortIndicator = ({ col }: { col: string }) =>
    sort === col ? (order === "asc" ? " ↑" : " ↓") : "";

  if (selectedId) {
    return <AdminUserDetail userId={selectedId} onClose={() => setSelectedId(null)} />;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Users</h1>
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("groom_name")}>Groom<SortIndicator col="groom_name" /></TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("bride_name")}>Bride<SortIndicator col="bride_name" /></TableHead>
              <TableHead>Wedding</TableHead>
              <TableHead>Region</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("checklist_progress")}>Progress<SortIndicator col="checklist_progress" /></TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("budget")}>Budget<SortIndicator col="budget" /></TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("updated_at")}>Last Active<SortIndicator col="updated_at" /></TableHead>
              <TableHead>Done</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedId(u.id)}>
                <TableCell>{u.groomName ?? "—"}</TableCell>
                <TableCell>{u.brideName ?? "—"}</TableCell>
                <TableCell>{u.weddingDate ?? "—"}</TableCell>
                <TableCell>{u.region ?? "—"}</TableCell>
                <TableCell>{Math.round((u.checklistProgress ?? 0) * 100)}%</TableCell>
                <TableCell>{u.budget ? u.budget.toLocaleString() : "—"}</TableCell>
                <TableCell className="text-xs">{new Date(u.updatedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={u.onboardingComplete ? "default" : "secondary"}>
                    {u.onboardingComplete ? "Yes" : "No"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {!users.length && (
              <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">No users found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{total} total</span>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
          <span>Page {page} / {totalPages || 1}</span>
          <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}
