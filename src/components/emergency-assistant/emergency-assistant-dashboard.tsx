import { useState } from "react";
import { AlertTriangle, Phone, Bell, Package, Cloud } from "lucide-react";
import { EmergencyContactsCard } from "./emergency-contacts-card";
import { EmergencyTimelineAlerts } from "./emergency-timeline-alerts";
import { BackupPlanSuggestions } from "./backup-plan-suggestions";
import { EmergencySupplyChecklist } from "./emergency-supply-checklist";

interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  address?: string;
  priority: "critical" | "high" | "normal";
}

interface TimelineAlert {
  id: string;
  time: string;
  title: string;
  description: string;
  type: "info" | "warning" | "critical";
  acknowledged?: boolean;
}

interface BackupPlan {
  id: string;
  condition: string;
  originalPlan: string;
  backupOption: string;
  location?: string;
  contact?: string;
  estimatedCost?: number;
  priority: "essential" | "recommended" | "optional";
}

interface EmergencySupply {
  id: string;
  name: string;
  category: "medical" | "clothing" | "documents" | "misc";
  quantity: number;
  packed?: boolean;
  notes?: string;
}

interface EmergencyAssistantDashboardProps {
  lang?: string;
  initialContacts?: EmergencyContact[];
  initialAlerts?: TimelineAlert[];
  initialBackupPlans?: BackupPlan[];
  initialSupplies?: EmergencySupply[];
  currentWeather?: "sunny" | "cloudy" | "rainy" | "storm";
}

const t = {
  vi: {
    emergencyAssistant: "Trợ Lý Khẩn Cấp Ngày Cưới",
    addContact: "Thêm Liên Hệ",
    quickActions: "Hành Động Nhanh",
    callEmergency: "Gọi Cứu Hộ (112)",
    checkWeather: "Kiểm Tra Thời Tiết",
    overview: "Tổng Quan",
    emergencyContacts: "Danh Bạ Khẩn Cấp",
    timelineAlerts: "Cảnh Báo Lịch Trình",
    backupPlans: "Kế Hoách Dự Phòng",
    supplyChecklist: "Kiểm Tra Đồ Đóng Gói",
    noIssues: "Không Có Vấn Đề Gì",
    allSet: "Mọi Thứ Đã Sẵn Sàng",
  },
  en: {
    emergencyAssistant: "Wedding Day Emergency Assistant",
    addContact: "Add Contact",
    quickActions: "Quick Actions",
    callEmergency: "Call Emergency (112)",
    checkWeather: "Check Weather",
    overview: "Overview",
    emergencyContacts: "Emergency Contacts",
    timelineAlerts: "Timeline Alerts",
    backupPlans: "Backup Plans",
    supplyChecklist: "Supply Checklist",
    noIssues: "No Issues",
    allSet: "Everything is Ready",
  },
};

