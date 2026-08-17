import type { FeedSource, Lab, LearningModule, TerminalEvent } from './types';

export const LABS: Lab[] = [
  {
    id: 'soc-beacon',
    title: 'SOC Beacon Triage',
    role: 'Senior Security Analyst',
    outcome: 'Distinguish periodic command-and-control behaviour from ordinary service traffic and defend a containment decision.',
    evidence: [
      '192.0.2.24 contacted 198.51.100.42 every 60 seconds for 47 minutes.',
      'Each session transferred 412–448 bytes over TLS; the destination has not appeared in the 30-day baseline.',
      'EDR shows powershell.exe spawning from winword.exe three minutes before the first connection.'
    ],
    question: 'Which action is the strongest evidence-led first response?',
    options: ['Block the whole subnet immediately', 'Isolate the host, preserve volatile evidence, and hunt the destination', 'Ignore encrypted traffic', 'Reimage without collecting evidence'],
    answer: 1,
    rationale: 'The combined process ancestry, periodicity, and novel destination justify host containment and a scoped hunt without destroying the evidence needed for attribution and recovery.',
    tags: ['soc', 'beacon', 'edr', 'network', 'containment']
  },
  {
    id: 'cti-rfi',
    title: 'CTI Direction: Answer an RFI',
    role: 'Senior Threat Intelligence Analyst',
    outcome: 'Turn a broad concern into a priority intelligence requirement, evidence collection plan, and decision-ready product.',
    evidence: [
      'Leadership asks whether a named ransomware group is likely to target UK manufacturing in the next 90 days.',
      'Recent reporting describes exploitation of internet-facing remote-access services.',
      'The organisation operates two externally managed VPN gateways and has incomplete asset ownership records.'
    ],
    question: 'Which response best satisfies intelligence direction?',
    options: ['List every IOC associated with the group', 'Define decision, PIR/EEIs, source plan, confidence and collection gaps', 'Copy a vendor article', 'Wait for an incident'],
    answer: 1,
    rationale: 'An actionable RFI starts with the decision it must support and explicitly connects requirements, collection, assessment, uncertainty, and dissemination.',
    tags: ['cti', 'rfi', 'pir', 'eei', 'ransomware']
  },
  {
    id: 'ot-containment',
    title: 'Safety-Aware OT Containment',
    role: 'Senior OT Security Analyst',
    outcome: 'Choose containment that reduces cyber risk without creating an unassessed process-safety consequence.',
    evidence: [
      'An engineering workstation issued an unauthorised Modbus write to a test PLC.',
      'The PLC controls a pump whose abrupt stop can overpressure an upstream line.',
      'A redundant manual control path exists but operations has not confirmed readiness.'
    ],
    question: 'What is the appropriate immediate recommendation?',
    options: ['Power off the PLC', 'Coordinate with operations, inhibit the workstation path, validate safe state, then contain', 'Run an aggressive vulnerability scan', 'Reset all controllers'],
    answer: 1,
    rationale: 'OT containment must be jointly authorised and process-aware. Isolating the source path while validating safe operational state reduces threat access without guessing about physical consequences.',
    tags: ['ot', 'ics', 'modbus', 'safety', 'containment']
  },
  {
    id: 'ai-agent-boundary',
    title: 'AI Agent Trust-Boundary Review',
    role: 'Senior AI Security Architect',
    outcome: 'Threat-model an AI agent that can retrieve knowledge and request operational actions across an OT boundary.',
    evidence: [
      'The assistant retrieves untrusted maintenance documents into its context.',
      'A tool can propose firewall changes but approval is represented only by a UI confirmation.',
      'The same service account can read telemetry and submit the requested change.'
    ],
    question: 'Which architectural correction most reduces systemic risk?',
    options: ['Use a larger model', 'Separate read/propose/approve/execute identities and validate policy server-side', 'Hide the prompt', 'Increase temperature'],
    answer: 1,
    rationale: 'Server-enforced separation of duties and scoped identities prevents untrusted content or a compromised model from turning a proposal into an authorised OT action.',
    tags: ['ai', 'agent', 'threat-model', 'ot-ai', 'governance']
  }
];

