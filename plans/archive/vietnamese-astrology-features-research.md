# Vietnamese Astrology Wedding Planning Features Research

**Research Date:** February 21, 2026
**Researcher:** Technical Analyst
**Focus:** Vietnamese astrology features for wedding planning integration

---

## Executive Summary

Vietnamese astrology websites offer comprehensive features for wedding planning based on Tử Vi Đẩu Số (Purple Star astrology) and traditional feng shui (phong thủy) principles. These features analyze couple compatibility, determine auspicious dates for wedding ceremonies, and provide fate/destiny insights. The research identifies 7 major feature categories with 40+ specific tools useful for integration into a wedding planner app.

**Key Platforms Researched:** tuvikhoahoc.vn, tuvi.vn, lichngaytot.com, xemtuvi.com, tuvilyso.vn, phongthuyvuong.net, xemngay.com

---

## Feature Categories & Detailed Capabilities

### 1. COUPLE AGE/ZODIAC COMPATIBILITY (Xem tuổi vợ chồng)

**Feature Name:** Xem tuổi vợ chồng (Spouse Age Compatibility Checking)

**Sub-Features:**
- **Xem tuổi hợp nhau** - Check if couple ages are harmonious based on birth year
- **Xem tuổi lấy chồng** - Determine appropriate marriage age for women
- **Xem tuổi kết hôn** - Identify good years for marriage based on age/zodiac
- **Xem tuổi hợp để chọn vợ, chọn bạn, chọn đối tác** - Check age compatibility for spouse selection, business partnerships

**Analysis Factors:**
- Thiên Can (Heavenly Stems) compatibility analysis
- Địa Chi (Earthly Branches) compatibility analysis
- Ngũ Hành (Five Elements) mutual relationship assessment (see Category 2)
- Cung Mệnh (Destiny Palace) analysis (see Category 5)
- Cung Phu Thê (Spouse Palace) compatibility determination
- Cung Phi Bát Tự (Eight Mansions) position analysis

**Data Required:**
- Bride's full birth date & birth hour
- Groom's full birth date & birth hour
- Lunar year (determines zodiac sign)

**Output Results:**
- Harmony level assessment (hợp/không hợp/hợp có xung)
- Specific conflicts identified (if any)
- Remediation suggestions (hóa giải)
- Personality & life path compatibility predictions
- Marriage longevity forecast

---

### 2. FIVE ELEMENTS SYSTEM (Ngũ Hành Tương sinh tương khắc)

**Feature Name:** Ngũ Hành Phân Tích (Five Elements Analysis)

**The Five Elements:**
- Kim (Metal) - 金
- Mộc (Wood) - 木
- Thủy (Water) - 水
- Hỏa (Fire) - 火
- Thổ (Earth) - 土

**Sub-Features:**
- **Ngũ hành tương sinh** - Mutual generation analysis (supporting relationships)
  - Wood generates Fire
  - Fire generates Earth
  - Earth generates Metal
  - Metal generates Water
  - Water generates Wood

- **Ngũ hành tương khắc** - Mutual restraint analysis (conflicting relationships)
  - Wood restrains Earth
  - Earth restrains Water
  - Water restrains Fire
  - Fire restrains Metal
  - Metal restrains Wood

**Application to Marriage:**
- Analyze couple's elemental destiny based on birth year
- Assess whether elements promote or inhibit each other
- Determine if couple helps each other develop or creates obstacles
- Predict harmony level based on element interactions

**Output:**
- Element type for each spouse (e.g., "Mệnh Thổ" = Earth destiny)
- Interaction type (tương sinh = harmonious, tương khắc = conflicting)
- Life development prediction based on elemental relationships

---

### 3. INAUSPICIOUS TIME PERIODS (Tam Tai, Thái Tuế)

**Feature Name:** Kiểm Tra Năm Xui Xẩm (Inauspicious Year Detection)

#### 3a. Tam Tai (Three Inauspicious Years)

**Feature Name:** Xem Tam Tai (Three Inauspicious Years Analysis)

