import type { WeddingStep, PrayerItem } from "@/types/wedding";
import { RECEPTION_EXTRAS_EN } from "./wedding-steps-reception-extras.en";

// ===== Prayers & speeches for LE VU QUY (Bride's Ceremony) =====
const VU_QUY_PRAYERS_EN: PrayerItem[] = [
  {
    emoji: "🕯️",
    title: "Ancestor prayer — Le Vu Quy (Bride's farewell)",
    occasion: "Vu Quy — wedding morning, before the reception",
    type: "prayer",
    note: "Bride's father or mother recites. The couple lights incense and bows 3 times. This is the LAST time the bride bows at her own family altar as 'their daughter' — deeply emotional. Have handkerchiefs ready.",
    text: `Namo Amitabha Buddha (3 times)

We respectfully bow to Heaven and Earth, and all divine spirits.
We respectfully bow to the City God, the Land God, and the Kitchen God.
We respectfully bow to our ancestors of the [BRIDE'S FAMILY NAME] clan.

Today, [LUNAR DATE],
At [BRIDE'S HOME ADDRESS],

Our granddaughter [BRIDE'S NAME], born in [BIRTH YEAR], is to be married to [GROOM'S NAME], son of Mr./Mrs. [GROOM'S PARENTS' NAMES].

Today is her Vu Quy day — she officially departs for her husband's home.
We humbly report to the ancestors and ask for their blessing:
— A safe and smooth journey to her new home
— A lifetime of harmony and happiness as husband and wife
— Both in-law families in peace and prosperity

Namo Amitabha Buddha (3 times)`,
  },
  {
    emoji: "👨",
    title: "Father's farewell speech to his daughter",
    occasion: "Vu Quy — after the ancestral ceremony, before the bride gets into the wedding car",
    type: "speech",
    note: "The bride's father speaks. This is the MOST EMOTIONAL moment — photographer must be ready. Keep it brief, from the heart. If you can't finish because of tears — that's completely normal.",
    text: `My dearest daughter,

Today you officially leave for your husband's home. Your mother and I have raised you from a little girl to this day — through joy and hardship — and we have always been happy because of you.

Son-in-law [GROOM'S NAME], I entrust my daughter to you. I trust you will love her, protect her, and build a happy home together.

My dear girl — this home will forever be your home. You can always come back, anytime.

We wish you both a lifetime of happiness.`,
  },
];

