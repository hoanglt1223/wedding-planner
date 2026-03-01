import { useState, useEffect, useRef } from "react";

function isStandalone(): boolean {
  return window.matchMedia("(display-mode: standalone)").matches;
}

function isIos(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

interface InstallPromptProps {
  lang?: string;
}

export function InstallPrompt({ lang = "vi" }: InstallPromptProps) {
  const [show, setShow] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone()) return;
    if (localStorage.getItem("pwa_install_dismissed")) return;

    // Android: capture beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS Safari: show manual instructions
    if (isIos()) setShow(true);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!show) return null;

  const dismiss = () => {
    localStorage.setItem("pwa_install_dismissed", "1");
    setShow(false);
  };

  const handleInstall = async () => {
    if (deferredPrompt.current) {
      await deferredPrompt.current.prompt();
      deferredPrompt.current = null;
      setShow(false);
    }
  };

  const title = lang === "en" ? "Add to Home Screen" : "Thêm vào Màn hình chính";
  const iosHint = lang === "en"
    ? <>Tap <span className="inline-block mx-0.5">⎙</span> then &quot;Add to Home Screen&quot;</>
    : <>Nhấn <span className="inline-block mx-0.5">⎙</span> rồi chọn &quot;Thêm vào MHC&quot;</>;
  const installLabel = lang === "en" ? "Install" : "Cài đặt";

  return (
    <div className="fixed bottom-16 inset-x-0 z-50 p-3 bg-white/95 backdrop-blur border-t shadow-lg md:hidden"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="max-w-md mx-auto flex items-center gap-3">
        <div className="text-2xl">💍</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-gray-500">
            {isIos() ? iosHint : (
              <button onClick={handleInstall} className="text-[var(--theme-primary)] font-semibold">
                {installLabel}
              </button>
            )}
          </p>
        </div>
        <button
          onClick={dismiss}
          className="text-gray-400 hover:text-gray-600 text-lg font-bold min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
}
