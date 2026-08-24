// All TypeScript interfaces for the Wedding Planner app

import type { Region, RegionalContent } from "../data/regions";
import type { WeddingContract } from "./contracts";
import type { ItineraryItem } from "../data/wedding-itinerary";
import type { AppTheme } from "../data/themes";

export type { Region, RegionalContent, AppTheme };

export interface CeremonyStep {
  text: string;
  time?: string;
  responsible?: string;
  cost?: number;
  categoryKey?: string;
  detail?: string;
  note?: string;
  checkable?: boolean;
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

export interface DiscussionItem {
  emoji: string;
  question: string;
  detail: string;
  tips?: string[];
}

export interface PrayerItem {
  emoji: string;
  title: string;
  occasion: string;          // When to use (e.g., "Lễ ăn hỏi tại nhà gái")
  type: "prayer" | "speech"; // Visual distinction
  text: string;              // Full multiline text
  note?: string;             // Brief guidance (who recites, how)
}

export interface Ceremony {
  name: string;
  required: number;         // 1=required, 0=optional
  description: string;
  steps: CeremonyStep[];
  people: Person[];
  gifts?: GiftItem[];
  discussions?: DiscussionItem[];  // Questions/ideas for families to discuss
  prayers?: PrayerItem[];          // Prayers and speeches for this ceremony
  regionalNotes?: RegionalContent<string[]>;  // Region-specific notes
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
  optional?: boolean;      // Step can be skipped
  optionalHint?: string;   // Explanation of when to skip
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
  brideBirthDate: string;       // "YYYY-MM-DD" or ""
  brideBirthHour: number | null; // 0-23 or null (unknown)
  brideGender: string;           // "female" | "male"
  groomBirthDate: string;
  groomBirthHour: number | null;
  groomGender: string;
  venueCity: string;           // city id from venue-cities.ts (default "hcmc")
}

export interface Guest {
  name: string;
  phone: string;
  side: string;
  tableGroup: string;
  id: number;
  group?: string;          // Guest group category (family-bride, family-groom, friends-bride, etc.)
  rsvpToken?: string;
  dietary?: string;        // e.g. "chay" (vegetarian), "halal", allergy note
  plusOneName?: string;    // Name of accompanying guest (+1)
  guestNotes?: string;     // General notes about this guest
  tableNumber?: number;    // For PDF compatibility
  rsvpStatus?: string;     // For PDF compatibility
}

export interface RsvpSettings {
  welcomeMessage: string;
  venue: string;
  venueAddress: string;
  venueMapLink: string;
  coupleStory: string;
}

// --- Phase 2 types ---

export interface TimelineEntry {
  id: number;
  time: string;           // "HH:mm" format
  title: string;
  location?: string;
  responsible?: string;
  notes?: string;
  category: "ceremony" | "reception" | "prep" | "other";
}

export interface GiftEntry {
  id: number;
  guestId?: number;
  guestName: string;
  type: "cash" | "gift";
  amount?: number;
  description?: string;
  side: "groom" | "bride" | "other";
  tableGroup?: string;
  thankYouSent: boolean;
}

export interface WebsiteSettings {
  enabled: boolean;
  slug: string;
  sections: {
    story: boolean;
    timeline: boolean;
    gallery: boolean;
    venue: boolean;
    rsvp: boolean;
  };
  heroImage?: string;
  customMessage?: string;
  storyText?: string;
}

export interface PhotoWallSettings {
  enabled: boolean;
  maxPhotos: number;
  autoApprove: boolean;
}

export interface TaskBoardSettings {
  enabled: boolean;
  categories: string[];
}

export interface ReminderPreference {
  id: string;
  dismissed: boolean;
}

// --- Phase 3 types ---

export interface ExpenseEntry {
  id: number;
  category: string;       // budget category key
  description: string;
  amount: number;          // VND amount
  vendorName?: string;
  date: string;            // YYYY-MM-DD
  dueDate?: string;        // YYYY-MM-DD (optional due date for payment scheduling)
  paid: boolean;
}

export interface WeddingState {
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
  region: Region;
  partyTime: "noon" | "afternoon";
  stepStartTimes: Record<string, string>;
  enabledSteps: Record<string, boolean>;
  onboardingComplete: boolean;
  rsvpSettings: RsvpSettings;

