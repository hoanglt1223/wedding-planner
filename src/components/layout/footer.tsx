export function Footer() {
  return (
    <footer className="mt-4 border-t border-amber-100">
      <div className="container mx-auto flex h-12 items-center justify-center px-4">
        <p className="text-xs text-muted-foreground">
          Wedding Planner &copy; {new Date().getFullYear()} — Vietnamese Wedding Planner
        </p>
      </div>
    </footer>
  );
}