- **Definition:** Three consecutive years of prolonged misfortune based on age groups
- **Triggered by:** Age group within zodiac triple (every 12 years, 3-year period)
- **Impact:** Major life events (weddings, house purchases, job changes) should be avoided during tam tai years
- **Mitigation:** Perform rituals (cúng giải tam tai) or wait until after lunar birthday

#### 3b. Thái Tuế (Year Star / Grand Duke of Jupiter)

**Feature Name:** Xem Thái Tuế (Year Star Analysis)

- **Definition:** Individual year-specific misfortune cycles affecting major life events
- **Associated Stars:**
  - Sao Thái Tuế (Grand Duke Star)
  - Tang Môn (White Tiger)
  - Bạch Hổ (White Tiger - different context)
  - Điếu Khách (Robber)
  - Quan Phù (Officer)

- **Marriage Impact:** In Cung Phu Thê (Spouse Palace), Thái Tuế indicates:
  - Potential harm to spouse
  - Separation or divorce risk
  - Obstacles in marital happiness
  - Recommendation: Marry later to avoid conflict

**Analysis:** Check if either spouse's birth year falls into current Thái Tuế cycle

**Output:**
- Affected year notification
- Risk level for major events during that year
- Recommended timing alternatives

---

### 4. GOOD WEDDING DATES SELECTION (Xem ngày cưới)

**Feature Name:** Xem Ngày Cưới Hỏi (Wedding Date Selection & Timing)

**Sub-Features:**

#### 4a. Auspicious Date Identification

- **Xem ngày tốt xấu** - Check auspicious vs. inauspicious days
- **Xem ngày tốt cưới hỏi** - Select auspicious wedding dates
- **Xem ngày tốt theo tuổi** - Find good dates based on couple's age/zodiac
- **Xem ngày theo ngũ hành** - Select dates based on five elements compatibility

**Date Categories (Hoàng Đạo days):**

1. **Tốc Hy** (Speedy Joy) - Quick luck & good fortune
2. **Đại An** (Great Peace) - Peace, prosperity, & success
3. **Tiểu Cát** (Minor Auspiciousness) - Positive events
4. **Lục Hợp** (Harmony of Six) - Promotes couple unity

**Inauspicious Day Categories:**

1. **Tam Xung** (Conflict of Three) - Creates conflicts & disagreements

#### 4b. Wedding Ceremony Date Selection

- **Xem ngày hỏi/dạm ngõ** - Find good day for engagement ceremony
- **Xem ngày ăn hỏi** - Select date for betrothal gift ceremony
- **Xem ngày cưới/kết hôn** - Choose main wedding day
- **Xem ngày đón dâu** - Pick best day for bride reception

**Auspicious Stars for Each Ceremony:**

- **Sao Thiên Phúc** - Good for dạm ngõ, marriage, travel, charity
- **Sao Sinh Khí** - Good for marriage, dạm ngõ, earthwork

#### 4c. Time Selection (Hoàng Đạo Hours)

- **Xem giờ tốt xấu** - Identify auspicious & inauspicious hours
- **Hoàng Đạo hours** - Specific time windows on each day (12 guardian deities)
- **Hour compatibility** - Match hours with couple's zodiac signs

**Data Required:**
- Bride's birth date & hour (lunar calendar)
- Groom's birth date & hour (lunar calendar)
- Desired month/timeframe for wedding

**Processing Logic:**

1. Calculate bride's lunar age
2. Identify favorable months for bride's age group
3. Cross-reference with groom's zodiac compatibility
4. Filter for dates avoiding:
   - Inauspicious constellations
   - Tam Tai years
   - Thái Tuế cycle
   - Personal conflicting zodiac combinations
5. Rank results by auspiciousness level

**Output:**
- List of top auspicious dates with:
  - Day (lunar & solar calendar dates)
  - Auspiciousness level & category
  - Recommended ceremony type(s)
  - Recommended hours
  - Star influence information
  - Conflict warnings (if any)

---

### 5. DESTINY PALACE ANALYSIS (Cung Mệnh - 命宮)

