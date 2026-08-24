/**
 * Engagement Ceremony Planning Page
 * Comprehensive planning tool for Vietnamese engagement ceremony (Lễ Đính Hôn)
 */

import { useState } from "react";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { EngagementGiftChecklist } from "@/components/engagement/engagement-gift-checklist";
import { EngagementFamilyRoles } from "@/components/engagement/engagement-family-roles";
import { EngagementTimeline } from "@/components/engagement/engagement-timeline";
import { EngagementBudget } from "@/components/engagement/engagement-budget";
import { EngagementVenues } from "@/components/engagement/engagement-venues";
import { Plus, Calendar, Users, Gift, MapPin, DollarSign, CheckCircle } from "lucide-react";

type EngagementTab = "overview" | "gifts" | "family" | "timeline" | "budget" | "venues";

interface EngagementChecklistItem {
  id: string;
  category: "gifts" | "attire" | "venue" | "ceremony" | "photos";
  textVi: string;
  textEn: string;
  checked: boolean;
  notes?: string;
}

interface EngagementGiftItem {
  id: number;
  name: string;
  nameEn: string;
  category: "betel" | "areca" | "tea" | "wine" | "fruit" | "cake" | "jewelry" | "other";
  quantity: number;
  estimatedCost: number;
  prepared: boolean;
  notes: string;
}

interface EngagementRole {
  id: string;
  roleVi: string;
  roleEn: string;
  side: "bride" | "groom";
  required: boolean;
  assignedTo?: string;
}

