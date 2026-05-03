import { useState } from "react";

const SECTIONS = ["codes", "stacking", "gtm", "referral"];

const cptData = [
  {
    category: "APCM — Advanced Primary Care Management",
    tag: "CORE",
    tagColor: "#16a34a",
    tagBg: "#052e16",
    codes: [
      { code: "99424", desc: "APCM — complex patient, first 30 min/month", rate: "$88–$110", npiOk: true, houseCall: true, notes: "Patient must have 2+ chronic conditions expected to last ≥12 months. NP must be the principal care clinician." },
      { code: "99425", desc: "APCM — complex patient, each additional 30 min/month", rate: "$44–$55", npiOk: true, houseCall: true, notes: "Add-on to 99424. No monthly cap stated but clinical documentation must support time." },
      { code: "99426", desc: "APCM — non-complex patient, first 30 min/month", rate: "$55–$68", npiOk: true, houseCall: true, notes: "Patient has 1 chronic condition. NP is designated care clinician." },
      { code: "99427", desc: "APCM — non-complex patient, each additional 30 min/month", rate: "$25–$35", npiOk: true, houseCall: true, notes: "Add-on to 99426. Same documentation requirements." },
    ]
  },
  {
    category: "CCM — Chronic Care Management",
    tag: "HIGH VALUE",
    tagColor: "#2563eb",
    tagBg: "#0f1f4a",
    codes: [
      { code: "99490", desc: "CCM — first 20 min non-complex, clinical staff time", rate: "$62–$72", npiOk: true, houseCall: false, notes: "Billable by NP incident-to or independently. Cannot bill same month as APCM — choose one per patient per month." },
      { code: "99491", desc: "CCM — first 30 min, personally by physician/NPP", rate: "$82–$94", npiOk: true, houseCall: false, notes: "NP bills directly. Requires NP personally providing the time (not delegated to MA/RN). Strong revenue code." },
      { code: "99487", desc: "CCM — complex, first 60 min", rate: "$130–$145", npiOk: true, houseCall: false, notes: "High-acuity patients. Requires moderate/high complexity medical decision making. Excellent for multi-morbid homebound patients." },
      { code: "99489", desc: "CCM — complex, each additional 30 min", rate: "$65–$75", npiOk: true, houseCall: false, notes: "Add-on to 99487. High-documentation burden — maintain detailed time logs." },
    ]
  },
  {
    category: "PCM — Principal Care Management",
    tag: "NICHE",
    tagColor: "#7c3aed",
    tagBg: "#1e0a3c",
    codes: [
      { code: "99424", desc: "PCM — complex chronic condition mgmt, first 30 min (same code as APCM)", rate: "$88", npiOk: true, houseCall: true, notes: "PCM is condition-specific (e.g., one specialist managing one primary condition). Different intent than APCM. NP in your model is likely billing APCM, not PCM." },
      { code: "99426", desc: "PCM — non-complex, first 30 min", rate: "$55", npiOk: true, houseCall: true, notes: "Same code as APCM non-complex. Context and documentation distinguish use case." },
    ]
  },
  {
    category: "TCM — Transitional Care Management",
    tag: "RAMP TOOL",
    tagColor: "#d97706",
    tagBg: "#2d1a04",
    codes: [
      { code: "99495", desc: "TCM — moderate complexity, contact within 2 biz days of discharge", rate: "$168–$185", npiOk: true, houseCall: true, notes: "ONE of the highest-value codes in this model. Triggered by hospital/SNF/ED discharge. Face-to-face visit within 14 days. Drives same-month patient acquisition." },
      { code: "99496", desc: "TCM — high complexity, contact within 2 biz days of discharge", rate: "$228–$245", npiOk: true, houseCall: true, notes: "Highest single-encounter code here. Requires face-to-face within 7 days. Homebound, complex patients post-hospitalization are your target. THIS is your referral hook." },
    ]
  },
  {
    category: "Annual Wellness Visits",
    tag: "ACQUISITION",
    tagColor: "#0891b2",
    tagBg: "#052533",
    codes: [
      { code: "G0438", desc: "Initial Annual Wellness Visit (AWV)", rate: "$185–$210", npiOk: true, houseCall: true, notes: "No copay for patient — powerful enrollment conversation tool. Do AWV at first house call, immediately enroll in APCM same month. Stack these." },
      { code: "G0439", desc: "Subsequent Annual Wellness Visit", rate: "$130–$145", npiOk: true, houseCall: true, notes: "Annual recurring revenue per patient. Pairs with HRA, advance care planning documentation, fall risk screening." },
      { code: "G0468", desc: "AWV — FQHC/RHC variant", rate: "varies", npiOk: true, houseCall: false, notes: "Not applicable to your model — included for completeness." },
    ]
  },
  {
    category: "Cognitive Assessment & Advance Care Planning",
    tag: "HIGH YIELD",
    tagColor: "#16a34a",
    tagBg: "#052e16",
    codes: [
      { code: "99483", desc: "Cognitive assessment & care plan (≥50 min face-to-face)", rate: "$270–$295", npiOk: true, houseCall: true, notes: "Single highest-value house call code. Billable once per year per patient. Target: any patient with memory concerns, early dementia, MMSE flags. Your dementia care thesis makes this a natural fit." },
      { code: "99497", desc: "Advance care planning, first 30 min, face-to-face", rate: "$88–$98", npiOk: true, houseCall: true, notes: "Billable in addition to E&M or AWV on same day with modifier. Homebound elderly population has extremely high demand for ACP conversations." },
      { code: "99498", desc: "Advance care planning, each additional 30 min", rate: "$78–$85", npiOk: true, houseCall: true, notes: "Add-on to 99497. Document goals, surrogate decisions, POLST completion in visit notes." },
    ]
  },
  {
    category: "RPM — Remote Patient Monitoring",
    tag: "RECURRING",
    tagColor: "#0891b2",
    tagBg: "#052533",
    codes: [
      { code: "99453", desc: "RPM — device setup and patient education (one-time)", rate: "$18–$22", npiOk: true, houseCall: true, notes: "Setup code. Billed once per device per patient. Use house call visit to set up BP cuff, glucometer, or pulse ox." },
      { code: "99454", desc: "RPM — device supply, daily recordings ≥16 days/month", rate: "$52–$60", npiOk: true, houseCall: false, notes: "Monthly recurring. Patient must transmit data ≥16 days. Compliance tracking is essential — your platform must alert on non-adherence." },
      { code: "99457", desc: "RPM — first 20 min interactive communication/month", rate: "$50–$58", npiOk: true, houseCall: false, notes: "Can be NP or clinical staff time reviewing data and communicating with patient. Stacks cleanly on top of APCM." },
      { code: "99458", desc: "RPM — each additional 20 min/month", rate: "$38–$45", npiOk: true, houseCall: false, notes: "Add-on to 99457. High-utilizers with labile HTN, DM, CHF can justify this routinely." },
    ]
  },
  {
    category: "Home / Residence E&M Visits",
    tag: "HOUSE CALL CORE",
    tagColor: "#dc2626",
    tagBg: "#2d0a0a",
    codes: [
      { code: "99341", desc: "Home visit — new patient, low complexity", rate: "$80–$95", npiOk: true, houseCall: true, notes: "First visit to new patient at home. Use for initial enrollment assessment. Stack with G0438 (AWV) on same day." },
      { code: "99342", desc: "Home visit — new patient, moderate complexity", rate: "$130–$148", npiOk: true, houseCall: true, notes: "Most common new patient home visit level for your target population." },
      { code: "99344", desc: "Home visit — new patient, high complexity", rate: "$190–$210", npiOk: true, houseCall: true, notes: "Complex multi-morbid new patients. Justify with number of conditions, MDM complexity, and time." },
      { code: "99345", desc: "Home visit — new patient, high complexity + imminent threat", rate: "$225–$245", npiOk: true, houseCall: true, notes: "Reserved for patients whose condition poses imminent significant risk. Rare but real in homebound population." },
      { code: "99347", desc: "Home visit — established patient, low complexity", rate: "$58–$70", npiOk: true, houseCall: true, notes: "Routine follow-up visit. For stable APCM patients needing periodic face-to-face." },
      { code: "99348", desc: "Home visit — established patient, moderate complexity", rate: "$105–$118", npiOk: true, houseCall: true, notes: "Most common established patient home visit in chronic care population." },
      { code: "99349", desc: "Home visit — established patient, moderate-high complexity", rate: "$145–$165", npiOk: true, houseCall: true, notes: "Multi-problem visit with medication adjustments, referral coordination, or escalation decisions." },
      { code: "99350", desc: "Home visit — established patient, high complexity", rate: "$175–$200", npiOk: true, houseCall: true, notes: "Highest established patient home visit. Justifiable when patient is deteriorating or requires complex decision-making to avoid hospitalization." },
    ]
  },
  {
    category: "BHI — Behavioral Health Integration",
    tag: "ADD-ON",
    tagColor: "#7c3aed",
    tagBg: "#1e0a3c",
    codes: [
      { code: "99484", desc: "BHI — general, 20 min clinical staff time/month", rate: "$48–$56", npiOk: true, houseCall: false, notes: "NP can bill for behavioral health integration time. Anxiety, depression, and adjustment disorders are common in homebound patients. Pairs with APCM." },
      { code: "99492", desc: "Psychiatric Collaborative Care — first 70 min/month (initial)", rate: "$275–$295", npiOk: true, houseCall: false, notes: "Requires relationship with psychiatric consultant. High overhead — worth exploring if NP has psychiatric NP network or psychiatry referral relationship." },
      { code: "99493", desc: "Psychiatric CoCM — first 60 min/month (subsequent)", rate: "$225–$245", npiOk: true, houseCall: false, notes: "Ongoing monthly CoCM management. Requires registry, care manager, and psychiatric consultant. Complex to operationalize initially." },
    ]
  },
  {
    category: "Preventive & Screening",
    tag: "ENCOUNTER ADD-ON",
    tagColor: "#d97706",
    tagBg: "#2d1a04",
    codes: [
      { code: "G0444", desc: "Annual depression screening (15 min)", rate: "$28–$35", npiOk: true, houseCall: true, notes: "No patient copay. Bill alongside any E&M or AWV. PHQ-2 or PHQ-9 administered and documented." },
      { code: "G0442", desc: "Alcohol misuse screening (15 min)", rate: "$28–$35", npiOk: true, houseCall: true, notes: "Same structure as G0444. AUDIT-C screen. Stack on AWV or E&M." },
      { code: "G0296", desc: "Counseling visit for lung cancer screening eligibility", rate: "$28–$32", npiOk: true, houseCall: true, notes: "Patients 50–80 yrs, 20 pack-year history, current or former smoker. Can be done at home visit." },
      { code: "99406", desc: "Smoking cessation counseling, 3–10 min", rate: "$14–$18", npiOk: true, houseCall: true, notes: "Low dollar but zero additional time when counseling is already occurring." },
      { code: "99407", desc: "Smoking cessation counseling, >10 min", rate: "$26–$32", npiOk: true, houseCall: true, notes: "Document time and cessation counseling provided. Stack with any visit." },
    ]
  },
];