**Feature Name:** Phân Tích Cung Mệnh (Destiny Palace Reading)

**Definition:** Life palace - most important palace in 12-palace astrology chart, reflecting overall life destiny, personality, major events

**Key Characteristics:**
- Closest relationships with all other palaces (acts as "mind/brain")
- Influences career, family, children, marriage decisions
- Combined with birth hour, date, month, year to generate life chart

**The 12-13 Palaces in Tử Vi System:**

1. **Cung Mệnh** - Life/Destiny Palace
2. **Cung Thân** - Body Palace (overlaps; sometimes omitted)
3. **Cung Huynh Đệ** - Siblings Palace
4. **Cung Phu Thê** - Spouse/Marriage Palace
5. **Cung Tật Ách** - Illness Palace
6. **Cung Thiên Di** - Relocation/Travel Palace
7. **Cung Nô Bộc** - Associates/Servants Palace
8. **Cung Tài Bạch** - Wealth/Money Palace
9. **Cung Điền Trạch** - Property/Land Palace
10. **Cung Phụ Mẫu** - Parents Palace
11. **Cung Quan Lộc** - Career/Official Palace
12. **Cung Phúc Đức** - Fortune/Virtue Palace
13. **Cung Tử Tức** - Children Palace

**For Wedding Planning Focus:**

**Cung Phu Thê (Spouse Palace)** - Most relevant
- Determines ideal marriage timing (early/late)
- Describes spouse appearance & character
- Predicts emotional & marital relationship quality
- Reveals obstacles or harmony in married life
- Relationship analysis with:
  - Cung Quan Lộc (Career) - work-life balance impacts
  - Cung Thiên Di (Relocation) - living circumstances impact
  - Cung Phúc Đức (Fortune) - mental/emotional health impact

**Sub-Feature:**

- **Xem cung mệnh theo tuổi** - Determine destiny palace based on birth year
- **Xem cung phu thê** - Analyze spouse palace for marriage compatibility
- **Bảng tra cung mệnh** - Reference tables for palace calculation

**Data Required:**
- Full birth information (date, hour, month, year)
- Gender

**Output:**
- Destiny palace assignment
- Spouse palace analysis
- Life path predictions for marriage
- Career-marriage balance assessment
- Children prospects
- Recommended marriage timing

---

### 6. ASTROLOGY CHART GENERATION (Lá Số Tử Vi)

**Feature Name:** Lập Lá Số Tử Vi (Astrology Chart Creation & Interpretation)

**Definition:** Personal destiny map (lá số) generated from birth hour, day, month, year, and gender showing all 12 palace positions and associated stars

**Sub-Features:**

- **Lập lá số tử vi theo ngày giờ sinh** - Generate chart from birth data
- **Lấy lá số tử vi 2025** - Create 2025 chart
- **Xem lá số tử vi tự động** - Auto-generated chart with interpretations
- **Luận giải lá số tử vi trọn đời** - Lifetime chart analysis & interpretation
- **Lá số tử vi cá nhân hóa** - Personalized chart reading

**Chart Components:**

1. **Star Positions** - 14 primary stars placed in 12 palaces:
   - Tử Tú (Purple Star) - Primary destiny star
   - Thiên Cơ (Celestial Mechanism)
   - Thiên Phủ (Celestial Restriction)
   - Tảo Tửu (Greedy Wolf)
   - Liêm Trinh (Honesty)
   - Tướng Quân (General)
   - Thích Hợp (Right Match)
   - Phó Tứ (Assistant Star)
   - And others based on system

2. **Star Qualities:**
   - Thái Dương (Sun) - Positive traits
   - Âm Dương (Yin/Yang) - Positive/Negative charges
   - Cứng (Hard) - Fixed/Rigid traits
   - Mềm (Soft) - Flexible traits

3. **Palace Interactions** - How stars in each palace influence life areas

**Data Input Required:**
- Complete birth information:
  - Full name
  - Birth date (lunar & solar calendar)
  - Birth hour (critical for accuracy)
  - Birth month & year
  - Gender
  - Birth location (for advanced readings)