export const MODULES: LearningModule[] = [
  { id:'network-hunt', title:'Network Threat Hunting', objective:'Form and test a hunt hypothesis across connection and IDS telemetry.', practice:'Use the bounded analyst terminal to filter synthetic network events.', proof:'Submit a hypothesis, cited rows, alternatives, confidence and disposition.', pathway:'Traditional', tags:['network','ids','hunt'] },
  { id:'detection-engineering', title:'Detection Engineering', objective:'Translate adversary behaviour into testable, maintainable detection logic.', practice:'Map a Sigma-like rule to Splunk, KQL or Elastic syntax.', proof:'Explain data dependencies, false positives and validation evidence.', pathway:'Traditional', tags:['sigma','splunk','kql','detection'] },
  { id:'vulnerability-risk', title:'Vulnerability Prioritisation', objective:'Prioritise remediation using exploitation evidence, exposure and business consequence.', practice:'Review cached CISA KEV records and build an evidence-led queue.', proof:'Defend priority without treating a CVE presence as proof of vulnerability.', pathway:'Traditional', tags:['cve','kev','risk'] },
  { id:'cti-lifecycle', title:'CTI Service Lifecycle', objective:'Connect direction, collection, processing, analysis, dissemination and feedback.', practice:'Work the RFI/PIR lab and create an intelligence product outline.', proof:'Show requirement-to-source-to-assessment traceability and confidence.', pathway:'Traditional', tags:['cti','rfi','pir','eei'] },
  { id:'ot-defense', title:'OT Detection & Response', objective:'Investigate OT protocol activity while preserving availability and process safety.', practice:'Analyse Modbus evidence and choose a coordinated containment path.', proof:'State cyber evidence, safety constraints, authority and recovery checks.', pathway:'Traditional', tags:['ot','ics','modbus','safety'] },
  { id:'consulting', title:'Security Consulting & Governance', objective:'Turn technical findings into risk decisions for technical and executive audiences.', practice:'Draft a concise finding with condition, consequence and control recommendation.', proof:'Produce an inspectable technical note and executive decision brief.', pathway:'Traditional', tags:['risk','governance','communication'] },
  { id:'llm01', title:'LLM01 Prompt Injection', objective:'Identify direct and indirect instruction injection across model trust boundaries.', practice:'Classify document-borne instructions and design server-side control.', proof:'Provide abuse case, affected asset, control and residual risk.', pathway:'AI & Convergence', tags:['owasp','prompt-injection','llm'] },
  { id:'llm02', title:'LLM02 Sensitive Information Disclosure', objective:'Prevent secrets, personal data and proprietary context from crossing model boundaries.', practice:'Review an assistant data flow and mark disclosure paths.', proof:'Define minimisation, access, redaction and output validation controls.', pathway:'AI & Convergence', tags:['owasp','privacy','data'] },
  { id:'llm03', title:'LLM03 Supply Chain', objective:'Assess models, datasets, adapters, dependencies and registries as supply-chain components.', practice:'Create an AI bill-of-materials and trust decision.', proof:'Show provenance, integrity verification and update response.', pathway:'AI & Convergence', tags:['owasp','supply-chain','sbom'] },
  { id:'llm04', title:'LLM04 Data & Model Poisoning', objective:'Recognise integrity attacks against training, feedback, retrieval and evaluation data.', practice:'Investigate anomalous knowledge-source changes.', proof:'Separate hypothesis from evidence and propose rollback/validation.', pathway:'AI & Convergence', tags:['owasp','poisoning','integrity'] },
  { id:'llm05', title:'LLM05 Improper Output Handling', objective:'Treat model output as untrusted input before downstream use.', practice:'Review a model-to-tool invocation flow.', proof:'Specify schema, policy, encoding and authorisation enforcement.', pathway:'AI & Convergence', tags:['owasp','output','injection'] },
  { id:'llm06', title:'LLM06 Excessive Agency', objective:'Bound agent tools, identities, autonomy, rate and consequence.', practice:'Threat-model the AI/OT agent lab.', proof:'Demonstrate least privilege and human authority at the execution boundary.', pathway:'AI & Convergence', tags:['owasp','agent','least-privilege'] },
  { id:'llm07', title:'LLM07 System Prompt Leakage', objective:'Avoid relying on hidden prompts as a security boundary.', practice:'Classify instructions, secrets and policy in a system prompt.', proof:'Move enforcement and secrets outside model context.', pathway:'AI & Convergence', tags:['owasp','prompt','secrets'] },
  { id:'llm08', title:'LLM08 Vector & Embedding Weaknesses', objective:'Protect retrieval stores from unauthorised access, poisoning and cross-tenant leakage.', practice:'Review an embedding/RAG architecture.', proof:'Define provenance, tenancy, filtering and monitoring controls.', pathway:'AI & Convergence', tags:['owasp','rag','embedding'] },
  { id:'llm09', title:'LLM09 Misinformation', objective:'Calibrate confidence and require evidence for consequential model claims.', practice:'Critique an uncited AI incident summary.', proof:'Produce a sourced assessment with alternatives and information gaps.', pathway:'AI & Convergence', tags:['owasp','misinformation','evidence'] },
  { id:'llm10', title:'LLM10 Unbounded Consumption', objective:'Control resource exhaustion and cascading cost or availability failures.', practice:'Model abusive token, tool and retrieval workloads.', proof:'Define quotas, circuit breakers, budgets and degraded modes.', pathway:'AI & Convergence', tags:['owasp','availability','cost'] },
  { id:'ai-threat-model', title:'AI Threat Modelling', objective:'Model assets, actors, trust boundaries, misuse and safety impact across the AI lifecycle.', practice:'Build a threat model for a retrieval-enabled OT assistant.', proof:'Link threats to testable controls and residual risk owners.', pathway:'AI & Convergence', tags:['stride','atlas','threat-model'] },
  { id:'ai-architecture', title:'Secure AI Architecture', objective:'Design identity, data, model, tool and evidence boundaries that fail closed.', practice:'Separate orchestration, policy, model and execution planes.', proof:'Defend the architecture under prompt injection and service compromise.', pathway:'AI & Convergence', tags:['architecture','zero-trust','agent'] },
  { id:'ai-governance', title:'AI Governance & Assurance', objective:'Connect AI risks to ownership, testing, monitoring and release decisions.', practice:'Create a control/evidence register for one AI use case.', proof:'Show accountable approval, metrics, incidents and retirement criteria.', pathway:'AI & Convergence', tags:['nist-ai-rmf','governance','assurance'] },
  { id:'ot-ai-convergence', title:'OT in an AI World', objective:'Apply AI security without losing OT safety, determinism, availability or operational authority.', practice:'Design a read-only-to-propose-to-approved-action workflow.', proof:'Demonstrate that model failure cannot directly create unsafe process action.', pathway:'AI & Convergence', tags:['ot-ai','safety','convergence'] }
];

