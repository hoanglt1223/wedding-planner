import { Footer } from "./footer";

interface RootLayoutProps {
  children: React.ReactNode;
  lang?: string;
}

export function RootLayout({ children, lang }: RootLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
      <Footer lang={lang} />
    </div>
  );
}
