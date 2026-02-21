import { Footer } from "./footer";

interface RootLayoutProps {
  children: React.ReactNode;
  activeTheme: string;
  onSelectTheme: (id: string) => void;
}

export function RootLayout({ children, activeTheme, onSelectTheme }: RootLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
      <Footer activeTheme={activeTheme} onSelectTheme={onSelectTheme} />
    </div>
  );
}
