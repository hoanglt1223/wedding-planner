import { useState, useEffect, useCallback } from "react";

/** Convert "YYYY-MM-DD" → "DD-MM-YYYY" for display */
export function isoToDisplay(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

/** Convert "DD-MM-YYYY" → "YYYY-MM-DD" for storage. Returns "" if invalid. */
export function displayToIso(display: string): string {
  const m = display.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
}

/** Auto-format as user types: insert dashes after DD and MM */
function formatDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
}

interface DateInputProps {
  /** ISO "YYYY-MM-DD" value */
  value: string;
  /** Called with ISO "YYYY-MM-DD" on valid change */
  onChange: (iso: string) => void;
  className?: string;
  placeholder?: string;
}

/**
 * Text-based date input that displays dd-mm-yyyy format.
 * Stores/receives ISO YYYY-MM-DD externally.
 */
export function DateInput({ value, onChange, className = "", placeholder }: DateInputProps) {
  const [display, setDisplay] = useState(() => isoToDisplay(value));

  // Sync from external value changes
  useEffect(() => {
    const expected = isoToDisplay(value);
    if (expected !== display) setDisplay(expected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatDateInput(e.target.value);
      setDisplay(formatted);
      const iso = displayToIso(formatted);
      if (iso) onChange(iso);
    },
    [onChange],
  );

  return (
    <input
      value={display}
      onChange={handleChange}
      placeholder={placeholder ?? "dd-mm-yyyy"}
      maxLength={10}
      className={className}
    />
  );
}
