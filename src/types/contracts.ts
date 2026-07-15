// Contract Management Types for Wedding Planner

export type ContractStatus =
  | "draft"           // Not yet sent to vendor
  | "sent"            // Sent to vendor, awaiting response
  | "negotiating"     // Under negotiation
  | "signed"          // Signed and active
  | "completed"       // Services rendered, contract complete
  | "cancelled";      // Cancelled

export type PaymentMilestoneStatus = "pending" | "paid" | "overdue";

export interface PaymentMilestone {
  id: number;
  title: string;           // e.g. "Deposit", "Final Payment"
  amount: number;          // VND
  dueDate: string;         // YYYY-MM-DD
  status: PaymentMilestoneStatus;
  paidDate?: string;       // YYYY-MM-DD when paid
  notes?: string;
}

export interface ContractRequirement {
  id: string;
  textVi: string;
  textEn: string;
  category: string;        // e.g. "venue", "photography", "catering"
  checked: boolean;
}

export interface WeddingContract {
  id: number;
  vendorId?: number;       // Link to existing vendor if exists
  vendorName: string;      // Vendor name (may not be in vendor system)
  vendorCategory: string;  // e.g. "venue", "photography", "makeup", "catering"
  contractType: string;    // e.g. "service", "rental", "consultation"

  // Contract details
  status: ContractStatus;
  totalAmount: number;      // Total contract value (VND)
  startDate: string;        // YYYY-MM-DD (when service starts)
  endDate: string;          // YYYY-MM-DD (when service ends)

  // Payment tracking
  paymentMilestones: PaymentMilestone[];
  depositPaid: number;      // Amount already paid as deposit
  totalPaid: number;        // Total amount paid so far

  // Requirements & terms
  requirementIds: string[]; // IDs from contract-requirements.ts
  customRequirements: string[]; // Additional requirements

  // Important dates & terms
  signedDate?: string;      // YYYY-MM-DD when contract was signed
  cancellationDeadline?: string; // YYYY-MM-DD
  cancellationFee?: number; // VND
  notes?: string;

  // Document tracking
  contractUrl?: string;     // Link to contract document (if stored digitally)
  documents: ContractDocument[];

  // Metadata
  createdAt: string;        // ISO timestamp
  updatedAt: string;        // ISO timestamp
  reminderSent: boolean;    // Payment deadline reminders sent
}

export interface ContractDocument {
  id: number;
  name: string;             // e.g. "Signed Contract", "Invoice 1"
  url: string;              // Link to document
  uploadedAt: string;       // ISO timestamp
  type: "contract" | "invoice" | "quote" | "other";
}

// Contract requirement templates by vendor category
export interface ContractRequirementTemplate {
  id: string;
  category: string;
  textVi: string;
  textEn: string;
  priority: "required" | "recommended" | "optional";
}

// Summary statistics for contract dashboard
export interface ContractSummary {
  totalContracts: number;
  activeContracts: number;
  totalValue: number;        // Total contract value
  totalPaid: number;         // Total amount paid
  pendingPayments: number;   // Number of pending payments
  overduePayments: number;   // Number of overdue payments
  upcomingDeadlines: number; // Payments due in next 7 days
}