export function EngagementCeremonyPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const lang: "en" | "vi" = (state.lang || "vi") as "en" | "vi";
  const en = lang === "en";

  const [activeTab, setActiveTab] = useState<EngagementTab>("overview");
  const [showAddItem, setShowAddItem] = useState(false);

  // State for engagement-specific data
  const [engagementDate, setEngagementDate] = useState(state.info.engagementDate || "");
  const [engagementVenue, setEngagementVenue] = useState("");
  const [engagementBudget, setEngagementBudget] = useState(0);
  const [checklistItems, setChecklistItems] = useState<EngagementChecklistItem[]>([
    { id: "1", category: "gifts", textVi: "Trầu cau", textEn: "Betel leaves & areca nuts", checked: false },
    { id: "2", category: "gifts", textVi: "Trà", textEn: "Tea set", checked: false },
    { id: "3", category: "gifts", textVi: "Rượu", textEn: "Wine/Alcohol", checked: false },
    { id: "4", category: "gifts", textVi: "Hoa quả", textEn: "Fruits", checked: false },
    { id: "5", category: "gifts", textVi: "Bánh kẹo", textEn: "Cakes & sweets", checked: false },
    { id: "6", category: "attire", textVi: "Áo dài cô dâu", textEn: "Bride's Ao Dai", checked: false },
    { id: "7", category: "attire", textVi: "Áo dài chú rể", textEn: "Groom's Ao Dai", checked: false },
    { id: "8", category: "ceremony", textVi: "Nến vàng", textEn: "Golden candles", checked: false },
    { id: "9", category: "ceremony", textVi: "Hương", textEn: "Incense", checked: false },
    { id: "10", category: "photos", textVi: "Thợ chụp ảnh", textEn: "Photographer", checked: false },
  ]);

  const [giftItems, setGiftItems] = useState<EngagementGiftItem[]>([
    { id: 1, name: "Trầu cau", nameEn: "Betel leaves & areca nuts", category: "betel", quantity: 10, estimatedCost: 500000, prepared: false, notes: "" },
    { id: 2, name: "Trà xanh", nameEn: "Green tea set", category: "tea", quantity: 2, estimatedCost: 800000, prepared: false, notes: "" },
  ]);

  const [familyRoles, setFamilyRoles] = useState<EngagementRole[]>([
    { id: "bride-father", roleVi: "Bố cô dâu", roleEn: "Bride's father", side: "bride", required: true, assignedTo: "" },
    { id: "bride-mother", roleVi: "Mẹ cô dâu", roleEn: "Bride's mother", side: "bride", required: true, assignedTo: "" },
    { id: "groom-father", roleVi: "Bố chú rể", roleEn: "Groom's father", side: "groom", required: true, assignedTo: "" },
    { id: "groom-mother", roleVi: "Mẹ chú rể", roleEn: "Groom's mother", side: "groom", required: true, assignedTo: "" },
  ]);

  const [timelineEvents, setTimelineEvents] = useState([
    { id: "1", time: "08:00", titleVi: "Đoàn chú rể đến nhà cô dâu", titleEn: "Groom's procession arrives", notes: "" },
    { id: "2", time: "08:30", titleVi: "Lễ dạm ngõ", titleEn: "Introductory ceremony", notes: "" },
    { id: "3", time: "09:00", titleVi: "Lễ ăn hỏi", titleEn: "Proposal ceremony", notes: "" },
    { id: "4", time: "10:00", titleVi: "Lễ đính hôn", titleEn: "Engagement ceremony", notes: "" },
    { id: "5", time: "11:00", titleVi: "Tiệc gia đình", titleEn: "Family banquet", notes: "" },
  ]);

  // Calculate progress
  const totalItems = checklistItems.length;
  const checkedItems = checklistItems.filter(item => item.checked).length;
  const progressPercent = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  const totalGiftBudget = giftItems.reduce((sum, item) => sum + item.estimatedCost, 0);

  const toggleChecklistItem = (id: string) => {
    setChecklistItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDateChange = (date: string) => {
    setEngagementDate(date);
    store.updateInfo("engagementDate", date);
  };

  return (
    <div className="space-y-4 py-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--theme-primary)]">
            {en ? "💍 Engagement Ceremony" : "💍 Lễ Đính Hôn"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {en ? "Plan your traditional Vietnamese engagement ceremony" : "Lập kế vọng lễ đính hôn truyền thống"}
          </p>
        </div>
        <Button
          onClick={() => setShowAddItem(!showAddItem)}
          className="bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-dark)]"
        >
          <Plus className="w-4 h-4 mr-2" />
          {en ? "Quick Add" : "Thêm Nhanh"}
        </Button>
      </div>

      {/* Progress Overview */}
      <Card className="bg-[var(--theme-surface)] border-[var(--theme-border)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {en ? "Overall Progress" : "Tiến Độ Tổng Thể"}
              </CardTitle>
              <CardDescription>
                {checkedItems} / {totalItems} {en ? "completed" : "hoàn thành"}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[var(--theme-primary)]">
                {progressPercent.toFixed(0)}%
              </div>
              <Progress value={progressPercent} className="w-24 h-2" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card className="bg-[var(--theme-surface)] border-[var(--theme-border)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">
                  {en ? "Date" : "Ngày"}
                </p>
                <p className="text-sm font-medium">
                  {engagementDate || (en ? "Not set" : "Chưa đặt")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--theme-surface)] border-[var(--theme-border)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">
                  {en ? "Venue" : "Địa điểm"}
                </p>
                <p className="text-sm font-medium">
                  {engagementVenue || (en ? "TBD" : "Chưa quyết")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--theme-surface)] border-[var(--theme-border)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">
                  {en ? "Budget" : "Ngân sách"}
                </p>
                <p className="text-sm font-medium">
                  {engagementBudget.toLocaleString()}₫
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--theme-surface)] border-[var(--theme-border)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">
                  {en ? "Gift Budget" : "Ngân sách quà"}
                </p>
                <p className="text-sm font-medium">
                  {totalGiftBudget.toLocaleString()}₫
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as EngagementTab)}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="overview">
            {en ? "Overview" : "Tổng quan"}
          </TabsTrigger>
          <TabsTrigger value="gifts">
            <Gift className="w-4 h-4 mr-1" />
            {en ? "Gifts" : "Quà"}
          </TabsTrigger>
          <TabsTrigger value="family">
            <Users className="w-4 h-4 mr-1" />
            {en ? "Family" : "Gia đình"}
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Calendar className="w-4 h-4 mr-1" />
            {en ? "Timeline" : "Lịch"}
          </TabsTrigger>
          <TabsTrigger value="budget">
            <DollarSign className="w-4 h-4 mr-1" />
            {en ? "Budget" : "Ngân sách"}
          </TabsTrigger>
          <TabsTrigger value="venues">
            <MapPin className="w-4 h-4 mr-1" />
            {en ? "Venues" : "Địa điểm"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="bg-[var(--theme-surface)] border-[var(--theme-border)]">
            <CardHeader>
              <CardTitle>{en ? "Engagement Ceremony Overview" : "Tổng quan Lễ Đính Hôn"}</CardTitle>
              <CardDescription>
                {en ? "Traditional Vietnamese engagement ceremony planning" : "Lập kế vọng lễ đính hôn truyền thống Việt Nam"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{en ? "Quick Checklist" : "Kiểm tra nhanh"}</h3>
                <div className="space-y-2">
                  {checklistItems.slice(0, 5).map(item => (
                    <div key={item.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={item.checked}
                        onChange={() => toggleChecklistItem(item.id)}
                      />
                      <span className={`text-sm ${item.checked ? "line-through text-muted-foreground" : ""}`}>
                        {en ? item.textEn : item.textVi}
                      </span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  💡 {en ? "Tip: Complete each tab below to ensure a smooth ceremony" : "Mẹo: Hoàn thành từng tab dưới đây để đảm bảo lễ đính hôn suôn sẻ"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gifts">
          <EngagementGiftChecklist
            items={giftItems}
            onToggleItem={(id) => {
              setGiftItems(prev =>
                prev.map(item =>
                  item.id === id ? { ...item, prepared: !item.prepared } : item
                )
              );
            }}
            lang={lang}
          />
        </TabsContent>

        <TabsContent value="family">
          <EngagementFamilyRoles
            roles={familyRoles}
            onAssignRole={(roleId, personName) => {
              setFamilyRoles(prev =>
                prev.map(role =>
                  role.id === roleId ? { ...role, assignedTo: personName } : role
                )
              );
            }}
            lang={lang}
          />
        </TabsContent>

        <TabsContent value="timeline">
          <EngagementTimeline
            events={timelineEvents}
            engagementDate={engagementDate}
            lang={lang}
          />
        </TabsContent>

        <TabsContent value="budget">
          <EngagementBudget
            budget={engagementBudget}
            gifts={giftItems}
            totalGiftCost={totalGiftBudget}
            onSetBudget={setEngagementBudget}
            lang={lang}
          />
        </TabsContent>

        <TabsContent value="venues">
          <EngagementVenues
            venue={engagementVenue}
            onSetVenue={setEngagementVenue}
            engagementDate={engagementDate}
            lang={lang}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}