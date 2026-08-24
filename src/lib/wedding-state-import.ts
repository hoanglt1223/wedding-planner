import type { WeddingState } from "@/types/wedding";

const CURRENT_VERSION = "16"; // WeddingState version

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// Validate WeddingState structure
export function validateWeddingState(state: unknown): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Basic structure check
  if (!state || typeof state !== "object") {
    return {
      isValid: false,
      errors: [{ field: "root", message: "Invalid JSON structure", severity: "error" }],
      warnings: [],
    };
  }

  const s = state as Record<string, unknown>;

  // Check required fields
  const requiredFields: (keyof WeddingState)[] = [
    "tab",
    "themeId",
    "info",
    "guests",
    "lang",
    "region",
    "onboardingComplete",
  ];

  for (const field of requiredFields) {
    if (!(field in s)) {
      errors.push({
        field,
        message: `Missing required field: ${field}`,
        severity: "error",
      });
    }
  }

  // Validate info structure
  if (s.info && typeof s.info === "object") {
    const info = s.info as Record<string, unknown>;
    const infoFields = ["bride", "groom", "date"];
    for (const field of infoFields) {
      if (!(field in info)) {
        errors.push({
          field: `info.${field}`,
          message: `Missing required info field: ${field}`,
          severity: "error",
        });
      }
    }
  } else {
    errors.push({
      field: "info",
      message: "Invalid or missing info object",
      severity: "error",
    });
  }

  // Validate arrays
  const arrayFields: (keyof WeddingState)[] = ["guests", "vendors"];
  for (const field of arrayFields) {
    if (s[field] && !Array.isArray(s[field])) {
      errors.push({
        field,
        message: `${field} must be an array`,
        severity: "error",
      });
    }
  }

  // Validate language
  if (s.lang && typeof s.lang === "string") {
    const validLangs = ["vi", "en"];
    if (!validLangs.includes(s.lang)) {
      warnings.push({
        field: "lang",
        message: `Unknown language: ${s.lang}. Will default to "vi"`,
        severity: "warning",
      });
    }
  }

  // Validate region
  if (s.region && typeof s.region === "string") {
    const validRegions = ["north", "central", "south"];
    if (!validRegions.includes(s.region)) {
      warnings.push({
        field: "region",
        message: `Unknown region: ${s.region}. Will default to "north"`,
        severity: "warning",
      });
    }
  }

  // Check for deprecated fields (optional)
  const deprecatedFields: string[] = [];
  for (const field of deprecatedFields) {
    if (field in s) {
      warnings.push({
        field,
        message: `Deprecated field "${field}" will be ignored`,
        severity: "warning",
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Parse and validate JSON string
export function importWeddingStateFromJson(jsonString: string): {
  success: boolean;
  data?: WeddingState;
  validation?: ValidationResult;
  error?: string;
} {
  try {
    // Parse JSON
    const parsed = JSON.parse(jsonString);

    // Validate structure
    const validation = validateWeddingState(parsed);

    if (!validation.isValid) {
      return {
        success: false,
        validation,
        error: "Invalid wedding data structure",
      };
    }

    return {
      success: true,
      data: parsed as WeddingState,
      validation,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to parse JSON",
    };
  }
}

// Merge two WeddingState objects (imported takes precedence)
export function mergeWeddingStates(current: WeddingState, imported: WeddingState): WeddingState {
  // Create a deep merge strategy
  // - Preserve current system fields (apiKey, onboardingComplete if already done)
  // - Override with imported data
  // - Merge arrays and complex objects

  const merged: WeddingState = {
    ...imported,
    // Preserve current API key if imported doesn't have one
    apiKey: imported.apiKey || current.apiKey,
    // If current user already completed onboarding, respect that
    onboardingComplete: current.onboardingComplete || imported.onboardingComplete,
    // Merge arrays by combining and deduplicating
    guests: mergeArrays(current.guests, imported.guests, "id"),
    vendors: mergeArrays(current.vendors, imported.vendors, "id"),
    // Merge other important arrays
    gifts: mergeArrays(current.gifts || [], imported.gifts || [], "id"),
    timelineEntries: mergeArrays(current.timelineEntries || [], imported.timelineEntries || [], "id"),
    expenseLog: mergeArrays(current.expenseLog || [], imported.expenseLog || [], "id"),
    // Merge records
    checkedItems: { ...current.checkedItems, ...imported.checkedItems },
    budgetOverrides: { ...current.budgetOverrides, ...imported.budgetOverrides },
    expenses: { ...current.expenses, ...imported.expenses },
    checkedChecklistItems: {
      ...current.checkedChecklistItems,
      ...imported.checkedChecklistItems,
    },
    weddingDayKitChecked: {
      ...current.weddingDayKitChecked,
      ...imported.weddingDayKitChecked,
    },
    seatingTables: mergeArrays(current.seatingTables || [], imported.seatingTables || [], "id"),
    contacts: mergeArrays(current.contacts || [], imported.contacts || [], "id"),
    // Add merge logic for other arrays as needed
  };

  return merged;
}

// Helper function to merge arrays and deduplicate by ID field
function mergeArrays<T>(
  current: T[],
  imported: T[],
  idField: string
): T[] {
  const merged = [...current];
  const currentIds = new Set(current.map((item) => String((item as any)[idField])));

  for (const item of imported) {
    const id = String((item as any)[idField]);
    if (!currentIds.has(id)) {
      merged.push(item);
      currentIds.add(id);
    }
  }

  return merged;
}

// Create a backup of current state (for safety before import)
export function createBackupTimestamp(): string {
  const now = new Date();
  return `backup_${now.toISOString().replace(/[:.]/g, "-")}`;
}

// Check if imported state version is compatible
export function checkVersionCompatibility(importedState: WeddingState): {
  compatible: boolean;
  message?: string;
} {
  // For now, we'll be permissive and just warn about potential issues
  // In the future, you might want to check specific version requirements

  if (!importedState.info?.date) {
    return {
      compatible: false,
      message: "Imported data missing wedding date",
    };
  }

  // Check if critical data is present
  if (!importedState.info?.bride || !importedState.info?.groom) {
    return {
      compatible: false,
      message: "Imported data missing couple information",
    };
  }

  return { compatible: true };
}

// Get import summary for user confirmation
export function getImportSummary(state: WeddingState): {
  guestCount: number;
  vendorCount: number;
  expenseCount: number;
  weddingDate: string;
  hasBudget: boolean;
  hasTimeline: boolean;
  coupleNames: string;
} {
  return {
    guestCount: state.guests?.length || 0,
    vendorCount: state.vendors?.length || 0,
    expenseCount: state.expenseLog?.length || 0,
    weddingDate: state.info?.date || "Not set",
    hasBudget: !!(state.budget && state.budget > 0),
    hasTimeline: !!(state.timelineEntries && state.timelineEntries.length > 0),
    coupleNames: `${state.info?.bride || ""} & ${state.info?.groom || ""}`,
  };
}