const stackScenarios = [
  {
    title: "Initial Enrollment Visit — New Homebound Patient",
    subtitle: "Month 1 | Face-to-face house call",
    total: "$555–$610",
    color: "#16a34a",
    bg: "#052e16",
    codes: [
      { code: "99342", desc: "New patient home visit, moderate complexity", amt: "$130–$148" },
      { code: "G0438", desc: "Initial Annual Wellness Visit", amt: "$185–$210" },
      { code: "99497", desc: "Advance care planning, first 30 min", amt: "$88–$98" },
      { code: "G0444", desc: "Depression screening", amt: "$28–$35" },
      { code: "99453", desc: "RPM device setup", amt: "$18–$22" },
      { code: "99424", desc: "APCM enrollment, complex (prorated month)", amt: "$88–$110" },
    ],
    note: "One house call. APCM active same month as enrollment. AWV + ACP stacked on same date — document separately. RPM device left at home. This is your Day 1 revenue event."
  },
  {
    title: "Post-Discharge TCM Visit — Hospital Leaver",
    subtitle: "Month of discharge | Referral conversion",
    total: "$380–$440",
    color: "#d97706",
    bg: "#2d1a04",
    codes: [
      { code: "99496", desc: "TCM high complexity — face-to-face within 7 days", amt: "$228–$245" },
      { code: "99497", desc: "Advance care planning (if appropriate)", amt: "$88–$98" },
      { code: "99453", desc: "RPM setup", amt: "$18–$22" },
      { code: "99424", desc: "APCM enrollment same month", amt: "$88–$110" },
    ],
    note: "TCM + APCM can both be billed in the same month per CMS guidance when TCM is the transition service and APCM continues. Confirm with your RCM vendor on current LCD/policy. This single patient generates $380+ in month 1."
  },
  {
    title: "Dementia-Focused House Call",
    subtitle: "High-value annual event | Cognitive assessment",
    total: "$450–$510",
    color: "#7c3aed",
    bg: "#1e0a3c",
    codes: [
      { code: "99483", desc: "Cognitive assessment & care plan (≥50 min)", amt: "$270–$295" },
      { code: "99349", desc: "Established home visit, mod-high complexity", amt: "$145–$165" },
      { code: "99497", desc: "ACP if family present", amt: "$88–$98" },
    ],
    note: "99483 is the anchor — justifies 50+ min face-to-face. Pair with 99349 for the E&M component (use modifier 25 to show separately identifiable service). Annual cognitive assessments for your dementia patients generate significant per-visit yield."
  },
  {
    title: "Steady-State Monthly APCM + RPM Patient",
    subtitle: "Months 2–12 | No face-to-face required",
    total: "$188–$225",
    color: "#0891b2",
    bg: "#052533",
    codes: [
      { code: "99424", desc: "APCM complex, first 30 min", amt: "$88–$110" },
      { code: "99425", desc: "APCM add-on 30 min (high acuity)", amt: "$44–$55" },
      { code: "99454", desc: "RPM device data, ≥16 days compliance", amt: "$52–$60" },
      { code: "99457", desc: "RPM interactive communication, 20 min", amt: "$50–$58" },
    ],
    note: "No house call required every month. This is the recurring revenue core. 60 patients at this stack = $11,000–$13,500/month in billings without leaving the office. RPM compliance tracking is the operational key."
  },
];

