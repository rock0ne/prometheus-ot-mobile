export type PageId = 'control' | 'labs' | 'learn' | 'observe' | 'intel' | 'feeds' | 'ai' | 'rules' | 'terminal' | 'portfolio' | 'howto' | 'faq' | 'settings';

export interface Lab {
  id: string;
  title: string;
  role: string;
  outcome: string;
  evidence: string[];
  question: string;
  options: string[];
  answer: number;
  rationale: string;
  tags: string[];
}

export interface LearningModule {
  id: string;
  title: string;
  objective: string;
  practice: string;
  proof: string;
  pathway: 'Traditional' | 'AI & Convergence';
  tags: string[];
}

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  authority: string;
}

export interface FeedItem {
  id: string;
  title: string;
  link: string;
  published: string;
  source: string;
  summary: string;
}

export interface KevItem {
  cveID: string;
  vendorProject: string;
  product: string;
  vulnerabilityName: string;
  dateAdded: string;
  dueDate: string;
  requiredAction: string;
  knownRansomwareCampaignUse: string;
}

export interface TerminalEvent {
  ts: string;
  source: 'zeek' | 'suricata' | 'ot-sensor' | 'edr';
  host: string;
  peer: string;
  protocol: string;
  action: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  note: string;
}

export interface LabResult {
  labId: string;
  completedAt: string;
  correct: boolean;
  selected: number;
  reflection: string;
}
