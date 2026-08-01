import React, { useState, useMemo, useCallback } from "react";
import {
  Compass, Users, Lightbulb, FlaskConical, ListOrdered, Calculator, FileText,
  Palette, Cpu, Map as MapIcon, Rocket, Megaphone, TrendingUp, Beaker,
  HeartPulse, ChevronRight, X, Check, AlertTriangle, ArrowRight, Sparkles,
  Gauge, Target, DollarSign, Activity, GitBranch, Layers, BookOpen, Shield,
  Plus, Trash2, Minus
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar, Cell
} from "recharts";

/* ============================== DESIGN TOKENS ============================== */
const C = {
  bg: "#0A0E17",
  panel: "#121826",
  panel2: "#161D2E",
  border: "#232C42",
  borderLight: "#2E3A56",
  text: "#E7EBF5",
  muted: "#8996AF",
  faint: "#5B6786",
  amber: "#F2A93B",
  teal: "#34D5B8",
  coral: "#F0577A",
  indigo: "#7C93F5",
  violet: "#B78CF0",
};

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; }
    .pm-root { font-family: 'Inter', sans-serif; background: ${C.bg}; color: ${C.text}; }
    .pm-mono { font-family: 'IBM Plex Mono', monospace; }
    .pm-scroll::-webkit-scrollbar { height: 8px; width: 8px; }
    .pm-scroll::-webkit-scrollbar-thumb { background: ${C.borderLight}; border-radius: 4px; }
    .pm-scroll::-webkit-scrollbar-track { background: transparent; }
    .pm-fade-in { animation: pmFadeIn .25s ease both; }
    @keyframes pmFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
    .pm-pulse { animation: pmPulse 2.4s ease-in-out infinite; }
    @keyframes pmPulse { 0%,100% { opacity: 1; } 50% { opacity: .45; } }
    .pm-btn { cursor: pointer; border: none; font-family: inherit; transition: all .15s ease; }
    .pm-btn:hover { filter: brightness(1.12); }
    .pm-btn:active { transform: scale(.97); }
    .pm-node:hover .pm-node-dot { transform: scale(1.25); }
    input[type=range] { -webkit-appearance: none; height: 4px; border-radius: 2px; background: ${C.border}; outline: none; }
    input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: ${C.amber}; cursor: pointer; border: 2px solid ${C.bg}; }
    ::selection { background: ${C.amber}55; }
  `}</style>
);

/* ============================== SHARED UI ============================== */
const Card = ({ children, style, ...p }) => (
  <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, ...style }} {...p}>
    {children}
  </div>
);

const Pill = ({ children, color = C.indigo, style }) => (
  <span className="pm-mono" style={{ fontSize: 10, letterSpacing: .6, textTransform: "uppercase", color, background: color + "1c", border: `1px solid ${color}44`, borderRadius: 20, padding: "3px 9px", ...style }}>{children}</span>
);

const SectionTitle = ({ eyebrow, title, desc, icon: Icon }) => (
  <div style={{ marginBottom: 20 }}>
    {eyebrow && <div className="pm-mono" style={{ fontSize: 11, color: C.amber, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>{Icon && <Icon size={13} />}{eyebrow}</div>}
    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: -0.3 }}>{title}</h2>
    {desc && <p style={{ margin: "6px 0 0", color: C.muted, fontSize: 13.5, maxWidth: 720, lineHeight: 1.55 }}>{desc}</p>}
  </div>
);

const Field = ({ label, children }) => (
  <label style={{ display: "block", marginBottom: 12 }}>
    <div className="pm-mono" style={{ fontSize: 10.5, color: C.faint, textTransform: "uppercase", letterSpacing: .5, marginBottom: 5 }}>{label}</div>
    {children}
  </label>
);

const inputStyle = { width: "100%", background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 6, padding: "9px 11px", color: C.text, fontSize: 13.5, fontFamily: "inherit" };

const SliderRow = ({ label, value, onChange, min, max, step = 1, fmt = (v) => v, accent = C.amber }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
      <span className="pm-mono" style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: .4 }}>{label}</span>
      <span className="pm-mono" style={{ fontSize: 12.5, color: accent, fontWeight: 600 }}>{fmt(value)}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} style={{ width: "100%" }} />
  </div>
);

const Bar2 = ({ label, value, max = 100, color = C.teal }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
      <span style={{ color: C.muted }}>{label}</span><span className="pm-mono" style={{ color }}>{Math.round(value)}</span>
    </div>
    <div style={{ height: 6, background: C.panel2, borderRadius: 3, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.min(100, (value / max) * 100)}%`, background: color, borderRadius: 3, transition: "width .4s ease" }} />
    </div>
  </div>
);

const Tag = ({ children, active, onClick, color = C.indigo }) => (
  <button onClick={onClick} className="pm-btn pm-mono" style={{
    fontSize: 11.5, padding: "6px 12px", borderRadius: 20, border: `1px solid ${active ? color : C.border}`,
    background: active ? color + "22" : "transparent", color: active ? color : C.muted, textTransform: "uppercase", letterSpacing: .4
  }}>{children}</button>
);

/* ============================== DATA ============================== */
const PRODUCT_TYPES = [
  { id: "ai", label: "AI Productivity App", icon: Sparkles, seed: { name: "Flowstate AI", customers: "Knowledge workers & small teams", problem: "People lose 2+ hours/day switching between tools and re-explaining context.", market: "B2B SaaS, productivity software", model: "Freemium → per-seat subscription", category: "AI Productivity", objective: "Become the default AI workspace for distributed teams" } },
  { id: "fintech", label: "FinTech App", icon: DollarSign, seed: { name: "Ledgerly", customers: "Freelancers & solo founders", problem: "Freelancers can't see real-time cash flow across multiple income sources.", market: "Consumer fintech", model: "Subscription + interchange revenue", category: "Personal Finance", objective: "Give independent workers bank-grade cash visibility" } },
  { id: "health", label: "Healthcare Platform", icon: HeartPulse, seed: { name: "Carepath", customers: "Chronic-condition patients & care teams", problem: "Patients lose track of care plans between appointments, causing avoidable readmissions.", market: "Digital health / care coordination", model: "B2B2C via health systems", category: "HealthTech", objective: "Reduce 30-day readmissions through continuous care coordination" } },
  { id: "ecom", label: "E-commerce Product", icon: Layers, seed: { name: "Restock", customers: "DTC brands under $10M revenue", problem: "Small DTC brands run out of stock or overstock because demand forecasting is manual.", market: "E-commerce operations tooling", model: "Usage-based SaaS", category: "Commerce Ops", objective: "Cut stockouts and overstock by 40% for small DTC brands" } },
  { id: "saas", label: "SaaS Platform", icon: Cpu, seed: { name: "Pipeworks", customers: "Mid-market RevOps teams", problem: "RevOps teams stitch together spreadsheets to see pipeline health across tools.", market: "B2B RevOps tooling", model: "Tiered SaaS, annual contracts", category: "RevOps", objective: "Be the single source of truth for pipeline health" } },
  { id: "edtech", label: "EdTech App", icon: BookOpen, seed: { name: "Learnloop", customers: "Working professionals re-skilling", problem: "Adults abandon online courses because content isn't adapted to their actual skill gaps.", market: "Consumer EdTech", model: "Subscription with cohort upsell", category: "Professional Learning", objective: "Cut course-abandonment in half through adaptive learning paths" } },
];