const gtmTiers = [
  {
    tier: "Tier 1 — Zero Cost, Fastest Return",
    timeframe: "Months 1–3 (pre-credentialing)",
    color: "#16a34a",
    tactics: [
      {
        name: "Hospital Discharge Planner Relationships",
        effort: "High",
        yield: "Very High",
        detail: "Discharge planners at INOVA, MedStar, Holy Cross, Suburban Hospital, and VHC are managing homebound patients with nowhere to go for chronic care follow-up. They need a reliable NP who does house calls. Visit in person. Bring a one-page referral sheet. Offer to take a post-discharge patient same week. TCM codes are your hook — the referral source gets a patient successfully transitioned, you get $228+ day one.",
      },
      {
        name: "SNF / Rehab Facility Liaisons",
        effort: "Medium",
        yield: "Very High",
        detail: "Skilled nursing facilities in Fairfax, Montgomery, and PG counties are discharging patients daily who need chronic care management at home but cannot get a PCP appointment for 6–8 weeks. Position as the bridge. Key facilities: Fairfax Nursing Center, The Virginian, Sunrise SNFs, Sunrise Rehabilitation. Ask for a 15-minute meeting with the social work director.",
      },
      {
        name: "Geriatric Care Managers (GCMs)",
        effort: "Low",
        yield: "High",
        detail: "GCMs are private-pay care coordinators managing affluent elderly clients in NoVA and suburban MD. They desperately need a clinical NP partner for house calls. Search the Aging Life Care Association directory for DMV members. One GCM with 20 active clients is worth 15+ referrals over 6 months.",
      },
      {
        name: "Home Health Agency DONs",
        effort: "Medium",
        yield: "High",
        detail: "Home health agencies (Amedisys, Bayada, LHC Group) have patients being skilled for PT/OT/SN who need a supervising or ordering physician/NP. You can co-manage their patients and drive mutual referrals. Crucially, home health cannot bill APCM — you can. Their patients are your patients.",
      },
    ]
  },
  {
    tier: "Tier 2 — Relationship-Based, 60–90 Day Payoff",
    timeframe: "Months 2–4",
    color: "#2563eb",
    tactics: [
      {
        name: "Independent Primary Care Physicians",
        effort: "Medium",
        yield: "High",
        detail: "Solo and small-group PCPs in Fairfax, Arlington, Alexandria, Bethesda, and Silver Spring have panels full of homebound or near-homebound patients they cannot physically reach. They cannot bill APCM without setting up the infrastructure. Offer to serve as their APCM partner — they maintain the PCP relationship, you handle house calls and care management. Revenue share or simple referral relationship. Target: any PCP who is 60%+ Medicare.",
      },
      {
        name: "Assisted Living Facility (ALF) Administrators",
        effort: "High",
        yield: "Very High",
        detail: "ALFs in Virginia and Maryland are required to have access to medical care but typically rely on sporadic PCP visits. Negotiate a preferred provider arrangement. One 40-bed ALF generates 20–30 APCM-eligible patients immediately. Key advantage: geographic concentration — you can see 8–10 patients in a single afternoon. Facilities to target: Sunrise, Brightview, Arden Courts (dementia-specific), Sunrise of McLean.",
      },
      {
        name: "Area Agency on Aging (AAA) Partnerships",
        effort: "Low",
        yield: "Medium",
        detail: "NoVA AAA (Fairfax) and Montgomery County Aging Services maintain lists of medically complex older adults receiving meals, transportation, and social services. These clients are Medicare-eligible and often have no regular NP or physician. Offer to speak at their caregiver workshops. Ask for a warm introduction protocol with their case managers.",
      },
      {
        name: "Faith Communities",
        effort: "Low",
        yield: "Medium",
        detail: "Large churches, mosques, and synagogues in NOVA/suburban MD with significant older adult populations. Health ministries at McLean Bible, Fairfax Presbyterian, Beth El Congregation, etc. Offer a free senior health screening or AARP-style educational session. One 90-minute community event in a congregation with 200+ seniors can yield 8–12 patient inquiries.",
      },
    ]
  },
  {
    tier: "Tier 3 — Infrastructure Plays, 90–180 Day Payoff",
    timeframe: "Months 4–9",
    color: "#dc2626",
    tactics: [
      {
        name: "INOVA Home Health / VHC at Home Integration",
        effort: "High",
        yield: "Very High",
        detail: "INOVA has been aggressively building its home-based care infrastructure. A formal preferred provider arrangement with INOVA or VHC home health gives you pipeline from one of the region's largest health systems. Requires credentialing with their network but opens a sustained referral flow for post-acute, complex patients.",
      },
      {
        name: "Medicare Advantage Special Needs Plans (D-SNPs)",
        effort: "High",
        yield: "Very High",
        detail: "D-SNPs cover dual-eligible (Medicare + Medicaid) beneficiaries who are among the most complex and highest-revenue patients in this model. Contracting with CareFirst BlueCross, Humana, or UnitedHealthcare D-SNP products in VA/MD unlocks per-member payments and referrals from their care coordinators. Longer contracting timeline but dramatically increases per-patient revenue.",
      },
      {
        name: "Hospice and Palliative Care Organizations",
        effort: "Medium",
        yield: "Medium",
        detail: "Patients transitioning from curative care toward comfort care need bridge management. APCM is billable until a patient elects the hospice benefit. Vitas, Heartland, Capital Caring (DC/MD/VA) all have patients in that 6–24 month window before hospice election where your model fits perfectly. Build a warm handoff relationship.",
      },
      {
        name: "Digital Presence + Referral Portal",
        effort: "Medium",
        yield: "Medium",
        detail: "Simple HIPAA-secure referral intake form on your website. List the practice on Zocdoc (NP house call practices are rare — you will stand out), AARP Caregiver locator, and the ACHP member directories. Google Business profile optimized for 'house call nurse practitioner' + your county names. These generate inbound for warm patients whose families are searching.",
      },
    ]
  },
];

