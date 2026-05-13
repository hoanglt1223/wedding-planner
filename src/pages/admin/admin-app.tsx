import { lazy, Suspense, useEffect, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { adminVerify } from "@/lib/admin-api";
import { AdminLogin } from "./admin-login";
import { AdminSidebar } from "./admin-sidebar";

const AdminDashboard = lazy(() => import("./admin-dashboard"));
const AdminUsers = lazy(() => import("./admin-users"));
const AdminAnalytics = lazy(() => import("./admin-analytics"));
const AdminSystem = lazy(() => import("./admin-system"));

function parseAdminRoute(): string {
  const path = window.location.pathname;
  const sub = path.replace("/admin", "").replace(/^\//, "");
  return sub || "dashboard";
}

function AdminContent({ route }: { route: string }) {
  const fallback = <div className="p-6 text-sm text-muted-foreground">Loading...</div>;
  switch (route) {
    case "users":
      return <Suspense fallback={fallback}><AdminUsers /></Suspense>;
    case "analytics":
      return <Suspense fallback={fallback}><AdminAnalytics /></Suspense>;
    case "system":
      return <Suspense fallback={fallback}><AdminSystem /></Suspense>;
    default:
      return <Suspense fallback={fallback}><AdminDashboard /></Suspense>;
  }
}

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRoute, setCurrentRoute] = useState(parseAdminRoute);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    adminVerify().then((authenticated) => {
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    setCurrentRoute(parseAdminRoute());
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-app bg-background text-foreground overflow-hidden">
      <AdminSidebar
        currentRoute={currentRoute}
        onLogout={() => {
          setIsAuthenticated(false);
          void navigate({ to: "/admin" });
        }}
      />
      <main className="flex-1 overflow-auto bg-gray-50">
        <AdminContent route={currentRoute} />
      </main>
    </div>
  );
}