const STAGES = [
  { id: "s1", phase: "Foundation", name: "Market & Business Context", icon: Compass,
    purpose: "Understand the market you're entering and the business constraints you're operating under before chasing any solution.",
    activities: ["Size TAM / SAM / SOM", "Map industry dynamics & trends", "Assess competitive intensity", "Clarify business objectives & constraints"],
    inputs: ["Market reports", "Analyst data", "Internal strategy docs"], outputs: ["Market sizing model", "Competitive landscape map"],
    stakeholders: ["Executives", "Finance", "Strategy"], metrics: ["TAM/SAM/SOM", "Market growth rate", "Category momentum"],
    mistakes: ["Sizing the market around your solution instead of the problem", "Ignoring business constraints (budget, headcount, capability)"],
    example: "Before building Flowstate AI, the team sizes the AI-productivity category, finds SOM is 40x smaller than TAM once security-conscious enterprises are excluded, and adjusts ambitions accordingly." },
  { id: "s2", phase: "Foundation", name: "Discovery & Customer Research", icon: Users,
    purpose: "Talk to real customers to surface unfiltered problems, needs, and behaviors — before assuming you know the answer.",
    activities: ["Customer interviews", "Surveys & social listening", "Support-ticket analysis", "Jobs-to-be-Done synthesis", "Persona & empathy mapping"],
    inputs: ["Customer access", "Support data", "Usage analytics"], outputs: ["Personas", "JTBD statements", "Journey maps"],
    stakeholders: ["Product", "UX Research", "Customer Success"], metrics: ["# interviews", "Insight-to-theme ratio", "Research coverage by segment"],
    mistakes: ["Asking customers what to build instead of what they struggle with", "Small, non-representative sample treated as ground truth"],
    example: "12 interviews with freelancers reveal the real JTBD isn't 'track expenses' — it's 'know today whether I can afford to take a slow month.'" },
  { id: "s3", phase: "Foundation", name: "Problem & Opportunity Discovery", icon: FlaskConical,
    purpose: "Turn raw research into a well-formed problem statement and validated opportunity — resisting the jump straight to a feature.",
    activities: ["5 Whys / root-cause analysis", "Separate symptom from root cause", "Write problem & opportunity statements", "Build an Opportunity Solution Tree"],
    inputs: ["Research insights", "Support themes"], outputs: ["Problem statement", "Opportunity Solution Tree"],
    stakeholders: ["Product", "Design", "Data"], metrics: ["Opportunity size", "Confidence level"],
    mistakes: ["Treating a feature request as the problem itself", "Skipping root-cause analysis and solutioning immediately"],
    example: "'Add a dark mode' (feature request) traces back to 'users work late and get eye strain' (root cause) — opening several possible solutions, not just one." },
  { id: "s4", phase: "Strategy", name: "Vision & Strategy", icon: Target,
    purpose: "Set direction: why this product exists, who it's for, and how it wins — connecting company strategy to product goals.",
    activities: ["Draft product vision & principles", "Value Proposition Canvas", "Lean / Business Model Canvas", "SWOT & positioning"],
    inputs: ["Company strategy", "Market research", "Competitive analysis"], outputs: ["Vision statement", "Strategy canvas", "Positioning doc"],
    stakeholders: ["Executives", "Product leadership", "Marketing"], metrics: ["Strategic alignment score", "North Star Metric definition"],
    mistakes: ["A vision so vague it can't rule anything out", "Strategy disconnected from measurable outcomes"],
    example: "Flowstate AI's vision: 'Every team decision made with full context, automatically.' It rules out becoming a generic notes app." },
  { id: "s5", phase: "Strategy", name: "Ideation & Solution Discovery", icon: Lightbulb,
    purpose: "Generate a wide field of possible solutions before narrowing — quantity and diversity of ideas first, judgment second.",
    activities: ["Brainstorming / Crazy 8s", "How Might We questions", "SCAMPER, mind mapping", "Capture value, complexity, risk per idea"],
    inputs: ["Opportunity Solution Tree", "Design Thinking sessions"], outputs: ["Ranked idea backlog"],
    stakeholders: ["Product", "Design", "Engineering"], metrics: ["# ideas generated", "Idea diversity"],
    mistakes: ["Anchoring on the first plausible idea", "Skipping ideation and going straight to build"],
    example: "For 'reduce context-switching', the team generates 14 ideas ranging from a browser extension to an AI meeting summarizer before picking two to validate." },
  { id: "s6", phase: "Validation", name: "Discovery Validation", icon: FlaskConical,
    purpose: "Test hypotheses cheaply before committing engineering effort — turning assumptions into evidence.",
    activities: ["Hypothesis & assumption mapping", "Fake-door & landing-page tests", "Concierge / Wizard-of-Oz MVPs", "Prototype & usability testing"],
    inputs: ["Prioritized ideas", "Prototypes"], outputs: ["Validated / invalidated hypotheses", "Go/iterate/pivot/stop decision"],
    stakeholders: ["Product", "Design", "Data"], metrics: ["Signup/click-through rate", "Task success rate", "Statistical confidence"],
    mistakes: ["Building the full product before testing the riskiest assumption", "Declaring victory on tiny sample sizes"],
    example: "A fake-door test for 'AI meeting summarizer' gets a 22% click rate vs. a 4% baseline — strong enough evidence to proceed to prototyping." },
  { id: "s7", phase: "Planning", name: "Prioritization", icon: ListOrdered,
    purpose: "Decide what to build next given finite time and resources, using explicit and comparable criteria.",
    activities: ["Score with RICE / ICE / Kano / WSJF", "Build value-vs-effort matrix", "Resolve conflicting stakeholder priorities"],
    inputs: ["Idea backlog", "Business case inputs"], outputs: ["Prioritized backlog"],
    stakeholders: ["Product", "Engineering", "Design", "Sales"], metrics: ["RICE/ICE score", "Cost of delay"],
    mistakes: ["Using a single framework for every kind of decision", "Prioritizing loudest stakeholder over highest value"],
    example: "Two features tie on RICE but WSJF (which weighs urgency) clearly favors the compliance fix over the nice-to-have integration." },
  { id: "s8", phase: "Planning", name: "Business Case & Economics", icon: Calculator,
    purpose: "Prove the idea is worth pursuing financially, and model the downside if assumptions are wrong.",
    activities: ["Model revenue & cost", "Compute CAC, LTV, ROI, breakeven", "Run conservative/expected/aggressive scenarios"],
    inputs: ["Pricing assumptions", "Market sizing"], outputs: ["Business case doc", "Financial model"],
    stakeholders: ["Finance", "Executives", "Product"], metrics: ["LTV:CAC ratio", "Gross margin", "Payback period"],
    mistakes: ["Modeling only the optimistic scenario", "Ignoring CAC payback period"],
    example: "At $29/mo with $180 CAC, Ledgerly needs 7 months to pay back acquisition cost — informing how aggressively to spend on ads." },
  { id: "s9", phase: "Planning", name: "Requirements & UX", icon: FileText,
    purpose: "Translate validated opportunities into specific, buildable requirements and a usable design.",
    activities: ["Write PRD, epics, user stories (INVEST)", "Define acceptance criteria", "Information architecture, wireframes, prototypes"],
    inputs: ["Prioritized backlog", "Personas & journeys"], outputs: ["PRD", "User stories", "Prototypes"],
    stakeholders: ["Product", "Design", "Engineering", "QA"], metrics: ["Story clarity / rework rate", "Usability test success rate"],
    mistakes: ["Requirements with no acceptance criteria", "Designing before requirements are validated"],
    example: "'As a freelancer, I want a weekly cash-flow forecast so I can decide whether to take on new work' — with concrete acceptance criteria attached." },
  { id: "s10", phase: "Delivery", name: "Feasibility & Roadmap", icon: Cpu,
    purpose: "Confirm what's technically possible, then sequence the work into a roadmap tied to outcomes, not just features.",
    activities: ["Assess architecture, APIs, scalability", "Build vs. buy analysis", "Sequence roadmap by theme/outcome"],
    inputs: ["Requirements", "Engineering capacity"], outputs: ["Feasibility assessment", "Roadmap"],
    stakeholders: ["Engineering", "Architecture", "Product"], metrics: ["Engineering effort estimate", "Technical risk score"],
    mistakes: ["Treating the roadmap as a fixed feature list", "Skipping build-vs-buy analysis for commodity capabilities"],
    example: "Carepath decides to buy a HIPAA-compliant messaging API rather than build one — saving 4 months of engineering time." },
  { id: "s11", phase: "Delivery", name: "Development & Testing", icon: GitBranch,
    purpose: "Build and verify the product iteratively, in close collaboration across functions.",
    activities: ["Sprint planning & backlog refinement", "Daily cross-functional collaboration", "QA, security, performance testing"],
    inputs: ["Roadmap", "Design specs"], outputs: ["Shippable increments"], stakeholders: ["Engineering", "QA", "Design", "Product"],
    metrics: ["Velocity", "Defect rate", "Cycle time"], mistakes: ["PM disappearing during development", "Skipping regression testing under deadline pressure"],
    example: "A two-week sprint delivers the cash-flow forecast MVP; QA catches a rounding bug in multi-currency accounts before release." },
  { id: "s12", phase: "Launch", name: "Launch Readiness & GTM", icon: MapIcon,
    purpose: "Confirm every function — not just engineering — is ready, and align marketing, sales, and support before flipping the switch.",
    activities: ["Go/No-Go checklist across teams", "Positioning, messaging, pricing", "Sales & support enablement"],
    inputs: ["Shippable product", "GTM plan"], outputs: ["Go/No-Go decision", "Launch plan"], stakeholders: ["All functions", "Executives"],
    metrics: ["Readiness %", "Support ticket readiness"], mistakes: ["Launching before support/sales are trained", "No rollback plan"],
    example: "Legal flags an unresolved data-residency question two days before launch — the team delays GA by a week rather than risk it." },
  { id: "s13", phase: "Launch", name: "Launch", icon: Rocket,
    purpose: "Release the product to real customers, in a controlled way that limits blast radius if something goes wrong.",
    activities: ["Beta / phased rollout", "Feature flags & canary release", "Live monitoring", "Incident response"],
    inputs: ["Go decision", "Monitoring dashboards"], outputs: ["Live product", "Incident log"], stakeholders: ["Engineering", "Product", "Support"],
    metrics: ["Uptime", "Error rate", "Early adoption"], mistakes: ["100% rollout with no canary", "No monitoring on day one"],
    example: "A canary release to 5% of users catches a checkout bug before it reaches the full customer base." },
  { id: "s14", phase: "Growth", name: "Adoption, Analytics & Growth", icon: TrendingUp,
    purpose: "Measure how the product performs against outcomes, and deliberately drive acquisition, activation, retention and referral.",
    activities: ["Track acquisition→activation→retention funnel", "Define North Star Metric", "Design growth & referral loops"],
    inputs: ["Product usage data"], outputs: ["Analytics dashboard", "Growth experiments"], stakeholders: ["Product", "Growth", "Data", "Marketing"],
    metrics: ["DAU/WAU/MAU", "Activation rate", "Retention curve", "Referral rate"], mistakes: ["Optimizing vanity metrics over the North Star", "No retention cohort analysis"],
    example: "Learnloop discovers week-2 retention — not signups — is the real bottleneck, and redirects the team's focus accordingly." },
  { id: "s15", phase: "Growth", name: "Experimentation & Optimization", icon: Beaker,
    purpose: "Continuously test changes against real user behavior rather than opinion, and act decisively on the evidence.",
    activities: ["A/B and multivariate testing", "Pricing & UX experiments", "Statistical significance review"],
    inputs: ["Traffic", "Hypotheses"], outputs: ["Experiment results", "Ship/iterate/rollback decisions"], stakeholders: ["Product", "Data Science", "Engineering"],
    metrics: ["Lift %", "Statistical significance", "Experiment velocity"], mistakes: ["Calling a result before reaching significance", "Testing too many variables at once"],
    example: "A pricing experiment shows a 9% lift in conversion at a higher price point — but LTV:CAC still improves, so the team ships it." },
  { id: "s16", phase: "Maturity", name: "Maturity, Pivot, Scale & Sunset", icon: HeartPulse,
    purpose: "As the product matures, make a deliberate strategic call: keep investing, scale, pivot, or retire — and feed the learnings forward.",
    activities: ["Assess portfolio fit & health", "Decide continue/scale/pivot/sunset", "Plan migration, comms, decommissioning if sunsetting"],
    inputs: ["Health metrics", "Portfolio strategy"], outputs: ["Strategic decision", "Sunset or scale plan"], stakeholders: ["Executives", "Product", "Customer Success", "Legal"],
    metrics: ["Product health score", "Market share trend", "Cannibalization risk"], mistakes: ["Sunk-cost investment in a declining product", "Sunsetting with no customer migration plan"],
    example: "Restock's legacy SKU tool is sunset with 90 days' notice, a free migration path, and a post-mortem that feeds directly into the next roadmap." },
];

