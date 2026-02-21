interface PartyTimeToggleProps {
  value: "noon" | "afternoon";
  onChange: (v: "noon" | "afternoon") => void;
}

export function PartyTimeToggle({ value, onChange }: PartyTimeToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden text-[0.68rem]">
      <button
        onClick={() => onChange("noon")}
        className={`px-2.5 py-1 font-medium transition-colors ${
          value === "noon"
            ? "bg-red-600 text-white"
            : "bg-white text-gray-600 hover:bg-gray-50"
        }`}
      >
        🌞 Trưa (11h)
      </button>
      <button
        onClick={() => onChange("afternoon")}
        className={`px-2.5 py-1 font-medium transition-colors ${
          value === "afternoon"
            ? "bg-red-600 text-white"
            : "bg-white text-gray-600 hover:bg-gray-50"
        }`}
      >
        🌇 Chiều (17h)
      </button>
    </div>
  );
}
