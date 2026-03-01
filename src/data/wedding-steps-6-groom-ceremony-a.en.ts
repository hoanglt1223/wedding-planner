import type { Ceremony, PrayerItem } from "@/types/wedding";

// ===== Prayers for LE TAN HON (Groom's Ancestral Ceremony) =====
const GROOM_PRAYERS_EN: PrayerItem[] = [
  {
    emoji: "🕯️",
    title: "Ancestor prayer at the groom's home — Le Tan Hon",
    occasion: "Le Tan Hon — when the bride arrives at the groom's home, before the reception",
    type: "prayer",
    note: "Groom's father or grandfather recites. The couple lights incense and bows 3 times. From this moment, the bride officially becomes a member of the groom's family. Must happen BEFORE the reception — quiet, solemn space.",
    text: `Namo Amitabha Buddha (3 times)

We respectfully bow to Heaven and Earth, and all divine spirits.
We respectfully bow to the City God, the Land God, and the Kitchen God.
We respectfully bow to our ancestors of the [GROOM'S FAMILY NAME] clan.

Today, [LUNAR DATE],
At [GROOM'S HOME ADDRESS],

I, [GROOM'S FATHER'S NAME], residing at [ADDRESS],
Report that our son [GROOM'S NAME], born in [BIRTH YEAR], has been joined in marriage with [BRIDE'S NAME], daughter of Mr./Mrs. [BRIDE'S PARENTS' NAMES].

We sincerely report to the ancestors and ask for your blessing:
— May they be a harmonious, respectful couple
— May they soon be blessed with children and a prosperous family
— May both in-law families live in peace and happiness

Namo Amitabha Buddha (3 times)`,
  },
  {
    emoji: "🏠",
    title: "Prayer when the bride first enters the groom's home",
    occasion: "Le Tan Hon — the moment the bride steps into the groom's house",
    type: "prayer",
    note: "The groom's mother or a senior elder recites as the bride enters. Some regions include a ritual of stepping over a charcoal brazier (Central) or a small fire pit. Brief and warm.",
    text: `Namo Amitabha Buddha (3 times)

We respectfully bow to the Land Deity, Kitchen God, and all guardian spirits of this home.
We respectfully bow to our ancestors of the [GROOM'S FAMILY NAME] clan.

Today, our new daughter-in-law [BRIDE'S NAME] officially enters this home, becoming a member of the [GROOM'S FAMILY NAME] family.

We ask the Land Deity and guardian spirits to witness and bless our new daughter-in-law:
— May she settle in well and bring harmony to the family
— May husband and wife be united and the household prosper
— May all enjoy good health and blessings

Namo Amitabha Buddha (3 times)`,
  },
];

