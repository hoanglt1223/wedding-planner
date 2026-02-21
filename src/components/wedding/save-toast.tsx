interface SaveToastProps {
  visible: boolean;
}

export function SaveToast({ visible }: SaveToastProps) {
  return (
    <div
      className={`fixed bottom-2.5 right-2.5 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold z-50 transition-opacity duration-300 pointer-events-none ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      Đã lưu
    </div>
  );
}