const FEATURE_SEED = [
  { id: "f1", name: "AI meeting summarizer", reach: 8, impact: 3, confidence: 80, effort: 5, moscow: "Must", value: 8, complexity: 4 },
  { id: "f2", name: "Cross-tool context search", reach: 6, impact: 3, confidence: 60, effort: 8, moscow: "Should", value: 7, complexity: 7 },
  { id: "f3", name: "Weekly cash-flow forecast", reach: 9, impact: 2, confidence: 90, effort: 3, moscow: "Must", value: 9, complexity: 3 },
  { id: "f4", name: "Dark mode", reach: 7, impact: 1, confidence: 95, effort: 1, moscow: "Could", value: 3, complexity: 1 },
  { id: "f5", name: "Custom enterprise SSO", reach: 2, impact: 2, confidence: 70, effort: 6, moscow: "Should", value: 5, complexity: 6 },
  { id: "f6", name: "Referral rewards program", reach: 5, impact: 2, confidence: 50, effort: 4, moscow: "Could", value: 6, complexity: 3 },
];

const DECISIONS = [
  { id: "d1", title: "The CEO wants a feature shipped this week", body: "Engineering says it needs three weeks to do safely. The CEO is adamant it ships for a board demo.",
    choices: [
      { label: "Ship a scoped-down version in one week", d: { business: 6, customer: -2, engineering: -5, financial: 2, risk: 8 } },
      { label: "Push back with data on quality risk", d: { business: -2, customer: 4, engineering: 6, financial: -1, risk: -4 } },
      { label: "Fast-track it, accept the tech debt", d: { business: 8, customer: -4, engineering: -9, financial: 3, risk: 12 } },
    ] },
  { id: "d2", title: "Two enterprise customers request conflicting features", body: "Customer A wants strict approval workflows. Customer B wants zero-friction quick actions. Both threaten churn.",
    choices: [
      { label: "Build a configurable setting for both", d: { business: 5, customer: 6, engineering: -4, financial: -2, risk: 2 } },
      { label: "Prioritize the larger contract's request", d: { business: 4, customer: -3, engineering: 2, financial: 3, risk: 3 } },
      { label: "Decline both, stay on strategy", d: { business: -3, customer: -5, engineering: 5, financial: -3, risk: -1 } },
    ] },
  { id: "d3", title: "A competitor launches a similar feature first", body: "Your team has been heads-down validating for three weeks; the competitor just shipped a rougher version.",
    choices: [
      { label: "Rush to ship your version this sprint", d: { business: 3, customer: -3, engineering: -6, financial: 0, risk: 7 } },
      { label: "Stay the course, ship the validated version", d: { business: 2, customer: 5, engineering: 3, financial: 1, risk: -2 } },
      { label: "Differentiate instead of racing to parity", d: { business: 7, customer: 4, engineering: -1, financial: 2, risk: 1 } },
    ] },
  { id: "d4", title: "Activation metrics decline unexpectedly after a release", body: "New-user activation dropped 14% in the two days since the last release. Cause is unclear.",
    choices: [
      { label: "Roll back immediately and investigate offline", d: { business: -1, customer: 5, engineering: 2, financial: -2, risk: -6 } },
      { label: "Leave it live, dig into session recordings first", d: { business: -3, customer: -4, engineering: -1, financial: -1, risk: 4 } },
      { label: "Ship a targeted hotfix within hours", d: { business: 2, customer: 3, engineering: -2, financial: 0, risk: 1 } },
    ] },
  { id: "d5", title: "Security flags a critical vulnerability pre-launch", body: "A pen test finds a critical auth bypass three days before a marketed launch date.", 
    choices: [
      { label: "Delay launch until it's fully fixed", d: { business: -6, customer: 6, engineering: 3, financial: -4, risk: -12 } },
      { label: "Launch on schedule, patch within 48 hours", d: { business: 4, customer: -8, engineering: -3, financial: 2, risk: 15 } },
      { label: "Soft-launch to a small cohort while patching", d: { business: 1, customer: 2, engineering: 1, financial: -1, risk: -3 } },
    ] },
  { id: "d6", title: "Sales asks for a one-off custom feature to close a deal", body: "A $400K deal is contingent on a bespoke feature that doesn't fit the roadmap or most other customers.",
    choices: [
      { label: "Build it as a one-off for this account", d: { business: 5, customer: 1, engineering: -6, financial: 6, risk: 5 } },
      { label: "Decline, offer existing capabilities instead", d: { business: -4, customer: -1, engineering: 4, financial: -5, risk: -2 } },
      { label: "Negotiate a generalized version on the roadmap", d: { business: 3, customer: 3, engineering: -2, financial: 2, risk: 0 } },
    ] },
];

const TEMPLATES = ["Product Vision Board", "Lean Canvas", "Value Proposition Canvas", "Persona", "Empathy Map", "Customer Journey Map",
  "Problem Statement", "Opportunity Solution Tree", "PRD", "User Story (INVEST)", "RICE Scoring Sheet", "Product Roadmap",
  "Risk Register", "Stakeholder Map (RACI)", "Experiment Plan", "GTM Plan", "Launch Checklist", "Product Metrics Tree"];

const AI_USES = [
  { label: "Research synthesis", desc: "Cluster interview transcripts into themes in minutes instead of days." },
  { label: "Persona & JTBD drafting", desc: "Draft first-pass personas from usage + support data for human review." },
  { label: "User story generation", desc: "Turn a requirement into draft stories with acceptance criteria." },
  { label: "Sentiment & feedback analysis", desc: "Surface recurring complaints across reviews and tickets at scale." },
  { label: "Experiment design support", desc: "Suggest sample size and guardrail metrics for an A/B test." },
  { label: "Forecasting support", desc: "Model revenue scenarios faster, with the PM setting assumptions." },
];
const AI_RISKS = [
  { label: "Hallucination", desc: "Fabricated stats or quotes presented as fact — always verify against source data." },
  { label: "Bias", desc: "Training data skew can bias personas or prioritization toward the loudest segment." },
  { label: "Data privacy", desc: "Customer data fed into third-party models can violate contracts or regulation." },
  { label: "Over-automation", desc: "Delegating judgment calls (prioritization, pricing) entirely to AI erodes accountability." },
  { label: "Explainability", desc: "Stakeholders can't be aligned on a decision no one can explain." },
];
const ROLES = [
  { role: "Product Manager", does: "Owns the 'why' and 'what' — problem definition, strategy, prioritization, outcomes." },
  { role: "Product Owner", does: "Owns the backlog and sprint execution within an agile team; narrower and more tactical than PM." },
  { role: "Product Leader / CPO", does: "Sets multi-product strategy, portfolio investment, and org design for product." },
  { role: "Project Manager", does: "Owns timeline, budget, and delivery coordination for a defined project — not product outcomes." },
  { role: "Program Manager", does: "Coordinates multiple related projects/teams toward a shared program goal." },
  { role: "UX Designer", does: "Owns user flows, interaction design, and usability of the solution." },
  { role: "Engineering Manager", does: "Owns technical delivery, architecture quality, and team health." },
  { role: "Data Analyst / Scientist", does: "Owns measurement, experimentation rigor, and predictive modeling." },
];

