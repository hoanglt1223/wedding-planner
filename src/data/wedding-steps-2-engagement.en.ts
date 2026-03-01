import type { WeddingStep, PrayerItem } from "@/types/wedding";
import type { RegionalContent } from "@/data/regions";

const ENGAGEMENT_PRAYERS_EN: PrayerItem[] = [
  {
    emoji: "🏡",
    title: "Prayer to the Land Deity before the ceremony",
    occasion: "Before the engagement/betrothal ceremony begins",
    type: "prayer",
    note: "The host family (bride's side) prays at the Land Deity altar, asking permission for the ceremony to proceed smoothly.",
    text: `Namo Amitabha Buddha (3 times)

We respectfully bow to Heaven and Earth, the Land Deity, and all guardian spirits of this place.

Today, [LUNAR DATE],
At [BRIDE'S HOME ADDRESS],

Our family's daughter [BRIDE'S NAME] is receiving the [GROOM'S FAMILY NAME] family who have come to discuss marriage.

We humbly present these offerings and ask the Land Deity to witness and bless this ceremony — may it proceed smoothly, and may both families be harmonious and joyful.

Namo Amitabha Buddha (3 times)`,
  },
  {
    emoji: "🎤",
    title: "Opening introduction by MC/elder",
    occasion: "Opening of the engagement/betrothal ceremony",
    type: "speech",
    note: "MC or the most senior person introduces both families and states the purpose. Tone: formal yet warm.",
    text: `Dear members of both families,

Today, on this auspicious day, our two families gather here to witness a momentous occasion — the [ENGAGEMENT / BETROTHAL] ceremony of [BRIDE'S NAME] and [GROOM'S NAME].

Allow me to introduce:
— From the groom's family: Mr. and Mrs. [NAME], the groom's parents, along with family representatives.
— From the bride's family: Mr. and Mrs. [NAME], the bride's parents, along with family representatives.

I now invite the groom's family representative to speak.`,
  },
  {
    emoji: "🗣️",
    title: "Groom's family formal request speech",
    occasion: "Engagement/betrothal — after opening introduction",
    type: "speech",
    note: "Groom's father or senior uncle delivers the speech. Sincere, clear, 3-5 minutes. Write it down and practice beforehand.",
    text: `Dear grandparents, elders, and the bride's esteemed family,

Today, on this auspicious day, our family — the [GROOM'S FAMILY NAME] clan — respectfully comes to your home to speak about an important matter.

Our son [GROOM'S NAME] and your daughter [BRIDE'S NAME] have been together for [DURATION]. They are deeply in love and wish to proceed toward marriage.

Our family brings these humble symbolic gifts to present to your family, and we respectfully ask for your permission to allow the two young ones to formally court and proceed toward the wedding.

We sincerely hope you will accept our request. Thank you very much.`,
  },
  {
    emoji: "🗣️",
    title: "Bride's family acceptance response",
    occasion: "Engagement/betrothal — after groom's family speech",
    type: "speech",
    note: "Bride's father or senior uncle responds. Keep it brief and sincere.",
    text: `Dear grandparents and the groom's esteemed family,

Our family is delighted and honored to welcome you today.

We have known about the relationship between [BRIDE'S NAME] and [GROOM'S NAME] for some time, and we are very happy to see them together.

Our family agrees and accepts your family's kind request. We gladly receive your gifts and look forward to discussing the next steps so the two young ones may soon be united.

We wish both families health and happiness. May the couple enjoy a lifetime of love and joy.`,
  },
  {
    emoji: "🕯️",
    title: "Ancestor prayer at the bride's home",
    occasion: "Betrothal ceremony at the bride's home",
    type: "prayer",
    note: "Bride's parents or grandparents recite the prayer. The couple lights incense and bows 2-4 times.",
    text: `Namo Amitabha Buddha (3 times)

We respectfully bow to Heaven and Earth, and all divine spirits.
We respectfully bow to our ancestors of the [BRIDE'S FAMILY NAME] clan.

Today, [LUNAR DATE],
At [BRIDE'S HOME ADDRESS],

Our family's daughter is [BRIDE'S NAME], born in [BIRTH YEAR].
Today, the [GROOM'S FAMILY NAME] family has come to request her hand in marriage for their son [GROOM'S NAME], born in [BIRTH YEAR].

The two young ones are deeply in love and wish to be united in marriage.

We humbly light this incense and present it to our ancestors, asking for your blessing and protection:
— May they be a harmonious husband and wife
— May they enjoy lasting happiness and a prosperous family
— May both families live in peace and harmony as in-laws

Namo Amitabha Buddha (3 times)`,
  },
  {
    emoji: "👰",
    title: "Bride handover speech — Bride's father",
    occasion: "Bride pickup ceremony at bride's home",
    type: "speech",
    note: "Bride's father speaks then walks his daughter to the groom. The most emotional moment — have the videographer ready.",
    text: `Dear grandparents and both families,

Today is the most important day for my daughter — [BRIDE'S NAME].

We raised her with all our love, and now the time has come for her to start her own family. Though we feel a tug at our hearts, we are truly happy that she has found a wonderful life partner.

Son-in-law [GROOM'S NAME], I entrust my daughter to you. We trust that you will love, protect, and build a happy home with her.

May you both enjoy a lifetime of love and happiness together.

My dear daughter — always remember, our home is always your home.`,
  },
  {
    emoji: "🙏",
    title: "Groom's response — Receiving the bride",
    occasion: "Bride pickup — after handover speech",
    type: "speech",
    note: "The groom should speak himself for sincerity. If too nervous, write a few lines and keep them handy.",
    text: `Dear Father and Mother (in-law), dear both families,

I sincerely thank you for trusting me with [BRIDE'S NAME].

I promise to love, respect, and build a happy family with [BRIDE'S NAME]. I also promise to be a devoted son to both sets of parents, just as your own child.

I accept [BRIDE'S NAME] as my wife, and I will walk this journey of life together with her.

Thank you, Father and Mother.`,
  },
  {
    emoji: "🕯️",
    title: "Ancestor prayer at the groom's home",
    occasion: "When the bride arrives at the groom's home",
    type: "prayer",
    note: "Groom's parents or grandparents recite. The couple lights incense and bows 2-4 times. Should be done before the reception.",
    text: `Namo Amitabha Buddha (3 times)

We respectfully bow to Heaven and Earth, and all divine spirits.
We respectfully bow to our ancestors of the [GROOM'S FAMILY NAME] clan.

Today, [LUNAR DATE],
At [GROOM'S HOME ADDRESS],

Our son [GROOM'S NAME], born in [BIRTH YEAR],
Today officially welcomes [BRIDE'S NAME], born in [BIRTH YEAR], daughter of the [BRIDE'S FAMILY NAME] family, as his bride.

We humbly light this incense and present it to our ancestors, asking for your blessing and protection:
— May husband and wife live in harmony, loving and respecting each other
— May they soon be blessed with children and a prosperous household
— May both families live in peace and happiness as in-laws

Namo Amitabha Buddha (3 times)`,
  },
  {
    emoji: "🏠",
    title: "Prayer when the bride first enters the groom's home",
    occasion: "The moment the bride steps into the groom's house",
    type: "prayer",
    note: "The groom's mother or a senior elder recites as the bride enters. Some regions include a ritual of stepping over a charcoal brazier or incense burner.",
    text: `Namo Amitabha Buddha (3 times)

We respectfully bow to the Land Deity, Kitchen God, and all guardian spirits of this home.
We respectfully bow to our ancestors of the [GROOM'S FAMILY NAME] clan.

Today, our new daughter-in-law [BRIDE'S NAME] officially steps into this home, becoming a member of the [GROOM'S FAMILY NAME] family.

We ask the Land Deity and guardian spirits to witness and bless our new daughter-in-law:
— May she adapt well and bring harmony to the family
— May husband and wife be united and the household prosper
— May all enjoy good health and blessings

Namo Amitabha Buddha (3 times)`,
  },
  {
    emoji: "🔄",
    title: "Prayer for the post-wedding visit (Le Lai Mat)",
    occasion: "Returning to the bride's family home 3 days after the wedding",
    type: "prayer",
    note: "The couple lights incense at the bride's family altar, reporting to the ancestors as husband and wife.",
    text: `Namo Amitabha Buddha (3 times)

We respectfully bow to our ancestors of the [BRIDE'S FAMILY NAME] clan.

Today, [LUNAR DATE],
Daughter [BRIDE'S NAME] and son-in-law [GROOM'S NAME] have returned home to light incense and report to the ancestors.

The two young ones are now husband and wife. They have come back to pay their respects, and humbly ask for the ancestors' blessing for a harmonious marriage and a happy family.

Namo Amitabha Buddha (3 times)`,
  },
];

