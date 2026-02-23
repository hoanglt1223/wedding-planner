import { ThemePicker } from "./theme-picker";

interface FooterProps {
  activeTheme: string;
  onSelectTheme: (id: string) => void;
}

export function Footer({ activeTheme, onSelectTheme }: FooterProps) {
  return (
    <footer className="mt-4 border-t border-amber-100">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <p className="text-xs text-muted-foreground">
          Wedding Planner &copy; {new Date().getFullYear()}
        </p>
        <ThemePicker activeTheme={activeTheme} onSelectTheme={onSelectTheme} />
      </div>
    </footer>
  );
}