**Output Includes:**

- Visual chart showing 12 palaces with all star positions
- Palace descriptions:
  - Life predictions (career, health, relationships)
  - Star influences in each palace
  - Interactions between palaces
  - Lucky/unlucky periods
- Detailed interpretations of:
  - Career prospects & suitable professions
  - Financial situation & wealth timing
  - Relationship & marriage compatibility
  - Family & children matters
  - Health predictions
  - Travel luck
  - Property/real estate fortune
- Lucky & unlucky periods by year
- Personality analysis
- Compatibility with potential partners

**Accuracy Note:** Birth hour is critical - without accurate hour, chart loses significant precision

---

### 7. FENG SHUI HOME GUIDANCE (Phong Thủy - Hướng Nhà)

**Feature Name:** Xem Hướng Nhà Phong Thủy (House Direction & Altar Positioning)

*Note: While less directly wedding-related, often appears in wedding planning context for newlywed home setup*

**Sub-Features:**

- **Xem hướng nhà hợp tuổi** - Determine house direction by age/zodiac
- **Xem hướng cửa** - Find auspicious door direction
- **Xem hướng bàn thờ** - Determine altar direction & positioning
- **Xem hướng bếp** - Kitchen direction selection
- **Xem hướng giường** - Bed placement direction
- **Chọn hướng bàn thờ hợp phong thủy** - Select altar direction per feng shui

**Key Principles:**

1. **Vị Trí vs. Hướng** (Position vs. Direction)
   - Position = where items are placed
   - Direction = which way items face

2. **Positioning Rule:** "Auspicious position + auspicious direction"
   - Altar should be in "central area" (good location)
   - Altar should face "good direction" (auspicious orientation)

3. **Direction Selection Based on Five Elements & Destiny:**

   **For Fire, Wood, Water Elements (東北南中→):**
   - East direction suitable
   - Southeast direction suitable
   - South direction suitable
   - North direction suitable

   **For Earth & Metal Elements (西北西南東北):**
   - West direction suitable
   - Northwest direction suitable
   - Southwest direction suitable
   - Northeast direction suitable

**Household Head Consideration:**
- Male household head's age used for direction selection
- If father elderly/ill, eldest son's age may be used
- In all-female households, female head's age is used

**Output:**
- Recommended altar direction for couple's ages/elements
- Secondary direction choices if primary unavailable
- House direction harmony assessment
- Remediation suggestions if poor directions unavoidable

---

### 8. ZODIAC COMPATIBILITY PATTERNS (Tam Hợp, Lục Hợp, Xung)

**Feature Name:** Phân Tích Quan Hệ Tuổi (Zodiac Relationship Patterns)

**8a. Tam Hợp (Triple Harmony Groups)**

**Definition:** Three zodiac signs sharing similar personalities, easily communicating, living harmoniously

**Key Pattern:** 4-year age gaps within group

**The 4 Triple Harmony Groups:**

1. **Tam Hợp Kim (Metal):** Tỵ (Snake), Dậu (Rooster), Sửu (Ox)
   - Element: Metal
   - Characteristics: Practical, disciplined, honest

2. **Tam Hợp Hỏa (Fire):** Dần (Tiger), Ngọ (Horse), Tuất (Dog)
   - Element: Fire
   - Characteristics: Passionate, energetic, loyal

3. **Tam Hợp Mộc (Wood):** Hợi (Pig), Mão (Rabbit), Mùi (Goat)
   - Element: Wood
   - Characteristics: Compassionate, creative, flexible

4. **Tam Hợp Thủy (Water):** Thân (Monkey), Tý (Rat), Thìn (Dragon)
   - Element: Water
   - Characteristics: Intuitive, intelligent, adaptable

**Benefits:** Communication ease, life harmony, mutual support in advancement

**8b. Lục Hợp (Six Perfect Pairs)**

**Definition:** Most harmonious zodiac pairings - highest compatibility