export const FEEDS: FeedSource[] = [
  { id:'ncsc', name:'UK NCSC', url:'https://www.ncsc.gov.uk/api/1/services/v1/report-rss-feed.xml', authority:'Government advisory' },
  { id:'cisa-alerts', name:'CISA Cybersecurity Alerts', url:'https://www.cisa.gov/cybersecurity-advisories/all.xml', authority:'Government advisory' },
  { id:'nist', name:'NIST Cybersecurity Insights', url:'https://www.nist.gov/blogs/cybersecurity-insights/rss.xml', authority:'Standards and research' },
  { id:'krebs', name:'Krebs on Security', url:'https://krebsonsecurity.com/feed/', authority:'Independent reporting' }
];

export const TERMINAL_EVENTS: TerminalEvent[] = [
  { ts:'2026-08-17T08:12:00Z', source:'zeek', host:'ENG-WS-04', peer:'198.51.100.42', protocol:'tls', action:'connection', severity:'high', note:'60-second periodicity; destination absent from baseline' },
  { ts:'2026-08-17T08:09:02Z', source:'edr', host:'ENG-WS-04', peer:'LOCAL', protocol:'process', action:'spawn', severity:'critical', note:'winword.exe -> powershell.exe -enc [redacted]' },
  { ts:'2026-08-17T08:14:15Z', source:'suricata', host:'ENG-WS-04', peer:'198.51.100.42', protocol:'tls', action:'alert', severity:'high', note:'ET MALWARE Suspicious periodic TLS session' },
  { ts:'2026-08-17T09:05:31Z', source:'ot-sensor', host:'ENG-WS-04', peer:'PLC-TEST-02', protocol:'modbus', action:'write-register', severity:'critical', note:'Function 16 outside approved change window' },
  { ts:'2026-08-17T09:05:32Z', source:'ot-sensor', host:'PLC-TEST-02', peer:'PUMP-SKID-02', protocol:'process', action:'setpoint-change', severity:'high', note:'Pressure setpoint changed +12%; physical state unconfirmed' },
  { ts:'2026-08-17T07:51:10Z', source:'zeek', host:'JUMP-01', peer:'192.0.2.24', protocol:'ssh', action:'connection', severity:'low', note:'Approved administrator session' },
  { ts:'2026-08-17T07:58:49Z', source:'suricata', host:'USER-19', peer:'203.0.113.17', protocol:'http', action:'alert', severity:'medium', note:'Executable download; EDR later marked benign signed updater' }
];
