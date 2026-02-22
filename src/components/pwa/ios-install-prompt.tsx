import { useState, useEffect } from "react";

function isIosSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(ua);
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  return isIos && !isStandalone;
}

export function IosInstallPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isIosSafari()) return;
    const dismissed = localStorage.getItem("pwa_ios_dismissed");
    if (!dismissed) setShow(true);
  }, []);

  if (!show) return null;

  const handleDismiss = () => {
    localStorage.setItem("pwa_ios_dismissed", "1");
    setShow(false);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-3 bg-white/95 backdrop-blur border-t shadow-lg">
      <div className="max-w-md mx-auto flex items-center gap-3">
        <div className="text-2xl">💍</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">Thêm vào Màn hình chính</p>
          <p className="text-xs text-gray-500">
            Nhấn <span className="inline-block mx-0.5">⎙</span> rồi chọn "Thêm vào MHC"
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 text-lg font-bold px-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