// Core ceremonies for Step 6: Groom's Family Reception (groom-specific, not shared)
export const GROOM_CEREMONIES_A_EN: Ceremony[] = [
  {
    name: "🙏 Groom's Ancestral Ceremony (Gia Tien Nha Trai)",
    required: 1,
    description: "The bride officially bows before the groom's family altar — from this moment, she becomes a member of his family. This sacred and solemn ceremony MUST take place BEFORE the reception.",
    steps: [
      { text: "Clean altar, arrange respectfully: fresh flowers, incense, candles", cost: 300000, categoryKey: "decor", checkable: true },
      { text: "Offerings tray: sticky rice, chicken, fruits, wine, tea", cost: 700000, categoryKey: "food", checkable: true },
      { text: "Ancestor portraits (if any) placed neatly", cost: 0, categoryKey: "other", checkable: true },
      { text: "Ancestral prayer text (read by groom's father or family elder)", cost: 0, categoryKey: "other", checkable: true, detail: "\"Nam mo A Di Da Phat (3 times). We respectfully bow to the Deities and Spirits, the high ancestors, both paternal and maternal, of the [GROOM'S FAMILY NAME]. Today, [DATE], I, [GROOM'S FATHER'S NAME], residing at [ADDRESS], report that our son [GROOM'S NAME] has been joined in marriage with [BRIDE'S NAME], daughter of Mr./Mrs. [BRIDE'S PARENTS' NAMES]. We sincerely report to the ancestors — please bear witness and bless the couple with a happy, harmonious life, and the family with health and prosperity. Nam mo A Di Da Phat (3 times).\"" },
      { text: "Fine tea to serve to parents and grandparents", cost: 100000, categoryKey: "food", checkable: true },
      { text: "Lucky red envelopes for the bride and groom", cost: 500000, categoryKey: "other", checkable: true, time: "09:40", responsible: "Groom's Parents" },
      { text: "Groom's family prepares the altar and offerings", time: "08:30", responsible: "Mother-in-law" },
      { text: "Wedding procession arrives at groom's home", time: "09:00", responsible: "Groom" },
      { text: "Mother-in-law greets the bride at the door — presents a welcoming gift (gold bracelet)", time: "09:05", responsible: "Mother-in-law" },
      { text: "Bride steps into the house with her RIGHT foot first", time: "09:10", responsible: "Bride", note: "Auspicious tradition" },
      { text: "Bride and groom are led before the ancestral altar", time: "09:15", responsible: "Groom's Parents" },
      { text: "Father/grandfather lights incense, prays to the ancestors", time: "09:20", responsible: "Groom's Father" },
      { text: "Bride and groom bow 3 times before the altar", time: "09:25", responsible: "Bride & Groom" },
      { text: "Bride pours tea and serves groom's parents and grandparents", time: "09:30", responsible: "Bride" },
      { text: "Family photo in front of the altar", time: "09:50", responsible: "Photographer" },
    ],
    prayers: GROOM_PRAYERS_EN,
    people: [
      { name: "Bride & Groom", role: "Light incense, bow to ancestors", avatar: "💑" },
      { name: "Groom's Parents", role: "Guide ceremony, pray", avatar: "👫" },
      { name: "Grandparents (if present)", role: "Bless", avatar: "👴" },
    ],
  },
  {
    name: "🎊 Main Reception (Tiec Chinh)",
    required: 1,
    description: "The grandest reception of the wedding — welcoming guests from both families, ring exchange, cake cutting, games, and first dance. This is the biggest event of the day and requires the most thorough preparation.",
    steps: [
      { text: "Book the venue (confirm table count + 10% buffer)", cost: 25000000, categoryKey: "venue", checkable: true },
      { text: "Print & send invitations (2-3 weeks in advance)", cost: 2000000, categoryKey: "other", checkable: true },
      { text: "Reception menu of 8-10 dishes + wine, beer, soft drinks", cost: 30000000, categoryKey: "food", checkable: true },
      { text: "Professional MC + live band/DJ + sound & lighting", cost: 11000000, categoryKey: "mc", checkable: true },
      { text: "Decor: stage, backdrop, flower arch, gallery table", cost: 8000000, categoryKey: "decor", checkable: true },
      { text: "Full photo + video package (pre-wedding + wedding day)", cost: 10000000, categoryKey: "photo", checkable: true },
      { text: "Soirée wedding gown + after-party dress", cost: 8000000, categoryKey: "clothes", checkable: true },
      { text: "Groom's suit (tailored or rented)", cost: 3000000, categoryKey: "clothes", checkable: true },
      { text: "All-day makeup & hair stylist", cost: 5000000, categoryKey: "makeup", checkable: true },
      { text: "Wedding ring set — final check!", cost: 5000000, categoryKey: "ring", checkable: true },
      { text: "Guest favors (candy, chocolate, thank-you cards)", cost: 3000000, categoryKey: "other", checkable: true },
      { text: "Multi-tiered wedding cake (order 1 week in advance)", cost: 3000000, categoryKey: "food", checkable: true },
      { text: "Honeymoon suite: flowers, candles, new red bedsheets", cost: 2000000, categoryKey: "other", checkable: true },
      { text: "Detailed MC script with minute-by-minute cues + backup copy", cost: 0, categoryKey: "other", checkable: true },
      { text: "Table layout: VIP near the stage, friends toward the back", cost: 0, categoryKey: "other", checkable: true },
      { text: "Wedding day emergency kit (backup supplies)", cost: 100000, categoryKey: "other", checkable: true, detail: "Includes: safety pins, double-sided tape, headache medicine, antacid, medicated oil, tissues, water, candy, lip touch-up, small brush, needle and thread, adhesive, spare mic battery." },
      { text: "Check all decor, sound, lighting, slides, and music", time: "07:00", responsible: "Wedding Planner" },
      { text: "Bride changes into wedding gown, touch-up makeup", time: "08:00", responsible: "Bride + MUA" },
      { text: "Receptionists ready, begin welcoming guests", time: "08:30", responsible: "Receptionist" },
      { text: "Guests arrive; MC checks mic and music", time: "09:00", responsible: "MC / Host + Sound Technician" },
      { text: "MC opens the reception — welcome speech, introduce families", time: "09:30", responsible: "MC / Host" },
      { text: "Groom's parents give their speech", time: "09:40", responsible: "Groom's Parents" },
      { text: "Bride and groom take the stage — ring exchange ceremony", time: "09:50", responsible: "Bride & Groom", note: "The most sacred moment" },
      { text: "Cut the wedding cake, raise champagne glasses", time: "10:00", responsible: "Bride & Groom" },
      { text: "Reception begins — food is served", time: "10:10", responsible: "Venue Staff" },
      { text: "Table rounds to toast and thank guests", time: "10:30", responsible: "Bride & Groom", note: "2-3 minutes per table" },
      { text: "Entertainment program, fun games for guests", time: "11:15", responsible: "MC / Host + Band" },
      { text: "First dance", time: "11:30", responsible: "Bride & Groom" },
      { text: "Thank-you letter to parents (if included)", time: "11:40", responsible: "Bride & Groom", note: "Most touching moment" },
      { text: "Bouquet toss for single ladies", time: "11:50", responsible: "Bride" },
      { text: "See off guests, give thanks, hand out favors", time: "12:00", responsible: "Bride & Groom" },
      { text: "Clean up, count gift envelopes and gifts", time: "12:30", responsible: "Family + Receptionist" },
    ],
    people: [
      { name: "Groom's Parents", role: "Host, speech", avatar: "👫" },
      { name: "MC / Host", role: "Coordinate minute by minute", avatar: "🎤" },
      { name: "Photographer & Videographer", role: "Record entire event", avatar: "📷" },
      { name: "Bridesmaids & Best Man", role: "Support bride and groom", avatar: "👫" },
      { name: "Receptionist", role: "Welcome guests, record envelopes", avatar: "📋" },
      { name: "Band / DJ", role: "Music throughout reception", avatar: "🎵" },
      { name: "Wedding Planner", role: "Coordinate (if hired)", avatar: "📝" },
    ],
  },
];
