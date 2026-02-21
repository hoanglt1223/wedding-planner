import type { WeddingStep } from "@/types/wedding";
import { STEP_MEETING } from "./wedding-steps-0-meeting";
import { STEP_PROPOSAL } from "./wedding-steps-1-proposal";
import { STEP_ENGAGEMENT } from "./wedding-steps-2-engagement";
import { STEP_BETROTHAL } from "./wedding-steps-3-betrothal";
import { STEP_BRIDE_CEREMONY } from "./wedding-steps-4-bride-ceremony";
import { STEP_PROCESSION } from "./wedding-steps-5-procession";
import { STEP_GROOM_CEREMONY } from "./wedding-steps-6-groom-ceremony";

export const WEDDING_STEPS: WeddingStep[] = [
  STEP_MEETING,
  STEP_PROPOSAL,
  STEP_ENGAGEMENT,
  STEP_BETROTHAL,
  STEP_BRIDE_CEREMONY,
  STEP_PROCESSION,
  STEP_GROOM_CEREMONY,
];