const questions = [
  { q: "What counties / zip codes are you targeting?", why: "Determines which ALFs, SNFs, hospitals, and PCPs to prioritize. NoVA vs suburban MD vs DC-adjacent have very different referral ecosystems." },
  { q: "Does the NP bring any existing clinical relationships — PCPs, specialists, facilities?", why: "One warm relationship with a discharge planner or PCP is worth 6 months of cold outreach. This determines Tier 1 priority and first-month patient projections." },
  { q: "Is the NP currently employed and under a non-compete or restrictive covenant?", why: "Governs whether she can solicit her existing panel or contact former referral sources. Critical to establish before any GTM activity." },
  { q: "Is the target population primarily Medicare FFS, or are you open to MA contract negotiations from the start?", why: "MA contracts add revenue complexity but some D-SNP plans pay $150–300/month PMPM for complex patients — materially changes the model." },
  { q: "Does the NP have a specific clinical focus she wants to lead with — dementia, CHF, COPD, diabetes, general geriatrics?", why: "A specialist referral identity (e.g., 'we do house calls for dementia patients') makes the GTM dramatically more focused and memorable than general chronic care." },
  { q: "What is your realistic capital availability — is the $42K ceiling or is there flexibility?", why: "Determines whether you can hire even part-time admin from month one, or whether the NP is doing her own scheduling and documentation initially — which dramatically affects ramp speed." },
  { q: "Do you have a preferred EHR or care management platform already in mind?", why: "Platform choice affects what RPM and APCM workflows are possible, how fast you can credential and go live, and what your RCM vendor can integrate with." },
];

