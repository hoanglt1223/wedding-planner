// All TypeScript interfaces for the Wedding Planner app

export interface ChecklistItem {
  text: string;
  cost: number;
  categoryKey: string;
  detail?: string;
}

export interface Person {
  name: string;
  role: string;
  avatar: string;
}

export interface GiftItem {
  name: string;
  quantity: string;
  cost: number;
}

export interface TimelineEntry {
  time: string;       // "08:00"
  activity: string;   // "Đội bưng quả tập trung"
  responsible: string; // "Phù rể"
  note?: string;
}

export interface Ceremony {
  name: string;
  required: number;         // 1=required, 0=optional
  description: string;
  checklist: ChecklistItem[];
  people: Person[];
  ritualSteps: string[];
  tips: string[];
  gifts?: GiftItem[];
  timelineDetail?: TimelineEntry[];
}

export interface WeddingStep {
  id: string;
  tab: string;
  title: string;
  formalName?: string;     // Official/traditional Vietnamese name
  icon: string;
  description: string;
  meaning?: string;        // Cultural significance
  notes?: string[];        // General notes/warnings for this step
  timeline: string;
  aiHint: string;
  ceremonies: Ceremony[];
}

export interface BudgetCategory {
  key: string;
  label: string;
  percentage: number;
  color: string;
}

export interface AiPrompt {
  label: string;
  prompt: string;
}

export interface IdeaItem {
  icon: string;
  title: string;
  description: string;
}

export interface BackgroundStyle {
  background: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
}

export interface CoupleInfo {
  bride: string;
  groom: string;
  brideFamilyName: string;
  groomFamilyName: string;
  date: string;
  engagementDate: string;
  betrothalDate: string;
  brideBirthYear: string;
  groomBirthYear: string;
}

export interface Guest {
  name: string;
  phone: string;
  side: string;
  tableGroup: string;
  id: number;
}

export interface WeddingState {
  page: string;
  tab: number;
  subTabs: Record<string, number>;
  checkedItems: Record<string, boolean>;
  budget: number;
  budgetOverrides: Record<string, number>;
  expenses: Record<string, number>;
  themeId: string;
  apiKey: string;
  aiResponse: string;
  info: CoupleInfo;
  guests: Guest[];
  guestIdCounter: number;
  notes: string;
  vendors: Vendor[];
  vendorIdCounter: number;
  photos: PhotoItem[];
  photoIdCounter: number;
  lang: string;
  partyTime: "noon" | "afternoon";
}

export interface WeddingEvent {
  name: string;
  date: string;
}

export interface Vendor {
  id: number;
  category: string;
  name: string;
  phone: string;
  address: string;
  note: string;
}

export interface PhotoItem {
  id: number;
  url: string;
  tag: string;
  note: string;
}