  // Phase 2 additions
  timelineEntries: TimelineEntry[];
  timelineIdCounter: number;
  gifts: GiftEntry[];
  giftIdCounter: number;
  websiteSettings: WebsiteSettings;
  photoWallSettings: PhotoWallSettings;
  taskBoardSettings: TaskBoardSettings;
  dismissedReminders: string[];

  // Phase 3 additions
  expenseLog: ExpenseEntry[];
  expenseIdCounter: number;

  // Planning checklist
  checkedChecklistItems: Record<string, boolean>;

  // Wedding day kit
  weddingDayKitChecked: Record<string, boolean>;
  weddingDayKitCustom: { id: string; categoryId: string; textVi: string; textEn: string; icon: string }[];

  // Seating chart
  seatingTables: SeatingTable[];
  seatingTableIdCounter: number;

  // Wedding day itinerary
  itineraryItems: ItineraryItem[];

  // Wedding contacts
  contacts: WeddingContact[];
  contactIdCounter: number;

  // Vendor payments
  vendorPayments: VendorPayment[];
  vendorPaymentIdCounter: number;

  // All payments (unified view for payment schedule)
  payments: VendorPayment[];
  paymentIdCounter: number;

  // Vendor communications
  vendorCommunications: VendorCommunication[];
  vendorCommunicationIdCounter: number;

  // Vendor gratitude/tip tracking
  vendorGratitude: VendorGratitude[];
  vendorGratitudeIdCounter: number;

  // Vendor reviews and ratings
  vendorReviews: VendorReview[];
  vendorReviewIdCounter: number;

  // Song list
  songs: SongItem[];
  songIdCounter: number;

  // Speeches & Vows
  speeches: SpeechEntry[];
  speechIdCounter: number;

  // Guest Book
  guestBookEntries: GuestBookEntry[];
  guestBookIdCounter: number;

  // Wedding Party
  weddingParty: WeddingPartyMember[];
  weddingPartyIdCounter: number;

  // Mood Board
  moodBoardItems: MoodBoardItem[];
  moodBoardIdCounter: number;
  colorPalettes: ColorPalette[];
  colorPaletteIdCounter: number;

  // Quick Notes
  quickNotes: QuickNote[];
  quickNoteIdCounter: number;

  // Gift Registry
  registryItems: RegistryItem[];
  registryIdCounter: number;

  // Transportation
  transportationGroups: TransportationGroup[];
  transportationGroupIdCounter: number;

  // Guest Gifts
  guestGifts: GuestGift[];
  guestGiftIdCounter: number;

  // Guest Meal Assignments
  guestMealAssignments: Record<number, number>;

  // Photo Shot List
  photoShots: PhotoShot[];
  photoShotIdCounter: number;

  // Welcome Bags
  welcomeBagItems: WelcomeBagItem[];
  welcomeBagItemIdCounter: number;
  welcomeBagDistributions: WelcomeBagDistribution[];
  welcomeBagDistributionIdCounter: number;

  // Menu Planner
  menuItems: MenuItem[];
  menuIdCounter: number;
  menuSettings?: MenuSettings;

  // Contract Checklist
  contractChecklist: Record<string, boolean>; // itemId -> checked state

  // Wedding Contracts
  contracts: WeddingContract[];
  contractIdCounter: number;

  // Hashtag Generator
  generatedHashtags: string[];
  favoriteHashtags: string[];

  // Emergency Kit Checklist
  emergencyKitChecked?: Record<string, boolean>; // itemId -> checked state

  // Emergency Assistant System
  emergencyAssistant: EmergencyAssistantSettings;

  // Anniversary & Important Dates
  anniversaryDates: ImportantDate[];
  anniversaryIdCounter: number;

  // Honeymoon Planner
  honeymoon: HoneymoonState;

  // Schedule Share Settings
  scheduleShareSettings?: any;

