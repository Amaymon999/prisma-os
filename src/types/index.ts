// ============================================
// PRISMA OS — Core Types
// ============================================

export type Vertical =
  | "edilizia"
  | "moda"
  | "palestra"
  | "estetica"
  | "ristorazione"
  | "professionisti"
  | "formazione"
  | "franchising"
  | "saas"
  | "altro";

export type PageType =
  | "lead_generation"
  | "preventivo"
  | "vendita_servizio"
  | "corso_academy"
  | "ecommerce_promo"
  | "sales_page"
  | "vsl"
  | "prenota_call"
  | "audit_gratuito"
  | "funnel_faq";

export type ToneOfVoice =
  | "diretto"
  | "professionale"
  | "premium"
  | "amichevole"
  | "tecnico"
  | "aggressivo"
  | "aspirazionale";

export type VisualStyle =
  | "premium"
  | "corporate"
  | "bold"
  | "minimal"
  | "aggressive"
  | "luxury"
  | "street"
  | "industrial";

export type CopyLength = "corto" | "medio" | "lungo";

export type ProjectStatus = "draft" | "active" | "published" | "archived";

// ---- Section types ----
export type SectionType =
  | "hero_cta"
  | "hero_form"
  | "proof_bar"
  | "metrics"
  | "pain_points"
  | "benefits"
  | "how_it_works"
  | "services"
  | "case_studies"
  | "testimonials"
  | "before_after"
  | "gallery"
  | "vsl_video"
  | "process"
  | "pricing"
  | "faq"
  | "contact"
  | "final_form"
  | "map"
  | "footer"
  | "sticky_cta"
  | "promo_banner"
  | "why_choose_us"
  | "how_we_work"
  | "what_happens_next";

// ---- Wizard step data ----
export interface WizardStep1 {
  projectName: string;
  brandName: string;
  vertical: Vertical;
  subVertical: string;
  location: string;
  mainGoal: string;
  primaryCta: string;
  secondaryCta: string;
  targetCustomer: string;
  awarenessLevel: "cold" | "warm" | "hot";
}

export interface WizardStep2 {
  productService: string;
  price: string;
  promotion: string;
  usp: string;
  mainProblem: string;
  mainDesire: string;
  objections: string;
  promisedResults: string;
  hasBonus: boolean;
  hasGuarantee: boolean;
  hasUrgency: boolean;
  hasScarcity: boolean;
}

export interface WizardStep3 {
  paletteId: string;
  customPrimary: string;
  customSecondary: string;
  customAccent: string;
  fontHeading: string;
  fontBody: string;
  visualStyle: VisualStyle;
  logoUrl: string;
  images: string[];
  testimonials: Testimonial[];
}

export interface WizardStep4 {
  toneOfVoice: ToneOfVoice;
  copyLength: CopyLength;
  heroLayout: "centered" | "split_left" | "split_right" | "fullscreen" | "minimal";
  pageType: PageType;
  sectionOrder: SectionType[];
  enabledSections: SectionType[];
}

export interface WizardStep5 {
  headline: string;
  subheadline: string;
  benefits: string[];
  services: ServiceItem[];
  socialProof: string;
  reviews: ReviewItem[];
  faqs: FaqItem[];
  formFields: FormField[];
  address: string;
  phone: string;
  email: string;
  socialLinks: SocialLinks;
  mapEmbed: string;
  privacyNote: string;
  footerNote: string;
}

export interface WizardData {
  step1: Partial<WizardStep1>;
  step2: Partial<WizardStep2>;
  step3: Partial<WizardStep3>;
  step4: Partial<WizardStep4>;
  step5: Partial<WizardStep5>;
}

// ---- Project ----
export interface Project {
  id: string;
  userId: string;
  name: string;
  brandName: string;
  vertical: Vertical;
  pageType: PageType;
  status: ProjectStatus;
  wizardData: WizardData;
  generatedHtml: string | null;
  generatedCss: string | null;
  conversionScore: number | null;
  createdAt: string;
  updatedAt: string;
}

// ---- Supporting types ----
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  avatarUrl: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  text: string;
  rating: number;
  date: string;
  platform: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FormField {
  id: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "checkbox";
  label: string;
  placeholder: string;
  required: boolean;
  options?: string[];
}

export interface SocialLinks {
  instagram: string;
  facebook: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  whatsapp: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  preview: string[];
  verticals: Vertical[];
}

// ---- Generation ----
export interface GenerationResult {
  html: string;
  css: string;
  sections: GeneratedSection[];
  score: ConversionScore;
  missingElements: string[];
}

export interface GeneratedSection {
  type: SectionType;
  html: string;
  order: number;
}

