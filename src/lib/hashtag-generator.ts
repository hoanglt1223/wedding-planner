import type { CoupleInfo } from "@/types/wedding";

export type HashtagCategory = "romantic" | "fun" | "simple" | "creative" | "vietnamese";

export interface HashtagSuggestion {
  tag: string;
  category: HashtagCategory;
  reason: string;
}

/**
 * Remove Vietnamese diacritics from text
 * "Nguyễn Thị Mai" → "Nguyen Thi Mai"
 */
function removeDiacritics(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace("Đ", "D")
    .replace("đ", "d");
}

/**
 * Create a clean base name from a full name
 * "Nguyễn Thị Mai" → "maithi" or "nguyenthimai"
 */
function cleanName(name: string, useFullName: boolean = false): string {
  const nameNoDiacritics = removeDiacritics(name);
  const parts = nameNoDiacritics.trim().split(/\s+/);

  if (useFullName) {
    return parts.join("").toLowerCase();
  }

  // Use last name (first part in Vietnamese naming convention)
  return parts[0].toLowerCase();
}

/**
 * Generate wedding year variations
 */
function getYearVariations(weddingDate: string): string[] {
  const year = weddingDate ? new Date(weddingDate).getFullYear() : new Date().getFullYear();
  const yearStr = year.toString();
  const shortYear = yearStr.slice(-2); // "26" from "2026"

  return [yearStr, shortYear];
}

/**
 * Generate Vietnamese wedding hashtags
 */
function generateVietnameseHashtags(
  brideName: string,
  groomName: string,
  weddingDate: string
): HashtagSuggestion[] {
  const bride = cleanName(brideName);
  const groom = cleanName(groomName);
  const brideFull = removeDiacritics(brideName).replace(/\s+/g, "").toLowerCase();
  const groomFull = removeDiacritics(groomName).replace(/\s+/g, "").toLowerCase();
  const years = getYearVariations(weddingDate);

  return [
    {
      tag: `damcuoi${bride}${groom}`,
      category: "vietnamese",
      reason: "Classic Vietnamese wedding hashtag"
    },
    {
      tag: `damcuoi${brideFull}${groomFull}`,
      category: "vietnamese",
      reason: "Full name combination"
    },
    {
      tag: `honnhan${bride}${groom}`,
      category: "vietnamese",
      reason: "Marriage-focused"
    },
    {
      tag: `tinhyeu${bride}${groom}`,
      category: "romantic",
      reason: "Love-themed with names"
    },
    {
      tag: `ngaychungthuc${years[0]}`,
      category: "vietnamese",
      reason: "Wedding anniversary year"
    },
    {
      tag: `lecuoi${bride}${groom}`,
      category: "vietnamese",
      reason: "Wedding ceremony focused"
    },
    {
      tag: `damcuoi${bride}${groom}${years[0]}`,
      category: "vietnamese",
      reason: "Wedding with year"
    },
    {
      tag: `hanhphuc${bride}${groom}`,
      category: "romantic",
      reason: "Happiness + couple names"
    }
  ];
}

/**
 * Generate romantic hashtags
 */
function generateRomanticHashtags(
  brideName: string,
  groomName: string,
  weddingDate: string
): HashtagSuggestion[] {
  const bride = cleanName(brideName);
  const groom = cleanName(groomName);
  const brideFull = removeDiacritics(brideName).replace(/\s+/g, "").toLowerCase();
  const groomFull = removeDiacritics(groomName).replace(/\s+/g, "").toLowerCase();
  const years = getYearVariations(weddingDate);

  return [
    {
      tag: `${bride}and${groom}`,
      category: "romantic",
      reason: "Simple and classic"
    },
    {
      tag: `${bride}${groom}${years[0]}`,
      category: "romantic",
      reason: "Names with wedding year"
    },
    {
      tag: `forever${bride}${groom}`,
      category: "romantic",
      reason: "Eternal love theme"
    },
    {
      tag: `${brideFull}weds${groomFull}`,
      category: "romantic",
      reason: "Full name wedding announcement"
    },
    {
      tag: `love${bride}${groom}`,
      category: "romantic",
      reason: "Love-focused with names"
    },
    {
      tag: `${bride}loves${groom}`,
      category: "romantic",
      reason: "Direct love declaration"
    },
    {
      tag: `happilyeverafter${bride}${groom}`,
      category: "romantic",
      reason: "Fairytale ending theme"
    },
    {
      tag: `weddingbliss${bride}${groom}`,
      category: "romantic",
      reason: "Wedding happiness theme"
    }
  ];
}

/**
 * Generate fun/playful hashtags
 */
