import { useState } from "react";
import type { WeddingContact, Vendor, WeddingPartyMember } from "@/types/wedding";

interface EmergencyContactsWidgetProps {
  contacts: WeddingContact[];
  vendors: Vendor[];
  weddingParty: WeddingPartyMember[];
  lang?: string;
}

interface QuickContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  icon: string;
  source: "contact" | "vendor" | "party";
}

function buildQuickContacts(
  contacts: WeddingContact[],
  vendors: Vendor[],
  party: WeddingPartyMember[]
): QuickContact[] {
  const results: QuickContact[] = [];

  // Priority contact categories with icons
  const categoryIcons: Record<string, string> = {
    venue: "🏛️",
    vendor: "🤝",
    "wedding-party": "💐",
    family: "👨‍👩‍👧",
    other: "📞",
  };

  // Vendor category icons
  const vendorIcons: Record<string, string> = {
    "🏛️ Nhà hàng": "🍽️",
    "📸 Ảnh/Video": "📸",
    "🌸 Trang trí": "🌸",
    "💄 Makeup": "💄",
    "🎵 MC/Nhạc": "🎵",
    "🚗 Xe": "🚗",
    "💐 Hoa": "💐",
    "👗 Trang phục": "👗",
  };

  // Add priority contacts (venue, vendor, wedding-party)
  const priorityCategories = ["venue", "vendor", "wedding-party"];
  for (const contact of contacts) {
    if (priorityCategories.includes(contact.category) && contact.phone) {
      results.push({
        id: `contact-${contact.id}`,
        name: contact.name,
        role: contact.role,
        phone: contact.phone,
        icon: categoryIcons[contact.category] || "📞",
        source: "contact",
      });
    }
  }

  // Add booked/confirmed vendors
  const activeVendors = vendors.filter(
    (v) => (v.status === "booked" || v.status === "confirmed" || v.status === "paid") && v.phone
  );
  for (const vendor of activeVendors) {
    results.push({
      id: `vendor-${vendor.id}`,
      name: vendor.name,
      role: vendor.category,
      phone: vendor.phone,
      icon: vendorIcons[vendor.category] || "🤝",
      source: "vendor",
    });
  }

  // Add wedding party members with phone numbers
  for (const member of party) {
    if (member.phone) {
      const roleIcons: Record<string, string> = {
        "maid-of-honor": "👑",
        bridesmaid: "💐",
        "best-man": "🎩",
        groomsman: "🤵",
        "flower-girl": "🌸",
        "ring-bearer": "💍",
        "mother-of-bride": "👩",
        "mother-of-groom": "👩",
        "father-of-bride": "👨",
        "father-of-groom": "👨",
        officiant: "⛪",
        mc: "🎤",
      };
      results.push({
        id: `party-${member.id}`,
        name: member.name,
        role: member.role,
        phone: member.phone,
        icon: roleIcons[member.role] || "👤",
        source: "party",
      });
    }
  }

  // Limit to 6 contacts for compact display
  return results.slice(0, 6);
}

export function EmergencyContactsWidget({
  contacts,
  vendors,
  weddingParty,
  lang = "vi",
}: EmergencyContactsWidgetProps) {
  const [expanded, setExpanded] = useState(false);
  const en = lang === "en";

  const quickContacts = buildQuickContacts(contacts, vendors, weddingParty);

  if (quickContacts.length === 0) {
    return null;
  }

  const displayContacts = expanded ? quickContacts : quickContacts.slice(0, 3);

  return (
    <div
      className="rounded-xl p-3"
      style={{
        backgroundColor: "var(--theme-surface)",
        border: "1px solid var(--theme-border)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3
          className="text-sm font-semibold"
          style={{ color: "var(--theme-primary)" }}
        >
          📞 {en ? "Quick Contacts" : "Liên Hệ Nhanh"}
        </h3>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: "var(--theme-primary-light, var(--theme-primary)20)",
            color: "var(--theme-primary)",
          }}
        >
          {quickContacts.length}
        </span>
      </div>

      <div className="space-y-1.5">
        {displayContacts.map((contact) => (
          <a
            key={contact.id}
            href={`tel:${contact.phone}`}
            className="flex items-center gap-2.5 p-2 rounded-lg transition-colors hover:opacity-80"
            style={{
              backgroundColor: "var(--theme-surface-hover, var(--theme-surface))",
            }}
          >
            <span className="text-lg flex-shrink-0">{contact.icon}</span>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: "var(--theme-text, inherit)" }}
              >
                {contact.name}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "var(--theme-note-text, #6b7280)" }}
              >
                {contact.role}
              </p>
            </div>
            <span
              className="text-xs px-2 py-1 rounded flex-shrink-0"
              style={{
                backgroundColor: "var(--theme-primary-light, var(--theme-primary)15)",
                color: "var(--theme-primary)",
              }}
            >
              📞
            </span>
          </a>
        ))}
      </div>

      {quickContacts.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-2 text-xs py-1.5 rounded-lg transition-opacity hover:opacity-80"
          style={{
            color: "var(--theme-primary)",
            backgroundColor: "var(--theme-primary-light, var(--theme-primary)10)",
          }}
        >
          {expanded
            ? en ? "Show less" : "Thu gọn"
            : en
              ? `+${quickContacts.length - 3} more`
              : `+${quickContacts.length - 3} liên hệ nữa`}
        </button>
      )}
    </div>
  );
}