export function EmergencyAssistantDashboard({
  lang = "vi",
  initialContacts = [],
  initialAlerts = [],
  initialBackupPlans = [],
  initialSupplies = [],
  currentWeather = "sunny"
}: EmergencyAssistantDashboardProps) {
  const labels = t[lang as keyof typeof t] || t.vi;
  const [activeTab, setActiveTab] = useState<"overview" | "contacts" | "alerts" | "backup" | "supplies">("overview");

  // Sample data for demonstration
  const [contacts] = useState<EmergencyContact[]>(initialContacts.length > 0 ? initialContacts : [
    {
      id: "1",
      name: "Nhà Cung Cấp Hoa",
      role: "Florist",
      phone: "0901234567",
      priority: "critical"
    },
    {
      id: "2",
      name: "Chụp Hình Nghiên Cứu",
      role: "Emergency Photographer",
      phone: "0912345678",
      priority: "high"
    }
  ]);

  const [alerts] = useState<TimelineAlert[]>(initialAlerts.length > 0 ? initialAlerts : [
    {
      id: "1",
      time: "30 phút",
      title: "Lễ Ăn Hỏi",
      description: "Chuẩn bị bắt đầu lễ ăn hỏi",
      type: "critical"
    },
    {
      id: "2",
      time: "1 giờ",
      title: "Đoàn Rể Xuất Phát",
      description: "Kiểm tra đoàn xe và lễ vật",
      type: "warning"
    }
  ]);

  const [backupPlans] = useState<BackupPlan[]>(initialBackupPlans.length > 0 ? initialBackupPlans : [
    {
      id: "1",
      condition: "rain",
      originalPlan: "Chụp Hình Ngoài Vườn",
      backupOption: "Sảnh Tiếp khách Dự Phòng",
      location: "Tầng 1, Sảnh A",
      priority: "essential"
    }
  ]);

  const [supplies] = useState<EmergencySupply[]>(initialSupplies.length > 0 ? initialSupplies : [
    { id: "1", name: "Bông băng y tế", category: "medical", quantity: 1 },
    { id: "2", name: "Thuốc đau đầu", category: "medical", quantity: 2 },
    { id: "3", name: "Áo liền thân dự phòng", category: "clothing", quantity: 1 },
    { id: "4", name: "Bản sao giấy tờ", category: "documents", quantity: 2 }
  ]);

  const handleCallEmergency = () => {
    window.location.href = "tel:112";
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    console.log("Acknowledged alert:", alertId);
  };

  const handleActivateBackup = (planId: string) => {
    console.log("Activated backup plan:", planId);
  };

  const handleUpdateSupply = (supplyId: string, packed: boolean) => {
    console.log("Updated supply:", supplyId, packed);
  };

  const criticalIssues = alerts.filter(a => a.type === "critical" && !a.acknowledged).length;
  const urgentBackups = backupPlans.filter(p => p.priority === "essential").length;
  const remainingSupplies = supplies.filter(s => !s.packed).length;

  const renderOverview = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold mb-2">{labels.quickActions}</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCallEmergency}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Phone size={16} />
            {labels.callEmergency}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Cloud size={16} />
            {labels.checkWeather}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{labels.emergencyContacts}</p>
              <p className="text-2xl font-bold">{contacts.length}</p>
            </div>
            <Phone className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{labels.timelineAlerts}</p>
              <p className="text-2xl font-bold">{criticalIssues > 0 ? criticalIssues : "0"}</p>
            </div>
            <Bell className={criticalIssues > 0 ? "text-red-500" : "text-green-500"} size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{labels.supplyChecklist}</p>
              <p className="text-2xl font-bold">{remainingSupplies}</p>
            </div>
            <Package className={remainingSupplies > 0 ? "text-orange-500" : "text-green-500"} size={24} />
          </div>
        </div>
      </div>

      {criticalIssues === 0 && urgentBackups === 0 && remainingSupplies === 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="text-green-600 dark:text-green-400" size={24} />
          <p className="font-medium text-green-800 dark:text-green-300">{labels.allSet}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{labels.emergencyAssistant}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          {lang === "vi"
            ? "Quản lý mọi khẩn cấp trong ngày vui của bạn"
            : "Manage any emergencies on your big day"}
        </p>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
        <nav className="flex overflow-x-auto gap-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === "overview"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
            }`}
          >
            {labels.overview}
          </button>
          <button
            onClick={() => setActiveTab("contacts")}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === "contacts"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
            }`}
          >
            {labels.emergencyContacts}
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === "alerts"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
            }`}
          >
            {labels.timelineAlerts}
          </button>
          <button
            onClick={() => setActiveTab("backup")}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === "backup"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
            }`}
          >
            {labels.backupPlans}
          </button>
          <button
            onClick={() => setActiveTab("supplies")}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === "supplies"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
            }`}
          >
            {labels.supplyChecklist}
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "contacts" && <EmergencyContactsCard contacts={contacts} lang={lang} />}
        {activeTab === "alerts" && (
          <EmergencyTimelineAlerts
            alerts={alerts}
            lang={lang}
            onAcknowledge={handleAcknowledgeAlert}
          />
        )}
        {activeTab === "backup" && (
          <BackupPlanSuggestions
            plans={backupPlans}
            currentWeather={currentWeather}
            lang={lang}
            onSelectPlan={handleActivateBackup}
          />
        )}
        {activeTab === "supplies" && (
          <EmergencySupplyChecklist
            supplies={supplies}
            lang={lang}
            onUpdateSupply={handleUpdateSupply}
          />
        )}
      </div>
    </div>
  );
}