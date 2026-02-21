// All TypeScript interfaces for the Wedding Planner app

export interface ChecklistItem {
  t: string;   // task text
  c: number;   // cost in VND
  k: string;   // budget category key
}

export interface Person {
  n: string;   // name/role title
  r: string;   // role description
  a: string;   // avatar emoji
}

export interface GiftItem {
  n: string;   // name
  q: string;   // quantity
  c: number;   // cost
}

export interface Ceremony {
  nm: string;          // ceremony name with emoji
  req: number;         // 1=required, 0=optional
  desc: string;        // description
  cl: ChecklistItem[]; // checklist
  pp: Person[];        // people
  ri: string[];        // ritual steps
  tp: string[];        // tips
  lv?: GiftItem[];     // gifts/offerings (optional)
}

export interface WeddingStep {
  id: string;       // unique key e.g. "gap", "cauhon"
  tab: string;      // tab label with emoji
  title: string;    // full title
  icon: string;     // emoji icon
  desc: string;     // description
  tm: string;       // timeline text
  aiHint: string;   // AI prompt hint for this step
  cers: Ceremony[]; // ceremonies
}

export interface BudgetCategory {
  k: string;   // key matching checklist item k
  l: string;   // label with emoji
  p: number;   // default percentage
  cl: string;  // color hex
}

export interface AiPrompt {
  l: string;   // label with emoji
  p: string;   // prompt text
}

export interface IdeaItem {
  icon: string;
  title: string;
  desc: string;
}

export interface BackgroundStyle {
  bg: string;   // CSS gradient
  t: string;    // text color
  sub: string;  // subtitle/accent color
  f: string;    // font-family
}

export interface CoupleInfo {
  bride: string;
  groom: string;
  bf: string;    // bride's family name
  gf: string;    // groom's family name
  date: string;  // wedding date YYYY-MM-DD
  dDN: string;   // dam ngo date
  dDH: string;   // dam hoi date
  bby: string;   // bride birth year
  gby: string;   // groom birth year
}

export interface Guest {
  n: string;   // name
  p: string;   // phone
  s: string;   // side: 'trai' | 'gai'
  g: string;   // group/table
  id: number;  // unique id
}

export interface WeddingState {
  page: string;                  // active top-level page
  tab: number;
  st: Record<string, number>;   // step -> active sub-ceremony index
  ck: Record<string, boolean>;  // checklist key -> done
  bud: number;                  // total budget VND
  bo: Record<string, number>;   // budget category overrides (percentage)
  exp: Record<string, number>;  // actual expenses by category key
  zk: string;                   // ZhipuAI API key
  ar: string;                   // AI last response
  info: CoupleInfo;
  guests: Guest[];
  gid: number;                  // guest ID counter
}

export interface WeddingEvent {
  n: string;  // event name
  d: string;  // date string
}