  // Additional properties for compatibility
  timeline?: TimelineEntry[]; // alias for timelineEntries
  venue?: string; // venue information for PDFs
  tasks?: Record<string, boolean>; // task tracking for PDFs
  theme?: AppTheme; // current theme object (not just ID)
}

export interface ImportantDate {
  id: number;
  date: string;              // "YYYY-MM-DD" format
  title: string;             // e.g., "First Date", "Engagement Day", "First Kiss"
  type: "milestone" | "anniversary" | "custom";
  notes?: string;            // Optional notes about the date
  recurring: boolean;        // Whether this repeats annually (for anniversaries)
  reminderDays?: number;     // Days before to remind (optional)
}

// Honeymoon Planner
export type HoneymoonTaskCategory = "booking" | "document" | "prep" | "activity" | "other";
export type HoneymoonTaskStatus = "todo" | "in-progress" | "done";

export interface HoneymoonTask {
  id: number;
  title: string;
  category: HoneymoonTaskCategory;
  status: HoneymoonTaskStatus;
  dueDate?: string;          // "YYYY-MM-DD" format
  notes?: string;
}

export interface HoneymoonState {
  destination: string;
  startDate: string;         // "YYYY-MM-DD" format
  endDate: string;           // "YYYY-MM-DD" format
  budget: number;            // planned honeymoon budget
  packingChecked: Record<string, boolean>;  // packing item id -> checked
  tasks: HoneymoonTask[];
  taskIdCounter: number;
}

export interface WeddingEvent {
  name: string;
  date: string;
}

export type VendorStatus = "new" | "contacted" | "quoted" | "booked" | "confirmed" | "paid";

export interface VendorQuote {
  id: number;
  vendorId: number;
  price: number;            // VND
  packageName: string;      // e.g. "Gói A — Chụp ảnh cưới"
  inclusions: string;       // what's included
  exclusions: string;       // what's NOT included
  validUntil: string;       // YYYY-MM-DD quote expiry
  rating: number;           // 1-5 stars (user subjective)
  notes: string;
  createdAt: string;        // ISO timestamp
}

export interface Vendor {
  id: number;
  category: string;
  name: string;
  phone: string;
  address: string;
  note: string;
  status: VendorStatus;
  budget: number;    // Total agreed price (VND)
  deposit: number;   // Deposit already paid (VND)
  quotes: VendorQuote[];
}

export type VendorPaymentMethod = "cash" | "bank_transfer" | "card" | "other";

export interface VendorPayment {
  id: number;
  vendorId?: number;         // Optional for expense-based payments
  vendorName?: string;       // Denormalized for convenience
  amount: number;           // VND
  date: string;             // YYYY-MM-DD
  dueDate: string;          // YYYY-MM-DD (when payment is due)
  method: VendorPaymentMethod;
  note: string;
  paid: boolean;            // Payment completion status
  description?: string;     // Optional description of what the payment is for
}

export type VendorCommunicationType = "email" | "call" | "meeting" | "text" | "other";

export interface VendorCommunication {
  id: number;
  vendorId: number;
  type: VendorCommunicationType;
  subject: string;
  content: string;
  date: string;             // YYYY-MM-DD
  followUpDate?: string;    // YYYY-MM-DD
  completed: boolean;
}

export type VendorGratitudeStatus = "planned" | "given" | "pending";

export interface VendorGratitude {
  id: number;
  vendorId: number;
  amount: number;           // VND - tip amount
  status: VendorGratitudeStatus;
  plannedDate?: string;     // YYYY-MM-DD - when planning to give
  givenDate?: string;       // YYYY-MM-DD - when actually given
  notes?: string;           // Optional notes about the tip
  createdAt: string;        // ISO timestamp
}

export interface VendorReview {
  id: number;
  vendorId: number;
  vendorName: string;       // Denormalized for convenience
  overallRating: number;     // 1-5 stars
  ratings: {
    quality: number;        // Service quality (1-5)
    professionalism: number; // Professional conduct (1-5)
    value: number;          // Value for money (1-5)
    communication: number;  // Responsiveness (1-5)
  };
  notes: string;
  reviewDate: string;       // YYYY-MM-DD
  createdAt: string;        // ISO timestamp
}

export interface PhotoItem {
  id: number;
  url: string;
  tag: string;
  note: string;
}

// --- Photo Shot List types ---

export type PhotoShotCategory =
  | "prep"
  | "first-look"
  | "ceremony"
  | "family"
  | "portraits"
  | "reception"
  | "details"
  | "exit";

export interface PhotoShot {
  id: number;
  title: string;
  category: PhotoShotCategory;
  description: string;
  priority: "must-have" | "nice-to-have";
  shotBy: string; // e.g. "Chụp tại nhà cô dâu", "Tại sân khấu"
  notes: string;
  checked: boolean;
  order: number; // for custom ordering within category
}

export interface SeatingTable {
  id: number;
  name: string;
  capacity: number;
  guestIds: number[];
}

export type ContactCategory = "venue" | "vendor" | "wedding-party" | "family" | "other";

export interface WeddingContact {
  id: number;
  name: string;
  role: string;
  phone: string;
  category: ContactCategory;
  note: string;
  email?: string; // optional email address
}

// --- Song list types ---

export type SongSection = "ceremony" | "cocktail" | "reception" | "first-dance" | "party" | "other";
export type SongPriority = "must-play" | "nice-to-have" | "do-not-play";

export interface SongItem {
  id: number;
  title: string;
  artist: string;
  section: SongSection;
  priority: SongPriority;
  notes: string;
  requestedBy: string;
  confirmed: boolean;
}

// --- Speech / Vow types ---

export type SpeechCategory = "vow" | "toast" | "reading" | "prayer" | "other";

export interface SpeechEntry {
  id: number;
  title: string;
  content: string;
  category: SpeechCategory;
  speaker: string;         // e.g. "Chú rể", "Cô dâu", "Best man"
  notes: string;
  isFavorite: boolean;
}

// --- Guest Book types ---

export type GuestBookMood = "love" | "joy" | "wisdom" | "funny" | "other";

export interface GuestBookEntry {
  id: number;
  guestName: string;
  message: string;
  mood: GuestBookMood;
  guestId?: number;        // Link to Guest if exists
  createdAt: string;       // ISO timestamp
  isFavorite: boolean;
}

// --- Wedding Party types ---

export type PartyRole =
  | "maid-of-honor"
  | "bridesmaid"
  | "best-man"
  | "groomsman"
  | "flower-girl"
  | "ring-bearer"
  | "mother-of-bride"
  | "mother-of-groom"
  | "father-of-bride"
  | "father-of-groom"
  | "officiant"
  | "mc"
  | "other";

export interface WeddingPartyMember {
  id: number;
  name: string;
  role: PartyRole;
  phone: string;
  email: string;
  outfitDetails: string;   // e.g. dress color, suit style
  measurements: string;    // e.g. size notes
  responsibilities: string; // assigned duties
  notes: string;
  guestId?: number;        // Link to Guest if exists
}

// --- Mood Board types ---

export type MoodBoardCategory =
  | "decor"
  | "flowers"
  | "attire"
  | "cake"
  | "food"
  | "venue"
  | "photography"
  | "other";

export interface MoodBoardItem {
  id: number;
  imageUrl: string;
  title: string;
  category: MoodBoardCategory;
  notes: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
}

export interface ColorPalette {
  id: number;
  name: string;
  colors: string[];      // hex color codes
  notes: string;
}

// --- Quick Notes types ---

export type QuickNoteColor = "yellow" | "blue" | "green" | "pink" | "purple";

export interface QuickNote {
  id: number;
  text: string;
  color: QuickNoteColor;
  done: boolean;
  createdAt: string;       // ISO timestamp
}

// --- Gift Registry types ---

export type RegistryCategory = "home" | "kitchen" | "bedroom" | "experience" | "travel" | "electronics" | "other";

export interface RegistryItem {
  id: number;
  name: string;
  description: string;
  category: RegistryCategory;
  price: number;            // VND, 0 = flexible
  link: string;             // optional URL to product page
  priority: "must-have" | "nice-to-have" | "optional";
  fulfilled: boolean;
  fulfilledBy: string;      // who purchased it
  notes: string;
  createdAt: string;        // ISO timestamp
}

// --- Transportation types ---

export type TransportType = "shuttle" | "bus" | "car" | "van" | "other";

export interface TransportationGroup {
  id: number;
  name: string;                    // e.g. "Shuttle from Hotel ABC"
  transportType: TransportType;
  driverName: string;
  driverPhone: string;
  vehicleInfo: string;             // e.g. "16-seat van, white"
  pickupLocation: string;
  pickupTime: string;              // "HH:mm" format
  dropoffLocation: string;
  dropoffTime: string;             // "HH:mm" format
  capacity: number;
  guestIds: number[];              // assigned guest IDs
  notes: string;
  date: string;                    // "YYYY-MM-DD"
}

export interface TransportationAssignment {
  guestId: number;
  groupId: number;
}

// --- Guest Gift types ---

export type GuestGiftCategory = "tea" | "cake" | "souvenir" | "home" | "food" | "other";
export type GuestGiftStatus = "pending" | "prepared" | "distributed";

export interface GuestGift {
  id: number;
  giftName: string;
  category: GuestGiftCategory;
  description: string;
  costPerUnit: number;
  totalQuantity: number;
  distributedQuantity: number;
  status: GuestGiftStatus;
  recipientType: "all" | "family" | "vip" | "regular";
  assignedGuestIds: number[];
  notes: string;
  createdAt: string;
}

// --- Welcome Bag types ---

export type WelcomeBagCategory = "essentials" | "snacks" | "info" | "personal" | "local" | "other";
export type WelcomeBagStatus = "pending" | "in-progress" | "complete";

export interface WelcomeBagItem {
  id: number;
  name: string;
  category: WelcomeBagCategory;
  description: string;
  quantityPerBag: number;
  estimatedCost: number;
  totalQuantity: number;
  notes: string;
  checked: boolean;
  custom: boolean;
}

export interface WelcomeBagDistribution {
  id: number;
  guestId?: number;
  guestName: string;
  bagStatus: WelcomeBagStatus;
  distributedDate: string;
  distributedBy: string;
  notes: string;
}

// --- Menu Planner types ---

export type MenuCourseType =
  | "appetizer"
  | "soup"
  | "main"
  | "side"
  | "dessert"
  | "drink"
  | "other";

export type DietaryRestriction = "vegetarian" | "vegan" | "halal" | "gluten-free" | "nut-free" | "none";

// Alias for single dietary restriction (used in filters)
export type DietaryType = DietaryRestriction;

export interface MenuItem {
  id: number;
  name: string;
  nameEn?: string;
  courseType: MenuCourseType;
  dietary: DietaryRestriction[];
  description: string;
  descriptionEn?: string;
  costPerServing: number;
  serves: number;
  vendorName: string;
  notes: string;
  order: number;
  isFavorite: boolean;
  checked: boolean;
  custom: boolean;
}

export interface MenuTemplate {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  budgetLevel: "economy" | "standard" | "premium";
  estimatedCostPerTable: number;
  items: MenuItem[];
}

export interface MenuSettings {
  enabled: boolean;
  budgetPerTable: number;
  guestCount: number;
  specialRequests: string;
  servingStyle: "banquet" | "buffet" | "family-style" | "plated";
  includeCutlery: boolean;
  includeDrinks: boolean;
  notes: string;
}

// Emergency Assistant System Types
export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  address?: string;
  priority: "critical" | "high" | "normal";
}

export interface TimelineAlert {
  id: string;
  time: string;
  title: string;
  description: string;
  type: "info" | "warning" | "critical";
  acknowledged?: boolean;
}

export interface BackupPlan {
  id: string;
  condition: string;
  originalPlan: string;
  backupOption: string;
  location?: string;
  contact?: string;
  estimatedCost?: number;
  priority: "essential" | "recommended" | "optional";
}

export interface EmergencySupply {
  id: string;
  name: string;
  category: "medical" | "clothing" | "documents" | "misc";
  quantity: number;
  packed?: boolean;
  notes?: string;
}

export interface EmergencyAssistantSettings {
  enabled: boolean;
  emergencyContacts: EmergencyContact[];
  timelineAlerts: TimelineAlert[];
  backupPlans: BackupPlan[];
  emergencySupplies: EmergencySupply[];
  currentWeather?: "sunny" | "cloudy" | "rainy" | "storm";
}
