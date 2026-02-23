import type { ElementCompatibility } from "./types";

// Five Elements (Ngũ Hành) from year's Heavenly Stem
// canIndex = (birthYear + 6) % 10
const ELEMENTS = ["Mộc", "Mộc", "Hỏa", "Hỏa", "Thổ", "Thổ", "Kim", "Kim", "Thủy", "Thủy"];

const ELEMENT_NAMES_EN: Record<string, string> = {
  "Mộc": "Wood",
  "Hỏa": "Fire",
  "Thổ": "Earth",
  "Kim": "Metal",
  "Thủy": "Water",
};

const ELEMENT_EMOJIS: Record<string, string> = {
  "Mộc": "🌳",
  "Hỏa": "🔥",
  "Thổ": "🏔️",
  "Kim": "⚙️",
  "Thủy": "💧",
};

// Tương Sinh (generation): Mộc→Hỏa→Thổ→Kim→Thủy→Mộc
const SINH_MAP: Record<string, string> = {
  "Mộc": "Hỏa",
  "Hỏa": "Thổ",
  "Thổ": "Kim",
  "Kim": "Thủy",
  "Thủy": "Mộc",
};

// Tương Khắc (destruction): Mộc→Thổ→Thủy→Hỏa→Kim→Mộc
const KHAC_MAP: Record<string, string> = {
  "Mộc": "Thổ",
  "Thổ": "Thủy",
  "Thủy": "Hỏa",
  "Hỏa": "Kim",
  "Kim": "Mộc",
};

export function getElement(birthYear: number): string {
  const canIndex = (birthYear + 6) % 10;
  return ELEMENTS[canIndex];
}

export function getElementEmoji(element: string): string {
  return ELEMENT_EMOJIS[element] ?? "";
}

export function getElementNameEn(element: string): string {
  return ELEMENT_NAMES_EN[element] ?? element;
}

export function getCompatibility(el1: string, el2: string, lang = "vi"): ElementCompatibility {
  const en = lang === "en";
  if (el1 === el2) {
    return {
      brideElement: el1,
      groomElement: el2,
      relationship: "neutral",
      description: en ? "Same element — natural harmony" : "Cùng hành — hòa hợp tự nhiên",
      favorable: true,
    };
  }
  if (SINH_MAP[el1] === el2 || SINH_MAP[el2] === el1) {
    return {
      brideElement: el1,
      groomElement: el2,
      relationship: "tuong-sinh",
      description: en ? "Tuong Sinh — mutually supportive" : "Tương Sinh — bổ trợ lẫn nhau",
      favorable: true,
    };
  }
  if (KHAC_MAP[el1] === el2 || KHAC_MAP[el2] === el1) {
    return {
      brideElement: el1,
      groomElement: el2,
      relationship: "tuong-khac",
      description: en ? "Tuong Khac — needs consideration" : "Tương Khắc — cần cân nhắc",
      favorable: false,
    };
  }
  return {
    brideElement: el1,
    groomElement: el2,
    relationship: "neutral",
    description: en ? "Neutral" : "Trung tính",
    favorable: true,
  };
}
