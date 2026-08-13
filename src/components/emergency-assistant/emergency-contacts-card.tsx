import { Phone, Mail, MapPin } from "lucide-react";

interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  address?: string;
  priority: "critical" | "high" | "normal";
}

interface EmergencyContactsCardProps {
  contacts: EmergencyContact[];
  lang?: string;
}

const t = {
  vi: {
    emergencyContacts: "Danh Bạ Khẩn Cấp",
    quickCall: "Gọi Nhanh",
    quickEmail: "Gửi Email",
    viewAddress: "Xem Địa Chỉ",
    criticalPriority: "Ưu Tiên Cao",
    addContact: "Thêm Liên Hệ",
    noContacts: "Chưa có liên hệ khẩn cấp",
  },
  en: {
    emergencyContacts: "Emergency Contacts",
    quickCall: "Quick Call",
    quickEmail: "Send Email",
    viewAddress: "View Address",
    criticalPriority: "Critical Priority",
    addContact: "Add Contact",
    noContacts: "No emergency contacts added",
  },
};

export function EmergencyContactsCard({ contacts, lang = "vi" }: EmergencyContactsCardProps) {
  const labels = t[lang as keyof typeof t] || t.vi;

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleMap = (address: string) => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 border-red-300";
      case "high": return "bg-orange-100 text-orange-800 border-orange-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (contacts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">{labels.noContacts}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{labels.emergencyContacts}</h3>
        <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor("critical")}`}>
          {labels.criticalPriority}
        </span>
      </div>

      <div className="space-y-3">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="border rounded-lg p-3 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-medium">{contact.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{contact.role}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(contact.priority)}`}>
                {contact.priority}
              </span>
            </div>

            <div className="flex gap-2 mt-3">
              {contact.phone && (
                <button
                  onClick={() => handleCall(contact.phone)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  <Phone size={16} />
                  {labels.quickCall}
                </button>
              )}

              {contact.email && (
                <button
                  onClick={() => handleEmail(contact.email!)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  <Mail size={16} />
                  {labels.quickEmail}
                </button>
              )}

              {contact.address && (
                <button
                  onClick={() => handleMap(contact.address!)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
                >
                  <MapPin size={16} />
                  {labels.viewAddress}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}