function generateFunHashtags(
  brideName: string,
  groomName: string,
  weddingDate: string
): HashtagSuggestion[] {
  const bride = cleanName(brideName);
  const groom = cleanName(groomName);
  const years = getYearVariations(weddingDate);

  return [
    {
      tag: `finally${bride}${groom}`,
      category: "fun",
      reason: "Playful 'finally married' theme"
    },
    {
      tag: `sayido${bride}${groom}`,
      category: "fun",
      reason: "Marriage proposal/wedding theme"
    },
    {
      tag: `ringthebell${bride}${groom}`,
      category: "fun",
      reason: "Wedding bell reference"
    },
    {
      tag: `tieTheKnot${bride}${groom}`,
      category: "fun",
      reason: "Common wedding idiom"
    },
    {
      tag: `shesaidyes${groom}`,
      category: "fun",
      reason: "Proposal moment focused"
    },
    {
      tag: `weddingparty${bride}${groom}`,
      category: "fun",
      reason: "Celebration theme"
    },
    {
      tag: `heretostay${bride}${groom}`,
      category: "fun",
      reason: "Commitment theme"
    },
    {
      tag: `weddingbells${years[0]}`,
      category: "fun",
      reason: "Wedding bells with year"
    }
  ];
}

/**
 * Generate simple/minimalist hashtags
 */
function generateSimpleHashtags(
  brideName: string,
  groomName: string,
  weddingDate: string
): HashtagSuggestion[] {
  const bride = cleanName(brideName);
  const groom = cleanName(groomName);
  const years = getYearVariations(weddingDate);

  return [
    {
      tag: `${bride}${groom}`,
      category: "simple",
      reason: "Minimalist name combination"
    },
    {
      tag: `${bride}groom${groom}`,
      category: "simple",
      reason: "Clear role indication"
    },
    {
      tag: `${bride}bride${groom}groom`,
      category: "simple",
      reason: "Explicit role labels"
    },
    {
      tag: `wedding${years[0]}`,
      category: "simple",
      reason: "Year-focused"
    },
    {
      tag: `mr${groom}mrs${bride}`,
      category: "simple",
      reason: "Title-based"
    },
    {
      tag: `the${bride}${groom}s`,
      category: "simple",
      reason: "Family name style"
    },
    {
      tag: `wed${years[0]}`,
      category: "simple",
      reason: "Short and sweet"
    },
    {
      tag: `mywedding${years[0]}`,
      category: "simple",
      reason: "Personal ownership"
    }
  ];
}

/**
 * Generate creative/unique hashtags
 */
function generateCreativeHashtags(
  brideName: string,
  groomName: string,
  weddingDate: string
): HashtagSuggestion[] {
  const bride = cleanName(brideName);
  const groom = cleanName(groomName);
  const brideFull = removeDiacritics(brideName).replace(/\s+/g, "").toLowerCase();
  const groomFull = removeDiacritics(groomName).replace(/\s+/g, "").toLowerCase();
  const years = getYearVariations(weddingDate);

  return [
    {
      tag: `frommiss${bride}tomrs${groom}`,
      category: "creative",
      reason: "Name transition theme"
    },
    {
      tag: `adventurebegins${bride}${groom}`,
      category: "creative",
      reason: "Life journey theme"
    },
    {
      tag: `chapterone${bride}${groom}`,
      category: "creative",
      reason: "New life chapter"
    },
    {
      tag: `{brideFull}and${groomFull}take2`,
      category: "creative",
      reason: "New beginning theme"
    },
    {
      tag: `twobecomeone${bride}${groom}`,
      category: "creative",
      reason: "Union/marriage theme"
    },
    {
      tag: `walkingdowntheaisle${years[0]}`,
      category: "creative",
      reason: "Wedding ceremony moment"
    },
    {
      tag: `happilyever${bride}${groom}`,
      category: "creative",
      reason: "Fairytale-inspired"
    },
    {
      tag: `ourweddingstory${bride}${groom}`,
      category: "creative",
      reason: "Narrative theme"
    }
  ];
}

/**
 * Main function to generate all hashtag suggestions
 */
export function generateHashtagSuggestions(
  coupleInfo: CoupleInfo
): HashtagSuggestion[] {
  const { bride, groom, date } = coupleInfo;

  if (!bride || !groom) {
    return [];
  }

  const suggestions: HashtagSuggestion[] = [
    ...generateVietnameseHashtags(bride, groom, date),
    ...generateRomanticHashtags(bride, groom, date),
    ...generateFunHashtags(bride, groom, date),
    ...generateSimpleHashtags(bride, groom, date),
    ...generateCreativeHashtags(bride, groom, date)
  ];

  // Remove duplicates while preserving order
  const unique = Array.from(
    new Map(suggestions.map(s => [s.tag, s])).values()
  );

  return unique;
}

/**
 * Copy hashtag to clipboard
 */
export async function copyHashtag(tag: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(`#${tag}`);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format multiple hashtags for sharing
 */
export function formatHashtagsForSharing(hashtags: string[]): string {
  return hashtags.map(tag => `#${tag}`).join(" ");
}