export const STEP_ENGAGEMENT_EN: WeddingStep = {
  id: "engagement",
  tab: "🏠 Engagement",
  title: "Step 2: Engagement Ceremony (Dam Ngo)",
  formalName: "Engagement Visit (Le Dam Ngo / Le Cham Ngo / Le Giap Loi)",
  icon: "🏠",
  description: "The first official ceremony — the groom's family visits the bride's family to formally request permission to proceed with the marriage.",
  meaning: "Dam Ngo literally means 'touching the gateway' — the first time the groom's family steps through the bride's family's gate as in-laws. This is the first formal ceremony in Vietnamese marriage, marking the official recognition of the relationship between the two families. Though simple in form, it carries deep significance: both families officially 'open the gate' to welcome each other, building the foundation for a lasting in-law relationship. After Dam Ngo, the couple is considered 'spoken for' — a commitment before the community that both sides have agreed to proceed toward marriage.",
  notes: [
    "Choose an auspicious date — consult the lunar calendar, avoid unlucky days (Tam Nuong, Nguyet Ky)",
    "Attendees: both sets of parents + the couple + grandparents (if present). Max 5-7 people per side",
    "Dress code: formal and neat — traditional ao dai or smart vest/dress",
    "The bride's family should clean and prepare the ancestral altar, and prepare tea and refreshments",
    "The couple should align expectations and budgets with their parents BEFORE the visit — avoid surprises",
    "Northern Vietnam: called 'Cham Ngo' — simple symbolic gifts (betel, tea, wine), formal etiquette",
    "Central Vietnam: called 'Giap Loi' or 'Di Noi' — similar to the North, may include regional wine",
    "Southern Vietnam: called 'Dam Ngo' — may include a fruit tray and sweet cakes, more relaxed atmosphere",
    "Gifts are symbolic — no need to overdo it. Sincerity matters more than value",
    "Key topics to discuss: agree on betrothal date, wedding date, number of gift trays, betrothal gifts, and bride price (nap tai)",
    "Do not bargain aggressively — harmony is paramount; this is the first time as in-laws",
    "Write down ALL agreements to avoid misunderstandings later — who covers what, how much, when",
    "If agreement isn't reached on everything — schedule a follow-up, don't push",
  ],
  timeline: "2-3 months before betrothal",
  aiHint: "Details of the engagement visit by region, what gifts to prepare, ceremony etiquette, and things to avoid.",
  ceremonies: [
    {
      name: "🏠 Engagement Visit (Le Dam Ngo)",
      required: 1,
      description: "The two families meet officially for the first time. The groom's family brings symbolic gifts to the bride's home to request permission to discuss marriage.",
      regionalNotes: {
        default: [],
        north: ["Northern style: called 'Cham Ngo' — more formal etiquette, betel nuts + wine + tea are required", "The groom's group is typically small and compact"],
        south: ["Southern style: more relaxed atmosphere; a fruit tray and sweet cakes are common additions", "Some Southern families combine Dam Ngo with the betrothal if both families live far apart"],
        central: ["Central style: called 'Giap Loi' or 'Di Noi' — Hue court influence makes it more formal and structured"],
      } as RegionalContent<string[]>,
      steps: [
        { text: "Consult the lunar calendar for an auspicious date", cost: 200000, categoryKey: "other", checkable: true },
        { text: "Gifts: betel nuts & leaves, tea, wine, cakes, fruits", cost: 1500000, categoryKey: "ceremonial-gifts", checkable: true },
        { text: "1-3 trays/platters (covered with red cloth or red paper)", cost: 300000, categoryKey: "ceremonial-gifts", checkable: true },
        { text: "Smart attire: ao dai or vest/dress", cost: 1000000, categoryKey: "clothes", checkable: true },
        { text: "Bride's family: decorate, clean the ancestral altar", cost: 500000, categoryKey: "decor", checkable: true },
        { text: "Tea, water, and light refreshments for guests", cost: 300000, categoryKey: "food", checkable: true },
        { text: "Notebook to record all agreements", cost: 0, categoryKey: "other", checkable: true },
        { text: "Groom's family arrives EXACTLY on time — not too early, not late", time: "09:00", responsible: "Groom's Representative" },
        { text: "Greetings and introductions of both families", time: "09:10", responsible: "Both Families" },
        { text: "Groom's family presents the symbolic gifts to the bride's family", time: "09:20", responsible: "Groom's Representative" },
        { text: "Bride's family accepts the gifts, invites guests to sit, pours tea", time: "09:25", responsible: "Bride's Family" },
        { text: "Discussion: betrothal & wedding dates, number of gift trays, gifts, bride price", time: "09:30", responsible: "Both Families" },
        { text: "Agree on customs: which regional traditions to follow, what to preserve", time: "10:00", responsible: "Both Families" },
        { text: "Light incense at the bride's family altar (if altar is set up)", time: "10:15", responsible: "Bride's Family" },
        { text: "Informal meal together, toast to the union", time: "10:30", responsible: "Bride's Family" },
        { text: "Wrap up — confirm all agreements before departing", time: "11:30", responsible: "Both Families" },
      ],
      discussions: [
        { emoji: "📅", question: "When should the betrothal and wedding be held?", detail: "Agree on a timeframe for the betrothal ceremony and the wedding day. Consider the couple's zodiac compatibility, auspicious dates, and avoid unlucky periods (e.g., lunar 7th month).", tips: ["Pick 2-3 backup dates for flexibility with venue/vendor bookings", "Betrothal is usually 1-3 months before the wedding (North) or 2-4 weeks (South)", "Consult a fortune teller or the Vietnamese lunar almanac for auspicious dates"] },
        { emoji: "🕐", question: "Auspicious hours: bride pickup, arrival, ancestor prayers?", detail: "Agree on key ceremony times: when the groom's entourage departs, arrives at the bride's home, picks up the bride, and when the ancestor altar prayer begins. These are 'golden hours' that need careful selection.", tips: ["The bride pickup time and arrival time (at groom's home) are the two most critical hours", "Work backwards: arrival time → subtract travel time → get pickup time", "Common auspicious hours: 6am, 8am, 10am (even numbers, avoid unlucky hours)", "Buffer 15-30 minutes for traffic and minor delays"] },
        { emoji: "🎁", question: "How many gift trays for the betrothal? What goes in each?", detail: "Agree on the number of gift trays (traditionally an odd number: 5, 7, 9, or 11). Discuss what each tray contains, the quantities, and presentation requirements.", tips: ["Northern style: 5-7 trays (betel, wine, tea, green bean cakes, fruits, wedding cakes...)", "Southern style: 5-11 trays, often including a roasted pig and sticky rice", "Central style: similar to the North, may include regional specialties", "The bride's family should state requirements clearly; the groom's family shouldn't haggle — this shows sincerity"] },
        { emoji: "🎊", question: "Gift tray decoration: cloth cover, flowers, arrangement?", detail: "Gift trays need to be beautifully decorated. Discuss: red cloth or cellophane cover? Fresh flowers? Who arranges and decorates? Hire a service or DIY?", tips: ["Red/gold cloth covers are most common — can rent or buy", "Fresh flowers (roses, chrysanthemums) on each tray add an elegant touch", "Decoration service: 500k-2M VND depending on quantity and elaborateness", "DIY: saves money but needs someone experienced, prepare the day before"] },
        { emoji: "🐷", question: "Whole roasted pig: who provides it, how many?", detail: "Many Vietnamese weddings (especially Southern) require whole roasted pigs as part of the betrothal gifts or bridal procession. Discuss: how many, who orders, who pays.", tips: ["Southern style: very common, 1-2 roasted pigs as part of the gift trays", "Northern/Central style: less common, may substitute with suckling pig or skip entirely", "Cost: 3-7 million VND per pig depending on size and vendor", "After the ceremony: split between both families or bride's family keeps it? — decide in advance"] },
        { emoji: "🎀", question: "How to split the betrothal gifts after the ceremony?", detail: "After the bride's family accepts the gift trays, tradition requires 'chia le' (splitting the gifts) — returning a portion to the groom's family as 'lai qua'. Discuss: how much to return, what items, how to present them.", tips: ["General rule: split roughly in half, or return a small portion to the groom's side (never keep all, never return all)", "Betel nuts: split into odd numbers (1, 3, or 5 pieces) to 'keep the luck'", "Cakes, tea, wine: open and split, each side keeps a portion", "Bride price: some bride's families return part of it inside the return envelopes", "Return items in red bags/trays — NEVER return an empty tray"] },
        { emoji: "🧧", question: "Red envelopes (li xi) for the gift bearer team?", detail: "The gift bearer team (groom's side) and the receiving team (bride's side) should receive red envelopes. Discuss: how much per person, who prepares the envelopes, who distributes.", tips: ["Bride's family gives red envelopes to the groom's gift bearers (when receiving trays)", "Groom's family gives red envelopes to the bride's receiving team (varies by region)", "Common amount: 100k-500k VND per person depending on family's means", "Prepare red envelopes in advance — don't scramble to find them at the last minute"] },
        { emoji: "💰", question: "How much is the bride price (tien nap tai)?", detail: "The bride price is a sum the groom's family presents to the bride's family as a token of respect for raising their daughter. The amount varies greatly by region and family.", tips: ["Northern Vietnam: often waived or purely symbolic (a few million VND)", "Southern Vietnam: more common, ranging from a few million to tens of millions VND", "Central Vietnam: flexible, depends on mutual agreement", "Discuss openly and honestly — this is about becoming family, not a transaction", "Some bride's families return all or part of it — best to ask their intentions early"] },
        { emoji: "💍", question: "Wedding jewelry: rings, gold, and when to present them?", detail: "Who buys the wedding rings? How much gold does the groom's family gift the bride? Does the bride's family gift anything back? When in the ceremony is gold presented?", tips: ["Wedding rings: usually chosen by the couple or provided by the groom's family", "Gold for the bride: depends on financial capacity, no need to compare", "Some bride's families gift gold/presents to the groom — discuss early", "Gold is the bride's property — the groom's family should NEVER ask for it back", "Timing: usually presented during the betrothal or bride pickup ceremony"] },
        { emoji: "🏛️", question: "Which regional customs should we follow?", detail: "If the two families are from different regions, agree on which customs to follow. Which ceremonies are mandatory, which are flexible, and which can be skipped.", tips: ["Same region: follow local traditions", "Different regions: usually follow the bride's family customs (since ceremonies are held at the bride's home)", "List clearly: which ceremonies are required, optional, or skipped", "If the family follows a religion (Buddhist, Catholic, Protestant...), discuss additional religious rites"] },
        { emoji: "⛪", question: "Different religions/beliefs: how to handle?", detail: "If the families follow different religions (Buddhism, Catholicism, Protestantism, none...), discuss religious ceremonies, altar arrangements, and mutual respect.", tips: ["Catholic families: often require a church wedding, may need catechism classes", "Buddhist families: may add a temple blessing ceremony (Le Hang Thuan)", "Ancestral altar: Catholic families typically don't have one — agree on alternative rituals", "Core principle: mutual respect — never pressure the other side to convert or abandon their faith"] },
        {
          emoji: "🗣️",
          question: "Who represents the groom's family in the formal request speech? What to say?",
          detail: "During the betrothal, a representative from the groom's family (usually the father or a senior uncle) delivers a formal speech requesting the bride's family's permission for the marriage. Discuss: who speaks, what to say.",
          tips: [
            "Speaker: groom's father, or a senior uncle/grandfather if the father is unavailable",
            "Content: introduce the family → express wishes → request permission → present gifts",
            "Tone: sincere, clear, not too long (3-5 minutes)",
            "Write it down beforehand and practice 1-2 times",
          ],
        },
        {
          emoji: "🗣️",
          question: "Who represents the bride's family in the response? What to say?",
          detail: "After the groom's family speaks, a representative from the bride's family (usually the father or a senior elder) responds — accepting or setting conditions. Discuss: who responds, what to say.",
          tips: [
            "Speaker: bride's father, or a senior uncle/grandfather as substitute",
            "Content: express gratitude → agree → state any conditions (if applicable) → bless the couple",
            "Keep it brief — sincerity is what matters",
            "Prepare in advance to avoid being flustered",
          ],
        },
        {
          emoji: "🕯️",
          question: "Ancestor altar ceremony: incense, bowing, protocol?",
          detail: "The ancestor prayer is the most important ritual — the couple lights incense and bows before the family altar. Discuss: who guides the couple, how many bows, who recites the prayer.",
          tips: [
            "Typical order: couple lights incense → 2 or 4 bows → parents witness and bless",
            "Northern style: usually 4 bows (2 half-bows + 2 full bows), very formal",
            "Southern style: more flexible, may be 2 bows or as guided by elders",
            "If the family is Catholic with no altar: substitute with a prayer ceremony",
            "Prepare in advance: incense, candles, fresh flowers, fruit tray on the altar",
            "Practice 1-2 times beforehand so the couple isn't awkward during the real ceremony",
          ],
        },
        {
          emoji: "👰",
          question: "Bride handover ceremony: who speaks, what happens?",
          detail: "The bride handover is when the bride's family officially entrusts their daughter to the groom's family. Who gives the speech? What is said? Who walks the bride out?",
          tips: [
            "Typically: bride's father gives a short speech → walks his daughter to the groom",
            "If parents are absent: the most senior family member substitutes",
            "Speech: keep it short, heartfelt — 3-5 minutes is plenty",
            "The groom should bow and thank the bride's parents formally",
            "This is the most emotional moment — have the videographer ready",
          ],
        },
        {
          emoji: "🙏",
          question: "Groom's response after receiving the bride: what to say?",
          detail: "After the bride's father hands over the bride, the groom (or the groom's family representative) should respond — showing gratitude and commitment.",
          tips: [
            "The groom should speak himself — it's more sincere than having someone else speak",
            "Content: thank the bride's parents → promise to love and care → promise filial piety to both families",
            "Keep it brief, no need for fancy words — just speak from the heart",
            "If too nervous: write a few lines and keep them handy",
          ],
        },
        {
          emoji: "🕯️",
          question: "Ancestor prayer at the groom's home when the bride arrives?",
          detail: "When the bride arrives at the groom's home, the couple lights incense at the groom's family altar — presenting themselves to the ancestors and asking for blessings. Who recites the prayer? What to say?",
          tips: [
            "Usually recited by the groom's father/mother or grandparents",
            "The couple lights incense and bows 2-4 times",
            "Should be done before the wedding reception begins",
            "Prepare the altar: flowers, fruits, incense, candles, a small offering tray",
          ],
        },
        { emoji: "🏮", question: "Decorating the bride's home on betrothal day?", detail: "The bride's home needs decorations to welcome the groom's family. Discuss: flower arch, backdrop/tent, altar arrangement, guest seating area, hire a decorator or DIY?", tips: ["Flower arch: 2-5M VND depending on size and flower type", "Guest backdrop/tent: rent or DIY, 1-3M VND", "Ancestral altar: clean thoroughly, fresh flowers, new fruit offerings", "Guest tea table: teacups, sweet cakes, bottled water", "Minimal decorations: banner, flowers, lights — no need to overdo it"] },
        { emoji: "🏮", question: "Decorating the groom's home for bride's arrival?", detail: "The groom's home also needs decorations to welcome the bride. Discuss: flower arch, backdrop/tent, bridal chamber, altar preparation.", tips: ["Flower arch at groom's home: recommended, doesn't need to be as grand as bride's", "Bridal chamber: tidy up, simple decor (flowers, candles, new bedding)", "Ancestral altar: prepare flowers, fruits, incense, candles for the ancestor prayer", "Guest area and tea service for the bride's family entourage (if they come along)"] },
        { emoji: "🚗", question: "Bridal procession: cars, route, entourage?", detail: "Both families need to agree on transportation for the bride pickup, number of cars, route there and back, and who's in the entourage.", tips: ["Number of cars is usually even (4, 6, or 8)", "Book wedding cars early during peak season", "Route: avoid passing cemeteries or religious sites of a different faith (varies by region)", "Entourage: groom's parents, representative elders, groomsmen — odd number (becomes even with bride)", "Factor in travel time + traffic to arrive at the auspicious hour"] },
        { emoji: "🎎", question: "Gift bearers, bridesmaids & groomsmen: how many?", detail: "Number of gift bearers = number of gift trays. How many bridesmaids and groomsmen? Who chooses them? Requirements (unmarried, same gender...)?", tips: ["Gift bearers: male (groom's side carries) + female (bride's side receives) — equal numbers", "Tradition: bearers should be unmarried (but this is flexible nowadays)", "Bridesmaids: 2-6 people, usually bride's close friends", "Groomsmen: same number as bridesmaids", "Discuss early: who provides outfits for bearers, bridesmaids, and groomsmen?"] },
        { emoji: "👗", question: "Ceremony attire: couple, both families, gift bearers?", detail: "Agree on attire for all ceremonies (betrothal + bride pickup + ancestor prayer). Traditional ao dai or modern suits? Coordinated colors?", tips: ["Bride: red/pink ao dai for ceremonies, white gown for reception (most common)", "Groom: matching ao dai or suit — should coordinate with the bride", "Both sets of parents: matching color tones (usually ao dai in blue, red, or gold)", "Gift bearer team + bridesmaids: matching ao dai in the same color — discuss who covers the cost", "Budget attire from the start — rent or custom-made, how many outfits for the bride"] },
        { emoji: "🍵", question: "Tea ceremony: pouring tea for both families?", detail: "During the betrothal or wedding, the couple pours tea for parents, grandparents, and senior relatives from both sides — showing respect and gratitude. Discuss: will you hold a tea ceremony, who to serve, in what order?", tips: ["Order: grandparents → parents → senior aunts/uncles → younger aunts/uncles", "Pouring tea for parents: kneel down or bow (varies by region)", "After receiving tea: parents/grandparents usually give red envelopes or gold to the couple", "Tea: use good quality tea, brewed in a nice tea set", "Common in Northern and Central regions; Southern style is more flexible"] },
        {
          emoji: "🔄",
          question: "Post-wedding visit (Le Lai Mat — returning to bride's home)?",
          detail: "Tradition says the couple visits the bride's family 3 days after the wedding (or 1 day, depending on region). Agree on the date, what gifts to bring, and who joins.",
          tips: [
            "Northern style: usually after 3 days, bring chicken, sticky rice, and fruits",
            "Southern style: can be the next day or after 3 days, more flexible",
            "The groom should attend to show respect for the bride's family",
            "Gifts: boiled chicken, sticky rice, fruits, wine — varies by region",
          ],
        },
        { emoji: "⚠️", question: "Any special family circumstances to be aware of?", detail: "Divorced parents, family in mourning, seriously ill relatives... all affect ceremony logistics. Discuss beforehand to handle sensitively and avoid surprises.", tips: ["Divorced parents: who represents the family at the ceremony? Are both present?", "Family in mourning: tradition says no wedding during mourning — but flexibility exists depending on severity", "Ill relatives: arrange substitute roles in the ceremony", "Being upfront is better than hiding — the other family will understand if told in advance"] },
        { emoji: "👴", question: "Should clan elders or patriarchs be invited?", detail: "Some clans have patriarchs or clan elders — they may need to be consulted or invited to attend the ceremony. Not inviting them could cause offense.", tips: ["Ask your parents: does our clan have an active patriarch?", "If yes: invite them to the betrothal ceremony, or at least inform them", "The patriarch may be asked to give a speech or serve as a witness", "A wedding is a joyful clan occasion — better to invite broadly than to leave someone out"] },
      ],
      prayers: ENGAGEMENT_PRAYERS_EN,
      gifts: [
        { name: "Betel nuts & leaves", quantity: "1 bunch betel nuts + leaves", cost: 200000 },
        { name: "Tea", quantity: "1-2 boxes of fine tea", cost: 200000 },
        { name: "Wine/Liquor", quantity: "2 bottles (wine/imported)", cost: 300000 },
        { name: "Cakes", quantity: "1-2 boxes (wedding cakes)", cost: 300000 },
        { name: "Fresh fruits", quantity: "5 fresh fruits", cost: 200000 },
        { name: "Sweet cakes (Southern style)", quantity: "1 box", cost: 200000 },
      ],
      people: [
        { name: "Both Parents", role: "Family Representative", avatar: "👫" },
        { name: "Bride & Groom", role: "Bridge between families", avatar: "💑" },
        { name: "Grandparents (if present)", role: "Elder", avatar: "👴" },
        { name: "Aunt/Uncle Representative", role: "Witness", avatar: "👥" },
      ],
    },
  ],
};