export default function App() {
  const [section, setSection] = useState("codes");
  const [expandedStack, setExpandedStack] = useState(null);
  const [expandedGtm, setExpandedGtm] = useState(null);
  const [expandedCode, setExpandedCode] = useState(null);

  const navStyle = (s) => ({
    padding: "9px 14px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    background: section === s ? "#1d4ed8" : "transparent",
    color: section === s ? "#eff6ff" : "#4b7baa",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s",
    whiteSpace: "nowrap",
  });

  return (
    <div style={{
      background: "#07090d",
      minHeight: "100vh",
      color: "#c4d6e7",
      fontFamily: "'Fira Code', 'Courier New', monospace",
      fontSize: 12,
      padding: "20px 14px 40px",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 9, color: "#1e3a52", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 5 }}>
          Virginia · Maryland · NP Full Practice Authority · House Call Model
        </div>
        <div style={{ fontSize: 22, color: "#e0f0ff", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 4 }}>
          APCM Code Stack +<br />Go-To-Market Playbook
        </div>
        <div style={{ fontSize: 10, color: "#1e3a52" }}>Medicare FFS · Part-Time Autonomous NP · MSO/PC Structure</div>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", gap: 4, overflowX: "auto", marginBottom: 24, paddingBottom: 10, borderBottom: "1px solid #0f1d2e" }}>
        {[
          { key: "codes", label: "CPT Codes" },
          { key: "stacking", label: "Code Stacking" },
          { key: "gtm", label: "Go-To-Market" },
          { key: "referral", label: "Key Questions" },
        ].map(n => (
          <button key={n.key} style={navStyle(n.key)} onClick={() => setSection(n.key)}>{n.label}</button>
        ))}
      </div>

      {/* CPT CODES */}
      {section === "codes" && (
        <div>
          <div style={{ fontSize: 10, color: "#1e3a52", marginBottom: 16, lineHeight: 1.8 }}>
            All codes billable by an autonomous NP in Virginia and Maryland under Medicare Part B. Both states have full practice authority — no collaborative agreement required. Rates shown are approximate 2024 national non-facility Medicare rates; adjust for locality (NOVA/suburban MD runs ~1.05–1.08 geographic practice cost index).
          </div>
          {cptData.map((cat, ci) => (
            <div key={ci} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: "#7eb8d4", fontWeight: 700 }}>{cat.category}</span>
                <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 3, background: cat.tagBg, color: cat.tagColor, fontWeight: 700, letterSpacing: "0.06em" }}>{cat.tag}</span>
              </div>
              {cat.codes.map((c, i) => (
                <div
                  key={i}
                  onClick={() => setExpandedCode(expandedCode === `${ci}-${i}` ? null : `${ci}-${i}`)}
                  style={{
                    background: expandedCode === `${ci}-${i}` ? "#0c1726" : "#090e15",
                    border: `1px solid ${expandedCode === `${ci}-${i}` ? "#1d4ed8" : "#0f1d2e"}`,
                    borderRadius: 5,
                    padding: "10px 12px",
                    marginBottom: 6,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: "#5b9bd5", fontWeight: 700, fontSize: 13, minWidth: 52 }}>{c.code}</span>
                      <span style={{ color: "#8aafcc", fontSize: 11 }}>{c.desc}</span>
                    </div>
                    <span style={{ color: "#3fb880", fontWeight: 700, whiteSpace: "nowrap", marginLeft: 8 }}>{c.rate}</span>
                  </div>
                  {expandedCode === `${ci}-${i}` && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #0f1d2e", color: "#4b7baa", fontSize: 11, lineHeight: 1.7 }}>
                      {c.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* CODE STACKING */}
      {section === "stacking" && (
        <div>
          <div style={{ fontSize: 10, color: "#1e3a52", marginBottom: 16, lineHeight: 1.8 }}>
            Strategic code combinations for maximum revenue per encounter and per patient per month. Tap any scenario to expand.
          </div>
          {stackScenarios.map((s, si) => (
            <div
              key={si}
              onClick={() => setExpandedStack(expandedStack === si ? null : si)}
              style={{
                background: expandedStack === si ? "#0c1726" : "#090e15",
                border: `1px solid ${expandedStack === si ? s.color : "#0f1d2e"}`,
                borderRadius: 6,
                padding: "14px",
                marginBottom: 12,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ color: "#e0f0ff", fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{s.title}</div>
                  <div style={{ color: "#1e3a52", fontSize: 10, letterSpacing: "0.04em" }}>{s.subtitle}</div>
                </div>
                <div style={{ color: s.color, fontWeight: 700, fontSize: 15, whiteSpace: "nowrap", marginLeft: 10 }}>{s.total}</div>
              </div>
              {expandedStack === si && (
                <div style={{ marginTop: 14 }}>
                  {s.codes.map((c, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #0c1420" }}>
                      <span style={{ color: "#5b9bd5", minWidth: 52, fontWeight: 700 }}>{c.code}</span>
                      <span style={{ color: "#7a9fb5", flex: 1, paddingRight: 8, fontSize: 11 }}>{c.desc}</span>
                      <span style={{ color: "#3fb880", whiteSpace: "nowrap" }}>{c.amt}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 12, padding: "10px", background: s.bg, borderRadius: 4, color: s.color, fontSize: 11, lineHeight: 1.7 }}>
                    {s.note}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div style={{ marginTop: 16, padding: 12, background: "#090e15", border: "1px solid #0f1d2e", borderRadius: 6 }}>
            <div style={{ fontSize: 10, color: "#1e3a52", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Revenue Per Patient — Best Case Annual</div>
            {[
              { label: "APCM only (complex)", val: "$1,056/yr" },
              { label: "APCM + RPM (compliant)", val: "$2,448/yr" },
              { label: "APCM + RPM + annual AWV + ACP", val: "$2,830/yr" },
              { label: "APCM + RPM + cognitive assessment + ACP", val: "$3,200/yr" },
              { label: "Full stack: enrollment yr + all recurring codes", val: "$3,800–$4,200/yr" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #0a1218" }}>
                <span style={{ color: "#4b7baa", fontSize: 11 }}>{r.label}</span>
                <span style={{ color: "#3fb880", fontWeight: 700 }}>{r.val}</span>
              </div>
            ))}
            <div style={{ marginTop: 10, fontSize: 10, color: "#1e3a52" }}>
              At 78 patients with full-stack billing, Year 2 annualized revenue approaches $250K–$300K — materially different from the APCM-only model in the proforma.
            </div>
          </div>
        </div>
      )}

      {/* GTM */}
      {section === "gtm" && (
        <div>
          <div style={{ fontSize: 10, color: "#1e3a52", marginBottom: 16, lineHeight: 1.8 }}>
            Three-tier GTM prioritized by speed-to-first-patient and cost-to-acquire. House call NPs in NOVA/suburban MD are genuinely rare — lean into scarcity.
          </div>
          {gtmTiers.map((tier, ti) => (
            <div key={ti} style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ fontSize: 11, color: tier.color, fontWeight: 700 }}>{tier.tier}</div>
              </div>
              <div style={{ fontSize: 10, color: "#1e3a52", marginBottom: 10 }}>{tier.timeframe}</div>
              {tier.tactics.map((t, i) => (
                <div
                  key={i}
                  onClick={() => setExpandedGtm(expandedGtm === `${ti}-${i}` ? null : `${ti}-${i}`)}
                  style={{
                    background: expandedGtm === `${ti}-${i}` ? "#0c1726" : "#090e15",
                    border: `1px solid ${expandedGtm === `${ti}-${i}` ? tier.color + "66" : "#0f1d2e"}`,
                    borderRadius: 5,
                    padding: "11px 13px",
                    marginBottom: 8,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#c4d6e7", fontWeight: 700, fontSize: 12 }}>{t.name}</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: "#0a1520", color: "#4b7baa" }}>Effort: {t.effort}</span>
                      <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: "#0a1520", color: "#3fb880" }}>Yield: {t.yield}</span>
                    </div>
                  </div>
                  {expandedGtm === `${ti}-${i}` && (
                    <div style={{ marginTop: 10, color: "#4b7baa", fontSize: 11, lineHeight: 1.8, paddingTop: 10, borderTop: "1px solid #0f1d2e" }}>
                      {t.detail}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
          <div style={{ padding: 12, background: "#090e15", border: "1px solid #0f1d2e", borderRadius: 6 }}>
            <div style={{ fontSize: 10, color: "#1e3a52", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>GTM Ramp Target — Revised with Full Strategy</div>
            {[
              { m: "M1–3", pts: "0", note: "Relationship-building only. In-person visits to SNFs, discharge planners, home health DONs. Zero patient intake." },
              { m: "M4", pts: "10–15", note: "First TCM referrals from hospital discharge planners. 1–2 ALF conversations converting. AWV + APCM stack from day one." },
              { m: "M5–6", pts: "25–35", note: "ALF preferred provider deal closes (20–30 patients in one facility). GCM pipeline converting. RPM being deployed." },
              { m: "M7–9", pts: "50–65", note: "Steady referral flow from 3–4 sources. Word of mouth from families. PCP co-management relationships active." },
              { m: "M10–12", pts: "75–100", note: "NP part-time capacity ceiling. Revenue $12K–$18K/month at full code stack. Hiring second NP becomes viable." },
            ].map((r, i) => (
              <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid #0a1218" }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 3 }}>
                  <span style={{ color: "#5b9bd5", fontWeight: 700, minWidth: 45 }}>{r.m}</span>
                  <span style={{ color: "#3fb880", fontWeight: 700, minWidth: 55 }}>{r.pts} pts</span>
                </div>
                <div style={{ color: "#2a4a62", fontSize: 10, lineHeight: 1.6, paddingLeft: 55 }}>{r.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUESTIONS */}
      {section === "referral" && (
        <div>
          <div style={{ fontSize: 13, color: "#e0f0ff", fontWeight: 700, marginBottom: 6 }}>Questions I Need From You</div>
          <div style={{ fontSize: 10, color: "#1e3a52", marginBottom: 20, lineHeight: 1.7 }}>
            These seven answers would materially change the GTM prioritization, financial model, and entity structure decisions. Answer any or all.
          </div>
          {questions.map((q, i) => (
            <div key={i} style={{ background: "#090e15", border: "1px solid #0f1d2e", borderRadius: 6, padding: "14px", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                <span style={{ color: "#1d4ed8", fontWeight: 700, minWidth: 22, fontSize: 14 }}>Q{i + 1}</span>
                <span style={{ color: "#c4d6e7", fontWeight: 700, fontSize: 12, lineHeight: 1.5 }}>{q.q}</span>
              </div>
              <div style={{ paddingLeft: 32, color: "#2a4a62", fontSize: 10, lineHeight: 1.7 }}>
                <span style={{ color: "#1e3a52" }}>Why it matters: </span>{q.why}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 20, padding: "12px 14px", background: "#0c1726", border: "1px solid #1d4ed8", borderRadius: 6 }}>
            <div style={{ fontSize: 10, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>One Insight Worth Surfacing Now</div>
            <div style={{ fontSize: 11, color: "#4b7baa", lineHeight: 1.8 }}>
              The ALF preferred provider arrangement is the single highest-leverage move in this GTM. One signed agreement with a 40-bed facility changes your ramp from 10 patients in month 4 to 25–30. Identify two or three target facilities before credentialing is done so the conversation is already warm when you are ready to enroll.
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 28, fontSize: 9, color: "#10202e", lineHeight: 1.8 }}>
        CPT rates approximate 2024 Medicare national non-facility rates. Locality adjustments apply. Billing combinations subject to CMS NCCI edits and LCD coverage determinations. Verify all stacking scenarios with your RCM vendor before submission. Not legal, billing, or financial advice. Federal ethics disclosure obligations apply before any business activity.
      </div>
    </div>
  );
}
