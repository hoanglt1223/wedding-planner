import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Users, BarChart3, Settings, LogOut, Menu, X } from "lucide-react";
import { adminLogout } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  route: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { route: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { route: "users", label: "Users", icon: <Users size={18} /> },
  { route: "analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
  { route: "system", label: "System", icon: <Settings size={18} /> },
];

interface AdminSidebarProps {
  currentRoute: string;
  onLogout: () => void;
}

export function AdminSidebar({ currentRoute, onLogout }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    await adminLogout();
    onLogout();
  }

  function handleNavigate(route: string) {
    void navigate({ to: `/admin/${route}` as never });
    setMobileOpen(false);
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5">
        <h1 className="text-base font-semibold text-gray-800">Admin Panel</h1>
      </div>
      <Separator />
      <nav className="flex-1 px-2 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Button
            key={item.route}
            variant="ghost"
            className={`w-full justify-start gap-3 text-sm font-normal ${
              currentRoute === item.route
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => handleNavigate(item.route)}
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
      </nav>
      <Separator />
      <div className="px-2 py-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sm text-gray-600 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-white h-full shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile toggle */}
      <div className="md:hidden fixed top-3 left-3 z-50">
        <Button
          variant="ghost"
          size="sm"
          className="bg-white border shadow-sm"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <aside className="w-64 bg-white border-r h-full shadow-xl">
            <div className="pt-12">{sidebarContent}</div>
          </aside>
          <div className="flex-1 bg-black/30" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
