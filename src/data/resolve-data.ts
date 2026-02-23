import { WEDDING_STEPS } from "./wedding-steps";
import { WEDDING_STEPS_EN } from "./wedding-steps.en";
import { BUDGET_CATEGORIES } from "./budget-categories";
import { BUDGET_CATEGORIES_EN } from "./budget-categories.en";
import { AI_PROMPTS } from "./ai-prompts";
import { AI_PROMPTS_EN } from "./ai-prompts.en";
import { IDEAS } from "./ideas";
import { IDEAS_EN } from "./ideas.en";
import { ZODIAC_PROFILES } from "./astrology-zodiac-profiles";
import { ZODIAC_PROFILES_EN } from "./astrology-zodiac-profiles.en";
import { ELEMENT_PROFILES } from "./astrology-element-profiles";
import { ELEMENT_PROFILES_EN } from "./astrology-element-profiles.en";
import { YEARLY_FORECASTS } from "./astrology-yearly-forecast";
import { YEARLY_FORECASTS_EN } from "./astrology-yearly-forecast.en";
import type { WeddingStep, BudgetCategory, AiPrompt } from "@/types/wedding";
import type { Region } from "@/data/regions";
import type { IdeaItemExt } from "./ideas";
import type { ZodiacProfile } from "./astrology-zodiac-profiles";
import type { ElementProfile } from "./astrology-element-profiles";
import type { YearlyForecast } from "./astrology-yearly-forecast";

export function getWeddingSteps(lang: string): WeddingStep[] {
  return lang === "en" ? WEDDING_STEPS_EN : WEDDING_STEPS;
}

export function getBudgetCategories(lang: string): BudgetCategory[] {
  return lang === "en" ? BUDGET_CATEGORIES_EN : BUDGET_CATEGORIES;
}

export function getAiPrompts(lang: string): AiPrompt[] {
  return lang === "en" ? AI_PROMPTS_EN : AI_PROMPTS;
}

export function getIdeas(lang: string): IdeaItemExt[] {
  return lang === "en" ? IDEAS_EN : IDEAS;
}

export function getZodiacProfiles(lang: string): ZodiacProfile[] {
  return lang === "en" ? ZODIAC_PROFILES_EN : ZODIAC_PROFILES;
}

export function getElementProfiles(lang: string): ElementProfile[] {
  return lang === "en" ? ELEMENT_PROFILES_EN : ELEMENT_PROFILES;
}

export function getYearlyForecasts(lang: string): YearlyForecast[] {
  return lang === "en" ? YEARLY_FORECASTS_EN : YEARLY_FORECASTS;
}

export type { Region };