export interface ConversionScore {
  total: number;
  breakdown: {
    headline: number;
    socialProof: number;
    cta: number;
    urgency: number;
    trust: number;
    clarity: number;
  };
  suggestions: string[];
}

// ---- Database (Supabase row types) ----
export interface DBProject {
  id: string;
  user_id: string;
  name: string;
  brand_name: string;
  vertical: Vertical;
  page_type: PageType;
  status: ProjectStatus;
  wizard_data: WizardData;
  generated_html: string | null;
  generated_css: string | null;
  conversion_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface DBUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
}

// ---- UI State ----
export interface WizardState {
  currentStep: number;
  totalSteps: number;
  data: WizardData;
  isGenerating: boolean;
  generationResult: GenerationResult | null;
}

export const WIZARD_STEPS = [
  { id: 1, label: "Progetto", description: "Info base e obiettivi" },
  { id: 2, label: "Offerta", description: "Prodotto e proposta di valore" },
  { id: 3, label: "Branding", description: "Visual identity e asset" },
  { id: 4, label: "Struttura", description: "Layout e tone of voice" },
  { id: 5, label: "Contenuto", description: "Testi e dati" },
  { id: 6, label: "Genera", description: "Anteprima e generazione" },
] as const;

export const VERTICAL_LABELS: Record<Vertical, string> = {
  edilizia: "Edilizia & Ristrutturazioni",
  moda: "Moda & Abbigliamento",
  palestra: "Palestra & Fitness",
  estetica: "Estetica & Beauty",
  ristorazione: "Ristorazione",
  professionisti: "Professionisti Locali",
  formazione: "Formazione & Academy",
  franchising: "Franchising",
  saas: "Servizi Digitali & SaaS",
  altro: "Altro",
};

export const PAGE_TYPE_LABELS: Record<PageType, string> = {
  lead_generation: "Lead Generation",
  preventivo: "Richiesta Preventivo",
  vendita_servizio: "Vendita Servizio",
  corso_academy: "Corso / Academy",
  ecommerce_promo: "Ecommerce Promo",
  sales_page: "Sales Page",
  vsl: "Video Sales Letter",
  prenota_call: "Prenota una Call",
  audit_gratuito: "Audit Gratuito",
  funnel_faq: "Funnel con FAQ",
};

export const DEFAULT_PALETTES: ColorPalette[] = [
  {
    id: "dark_pro",
    name: "Dark Pro",
    description: "Elegante e professionale",
    primary: "#1a1a2e",
    secondary: "#16213e",
    accent: "#0f3460",
    background: "#0a0a0a",
    text: "#ffffff",
    preview: ["#1a1a2e", "#0f3460", "#e94560"],
    verticals: ["saas", "professionisti", "franchising"],
  },
  {
    id: "forest_premium",
    name: "Forest Premium",
    description: "Verde naturale e fiducia",
    primary: "#0d2b1d",
    secondary: "#1a4a30",
    accent: "#2ecc71",
    background: "#060f09",
    text: "#ffffff",
    preview: ["#0d2b1d", "#1a4a30", "#2ecc71"],
    verticals: ["edilizia", "palestra", "formazione"],
  },
  {
    id: "luxury_gold",
    name: "Luxury Gold",
    description: "Lusso e autorevolezza",
    primary: "#1a1208",
    secondary: "#2d1f0a",
    accent: "#c9a84c",
    background: "#0d0b06",
    text: "#f5e6c8",
    preview: ["#1a1208", "#2d1f0a", "#c9a84c"],
    verticals: ["estetica", "moda", "franchising"],
  },
  {
    id: "urban_street",
    name: "Urban Street",
    description: "Bold e contemporaneo",
    primary: "#0f0f0f",
    secondary: "#1a1a1a",
    accent: "#ff3e3e",
    background: "#080808",
    text: "#ffffff",
    preview: ["#0f0f0f", "#1a1a1a", "#ff3e3e"],
    verticals: ["moda", "palestra", "ristorazione"],
  },
  {
    id: "ocean_trust",
    name: "Ocean Trust",
    description: "Affidabilità e competenza",
    primary: "#051525",
    secondary: "#0a2540",
    accent: "#00b4d8",
    background: "#030d1a",
    text: "#e0f2fe",
    preview: ["#051525", "#0a2540", "#00b4d8"],
    verticals: ["professionisti", "saas", "formazione"],
  },
  {
    id: "warm_local",
    name: "Warm Local",
    description: "Caldo e di fiducia",
    primary: "#1c0a00",
    secondary: "#3a1500",
    accent: "#ff8c00",
    background: "#0f0600",
    text: "#fff5e4",
    preview: ["#1c0a00", "#3a1500", "#ff8c00"],
    verticals: ["ristorazione", "edilizia", "professionisti"],
  },
];
