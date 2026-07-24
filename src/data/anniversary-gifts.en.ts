/**
 * Traditional Anniversary Gift Suggestions (English)
 * Based on Western anniversary gift traditions
 */

export interface AnniversaryGift {
  year: number;
  theme: string;          // Traditional theme (e.g., "Paper", "Silver")
  modernTheme?: string;   // Modern alternative theme
  ideas: string[];        // Gift ideas for this year
  color?: string;         // Associated color for gifts
  flower?: string;        // Associated flower for this year
}

export const ANNIVERSARY_GIFTS: AnniversaryGift[] = [
  {
    year: 1,
    theme: "Paper",
    modernTheme: "Clocks",
    ideas: [
      "Framed wedding photo",
      "Photo album/scrapbook",
      "Event tickets",
      "Handmade journal",
      "Love map poster"
    ],
    color: "Yellow",
    flower: "Carnation"
  },
  {
    year: 2,
    theme: "Cotton",
    modernTheme: "China",
    ideas: [
      "High-quality cotton sheets",
      "Personalized cotton robes",
      "Cotton picnic basket",
      "Custom throw pillows",
      "Cotton pajamas"
    ],
    color: "Green",
    flower: "Lily of the Valley"
  },
  {
    year: 3,
    theme: "Leather",
    modernTheme: "Crystal",
    ideas: [
      "Personalized leather wallet",
      "Leather belt",
      "Leather bag/purse",
      "Leather shoes",
      "Leather watch strap"
    ],
    color: "Brown",
    flower: "Rose"
  },
  {
    year: 4,
    theme: "Fruit/Flowers",
    modernTheme: "Appliances",
    ideas: [
      "Fruit basket centerpiece",
      "Beaded jewelry",
      "Blender",
      "Decorative lamp",
      "Elegant vase"
    ],
    color: "Blue",
    flower: "Daisy"
  },
  {
    year: 5,
    theme: "Wood",
    modernTheme: "Silverware",
    ideas: [
      "Carved wooden sculpture",
      "Wooden clock",
      "Wooden picture frame",
      "Wooden serving tray",
      "Wooden dollhouse"
    ],
    color: "Turquoise",
    flower: "Lily"
  },
  {
    year: 6,
    theme: "Iron",
    modernTheme: "Wood",
    ideas: [
      "Home iron accents",
      "Iron sculpture",
      "Iron chandelier",
      "Decorative iron tray",
      "DIY iron project"
    ],
    color: "White",
    flower: "White Daisy"
  },
  {
    year: 7,
    theme: "Copper",
    modernTheme: "Wool",
    ideas: [
      "Copper sculpture",
      "Copper cookware",
      "Copper necklace",
      "Copper serving tray",
      "Copper mug set"
    ],
    color: "Copper",
    flower: "Jacaranda"
  },
  {
    year: 8,
    theme: "Bronze",
    modernTheme: "Linens",
    ideas: [
      "Bronze sculpture",
      "Bronze medal",
      "Bronze serving tray",
      "Bronze decorative accents",
      "Bronze tools"
    ],
    color: "Bronze",
    flower: "Hydrangea"
  },
  {
    year: 9,
    theme: "Pottery",
    modernTheme: "Leather",
    ideas: [
      "Pottery dinnerware",
      "Pottery planters",
      "Pottery sculpture",
      "Tea set",
      "Pottery lamp"
    ],
    color: "Terracotta",
    flower: "Ivy"
  },
  {
    year: 10,
    theme: "Tin",
    modernTheme: "Diamond",
    ideas: [
      "Tin cookingware",
      "Tin jewelry box",
      "Tin decorative tray",
      "Tin drinking cups",
      "Tin card set"
    ],
    color: "Silver-blue",
    flower: "White Rose"
  },
  {
    year: 11,
    theme: "Steel",
    modernTheme: "Fashion",
    ideas: [
      "Steel kitchen appliances",
      "Steel frame artwork",
      "Steel bracelet",
      "Steel lamp",
      "DIY steel project"
    ],
    color: "Gray",
    flower: "Orchid"
  },
  {
    year: 12,
    theme: "Silk",
    modernTheme: "Pearl",
    ideas: [
      "Silk robe",
      "Silk scarf",
      "Silk sheets",
      "Silk tie",
      "Silk dress"
    ],
    color: "Pink",
    flower: "Violet"
  },
  {
    year: 13,
    theme: "Lace",
    modernTheme: "Textile",
    ideas: [
      "Lace dress",
      "Lace tablecloth",
      "Lace pillow",
      "Lace shirt",
      "Lace accessories"
    ],
    color: "Cream",
    flower: "Hollyhock"
  },
  {
    year: 14,
    theme: "Ivory",
    modernTheme: "Gold",
    ideas: [
      "Ivory accessories",
      "Ivory jewelry",
      "Ivory sculpture",
      "Ivory tools",
      "Ivory box"
    ],
    color: "Cream",
    flower: "Tulip"
  },
  {
    year: 15,
    theme: "Crystal",
    modernTheme: "Watches",
    ideas: [
      "Crystal glasses",
      "Crystal vase",
      "Crystal chandelier",
      "Crystal sculpture",
      "Crystal candlesticks"
    ],
    color: "Clear",
    flower: "Rose"
  },
  {
    year: 20,
    theme: "China",
    modernTheme: "Platinum",
    ideas: [
      "Platinum jewelry",
      "Platinum watch",
      "Platinum cookware",
      "Platinum serving tray",
      "Platinum knife set"
    ],
    color: "Silver",
    flower: "Red Rose"
  },
  {
    year: 25,
    theme: "Silver",
    modernTheme: "Silver",
    ideas: [
      "Silverware set",
      "Silver serving tray",
      "Silver sculpture",
      "Silver picture frame",
      "Silver decorative items"
    ],
    color: "Silver",
    flower: "Yellow Rose"
  },
  {
    year: 30,
    theme: "Pearl",
    modernTheme: "Diamond",
    ideas: [
      "Pearl necklace",
      "Pearl earrings",
      "Pearl bracelet",
      "Pearl jewelry box",
      "Pearl mirror"
    ],
    color: "Ivory",
    flower: "Orchid"
  },
  {
    year: 40,
    theme: "Ruby",
    modernTheme: "Ruby",
    ideas: [
      "Ruby jewelry",
      "Ruby watch",
      "Ruby cufflinks",
      "Ruby bracelet",
      "Ruby earrings"
    ],
    color: "Red",
    flower: "Ruby Rose"
  },
  {
    year: 50,
    theme: "Gold",
    modernTheme: "Gold",
    ideas: [
      "Gold jewelry",
      "Gold watch",
      "Gold accessories",
      "Gold sculpture",
      "Gold serving tray"
    ],
    color: "Gold",
    flower: "Yellow Rose"
  },
  {
    year: 60,
    theme: "Diamond",
    modernTheme: "Diamond",
    ideas: [
      "Diamond jewelry",
      "Diamond watch",
      "Diamond bracelet",
      "Diamond earrings",
      "Diamond box"
    ],
    color: "Clear",
    flower: "Diamond Rose"
  }
];

export function getAnniversaryGift(year: number): AnniversaryGift | undefined {
  return ANNIVERSARY_GIFTS.find(gift => gift.year === year);
}

export function getGiftSuggestions(year: number): string[] {
  const gift = getAnniversaryGift(year);
  return gift?.ideas || [];
}