**The 6 Perfect Pairs:**

1. **Tý-Sửu** (Rat-Ox) - 1 year apart
2. **Dần-Hợi** (Tiger-Pig) - 1 year apart
3. **Mão-Tuất** (Rabbit-Dog) - 1 year apart
4. **Thìn-Dậu** (Dragon-Rooster) - 1 year apart
5. **Tỵ-Thân** (Snake-Monkey) - 1 year apart
6. **Ngọ-Mùi** (Horse-Goat) - 1 year apart

**Characteristics:**
- Auspicious relationship bringing good fortune
- Support & connection between partners
- Opposite personalities that complement each other

**8c. Lục Xung (Six Conflicting Pairs)**

**Definition:** Opposing zodiac signs creating contradictions & conflict

**The 6 Conflicting Pairs:**

1. **Tý-Ngọ** (Rat-Horse) - 6 years apart
2. **Sửu-Mùi** (Ox-Goat) - 6 years apart
3. **Dần-Thân** (Tiger-Monkey) - 6 years apart
4. **Mão-Dậu** (Rabbit-Rooster) - 6 years apart
5. **Thìn-Tuất** (Dragon-Dog) - 6 years apart
6. **Tỵ-Hợi** (Snake-Pig) - 6 years apart

**Characteristics:**
- Contradiction between zodiac signs
- Discord & conflict easily arise
- Brings misfortune in work & life
- Requires remediation (hóa giải) if couple in conflicting pair

**Analysis Output:**
- Identify triple harmony group(s) if applicable
- Check for lục hợp (perfect pair) status
- Alert if lục xung (conflicting) pair detected
- Provide compatibility assessment & remediation suggestions if needed

---

### 9. AGE MARRIAGE TABOOS (Kim Lâu - 金牢)

**Feature Name:** Kiểm Tra Tuổi Cấm Cưới (Marriage Age Taboo Detection)

**Definition:** Kim Lâu (Metal Prison) - years of age considered unlucky for marriage and major life events

**Traditional Saying:** "1 3 6 8 Kim Lâu / Building a house, taking a wife, buying cattle—don't"

**Calculation Method:**
- Divide lunar age by 9
- If remainder = 1, 3, 6, or 8 → Age is Kim Lâu
- If remainder = 0, 2, 4, 5, or 7 → Age is NOT Kim Lâu

**Kim Lâu Categories:**

1. **Kim Lâu Thân** (Taboo for self) - Protects one's person from harm
2. **Kim Lâu Thê** (Taboo for spouse) - Protects spouse from harm
3. **Kim Lâu Tử** (Taboo for children) - Protects children from harm

**Historical Context:**
- Originally applied only to imperial children (conveyed prosperity)
- For commoners, forbidden because marrying during Kim Lâu could change destiny & steal nobility's wealth
- Modern practice: Varies in strictness; many do marry during Kim Lâu without severe consequences

**Mitigation Options:**
1. **Wait until after lunar birthday** - Check age again after birthday passes
2. **Choose auspicious date & time** - Select highly fortuitous ceremony moment
3. **Perform remediation rituals** - Traditional ceremonies to neutralize taboo

**Sub-Feature:**

- **Xem tuổi Kim Lâu** - Check if current age is Kim Lâu
- **Cách tính tuổi Kim Lâu** - Calculate Kim Lâu age
- **Hoá giải Kim Lâu** - Find remediation methods

**Output:**
- Kim Lâu status (true/false for each spouse)
- Specific taboo type if applicable
- Remediation recommendations
- Next non-taboo age (if applicable)
- Modern perspective note on accuracy

---

## Detailed Feature Comparison: Major Vietnamese Astrology Platforms

### tuvi.vn (Tử Vi Việt Nam)

**Core Features:**
- Lập lá số tử vi theo ngày giờ sinh (birth chart generation)
- Xem tuổi vợ chồng (spouse age compatibility)
- Xem ngày kết hôn (wedding date selection)
- Xem tuổi hợp nhau (age harmony checking)
- Xem tuổi kết hôn (marriage age checking)
- Xem ngày để tiến hành các sự kiện (event day selection)
- Xem ngày tốt xấu (auspicious/inauspicious days)