/* ============================== HELPERS ============================== */
const rice = (f) => ((f.reach * f.impact * (f.confidence / 100)) / Math.max(1, f.effort)).toFixed(1);
const ice = (f) => (((f.impact * 2) + (f.confidence / 10) + (10 - f.effort)) / 3).toFixed(1);
const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

/* ============================== TAB: LIFECYCLE MAP ============================== */
function LifecycleTab({ scenario }) {
  const [sel, setSel] = useState(STAGES[0]);
  const phases = [...new Set(STAGES.map(s => s.phase))];
  return (
    <div className="pm-fade-in">
      <SectionTitle eyebrow="Explore Mode" title="The Product Management Lifecycle" icon={Compass}
        desc={`Click any stage to see its purpose, activities, inputs, outputs, stakeholders, metrics and a worked example for ${scenario.name}. The lifecycle loops — sunset learnings feed the next Discovery cycle.`} />
      <div className="pm-scroll" style={{ display: "flex", gap: 0, overflowX: "auto", paddingBottom: 14, marginBottom: 8 }}>
        {phases.map((phase) => (
          <div key={phase} style={{ display: "flex", flexDirection: "column", minWidth: "fit-content" }}>
            <div className="pm-mono" style={{ fontSize: 10, color: C.faint, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, paddingLeft: 4 }}>{phase}</div>
            <div style={{ display: "flex" }}>
              {STAGES.filter(s => s.phase === phase).map((s, i, arr) => (
                <div key={s.id} className="pm-node" style={{ display: "flex", alignItems: "center" }}>
                  <button onClick={() => setSel(s)} className="pm-btn" style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "none", padding: "4px 14px", minWidth: 84
                  }}>
                    <div className="pm-node-dot" style={{
                      width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      background: sel.id === s.id ? C.amber : C.panel2, border: `2px solid ${sel.id === s.id ? C.amber : C.borderLight}`,
                      transition: "transform .15s ease", boxShadow: sel.id === s.id ? `0 0 16px ${C.amber}66` : "none"
                    }}>
                      <s.icon size={17} color={sel.id === s.id ? C.bg : C.muted} />
                    </div>
                    <span style={{ fontSize: 10.5, textAlign: "center", color: sel.id === s.id ? C.text : C.muted, lineHeight: 1.25, fontWeight: sel.id === s.id ? 700 : 500 }}>{s.name}</span>
                  </button>
                  {i < arr.length - 1 && <div style={{ width: 22, height: 2, background: C.border, marginTop: -20 }} />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Card style={{ marginTop: 10 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: C.amber + "1c", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <sel.icon size={22} color={C.amber} />
          </div>
          <div>
            <Pill>{sel.phase}</Pill>
            <h3 style={{ margin: "6px 0 4px", fontSize: 19, fontWeight: 800 }}>{sel.name}</h3>
            <p style={{ margin: 0, color: C.muted, fontSize: 13.5, lineHeight: 1.6 }}>{sel.purpose}</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginTop: 16 }}>
          <div><div className="pm-mono" style={{ fontSize: 11, color: C.teal, marginBottom: 8, textTransform: "uppercase" }}>Key Activities</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: C.text, lineHeight: 1.9 }}>{sel.activities.map((a, i) => <li key={i}>{a}</li>)}</ul></div>
          <div><div className="pm-mono" style={{ fontSize: 11, color: C.indigo, marginBottom: 8, textTransform: "uppercase" }}>Inputs → Outputs</div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 6 }}>In: {sel.inputs.join(", ")}</div>
            <div style={{ fontSize: 13, color: C.text }}>Out: {sel.outputs.join(", ")}</div></div>
          <div><div className="pm-mono" style={{ fontSize: 11, color: C.violet, marginBottom: 8, textTransform: "uppercase" }}>Stakeholders & Metrics</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>{sel.stakeholders.map((s, i) => <Pill key={i} color={C.violet}>{s}</Pill>)}</div>
            <div style={{ fontSize: 13, color: C.muted }}>{sel.metrics.join(" · ")}</div></div>
        </div>
        <div style={{ marginTop: 16, padding: 14, background: C.panel2, borderRadius: 8, border: `1px solid ${C.border}` }}>
          <div className="pm-mono" style={{ fontSize: 11, color: C.coral, marginBottom: 6, textTransform: "uppercase" }}>Common Mistakes</div>
          <ul style={{ margin: "0 0 12px", paddingLeft: 18, fontSize: 13, color: C.muted, lineHeight: 1.8 }}>{sel.mistakes.map((m, i) => <li key={i}>{m}</li>)}</ul>
          <div className="pm-mono" style={{ fontSize: 11, color: C.amber, marginBottom: 6, textTransform: "uppercase" }}>Example — {scenario.name}</div>
          <p style={{ margin: 0, fontSize: 13, color: C.text, lineHeight: 1.6 }}>{sel.example}</p>
        </div>
      </Card>
    </div>
  );
}

/* ============================== TAB: SCENARIO SETUP ============================== */
function ScenarioTab({ scenario, setScenario, productType, setProductType }) {
  const upd = (k, v) => setScenario((s) => ({ ...s, [k]: v }));
  return (
    <div className="pm-fade-in">
      <SectionTitle eyebrow="Product Scenario Simulator" title="Define your running case study" icon={Layers}
        desc="Pick a product archetype and edit the details. This scenario carries through every module in the demo." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 22 }}>
        {PRODUCT_TYPES.map((p) => (
          <button key={p.id} className="pm-btn" onClick={() => { setProductType(p.id); setScenario(p.seed); }}
            style={{
              textAlign: "left", background: productType === p.id ? C.amber + "14" : C.panel, border: `1.5px solid ${productType === p.id ? C.amber : C.border}`,
              borderRadius: 10, padding: 14
            }}>
            <p.icon size={18} color={productType === p.id ? C.amber : C.muted} />
            <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700 }}>{p.label}</div>
          </button>
        ))}
      </div>
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 4 }}>
          <Field label="Product name"><input style={inputStyle} value={scenario.name} onChange={(e) => upd("name", e.target.value)} /></Field>
          <Field label="Target customers"><input style={inputStyle} value={scenario.customers} onChange={(e) => upd("customers", e.target.value)} /></Field>
          <Field label="Market"><input style={inputStyle} value={scenario.market} onChange={(e) => upd("market", e.target.value)} /></Field>
          <Field label="Business model"><input style={inputStyle} value={scenario.model} onChange={(e) => upd("model", e.target.value)} /></Field>
          <Field label="Product category"><input style={inputStyle} value={scenario.category} onChange={(e) => upd("category", e.target.value)} /></Field>
          <Field label="Strategic objective"><input style={inputStyle} value={scenario.objective} onChange={(e) => upd("objective", e.target.value)} /></Field>
        </div>
        <Field label="Problem statement"><textarea style={{ ...inputStyle, minHeight: 64, resize: "vertical" }} value={scenario.problem} onChange={(e) => upd("problem", e.target.value)} /></Field>
      </Card>
      <p style={{ color: C.faint, fontSize: 12, marginTop: 10 }}>This case study is used throughout Research, Strategy, Prioritization, Business Case, Launch, Analytics and Decisions.</p>
    </div>
  );
}