export const STEP_BRIDE_CEREMONY_EN: WeddingStep = {
  id: "bride-ceremony",
  tab: "🏡 Vu Quy",
  title: "Step 4: Le Vu Quy (Bride's Ceremony)",
  formalName: "Le Vu Quy (Bride's Sending-Off Ceremony)",
  icon: "🏡",
  description: "Le Vu Quy is the ceremony of sending the bride to her husband's home — expressing the bride's filial piety toward her parents and reverence for ancestors. This name is traditionally printed on the bride's family banners and invitations.",
  meaning: "Le Vu Quy (the bride's sending-off ceremony) is the ritual of reporting to ancestors and hosting guests from both families before the bride leaves for her husband's home. It includes the sacred ancestral ceremony — the bride lights incense at her own family altar, asks the ancestors' permission to leave home (xuat gia), and expresses gratitude to her parents. The moment the bride tearfully thanks her mother is always the most emotional in the entire wedding. Key distinction: the bride's side calls it 'Le Vu Quy', while the groom's side calls it 'Le Tan Hon' (Southern) or 'Le Thanh Hon' (Northern).",
  notes: [
    "Many families today combine the bride's and groom's receptions on the same day or same venue — saves costs",
    "If held separately: bride's reception is usually 1-2 days BEFORE the groom's reception",
    "The ancestral ceremony MUST happen BEFORE the reception — solemn, reverent, never rushed",
    "Ancestral ceremony: bride wears traditional ao dai — do NOT wear a wedding gown",
    "Prepare handkerchiefs for the ancestral ritual — bride and mother WILL cry",
    "Most emotional moment: the bride cries thanking her mother — photographer MUST be ready",
    "Photographer should catch close-up of the bride thanking her mother",
    "Reception menu: 8-10 dishes, avoid number 7 (associated with funerals), favor auspicious dish names",
    "Table layout: VIP tables near the stage, friends/colleagues toward the back",
    "Check sound, music, microphone, and slideshow at least 2 hours before the reception starts",
    "If held outdoors: backup rain plan, fans/air conditioning for guests",
    "Backup plan: backup MC, spare mic battery, flashlight in case of power outage",
    "Prepare thank-you envelopes for VIP tables: parents, grandparents, in-laws, uncles and aunts",
    "2-3 TRUSTED people to record gift envelopes — write clearly, count money twice",
    "Table rounds: 2-3 minutes per table — about 30-45 minutes total for 15-20 tables",
    "Prepare water + snacks for the couple — they often forget to eat when busy",
    "The Nhom Ho gathering is a Southern/Mekong Delta tradition — very important, do not skip",
    "The person escorting the bride should be a woman with a happy family and children of both genders",
    "Verify the bride has packed everything she needs for tomorrow",
    "Wedding suitcase: new underwear in even numbers, red color; new red bedsheets for good fortune",
  ],
  timeline: "1-2 days before or same day",
  aiHint: "Suggest beautiful and budget-friendly decoration ideas for the bride's family reception. Suggest an appropriate menu.",
  ceremonies: [
    {
      name: "🏡 Vu Quy Reception",
      required: 1,
      description: "The main reception hosted by the bride's family — welcoming relatives, friends, and colleagues on the bride's side. This is the last time the bride hosts guests as 'her family's daughter.'",
      steps: [
        { text: "Book venue / reception hall (+ 10% extra tables as buffer)", cost: 15000000, categoryKey: "venue", checkable: true },
        { text: "Print and send invitations 2-3 weeks in advance", cost: 1500000, categoryKey: "other", checkable: true },
        { text: "Reception menu of 8-10 dishes (avoid number 7)", cost: 20000000, categoryKey: "food", checkable: true },
        { text: "MC + live band/DJ", cost: 7000000, categoryKey: "mc", checkable: true },
        { text: "Decor: backdrop, tables, flower arch, foyer", cost: 5000000, categoryKey: "decor", checkable: true },
        { text: "Full photography & videography package", cost: 8000000, categoryKey: "photo", checkable: true },
        { text: "Wedding gown + ao dai for ancestral ceremony + all-day makeup", cost: 8000000, categoryKey: "clothes", checkable: true },
        { text: "Table layout: VIP tables near the stage", cost: 0, categoryKey: "other", checkable: true },
        { text: "Thank-you envelopes for VIP tables", cost: 500000, categoryKey: "other", checkable: true },
        { text: "Guest favors (candy box, thank-you cards)", cost: 2000000, categoryKey: "other", checkable: true },
        { text: "Bride wakes up, begins makeup + hair styling", time: "04:30", responsible: "Bride + MUA" },
        { text: "Check decorations, sound, and lighting", time: "06:00", responsible: "Wedding Planner" },
        { text: "Ancestral ceremony at bride's home (if held separately)", time: "07:00", responsible: "Bride's Family" },
        { text: "Receptionists ready, begin welcoming guests", time: "08:00", responsible: "Receptionist" },
        { text: "Guests arrive, record gift envelopes, guide to tables", time: "08:30", responsible: "Receptionist" },
        { text: "MC opens the reception, introduces families", time: "09:00", responsible: "MC / Host" },
        { text: "Bride's parents give welcome speech", time: "09:15", responsible: "Bride's Parents" },
        { text: "Bride and groom take the stage, raise glasses", time: "09:30", responsible: "Bride & Groom" },
        { text: "Reception begins — food is served", time: "09:45", responsible: "Venue Staff" },
        { text: "Table rounds to thank guests, group photos per table", time: "10:00", responsible: "Bride & Groom", note: "2-3 minutes per table" },
        { text: "Play memory slideshow (if prepared)", time: "10:45", responsible: "MC / Host + Sound Technician" },
        { text: "See off guests, give thanks, hand out favors", time: "11:00", responsible: "Bride & Groom" },
      ],
      people: [
        { name: "Bride's Parents", role: "Host, speech", avatar: "👫" },
        { name: "MC / Host", role: "Program coordinator", avatar: "🎤" },
        { name: "Receptionist", role: "Record envelopes", avatar: "📋" },
        { name: "Bridesmaids", role: "Support bride", avatar: "👧" },
        { name: "Photographer", role: "Photo + Video", avatar: "📷" },
      ],
    },
    {
      name: "🙏 Bride's Ancestral Ceremony (Gia Tien Nha Gai)",
      required: 1,
      description: "The bride and groom light incense at the bride's family altar — asking the ancestors' permission for the bride to leave home, and expressing gratitude to her parents. This is the MOST SACRED ritual of all and MUST happen BEFORE the reception.",
      steps: [
        { text: "Clean altar: fresh flowers, incense, candles, fruits", cost: 300000, categoryKey: "decor", checkable: true },
        { text: "Offerings tray (sticky rice, chicken, fruits, wine, tea)", cost: 500000, categoryKey: "food", checkable: true },
        { text: "Ancestral prayer text (read by bride's father or family elder)", cost: 0, categoryKey: "other", detail: "\"Nam mo A Di Da Phat (3 times). We respectfully bow to the Heavenly Deities and Earth Spirits. We bow to the local City God, the Land God, and the Kitchen God. We bow to the high ancestors, both paternal and maternal, of the [BRIDE'S FAMILY NAME]. Today, [DATE], at [BRIDE'S ADDRESS]. Our family has a granddaughter, [BRIDE'S NAME], born in [YEAR], who has now come of age. With the agreement of both families, we give her in marriage to [GROOM'S NAME], son of Mr./Mrs. [GROOM'S PARENTS' NAMES], residing at [GROOM'S ADDRESS]. We sincerely present these offerings and humbly ask the ancestors to bear witness and bless the couple with lifelong happiness and family prosperity. Nam mo A Di Da Phat (3 times).\"", checkable: true },
        { text: "Handkerchiefs for the bride and her mother (it will be emotional)", cost: 50000, categoryKey: "other", checkable: true },
        { text: "Photographer on standby — capture the moment of gratitude", cost: 0, categoryKey: "photo", checkable: true },
        { text: "Dress code: traditional ao dai (do NOT wear wedding gown)", cost: 0, categoryKey: "clothes", checkable: true },
        { text: "Arrange offerings on the altar — fresh flowers, incense, candles, fruits", time: "06:30", responsible: "Bride's Parents" },
        { text: "Father (or mother) lights incense, prays to the ancestors", time: "07:00", responsible: "Bride's Parents" },
        { text: "Bride and groom stand before the altar, hands clasped in respect", time: "07:05", responsible: "Bride & Groom" },
        { text: "Bow 3 times — asking ancestors' permission for the bride to leave home", time: "07:10", responsible: "Bride & Groom" },
        { text: "Bride expresses gratitude to her parents — most emotional moment 😢", time: "07:15", responsible: "Bride" },
        { text: "Parents give their blessings and embrace their daughter", time: "07:20", responsible: "Bride's Parents" },
        { text: "Family photo before the altar — a sacred keepsake", time: "07:25", responsible: "Photographer" },
      ],
      prayers: VU_QUY_PRAYERS_EN,
      people: [
        { name: "Bride & Groom", role: "Light incense, bow to ancestors", avatar: "💑" },
        { name: "Bride's Parents", role: "Pray, lead ceremony", avatar: "👫" },
        { name: "Grandparents (if present)", role: "Witness, bless", avatar: "👴" },
      ],
    },
    {
      name: "🌙 Family Gathering (Nhom Ho — Eve of Wedding)",
      required: 0,
      description: "The bride's relatives gather the evening before the wedding — preparing for the procession the next day, finalizing the dowry, and giving counsel to the bride. This is a cherished Southern/Mekong Delta tradition, deeply meaningful and emotional.",
      steps: [
        { text: "Invite close relatives of the bride's family from the afternoon/evening", cost: 0, categoryKey: "other", checkable: true },
        { text: "Prepare dinner / small gathering feast for relatives", cost: 3000000, categoryKey: "food", checkable: true },
        { text: "Agree on the dowry: gold, cash, household items", cost: 0, categoryKey: "jewelry", checkable: true },
        { text: "Choose the bride escort (aunt/female relative — woman with a happy family, children of both genders)", cost: 0, categoryKey: "other", checkable: true },
        { text: "Choose the umbrella holder for the bride (younger brother or male cousin)", cost: 0, categoryKey: "other", checkable: true },
        { text: "Choose who carries the wedding suitcase (close friend / younger sister / female cousin)", cost: 0, categoryKey: "other", checkable: true },
        { text: "Pack the bride's wedding suitcase", cost: 2000000, categoryKey: "clothes", detail: "Includes: personal clothing, makeup, shoes, new underwear (even number, red color), new red bedsheet set (symbolizes happiness), personal items she wants to bring.", checkable: true },
        { text: "Counsel the bride: do NOT look back when leaving the house", cost: 0, categoryKey: "other", detail: "When leaving the house: do NOT turn back to look (tradition — symbolizes moving forward). The bride's mother does not accompany her to the gate (varies by family). Step out of the house with the RIGHT foot first.", checkable: true },
        { text: "Final check of home decor and altar for tomorrow", cost: 0, categoryKey: "decor", checkable: true },
        { text: "Confirm tomorrow's schedule with the groom's family", cost: 0, categoryKey: "other", checkable: true },
        { text: "Prepare lucky money envelopes for the groom's procession", cost: 500000, categoryKey: "other", checkable: true },
        { text: "Prepare offerings tray for the ancestral ceremony tomorrow morning", cost: 300000, categoryKey: "food", checkable: true },
        { text: "Afternoon/evening: relatives gather at bride's home", time: "17:00", responsible: "Bride's Relatives" },
        { text: "Dinner / small feast — warm and joyful atmosphere", time: "18:00", responsible: "Bride's Parents" },
        { text: "Agree on the dowry (gold, cash, household items)", time: "19:00", responsible: "Bride's Parents" },
        { text: "Choose bride escort, umbrella holder, and suitcase carrier", time: "19:15", responsible: "Bride's Parents" },
        { text: "Bride packs her wedding suitcase — verify everything is complete", time: "19:30", responsible: "Bride" },
        { text: "Parents and aunts counsel the bride (emotional moment)", time: "20:00", responsible: "Bride's Parents" },
        { text: "Final check of home decor and altar", time: "20:30", responsible: "Bride's Parents" },
        { text: "Confirm tomorrow's schedule with groom's family", time: "20:45", responsible: "Bride's Parents" },
        { text: "(Optional) Karaoke / casual drinks — bonding with relatives", time: "21:00", responsible: "Bride's Relatives" },
      ],
      people: [
        { name: "Bride's Relatives", role: "Gather, support", avatar: "👨‍👩‍👧‍👦" },
        { name: "Bride's Parents", role: "Preside, counsel", avatar: "👫" },
        { name: "Bride", role: "Prepare, listen to counsel", avatar: "👰" },
        { name: "Bride Escort", role: "Selected tonight", avatar: "👩" },
      ],
    },
    ...RECEPTION_EXTRAS_EN,
  ],
};