**Technology:** Mobile app available on Google Play & Amazon Appstore

**Specialty:** Comprehensive chart generation with AI-assisted interpretations

---

### tuvikhoahoc.vn

**Core Features:**
- Lấy lá số tử vi 2025 (2025 chart generation)
- Xem ngày kết hôn cưới hỏi theo tuổi vợ chồng (wedding date by couple's age)
- Tra lịch âm dương 100 năm (perpetual calendar 100 years)
- Lịch vạn niên (traditional perpetual calendar)
- Xem ngày tốt xấu hôm nay (daily auspicious/inauspicious checking)

**Specialty:** Traditional perpetual calendar (lịch vạn niên) for lunar-solar conversion and auspicious day selection

---

### lichngaytot.com (Lịch Ngày TỐT)

**Core Features:**
- Xem tuổi lấy chồng (marriage age for women)
- Xem ngày cưới hỏi (wedding date selection)
- Xem tuổi vợ chồng (spouse compatibility)
- Xem tinh duyên (romantic fate analysis)
- Xem ngày tốt theo tuổi (good days by zodiac)
- Xem ngày tốt xấu (daily calendar)
- Lá số tử vi (astrology charts)
- Tử vi 12 cung hoàng đạo (zodiac horoscopes)

**Specialty:** Comprehensive daily calendar with focus on "Kim Lâu" age calculation methods

---

### xemtuvi.com / xemtuvi.xyz

**Core Features:**
- Xem ngày cưới theo tuổi vợ chồng (wedding date by spouse age)
- Xem tuổi hợp nhau (age compatibility)
- Xem hợp tuổi (zodiac compatibility)
- Xem ngày cưới (wedding date selection with multiple examples)

**Specialty:** Interactive wedding date selector with real-world couple examples

---

### phongthuyvuong.net

**Core Features:**
- Xem ngày tốt cho việc cưới hỏi, kết hôn, dạm ngõ, ăn hỏi, đón dâu (all wedding ceremony dates)
- Sao Thái Tuế analysis (Grand Duke impact)
- Hướng nhà, hướng bàn thờ phong thủy (house & altar directions)
- Xem vợ chồng có hợp nhau theo tuổi (spouse harmony)

**Specialty:** Comprehensive wedding ceremony timing across all pre-wedding and main events

---

### xemngay.com

**Core Features:**
- Xem ngày tốt xấu daily (live daily calendar)
- Ngày tốt hôm nay (today's forecast)
- Thanh Long Hoàng Đạo designation (auspicious day categorization)
- Xem ngày cưới (wedding dates)

**Specialty:** Real-time daily astrology updates with star designations

---

## Feature Integration Priority for Wedding Planner App

### Tier 1 (Critical - MVP Must-Have)
1. **Xem tuổi vợ chồng** - Couple compatibility checking
2. **Xem ngày cưới hỏi** - Wedding date selection by couple age
3. **Xem ngày tốt xấu** - Auspicious day filtering
4. **Tính toán Kim Lâu** - Marriage age taboo detection
5. **Lịch vạn niên** - Lunar-solar calendar conversion

### Tier 2 (High Value - v1.0 Target)
6. **Xem cung mệnh** - Destiny palace analysis
7. **Ngũ hành tương sinh/khắc** - Five elements compatibility
8. **Tam Hợp/Lục Hợp/Xung** - Zodiac pattern analysis
9. **Xem Thái Tuế/Tam Tai** - Inauspicious period warnings
10. **Lập lá số tử vi** - Full astrology chart generation

### Tier 3 (Enhancement - Future Versions)
11. **Giờ tốt xấu** - Hour-by-hour timing within wedding day
12. **Hướng nhà phong thủy** - New home direction guidance
13. **Các sao chiếu mệnh** - Detailed star interpretations (Thất Sát, etc.)
14. **Bộ lễ cưới hỏi** - Multi-ceremony timing (dạm ngõ, ăn hỏi, đón dâu)

---

## Key Data Structures Needed

### Zodiac System
```
12 Zodiac Signs (12 Con Giáp)
├── Tý (Rat)
├── Sửu (Ox)
├── Dần (Tiger)
├── Mão (Rabbit)
├── Thìn (Dragon)
├── Tỵ (Snake)
├── Ngọ (Horse)
├── Mùi (Goat)
├── Thân (Monkey)
├── Dậu (Rooster)
├── Tuất (Dog)
└── Hợi (Pig)
```

### Five Elements
```
5 Elements (Ngũ Hành)
├── Kim (Metal)
├── Mộc (Wood)
├── Thủy (Water)
├── Hỏa (Fire)
└── Thổ (Earth)
```

### Heavenly Stems & Earthly Branches
```
10 Heavenly Stems (Thiên Can)
├── Giáp, Ất, Bính, Đinh, Mậu
├── Kỷ, Canh, Tân, Nhâm, Quý

12 Earthly Branches (Địa Chi)
├── Tý, Sửu, Dần, Mão, Thìn, Tỵ
├── Ngọ, Mùi, Thân, Dậu, Tuất, Hợi
```

### Compatibility Matrices
- Tam Hợp mappings (4 groups)
- Lục Hợp perfect pairs (6 pairs)
- Lục Xung conflicting pairs (6 pairs)
- Five elements interactions (tương sinh/tương khắc)

### Auspicious Day Categories
- Hoàng Đạo days (Tốc Hy, Đại An, Tiểu Cát, Lục Hợp)
- Inauspicious days (Tam Xung)
- Guardian deities & hours (12 divisions)

### Palace System
- 12-13 palaces with descriptions
- Star placements & interpretations
- Palace interactions & influences

---

## Technical Implementation Notes

### Critical Calculations Needed

1. **Lunar Age Calculation**
   - Convert Gregorian date to lunar date
   - Calculate age in lunar calendar
   - Account for birthday differences (lunar vs. solar)

2. **Zodiac Sign Determination**
   - Lunar year of birth → zodiac animal sign
   - Heavenly Stem + Earthly Branch combination

3. **Destiny Palace Assignment**
   - Birth info (date, hour, month, year, gender)
   - Complex mathematical formulas
   - 12-palace distribution calculation

4. **Auspicious Date Filtering**
   - Lunar calendar availability check
   - Couple's age/zodiac compatibility matrix
   - Exclusion logic for inauspicious combinations
   - Star designation calculation

5. **Kim Lâu Detection**
   - Lunar age ÷ 9
   - Remainder matching (1, 3, 6, 8 = taboo)

### External Data Sources Needed

- **Lunar-Solar Calendar Database:** 100+ years conversion tables
- **Astrology Rule Sets:** Mathematical formulas for chart calculation
- **Star Designation Charts:** Daily auspiciousness assignments
- **Compatibility Matrices:** All zodiac & element combinations

### Performance Considerations

- Pre-calculate & cache lunar dates (computational expensive)
- Star designation data likely available from Vietnamese astrology databases
- Chart generation can be CPU-intensive; consider batch processing
- Mobile app may need streamlined version (Tier 1 features only)

---

## Sources Referenced

1. [tuvi.vn - Xem tuổi vợ chồng](https://tuvi.vn/xem-tuoi-vo-chong)
2. [tuvikhoahoc.vn - Xem ngày kết hôn](https://tuvikhoahoc.vn/xem-ngay-ket-hon-cuoi-hoi)
3. [lichngaytot.com - Xem tuổi vợ chồng](https://lichngaytot.com/phong-thuy/xem-tuoi-vo-chong-284-184839.html)
4. [xemtuvi.xyz - Xem ngày cưới](https://xemtuvi.xyz/xem-ngay-cuoi)
5. [phongthuyvuong.net - Xem ngày tốt cưới hỏi](https://phongthuyvuong.net/lichvannien/xem-ngay-tot-cho-viec-cuoi-hoi/)
6. [tuvikhoahoc.vn - Lịch vạn niên](https://tuvikhoahoc.vn/lich-van-nien)
7. [tuvi.vn - Lập lá số tử vi](https://tuvi.vn/lap-la-so-tu-vi)
8. [lichngaytot.com - Lá số tử vi](https://lichngaytot.com/la-so-tu-vi.html)
9. [phongthuyvuong.com - Sao Thái Tuế](https://phongthuyvuong.com/kien-thuc/sao-thai-tue-trong-la-so-tu-vi)
10. [fptshop.com.vn - Lục hợp](https://fptshop.com.vn/tin-tuc/danh-gia/luc-hop-la-gi-189958)
11. [kimngocthuy.com - Kim Lâu](https://kimngocthuy.com/pham-tuoi-kim-lau-thi-co-duoc-lay-chong-khong-cach-hoa-giai/)
12. [wiki.batdongsan.com.vn - Cung mệnh](https://wiki.batdongsan.com.vn/wiki/xem-cung-menh-evr-801810)
13. [housef.vn - Ngũ hành tương sinh](https://housef.vn/ngu-hanh-tuong-sinh/)
14. [cuoihoivip.vn - Xem ngày dạm ngõ](https://cuoihoivip.vn/huong-dan-xem-ngay-lanh-di-dam-ngo/)

---

## Unresolved Questions & Recommendations

### Technical Questions

1. **Star Designation Authority:** Which Vietnamese astrology source should be considered "canonical" for daily star designations (Hoàng Đạo categorization)?
   - Current sources vary slightly
   - Recommend: Select 1-2 authoritative sources & standardize calculations

2. **Birth Hour Precision:** How to handle users without exact birth hour?
   - Impact on lá số accuracy is significant
   - Recommendation: Implement "estimated hour" mode with accuracy warnings

3. **Lunar Calendar Conversion:** Need verified 100-year lunar-solar conversion database
   - Critical for all date calculations
   - Recommendation: Source from Vietnamese government/academic sources

### Product Design Questions

1. **Remediation Guidance:** Should app provide hóa giải (remediation) suggestions for conflicts?
   - Ethical consideration: These are traditional beliefs, not science
   - Recommendation: Present as informational with cultural disclaimers

2. **Multiple Interpretation Sources:** Different platforms show slight variations in results
   - Example: Same date might be "Tiểu Cát" on one site, "Lục Hợp" on another
   - Recommendation: Implement multiple calculation methods & show range of results

3. **Localization:** Are these Vietnamese-specific astrology practices, or shared across East Asia?
   - Some overlap with Chinese astrology, but Vietnamese has unique elements
   - Recommendation: Clearly brand as Vietnamese astrology (tử vi khoa học Việt Nam)

### Research Gaps

1. **Real API Data:** No single comprehensive astrology API found
   - Most features require in-house calculation or scraping
   - Recommendation: Partner with existing Vietnamese astrology platform OR build comprehensive calculation engine

2. **Mobile App Market Research:** How successful are existing Vietnamese astrology apps?
   - tuvi.vn has Google Play & AppStore presence
   - Recommendation: Analyze user ratings & feature popularity

---

## Conclusion

Vietnamese astrology offers 40+ distinct features for wedding planning, organized into 9 major categories. The core value lies in couple compatibility analysis (Xem tuổi vợ chồng) and auspicious date selection (Xem ngày cưới). Implementation should follow the tiered priority system, with MVP focusing on Tier 1 features (couple compatibility, date selection, calendar conversion).

**Critical Success Factors:**
- Accurate lunar calendar conversion
- Reliable astrology calculation engine
- Cultural authenticity in terminology & practices
- Clear disclaimers on scientific validity
- Performance optimization for date range queries

**Estimated Implementation Complexity:** High (requires deep astrology domain knowledge + mathematical calculation infrastructure)

---

**Document Version:** 1.0
**Last Updated:** February 21, 2026
**Status:** Research Complete - Ready for Development Planning
