// English translations of Vietnamese Ngũ Hành (Five Elements) personality profiles
// Keys match ELEMENT_LABEL keys in astrology.ts: metal, wood, water, fire, earth
// Vietnamese terms kept in parentheses for cultural reference

import type { ElementProfile } from "./astrology-element-profiles";

export const ELEMENT_PROFILES_EN: ElementProfile[] = [
  {
    key: "metal",
    label: "Metal (Kim)",
    emoji: "🪙",
    coreTraits: ["Resolute", "Decisive", "Principled", "Steadfast"],
    marriageTraits: "Strong protector and loyal partner. Sometimes rigid — needs to learn compromise and flexibility in marriage.",
    healthTendencies: "Watch lungs, respiratory system, and skin. Practice deep breathing and yoga; avoid polluted environments.",
    luckyColors: ["White", "Silver", "Light Yellow"],
    unluckyColors: ["Red", "Orange"],
    luckyNumbers: [4, 9],
    luckyDirections: ["West", "Northwest"],
    season: "Autumn (lunar months 7–9)",
  },
  {
    key: "wood",
    label: "Wood (Moc)",
    emoji: "🌳",
    coreTraits: ["Benevolent", "Growth-oriented", "Creative", "Persistent"],
    marriageTraits: "Nurtures and cares for family wholeheartedly. A supportive partner; needs personal growth space alongside love.",
    healthTendencies: "Watch liver, gallbladder, and nervous system. Exercise outdoors regularly; eat a green, wholesome diet.",
    luckyColors: ["Green", "Lime Green"],
    unluckyColors: ["White", "Gray"],
    luckyNumbers: [3, 8],
    luckyDirections: ["East", "Southeast"],
    season: "Spring (lunar months 1–3)",
  },
  {
    key: "water",
    label: "Water (Thuy)",
    emoji: "💧",
    coreTraits: ["Intelligent", "Flexible", "Good communicator", "Emotionally rich"],
    marriageTraits: "Adapts well to a partner; emotionally deep and expressive. Easily influenced by environment — needs a grounded, stable partner.",
    healthTendencies: "Watch kidneys, bladder, and urinary system. Drink enough water, keep warm, and avoid damp or cold conditions.",
    luckyColors: ["Black", "Blue", "Dark Blue"],
    unluckyColors: ["Yellow", "Brown"],
    luckyNumbers: [1, 6],
    luckyDirections: ["North"],
    season: "Winter (lunar months 10–12)",
  },
  {
    key: "fire",
    label: "Fire (Hoa)",
    emoji: "🔥",
    coreTraits: ["Passionate", "Energetic", "Leadership", "Impulsive"],
    marriageTraits: "Intense and enthusiastic in love, likes to take charge. Marriage needs anger management and learning to truly listen.",
    healthTendencies: "Watch heart, blood pressure, and circulatory system. Avoid stress, practice meditation, and limit spicy or hot foods.",
    luckyColors: ["Red", "Pink", "Orange", "Purple"],
    unluckyColors: ["Blue", "Black"],
    luckyNumbers: [2, 7],
    luckyDirections: ["South"],
    season: "Summer (lunar months 4–6)",
  },
  {
    key: "earth",
    label: "Earth (Tho)",
    emoji: "🪨",
    coreTraits: ["Stable", "Trustworthy", "Practical", "Patient"],
    marriageTraits: "The most reliable partner — prioritizes safety and family stability. Marriage is enduring but needs proactive renewal.",
    healthTendencies: "Watch stomach, spleen, and digestive system. Eat regularly, avoid excessive worry, and maintain a consistent lifestyle.",
    luckyColors: ["Yellow", "Brown", "Beige"],
    unluckyColors: ["Green"],
    luckyNumbers: [2, 5],
    luckyDirections: ["Northeast", "Southwest"],
    season: "Transitional (end of each season)",
  },
];

/** Get element profile (English) by key ("metal", "wood", "water", "fire", "earth") */
export function getElementProfileEn(key: string): ElementProfile | undefined {
  return ELEMENT_PROFILES_EN.find((p) => p.key === key);
}