/* ============================== TAB: RESEARCH ============================== */
function ResearchTab({ scenario }) {
  const [personas, setPersonas] = useState([{ id: 1, name: "Priya, Ops Lead", need: "See team status without chasing five tools", pain: "Loses 45 min/day in status-check pings", motivation: "Wants to look on top of things to leadership" }]);
  const [whys, setWhys] = useState(["Users ask for a 'unified dashboard'", "Because they can't see status across tools", "Because each tool has its own notification stream", "Because nothing aggregates context automatically", "Root cause: no shared context layer across tools"]);
  const addPersona = () => setPersonas((p) => [...p, { id: Date.now(), name: "New persona", need: "", pain: "", motivation: "" }]);
  const updP = (id, k, v) => setPersonas((p) => p.map((x) => x.id === id ? { ...x, [k]: v } : x));
  const delP = (id) => setPersonas((p) => p.filter((x) => x.id !== id));

  return (
    <div className="pm-fade-in">
      <SectionTitle eyebrow="Customer & User Research" title="Research workspace" icon={Users}
        desc={`Build personas and trace a feature request down to its root cause for ${scenario.name}, before it turns into an opportunity.`} />
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18, alignItems: "start" }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div className="pm-mono" style={{ fontSize: 11, color: C.teal, textTransform: "uppercase" }}>Personas & Jobs-to-be-Done</div>
            <button className="pm-btn" onClick={addPersona} style={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 6, padding: "5px 10px", color: C.teal, display: "flex", gap: 4, alignItems: "center", fontSize: 12 }}><Plus size={13} /> Add persona</button>
          </div>
          {personas.map((p) => (
            <div key={p.id} style={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input style={{ ...inputStyle, fontWeight: 700 }} value={p.name} onChange={(e) => updP(p.id, "name", e.target.value)} />
                <button className="pm-btn" onClick={() => delP(p.id)} style={{ background: "none", color: C.coral, padding: 6 }}><Trash2 size={15} /></button>
              </div>
              <Field label="Job to be done / need"><input style={inputStyle} value={p.need} onChange={(e) => updP(p.id, "need", e.target.value)} /></Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Pain point"><input style={inputStyle} value={p.pain} onChange={(e) => updP(p.id, "pain", e.target.value)} /></Field>
                <Field label="Motivation"><input style={inputStyle} value={p.motivation} onChange={(e) => updP(p.id, "motivation", e.target.value)} /></Field>
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <div className="pm-mono" style={{ fontSize: 11, color: C.amber, textTransform: "uppercase", marginBottom: 12 }}>5 Whys → Root Cause</div>
          {whys.map((w, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
              <div className="pm-mono" style={{ width: 22, height: 22, borderRadius: "50%", background: i === whys.length - 1 ? C.amber : C.panel2, color: i === whys.length - 1 ? C.bg : C.muted, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 700 }}>{i === whys.length - 1 ? "!" : i + 1}</div>
              <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: i === whys.length - 1 ? C.amber : C.text }}>{w}</p>
            </div>
          ))}
          <div style={{ marginTop: 14, padding: 12, background: C.amber + "12", border: `1px solid ${C.amber}44`, borderRadius: 8 }}>
            <div className="pm-mono" style={{ fontSize: 10.5, color: C.amber, marginBottom: 4, textTransform: "uppercase" }}>Opportunity statement</div>
            <p style={{ margin: 0, fontSize: 12.5, color: C.text, lineHeight: 1.5 }}>How might we give {scenario.customers.toLowerCase()} shared context across tools automatically — without asking them to check five separate places?</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================== TAB: STRATEGY ============================== */
function StrategyTab({ scenario }) {
  const [canvas, setCanvas] = useState({
    problem: scenario.problem, uvp: `The only ${scenario.category.toLowerCase()} product that turns scattered context into one automatic view.`,
    solution: "AI-aggregated context layer across existing tools", advantage: "Proprietary cross-tool context graph",
    segments: scenario.customers, channels: "Product-led growth, content, partnerships", revenue: scenario.model,
    costs: "Cloud infra, model inference, engineering", metrics: "Weekly active teams, activation rate",
  });
  const upd = (k, v) => setCanvas((c) => ({ ...c, [k]: v }));
  const cells = [
    ["problem", "Problem"], ["solution", "Solution"], ["uvp", "Unique Value Proposition"], ["advantage", "Unfair Advantage"],
    ["segments", "Customer Segments"], ["channels", "Channels"], ["costs", "Cost Structure"], ["revenue", "Revenue Streams"], ["metrics", "Key Metrics"],
  ];
  return (
    <div className="pm-fade-in">
      <SectionTitle eyebrow="Product Vision & Strategy" title="Lean Canvas" icon={Target}
        desc={`Vision: "${scenario.objective}." Edit any cell — this canvas connects company strategy to what gets built.`} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {cells.map(([key, label]) => (
          <div key={key} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
            <div className="pm-mono" style={{ fontSize: 10, color: C.indigo, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
            <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical", background: "transparent", border: "none", padding: 0, fontSize: 12.5, lineHeight: 1.5 }} value={canvas[key]} onChange={(e) => upd(key, e.target.value)} />
          </div>
        ))}
      </div>
      <Card style={{ marginTop: 16 }}>
        <div className="pm-mono" style={{ fontSize: 11, color: C.violet, textTransform: "uppercase", marginBottom: 10 }}>Strategy Chain</div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, fontSize: 12.5 }}>
          {["Company Strategy", "Product Strategy", `Goal: ${scenario.objective.split(" ").slice(0, 4).join(" ")}…`, "Initiatives", "Features", "Outcomes"].map((s, i, arr) => (
            <React.Fragment key={i}><Pill color={C.violet}>{s}</Pill>{i < arr.length - 1 && <ArrowRight size={14} color={C.faint} />}</React.Fragment>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ============================== TAB: PRIORITIZATION ============================== */
function PrioritizationTab({ features, setFeatures }) {
  const [fw, setFw] = useState("RICE");
  const upd = (id, k, v) => setFeatures((fs) => fs.map((f) => f.id === id ? { ...f, [k]: v } : f));
  const scored = useMemo(() => {
    const withScore = features.map((f) => ({ ...f, score: fw === "RICE" ? parseFloat(rice(f)) : fw === "ICE" ? parseFloat(ice(f)) : fw === "Value/Effort" ? +(f.value / f.complexity).toFixed(2) : { Must: 4, Should: 3, Could: 2, "Won't": 1 }[f.moscow] }));
    return withScore.sort((a, b) => b.score - a.score);
  }, [features, fw]);
  const maxScore = Math.max(...scored.map((s) => s.score), 1);

  return (
    <div className="pm-fade-in">
      <SectionTitle eyebrow="Prioritization" title="Prioritization board" icon={ListOrdered}
        desc="Switch frameworks to see how the ranking changes — the same backlog, scored differently, can produce a different #1." />
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {["RICE", "ICE", "Value/Effort", "MoSCoW"].map((f) => <Tag key={f} active={fw === f} onClick={() => setFw(f)} color={C.amber}>{f}</Tag>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <div className="pm-mono" style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", marginBottom: 10 }}>Ranked by {fw}</div>
          {scored.map((f, i) => (
            <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div className="pm-mono" style={{ width: 20, fontSize: 11, color: i === 0 ? C.amber : C.faint, fontWeight: 700 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, marginBottom: 4 }}>{f.name}</div>
                <div style={{ height: 6, background: C.panel2, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(f.score / maxScore) * 100}%`, background: i === 0 ? C.amber : C.indigo, borderRadius: 3, transition: "width .3s" }} />
                </div>
              </div>
              <div className="pm-mono" style={{ fontSize: 12, color: i === 0 ? C.amber : C.muted, width: 40, textAlign: "right" }}>{f.score}</div>
            </div>
          ))}
        </Card>
        <Card>
          <div className="pm-mono" style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", marginBottom: 10 }}>Adjust inputs</div>
          <div className="pm-scroll" style={{ maxHeight: 360, overflowY: "auto", paddingRight: 4 }}>
            {features.map((f) => (
              <div key={f.id} style={{ marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 8 }}>{f.name}</div>
                {fw === "MoSCoW" ? (
                  <div style={{ display: "flex", gap: 6 }}>{["Must", "Should", "Could", "Won't"].map((m) => <Tag key={m} active={f.moscow === m} onClick={() => upd(f.id, "moscow", m)}>{m}</Tag>)}</div>
                ) : fw === "Value/Effort" ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <SliderRow label="Value" value={f.value} min={1} max={10} onChange={(v) => upd(f.id, "value", v)} accent={C.teal} />
                    <SliderRow label="Complexity" value={f.complexity} min={1} max={10} onChange={(v) => upd(f.id, "complexity", v)} accent={C.coral} />
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <SliderRow label="Reach" value={f.reach} min={1} max={10} onChange={(v) => upd(f.id, "reach", v)} accent={C.indigo} />
                    <SliderRow label="Impact" value={f.impact} min={1} max={3} onChange={(v) => upd(f.id, "impact", v)} accent={C.teal} />
                    <SliderRow label="Confidence %" value={f.confidence} min={10} max={100} step={5} onChange={(v) => upd(f.id, "confidence", v)} accent={C.violet} />
                    <SliderRow label="Effort" value={f.effort} min={1} max={10} onChange={(v) => upd(f.id, "effort", v)} accent={C.coral} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================== TAB: BUSINESS CASE ============================== */
function BusinessCaseTab({ scenario }) {
  const [price, setPrice] = useState(29);
  const [cac, setCac] = useState(180);
  const [churn, setChurn] = useState(4);
  const [growth, setGrowth] = useState(12);
  const [users, setUsers] = useState(400);
  const [scen, setScen] = useState("Expected");
  const mult = { Conservative: 0.6, Expected: 1, Aggressive: 1.6 }[scen];

  const proj = useMemo(() => {
    let u = users, rows = [];
    for (let m = 1; m <= 12; m++) {
      u = u * (1 + (growth * mult) / 100) * (1 - churn / 100);
      rows.push({ month: `M${m}`, revenue: Math.round(u * price), users: Math.round(u) });
    }
    return rows;
  }, [users, growth, churn, price, mult]);

  const ltv = (price / (churn / 100)).toFixed(0);
  const ratio = (ltv / cac).toFixed(1);
  const payback = (cac / price).toFixed(1);
  const margin = 72;

  return (
    <div className="pm-fade-in">
      <SectionTitle eyebrow="Business Case & Product Economics" title="Business case builder" icon={Calculator}
        desc={`Model ${scenario.name}'s unit economics and 12-month revenue trajectory across scenarios.`} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 18 }}>
        <Card>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>{["Conservative", "Expected", "Aggressive"].map((s) => <Tag key={s} active={scen === s} onClick={() => setScen(s)} color={C.amber}>{s}</Tag>)}</div>
          <SliderRow label="Monthly price" value={price} min={5} max={150} step={1} fmt={(v) => `$${v}`} onChange={setPrice} accent={C.teal} />
          <SliderRow label="CAC" value={cac} min={20} max={500} step={5} fmt={(v) => `$${v}`} onChange={setCac} accent={C.coral} />
          <SliderRow label="Monthly churn" value={churn} min={1} max={15} step={0.5} fmt={(v) => `${v}%`} onChange={setChurn} accent={C.coral} />
          <SliderRow label="Monthly growth" value={growth} min={2} max={40} step={1} fmt={(v) => `${v}%`} onChange={setGrowth} accent={C.indigo} />
          <SliderRow label="Starting users" value={users} min={50} max={5000} step={50} onChange={setUsers} accent={C.violet} />
        </Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {[["LTV", `$${ltv}`, C.teal], ["LTV:CAC", `${ratio}x`, ratio >= 3 ? C.teal : C.coral], ["Payback (mo)", payback, payback <= 12 ? C.teal : C.coral], ["Gross margin", `${margin}%`, C.indigo]].map(([l, v, c]) => (
              <Card key={l} style={{ padding: 12, textAlign: "center" }}>
                <div className="pm-mono" style={{ fontSize: 20, fontWeight: 700, color: c }}>{v}</div>
                <div style={{ fontSize: 10.5, color: C.faint, textTransform: "uppercase", marginTop: 4 }}>{l}</div>
              </Card>
            ))}
          </div>
          <Card>
            <div className="pm-mono" style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", marginBottom: 10 }}>12-month revenue projection ({scen})</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={proj}>
                <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke={C.faint} fontSize={11} />
                <YAxis stroke={C.faint} fontSize={11} />
                <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="revenue" stroke={C.amber} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ============================== TAB: ROADMAP ============================== */
function RoadmapTab({ features }) {
  const [assign, setAssign] = useState(() => Object.fromEntries(features.map((f, i) => [f.id, i < 2 ? "Now" : i < 4 ? "Next" : "Later"])));
  const cols = ["Now", "Next", "Later"];
  const colColor = { Now: C.teal, Next: C.amber, Later: C.indigo };
  return (
    <div className="pm-fade-in">
      <SectionTitle eyebrow="Product Roadmapping" title="Now / Next / Later roadmap" icon={MapIcon}
        desc="Reassign items to see the roadmap communicate outcomes and sequencing, not just a feature list." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {cols.map((col) => (
          <div key={col}>
            <div className="pm-mono" style={{ fontSize: 12, color: colColor[col], textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: colColor[col] }} /> {col}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 140 }}>
              {features.filter((f) => assign[f.id] === col).map((f) => (
                <Card key={f.id} style={{ padding: 12 }}>
                  <div style={{ fontSize: 12.5, marginBottom: 8 }}>{f.name}</div>
                  <div style={{ display: "flex", gap: 5 }}>
                    {cols.filter((c) => c !== col).map((c) => (
                      <button key={c} className="pm-btn" onClick={() => setAssign((a) => ({ ...a, [f.id]: c }))}
                        style={{ fontSize: 10.5, padding: "3px 8px", borderRadius: 5, background: C.panel2, border: `1px solid ${C.border}`, color: C.muted }}>→ {c}</button>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================== TAB: LAUNCH ============================== */
const CHECKLIST = {
  Engineering: ["Load testing passed", "Rollback plan documented", "Feature flags configured"],
  QA: ["Regression suite green", "Cross-browser/device verified"],
  Security: ["Pen test complete", "Data handling reviewed"],
  Legal: ["Terms & privacy updated", "Regulatory review complete"],
  Support: ["Help docs published", "Support team trained"],
  Marketing: ["Launch messaging finalized", "Landing page live"],
  Sales: ["Sales deck & pricing approved"],
};
function LaunchTab({ scenario }) {
  const [checks, setChecks] = useState(() => { const o = {}; Object.entries(CHECKLIST).forEach(([k, v]) => v.forEach((i) => o[`${k}:${i}`] = Math.random() > 0.3)); return o; });
  const [event, setEvent] = useState(null);
  const total = Object.keys(checks).length, done = Object.values(checks).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);
  const toggle = (k) => setChecks((c) => ({ ...c, [k]: !c[k] }));
  const events = [
    { title: "Server load spikes 400% at launch hour", choices: ["Scale infra & absorb cost", "Throttle new signups temporarily"] },
    { title: "Early reviews flag a confusing onboarding step", choices: ["Hotfix onboarding copy immediately", "Log it, address next sprint"] },
    { title: "A competitor announces a similar launch same week", choices: ["Move launch date up 2 days", "Hold steady, differentiate in messaging"] },
  ];
  return (
    <div className="pm-fade-in">
      <SectionTitle eyebrow="Launch Readiness & Go-to-Market" title={`Go / No-Go — ${scenario.name}`} icon={Rocket}
        desc="Toggle checklist items per function. Readiness below 80% should give you pause before General Availability." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {Object.entries(CHECKLIST).map(([team, items]) => (
            <Card key={team} style={{ padding: 14 }}>
              <div className="pm-mono" style={{ fontSize: 11, color: C.indigo, textTransform: "uppercase", marginBottom: 8 }}>{team}</div>
              {items.map((i) => {
                const k = `${team}:${i}`, on = checks[k];
                return (
                  <button key={k} onClick={() => toggle(k)} className="pm-btn" style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: "none", padding: "5px 0", textAlign: "left" }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${on ? C.teal : C.faint}`, background: on ? C.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {on && <Check size={11} color={C.bg} />}
                    </div>
                    <span style={{ fontSize: 12.5, color: on ? C.text : C.muted }}>{i}</span>
                  </button>
                );
              })}
            </Card>
          ))}
        </div>
        <div>
          <Card style={{ textAlign: "center", marginBottom: 14 }}>
            <div className="pm-mono" style={{ fontSize: 34, fontWeight: 800, color: pct >= 80 ? C.teal : pct >= 50 ? C.amber : C.coral }}>{pct}%</div>
            <div style={{ fontSize: 11, color: C.faint, textTransform: "uppercase", marginBottom: 12 }}>Launch readiness</div>
            <div style={{ padding: "8px 12px", borderRadius: 8, background: (pct >= 80 ? C.teal : C.coral) + "1c", border: `1px solid ${(pct >= 80 ? C.teal : C.coral)}44` }}>
              <span className="pm-mono" style={{ fontSize: 13, fontWeight: 700, color: pct >= 80 ? C.teal : C.coral }}>{pct >= 80 ? "GO" : "NO-GO"}</span>
            </div>
          </Card>
          <Card>
            <div className="pm-mono" style={{ fontSize: 11, color: C.coral, textTransform: "uppercase", marginBottom: 10 }}>Launch-day event</div>
            {!event ? (
              <button className="pm-btn" onClick={() => setEvent(events[Math.floor(Math.random() * events.length)])} style={{ width: "100%", padding: 10, background: C.coral + "1c", border: `1px solid ${C.coral}44`, borderRadius: 6, color: C.coral, fontSize: 12.5 }}>
                <AlertTriangle size={13} style={{ marginRight: 6, verticalAlign: -2 }} />Simulate an incident
              </button>
            ) : (
              <div>
                <p style={{ fontSize: 12.5, color: C.text, lineHeight: 1.5, marginBottom: 10 }}>{event.title}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {event.choices.map((c) => <button key={c} className="pm-btn" onClick={() => setEvent(null)} style={{ fontSize: 11.5, padding: 8, textAlign: "left", background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text }}>{c}</button>)}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ============================== TAB: ANALYTICS ============================== */
function AnalyticsTab({ scenario }) {
  const [acq, setAcq] = useState(10000);
  const [actR, setActR] = useState(45);
  const [engR, setEngR] = useState(60);
  const [retR, setRetR] = useState(38);
  const [refR, setRefR] = useState(15);
  const funnel = useMemo(() => {
    const activation = acq * (actR / 100), engagement = activation * (engR / 100), retention = engagement * (retR / 100), revenue = retention * 0.22, referral = revenue * (refR / 100);
    return [
      { name: "Acquisition", v: acq }, { name: "Activation", v: Math.round(activation) }, { name: "Engagement", v: Math.round(engagement) },
      { name: "Retention", v: Math.round(retention) }, { name: "Revenue", v: Math.round(revenue) }, { name: "Referral", v: Math.round(referral) },
    ];
  }, [acq, actR, engR, retR, refR]);
  return (
    <div className="pm-fade-in">
      <SectionTitle eyebrow="Product Analytics & Metrics" title={`${scenario.name} funnel`} icon={Activity}
        desc="Adjust conversion assumptions at each stage and watch the funnel — and the North Star Metric — respond." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 18 }}>
        <Card>
          <SliderRow label="Monthly visitors (acquisition)" value={acq} min={1000} max={50000} step={500} onChange={setAcq} accent={C.indigo} />
          <SliderRow label="Activation rate" value={actR} min={10} max={90} fmt={(v) => `${v}%`} onChange={setActR} accent={C.teal} />
          <SliderRow label="Engagement rate" value={engR} min={10} max={90} fmt={(v) => `${v}%`} onChange={setEngR} accent={C.teal} />
          <SliderRow label="Retention rate" value={retR} min={5} max={80} fmt={(v) => `${v}%`} onChange={setRetR} accent={C.amber} />
          <SliderRow label="Referral rate" value={refR} min={2} max={40} fmt={(v) => `${v}%`} onChange={setRefR} accent={C.violet} />
          <div style={{ marginTop: 8, padding: 12, background: C.panel2, borderRadius: 8 }}>
            <div className="pm-mono" style={{ fontSize: 10.5, color: C.faint, textTransform: "uppercase" }}>North Star Metric</div>
            <div className="pm-mono" style={{ fontSize: 20, color: C.amber, fontWeight: 700 }}>{funnel[3].v.toLocaleString()} <span style={{ fontSize: 11, color: C.muted, fontWeight: 400 }}>retained active users / mo</span></div>
          </div>
        </Card>
        <Card>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={funnel} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" stroke={C.faint} fontSize={11} />
              <YAxis type="category" dataKey="name" stroke={C.faint} fontSize={12} width={90} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="v" radius={[0, 6, 6, 0]}>
                {funnel.map((_, i) => <Cell key={i} fill={[C.indigo, C.teal, C.teal, C.amber, C.violet, C.coral][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

/* ============================== TAB: EXPERIMENTS ============================== */
function ExperimentTab() {
  const [hyp, setHyp] = useState("Shortening onboarding from 5 steps to 3 will increase activation rate.");
  const [sample, setSample] = useState(2000);
  const [days, setDays] = useState(14);
  const [result, setResult] = useState(null);
  const run = () => {
    const lift = +((Math.random() * 16) - 4).toFixed(1);
    const sig = sample > 1500 && days >= 10 ? Math.random() > 0.25 : Math.random() > 0.6;
    setResult({ lift, sig });
  };
  return (
    <div className="pm-fade-in">
      <SectionTitle eyebrow="Experimentation & Optimization" title="A/B test configurator" icon={Beaker}
        desc="Hypothesis → Experiment → Evidence → Learning → Decision. Configure and run a simulated test." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <Card>
          <Field label="Hypothesis"><textarea style={{ ...inputStyle, minHeight: 60 }} value={hyp} onChange={(e) => setHyp(e.target.value)} /></Field>
          <SliderRow label="Sample size / arm" value={sample} min={200} max={10000} step={100} onChange={setSample} accent={C.indigo} />
          <SliderRow label="Duration (days)" value={days} min={3} max={30} onChange={setDays} accent={C.violet} />
          <button className="pm-btn" onClick={run} style={{ width: "100%", padding: 11, background: C.amber, color: C.bg, borderRadius: 8, fontWeight: 700, fontSize: 13, marginTop: 6 }}>Run experiment</button>
        </Card>
        <Card>
          {!result ? <div style={{ color: C.faint, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 180 }}>Results will appear here</div> : (
            <div className="pm-fade-in">
              <div className="pm-mono" style={{ fontSize: 32, fontWeight: 800, color: result.lift >= 0 ? C.teal : C.coral }}>{result.lift >= 0 ? "+" : ""}{result.lift}%</div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>lift on activation rate</div>
              <Pill color={result.sig ? C.teal : C.coral}>{result.sig ? "Statistically significant" : "Not yet significant"}</Pill>
              <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                {["Ship", "Iterate", "Roll back", "Extend test"].map((a) => (
                  <button key={a} className="pm-btn" onClick={() => {}} style={{ fontSize: 12, padding: "7px 12px", borderRadius: 6, background: C.panel2, border: `1px solid ${C.border}`, color: C.text }}>{a}</button>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ============================== TAB: DECISIONS ============================== */
function DecisionTab({ decisions, setDecisions }) {
  const [idx, setIdx] = useState(0);
  const answered = decisions[idx]?.chosen != null;
  const choose = (ci) => setDecisions((ds) => ds.map((d, i) => i === idx ? { ...d, chosen: ci } : d));
  const d = decisions[idx];
  if (!d) return null;
  return (
    <div className="pm-fade-in">
      <SectionTitle eyebrow="PM Decision Center" title="Realistic product decisions" icon={GitBranch}
        desc="Every choice ripples across business, customer, engineering, financial and risk outcomes — tracked on your Product Health score." />
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {decisions.map((dd, i) => <button key={dd.id} onClick={() => setIdx(i)} className="pm-btn pm-mono" style={{ width: 30, height: 30, borderRadius: "50%", background: i === idx ? C.amber : dd.chosen != null ? C.teal + "33" : C.panel2, border: `1px solid ${i === idx ? C.amber : C.border}`, color: i === idx ? C.bg : C.muted, fontSize: 12 }}>{i + 1}</button>)}
      </div>
      <Card>
        <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700 }}>{d.title}</h3>
        <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, marginBottom: 18 }}>{d.body}</p>
        <div style={{ display: "grid", gap: 10 }}>
          {d.choices.map((c, ci) => (
            <button key={ci} className="pm-btn" onClick={() => choose(ci)} style={{
              textAlign: "left", padding: 13, borderRadius: 8, background: d.chosen === ci ? C.amber + "18" : C.panel2, border: `1.5px solid ${d.chosen === ci ? C.amber : C.border}`, color: C.text, fontSize: 13
            }}>{c.label}</button>
          ))}
        </div>
        {answered && (
          <div className="pm-fade-in" style={{ marginTop: 16, padding: 14, background: C.panel2, borderRadius: 8 }}>
            <div className="pm-mono" style={{ fontSize: 10.5, color: C.faint, textTransform: "uppercase", marginBottom: 10 }}>Impact of this decision</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
              {Object.entries(d.choices[d.chosen].d).map(([k, v]) => (
                <div key={k} style={{ textAlign: "center" }}>
                  <div className="pm-mono" style={{ fontSize: 15, fontWeight: 700, color: v >= 0 ? (k === "risk" ? C.coral : C.teal) : (k === "risk" ? C.teal : C.coral) }}>{v > 0 ? "+" : ""}{v}</div>
                  <div style={{ fontSize: 9.5, color: C.faint, textTransform: "uppercase" }}>{k}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
          <button className="pm-btn" disabled={idx === 0} onClick={() => setIdx((i) => Math.max(0, i - 1))} style={{ opacity: idx === 0 ? .3 : 1, background: "none", color: C.muted, fontSize: 12.5 }}>← Previous</button>
          <button className="pm-btn" disabled={idx === decisions.length - 1} onClick={() => setIdx((i) => Math.min(decisions.length - 1, i + 1))} style={{ opacity: idx === decisions.length - 1 ? .3 : 1, background: "none", color: C.amber, fontSize: 12.5 }}>Next scenario →</button>
        </div>
      </Card>
    </div>
  );
}

/* ============================== TAB: HEALTH & PIVOT/SCALE/SUNSET ============================== */
function HealthTab({ health, finalCall, setFinalCall }) {
  const radar = Object.entries(health).map(([k, v]) => ({ metric: k, value: clamp(v) }));
  const overall = Math.round(radar.reduce((a, b) => a + b.value, 0) / radar.length);
  const sunsetSteps = ["Define sunset criteria", "Notify customers (90-day window)", "Offer migration path", "Handle data retention & contracts", "Transition support", "Decommission infrastructure", "Run post-mortem & capture lessons"];
  return (
    <div className="pm-fade-in">
      <SectionTitle eyebrow="Product Health & Strategic Decision" title="Health Dashboard → Continue / Scale / Pivot / Sunset" icon={HeartPulse}
        desc="Your Product Health score is synthesized from the Business Case, Analytics, and Decision Center. Use it to make the final call." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <Card>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radar}>
              <PolarGrid stroke={C.border} />
              <PolarAngleAxis dataKey="metric" stroke={C.muted} fontSize={11} />
              <Radar dataKey="value" stroke={C.amber} fill={C.amber} fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ textAlign: "center", marginTop: -8 }}>
            <span className="pm-mono" style={{ fontSize: 28, fontWeight: 800, color: overall >= 65 ? C.teal : overall >= 45 ? C.amber : C.coral }}>{overall}</span>
            <span style={{ fontSize: 12, color: C.faint }}> / 100 overall health</span>
          </div>
        </Card>
        <Card>
          {radar.map((r) => <Bar2 key={r.metric} label={r.metric} value={r.value} color={r.value >= 65 ? C.teal : r.value >= 45 ? C.amber : C.coral} />)}
        </Card>
      </div>

      <Card style={{ marginTop: 18 }}>
        <div className="pm-mono" style={{ fontSize: 11, color: C.violet, textTransform: "uppercase", marginBottom: 12 }}>Make the strategic call</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["Continue", "Scale", "Pivot", "Sunset"].map((opt) => (
            <button key={opt} className="pm-btn" onClick={() => setFinalCall(opt)} style={{
              padding: "10px 18px", borderRadius: 8, background: finalCall === opt ? C.amber : C.panel2, color: finalCall === opt ? C.bg : C.text,
              border: `1.5px solid ${finalCall === opt ? C.amber : C.border}`, fontWeight: 700, fontSize: 13
            }}>{opt}</button>
          ))}
        </div>
        {finalCall && (
          <div className="pm-fade-in" style={{ marginTop: 16 }}>
            {finalCall === "Sunset" ? (
              <div style={{ display: "grid", gap: 8 }}>
                {sunsetSteps.map((s, i) => <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 12.5, color: C.text }}><div className="pm-mono" style={{ width: 20, height: 20, borderRadius: "50%", background: C.panel2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>{i + 1}</div>{s}</div>)}
                <p style={{ marginTop: 8, fontSize: 12, color: C.faint, lineHeight: 1.6 }}>Lessons learned from this sunset feed directly back into new Problem Discovery — closing the lifecycle loop.</p>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
                {{
                  Continue: "Keep current investment level. Re-check health quarterly against the same dashboard.",
                  Scale: "Increase investment in acquisition and infrastructure — health score supports aggressive growth.",
                  Pivot: "Preserve validated learnings, but redirect toward a new opportunity — loop back to Discovery with what you now know.",
                }[finalCall]}
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ============================== TAB: REFERENCE (Toolkit + AI + Roles) ============================== */
function ReferenceTab() {
  const [sub, setSub] = useState("Toolkit");
  return (
    <div className="pm-fade-in">
      <SectionTitle eyebrow="Reference" title="Toolkit, AI-augmented PM & roles" icon={Shield} desc="Quick reference material spanning templates, modern AI-assisted workflows, and how PM roles differ." />
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>{["Toolkit", "AI-Augmented PM", "Roles"].map((s) => <Tag key={s} active={sub === s} onClick={() => setSub(s)}>{s}</Tag>)}</div>
      {sub === "Toolkit" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 10 }}>
          {TEMPLATES.map((t) => (
            <Card key={t} style={{ padding: 13, display: "flex", alignItems: "center", gap: 10 }}>
              <FileText size={16} color={C.indigo} /><span style={{ fontSize: 12.5 }}>{t}</span>
            </Card>
          ))}
        </div>
      )}
      {sub === "AI-Augmented PM" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <Card><div className="pm-mono" style={{ fontSize: 11, color: C.teal, textTransform: "uppercase", marginBottom: 10 }}>Where AI helps</div>
            {AI_USES.map((u) => <div key={u.label} style={{ marginBottom: 10 }}><div style={{ fontSize: 12.5, fontWeight: 700 }}>{u.label}</div><div style={{ fontSize: 12, color: C.muted }}>{u.desc}</div></div>)}</Card>
          <Card><div className="pm-mono" style={{ fontSize: 11, color: C.coral, textTransform: "uppercase", marginBottom: 10 }}>Where AI creates risk</div>
            {AI_RISKS.map((u) => <div key={u.label} style={{ marginBottom: 10 }}><div style={{ fontSize: 12.5, fontWeight: 700 }}>{u.label}</div><div style={{ fontSize: 12, color: C.muted }}>{u.desc}</div></div>)}</Card>
        </div>
      )}
      {sub === "Roles" && (
        <Card>
          {ROLES.map((r) => (
            <div key={r.role} style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.amber }}>{r.role}</div>
              <div style={{ fontSize: 12.5, color: C.muted }}>{r.does}</div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

/* ============================== APP SHELL ============================== */
const TABS = [
  { id: "lifecycle", label: "Lifecycle", icon: Compass },
  { id: "scenario", label: "Scenario", icon: Layers },
  { id: "research", label: "Research", icon: Users },
  { id: "strategy", label: "Strategy", icon: Target },
  { id: "prioritization", label: "Prioritize", icon: ListOrdered },
  { id: "business", label: "Business Case", icon: Calculator },
  { id: "roadmap", label: "Roadmap", icon: MapIcon },
  { id: "launch", label: "Launch", icon: Rocket },
  { id: "analytics", label: "Analytics", icon: Activity },
  { id: "experiments", label: "Experiments", icon: Beaker },
  { id: "decisions", label: "Decisions", icon: GitBranch },
  { id: "health", label: "Health & Exit", icon: HeartPulse },
  { id: "reference", label: "Reference", icon: Shield },
];

export default function App() {
  const [tab, setTab] = useState("lifecycle");
  const [productType, setProductType] = useState("ai");
  const [scenario, setScenario] = useState(PRODUCT_TYPES[0].seed);
  const [features, setFeatures] = useState(FEATURE_SEED);
  const [decisions, setDecisions] = useState(DECISIONS);
  const [finalCall, setFinalCall] = useState(null);

  const decisionScore = useMemo(() => {
    const chosen = decisions.filter((d) => d.chosen != null);
    if (!chosen.length) return { business: 50, customer: 50, engineering: 50, financial: 50, risk: 50 };
    const sums = { business: 0, customer: 0, engineering: 0, financial: 0, risk: 0 };
    chosen.forEach((d) => Object.entries(d.choices[d.chosen].d).forEach(([k, v]) => sums[k] += v));
    const out = {};
    Object.entries(sums).forEach(([k, v]) => out[k] = clamp(50 + v * 2));
    return out;
  }, [decisions]);

  const health = useMemo(() => ({
    "Business Health": decisionScore.business,
    "Customer Health": decisionScore.customer,
    "Technical Health": decisionScore.engineering,
    "Financial Health": decisionScore.financial,
    "Risk (inverse)": clamp(100 - decisionScore.risk),
  }), [decisionScore]);

  const overallHealth = Math.round(Object.values(health).reduce((a, b) => a + b, 0) / Object.values(health).length);

  const renderTab = () => {
    switch (tab) {
      case "lifecycle": return <LifecycleTab scenario={scenario} />;
      case "scenario": return <ScenarioTab scenario={scenario} setScenario={setScenario} productType={productType} setProductType={setProductType} />;
      case "research": return <ResearchTab scenario={scenario} />;
      case "strategy": return <StrategyTab scenario={scenario} />;
      case "prioritization": return <PrioritizationTab features={features} setFeatures={setFeatures} />;
      case "business": return <BusinessCaseTab scenario={scenario} />;
      case "roadmap": return <RoadmapTab features={features} />;
      case "launch": return <LaunchTab scenario={scenario} />;
      case "analytics": return <AnalyticsTab scenario={scenario} />;
      case "experiments": return <ExperimentTab />;
      case "decisions": return <DecisionTab decisions={decisions} setDecisions={setDecisions} />;
      case "health": return <HealthTab health={health} finalCall={finalCall} setFinalCall={setFinalCall} />;
      case "reference": return <ReferenceTab />;
      default: return null;
    }
  };

  return (
    <div className="pm-root" style={{ minHeight: "100vh", width: "100%" }}>
      <GlobalStyle />
      {/* HEADER */}
      <div style={{ borderBottom: `1px solid ${C.border}`, background: C.panel, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: `linear-gradient(135deg, ${C.amber}, ${C.coral})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Gauge size={18} color={C.bg} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14.5, lineHeight: 1.1 }}>PM Command Center</div>
              <div className="pm-mono" style={{ fontSize: 10.5, color: C.faint }}>case study: {scenario.name}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="pm-mono" style={{ fontSize: 10.5, color: C.faint, textTransform: "uppercase" }}>Health</span>
              <div className="pm-pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: overallHealth >= 65 ? C.teal : overallHealth >= 45 ? C.amber : C.coral }} />
              <span className="pm-mono" style={{ fontSize: 16, fontWeight: 700, color: overallHealth >= 65 ? C.teal : overallHealth >= 45 ? C.amber : C.coral }}>{overallHealth}</span>
            </div>
          </div>
        </div>
        <div className="pm-scroll" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 20px 12px", display: "flex", gap: 6, overflowX: "auto" }}>
          {TABS.map((t) => (
            <button key={t.id} className="pm-btn" onClick={() => setTab(t.id)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 7, whiteSpace: "nowrap",
              background: tab === t.id ? C.amber : "transparent", color: tab === t.id ? C.bg : C.muted, fontSize: 12.5, fontWeight: tab === t.id ? 700 : 500
            }}>
              <t.icon size={13.5} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "26px 20px 60px" }}>
        {renderTab()}
      </div>
    </div>
  );
}
