import { Network } from '@capacitor/network';
import './styles.css';
import { FEEDS, LABS, MODULES, TERMINAL_EVENTS } from './data';
import { FAQS, GUIDES } from './guides';
import {
  coach, convertRule, errorMessage, labResults, loadFeed, loadKev, normalisePairOrigin,
  readJson, riskObservations, runTerminal, safeHttpUrl, saveLabResult, writeJson
} from './core';
import type { FeedItem, KevItem, Lab, PageId } from './types';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Application root not found.');

const pages: Array<{ id: PageId; label: string }> = [
  { id:'control', label:'CONTROL' }, { id:'labs', label:'LABS' }, { id:'learn', label:'LEARN' },
  { id:'observe', label:'OBSERVE' }, { id:'intel', label:'INTEL' }, { id:'feeds', label:'FEEDS' },
  { id:'ai', label:'AI' }, { id:'rules', label:'RULES' }, { id:'terminal', label:'TERMINAL' },
  { id:'portfolio', label:'PORTFOLIO' }, { id:'howto', label:'HOW TO' }, { id:'faq', label:'FAQ' },
  { id:'settings', label:'SETTINGS' }
];

let currentPage: PageId = 'control';
let networkState = { connected: navigator.onLine, connectionType: navigator.onLine ? 'unknown' : 'none' };
let latestKev: Awaited<ReturnType<typeof loadKev>> | undefined;

const shell = element('div', 'shell');
const topStack = element('div', 'top-stack');
const brand = element('header', 'brand');
brand.append(text('span', '⬡', 'brand-mark'), text('span', 'P R O M E T H E U S · O T', 'brand-name'), text('span', 'MOBILE', 'edition'));
const networkPill = text('span', '● CHECKING', 'network-pill');
brand.append(networkPill);
topStack.append(brand);

const nav = element('nav', 'nav');
nav.setAttribute('aria-label', 'Primary navigation');
pages.forEach((page, index) => {
  const button = element('button');
  button.type = 'button';
  const number = text('span', String(index + 1).padStart(2, '0'), 'n');
  button.append(number, document.createTextNode(page.label));
  button.addEventListener('click', () => navigate(page.id));
  button.dataset.page = page.id;
  nav.append(button);
});
topStack.append(nav);

const statusStrip = element('div', 'status-strip');
statusStrip.append(text('span', '● LOCAL LAB READY'));
const clock = document.createElement('time');
statusStrip.append(clock);
const mode = text('span', 'OFFLINE-FIRST');
mode.style.marginLeft = 'auto';
mode.style.color = 'var(--purple)';
statusStrip.append(mode);
topStack.append(statusStrip);

const searchForm = element('form', 'search-bar');
searchForm.setAttribute('role', 'search');
const searchInput = document.createElement('input');
searchInput.className = 'input mono';
searchInput.type = 'search';
searchInput.maxLength = 120;
searchInput.placeholder = 'SEARCH LABS · AI · RSS · TERMINAL';
searchInput.setAttribute('aria-label', 'Search the mobile platform');
searchForm.append(searchInput, button('SEARCH', 'btn primary'));
searchForm.addEventListener('submit', event => { event.preventDefault(); renderSearch(searchInput.value); });
topStack.append(searchForm);
shell.append(topStack);

const main = document.createElement('main');
shell.append(main);
app.append(shell);

window.setInterval(() => { clock.textContent = new Date().toLocaleTimeString([], { hour12:false }); }, 1000);
clock.textContent = new Date().toLocaleTimeString([], { hour12:false });

void initialise();

async function initialise(): Promise<void> {
  try {
    networkState = await Network.getStatus();
    await Network.addListener('networkStatusChange', status => {
      networkState = status;
      updateNetwork();
      if (currentPage === 'observe' || currentPage === 'control') renderPage();
    });
  } catch {
    networkState = { connected:navigator.onLine, connectionType:navigator.onLine ? 'unknown' : 'none' };
  }
  updateNetwork();
  renderPage();
  void loadKev(false).then(result => { latestKev = result; if (currentPage === 'control') renderPage(); }).catch(() => undefined);
}

function updateNetwork(): void {
  networkPill.textContent = networkState.connected ? `● ${networkState.connectionType.toUpperCase()}` : '● OFFLINE';
  networkPill.style.color = networkState.connected ? 'var(--green)' : 'var(--amber)';
}

function navigate(page: PageId): void {
  currentPage = page;
  renderPage();
  const active = nav.querySelector<HTMLButtonElement>(`button[data-page="${page}"]`);
  active?.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' });
  window.scrollTo({ top:0, behavior:'smooth' });
}

function renderPage(): void {
  nav.querySelectorAll('button').forEach(item => {
    if (item.getAttribute('data-page') === currentPage) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
  main.replaceChildren();
  if (currentPage === 'control') renderControl();
  else if (currentPage === 'labs') renderLabs();
  else if (currentPage === 'learn') renderLearn();
  else if (currentPage === 'observe') renderObserve();
  else if (currentPage === 'intel') renderIntel();
  else if (currentPage === 'feeds') renderFeeds();
  else if (currentPage === 'ai') renderAi();
  else if (currentPage === 'rules') renderRules();
  else if (currentPage === 'terminal') renderTerminal();
  else if (currentPage === 'portfolio') renderPortfolio();
  else if (currentPage === 'howto') renderHowTo();
  else if (currentPage === 'faq') renderFaq();
  else renderSettings();
}

function renderControl(): void {
  main.append(hero('PURPLE-TEAM FUSION WORKSPACE', 'Mission Control', 'A standalone phone lab for practical cyber, OT and AI-security learning—with optional connection to the full Prometheus-OT range.', [
    action('OPEN LABS', () => navigate('labs'), 'primary'), action('ASK COACH', () => navigate('ai')), action('REVIEW CVES', () => navigate('intel'))
  ]));
  const results = labResults();
  const stats = element('section', 'stats');
  stats.append(
    stat('NETWORK', networkState.connected ? networkState.connectionType.toUpperCase() : 'OFFLINE', 'Transport observation—not a security verdict'),
    stat('LEARNING', `${results.filter(r => r.correct).length} / ${LABS.length}`, 'Demonstrated local outcomes'),
    stat('CVE INTEL', latestKev ? `${latestKev.items.length} KEV` : 'READING…', latestKev ? cacheLabel(latestKev) : 'Private offline cache'),
    stat('PAIRING', pairingOrigin() ? 'CONFIGURED' : 'OPTIONAL', pairingOrigin() || 'Standalone mode')
  );
  main.append(stats);
  main.append(sectionTitle('MOBILE OPERATING MODEL'));
  const model = panel('Included on the phone', 'Labs · coherent learning paths · network visibility · CISA KEV and RSS intelligence · Living Engine · offline Platform Coach · AI security workspaces · rule converter · bounded analyst terminal · portfolio evidence.');
  model.append(text('p', 'Security Onion, SOAR, Wazuh, Velociraptor, Splunk operations, packet-capture infrastructure and HMI control remain main-lab services; the phone never represents them as fake local tools.', 'warning'));
  main.append(model);
  const future = panel('Traditional cyber + AI/OT convergence', 'Each page makes the outcome, hands-on activity and proof explicit. AI supports learning, but evidence and human judgement remain the competency boundary.');
  const chips = element('div');
  ['SOC & hunting','CTI','Vulnerability risk','OT safety','AI architecture','AI threat modelling','Governance'].forEach(value => chips.append(chip(value)));
  future.append(chips);
  main.append(future);
}

function renderLabs(): void {
  main.append(hero('HANDS-ON · AUTOMATION · MEASURABLE PROOF', 'Purple-Team Labs', 'Work a decision from evidence, commit an answer and record a reflection. Correctness alone does not demonstrate reasoning.'));
  const results = labResults();
  const list = element('section', 'grid two');
  LABS.forEach(lab => {
    const prior = results.find(result => result.labId === lab.id);
    const card = element('article', `card ${prior?.correct ? 'ok' : ''}`);
    card.append(chip(lab.role, 'purple'), text('h2', lab.title), text('p', lab.outcome));
    const proof = text('p', prior ? `Last attempt: ${prior.correct ? 'demonstrated' : 'needs review'} · ${new Date(prior.completedAt).toLocaleDateString()}` : 'Not attempted');
    proof.className = prior?.correct ? 'success' : 'muted';
    card.append(proof, action(prior ? 'REOPEN LAB' : 'START LAB', () => openLab(lab), 'primary'));
    list.append(card);
  });
  main.append(list);
}

function openLab(lab: Lab): void {
  const modal = element('div', 'modal');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  const body = element('section', 'modal-body');
  body.append(text('span', lab.role, 'eyebrow'), text('h2', lab.title), text('p', `OUTCOME · ${lab.outcome}`));
  body.append(sectionTitle('EVIDENCE'));
  lab.evidence.forEach((row, index) => body.append(panel(`E${index + 1}`, row)));
  body.append(sectionTitle('DECISION'));
  body.append(text('p', lab.question));
  const form = document.createElement('form');
  lab.options.forEach((option, index) => {
    const label = element('label', 'list-item');
    const input = document.createElement('input');
    input.type = 'radio'; input.name = 'answer'; input.value = String(index); input.required = true;
    label.append(input, document.createTextNode(` ${option}`));
    form.append(label);
  });
  const reflection = document.createElement('textarea');
  reflection.rows = 4; reflection.maxLength = 800; reflection.required = true;
  reflection.placeholder = 'Explain which evidence changed your decision, one credible alternative, and remaining uncertainty.';
  form.append(sectionTitle('REASONING RECORD'), reflection);
  const feedback = element('div');
  const actions = element('div', 'button-row');
  actions.append(action('SUBMIT EVIDENCE', () => undefined, 'primary'), action('CLOSE', () => modal.remove()));
  (actions.firstElementChild as HTMLButtonElement).type = 'submit';
  form.append(actions, feedback);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const selected = Number(new FormData(form).get('answer'));
    const correct = selected === lab.answer;
    saveLabResult({ labId:lab.id, completedAt:new Date().toISOString(), correct, selected, reflection:reflection.value.trim() });
    feedback.replaceChildren(panel(correct ? 'OUTCOME DEMONSTRATED' : 'REVIEW REQUIRED', `${lab.rationale} Your reflection is retained privately on this device.`));
    feedback.firstElementChild?.classList.add(correct ? 'ok' : 'risk');
  });
  body.append(form);
  modal.append(body);
  modal.addEventListener('click', event => { if (event.target === modal) modal.remove(); });
  document.body.append(modal);
}

function renderLearn(): void {
  main.append(hero('CLEAR OUTCOMES · PRACTICE · PROOF', 'Learning Paths', 'Two coherent routes fuse traditional cyber/OT tradecraft with secure AI architecture, governance and OT–AI convergence.'));
  (['Traditional','AI & Convergence'] as const).forEach(pathway => {
    main.append(sectionTitle(pathway === 'Traditional' ? '01 · CYBER, CTI, RISK & OT' : '02 · AI SECURITY & OT CONVERGENCE'));
    const list = element('section', 'list');
    MODULES.filter(module => module.pathway === pathway).forEach((module, index) => {
      const item = element('article', 'card');
      item.append(text('span', `${String(index + 1).padStart(2,'0')} · ${module.pathway}`, 'eyebrow'), text('h3', module.title));
      item.append(text('p', `OUTCOME · ${module.objective}`), text('p', `HANDS-ON · ${module.practice}`), text('p', `PROOF · ${module.proof}`));
      list.append(item);
    });
    main.append(list);
  });
}

function renderObserve(): void {
  main.append(hero('LOCAL + GLOBAL RISK OBSERVATION', 'Living Engine', 'Evidence-labelled observations refresh as connectivity, intelligence freshness and demonstrated learning change. It does not manufacture a universal risk score.'));
  const results = labResults();
  const observations = riskObservations({ online:networkState.connected, connectionType:networkState.connectionType, kev:latestKev, completed:results.filter(r => r.correct).length, total:LABS.length });
  observations.forEach(row => {
    const card = panel(row.title, row.detail);
    card.classList.add(row.level === 'attention' ? 'risk' : 'ok');
    card.prepend(chip(row.level, row.level === 'learning' ? 'purple' : row.level === 'attention' ? 'amber' : 'green'));
    card.append(text('p', `NEXT · ${row.action}`));
    main.append(card);
  });
  main.append(panel('Network visibility boundary', `Observed transport: ${networkState.connectionType}. The cross-platform app intentionally does not scan nearby devices, capture packets, inspect other apps, or claim vulnerability from connection metadata.`));
}

function renderIntel(): void {
  main.append(hero('AUTHORITATIVE FEED + PRIVATE CACHE', 'CVE & Exploitation Intelligence', 'Use CISA Known Exploited Vulnerabilities as exploitation evidence—then validate asset, version, exposure and consequence before prioritising.'));
  const controls = element('div', 'button-row');
  const refresh = action('REFRESH CISA KEV', () => void refreshKev(true), 'primary');
  controls.append(refresh);
  const query = document.createElement('input');
  query.className = 'input mono'; query.type = 'search'; query.placeholder = 'Filter CVE, vendor or product'; query.maxLength = 100;
  main.append(controls, query);
  const output = element('section', 'list');
  main.append(output);
  const draw = (): void => {
    output.replaceChildren();
    if (!latestKev) { output.append(panel('READING INTELLIGENCE', 'Loading CISA KEV or the private offline cache…')); return; }
    const needle = query.value.trim().toLowerCase();
    const items = latestKev.items.filter(item => !needle || `${item.cveID} ${item.vendorProject} ${item.product} ${item.vulnerabilityName}`.toLowerCase().includes(needle)).slice(0, 40);
    output.append(text('p', `${items.length} shown · ${cacheLabel(latestKev)}`, 'micro'));
    if (latestKev.warning) output.append(text('p', latestKev.warning, 'warning'));
    items.forEach(item => output.append(kevCard(item)));
  };
  query.addEventListener('input', draw);
  draw();
  if (!latestKev) void refreshKev(false).then(draw);
}

async function refreshKev(force: boolean): Promise<void> {
  try { latestKev = await loadKev(force); if (currentPage === 'intel') renderPage(); }
  catch (error) { main.append(panel('INTELLIGENCE UNAVAILABLE', errorMessage(error))); }
}

function kevCard(item: KevItem): HTMLElement {
  const card = element('article', 'card risk');
  const heading = element('div', 'split');
  heading.append(text('strong', item.cveID, 'mono'), chip(item.knownRansomwareCampaignUse === 'Known' ? 'RANSOMWARE' : 'KNOWN EXPLOITED', 'amber'));
  card.append(heading, text('h3', item.vulnerabilityName), text('p', `${item.vendorProject} · ${item.product}`), text('p', `Added ${item.dateAdded} · remediation due ${item.dueDate}`), text('p', item.requiredAction));
  return card;
}

function renderFeeds(): void {
  main.append(hero('RSS / ATOM · DIRECT SOURCES · OFFLINE CACHE', 'Threat & Security Feeds', 'Each source has its own cached reading view. Remote descriptions are rendered as inert text and links open outside the app.'));
  const sourceRow = element('div', 'button-row');
  const output = element('section', 'list');
  let active = FEEDS[0]!;
  const select = (source: typeof FEEDS[number], force = false): void => {
    active = source;
    output.replaceChildren(panel(`LOADING ${source.name.toUpperCase()}`, 'Reading direct source or private offline cache…'));
    void loadFeed(source, force).then(result => drawFeed(result.items, `${source.name} · ${cacheLabel(result)}`, result.warning)).catch(error => output.replaceChildren(panel('FEED UNAVAILABLE', errorMessage(error))));
  };
  FEEDS.forEach(source => sourceRow.append(action(source.name, () => select(source), source === active ? 'primary' : '')));
  sourceRow.append(action('REFRESH', () => select(active, true), 'warn'));
  main.append(sourceRow, output);
  select(active);
  function drawFeed(items: FeedItem[], label: string, warning?: string): void {
    output.replaceChildren(text('p', label, 'micro'));
    if (warning) output.append(text('p', warning, 'warning'));
    items.forEach(item => {
      const card = element('article', 'card');
      card.append(text('span', item.source, 'source'), text('h3', item.title), text('p', item.published || 'Date not supplied'), text('p', item.summary || 'Open the authoritative source to read the full item.'));
      const href = safeHttpUrl(item.link);
      if (href) {
        const link = document.createElement('a'); link.href = href; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.className = 'feed-link'; link.append(card); output.append(link);
      }
    });
  }
}

function renderAi(): void {
  main.append(hero('LOCAL COACH · GOVERNED PAIRING · AI SECURITY', 'Platform Assistant & AI Tool Hub', 'The offline coach is deterministic and private. It guides your reasoning but does not grade competency or claim live threat knowledge.'));
  const coachCard = element('section', 'panel');
  coachCard.append(chip('OFFLINE · ON DEVICE', 'green'), text('h2', 'Prometheus Learning Coach'), text('p', 'Ask about CVE prioritisation, CTI, OT safety, AI architecture, threat modelling, detection or learning outcomes.'));
  const prompt = document.createElement('textarea'); prompt.rows = 4; prompt.maxLength = 1200; prompt.placeholder = 'What are you trying to understand, decide or prove?';
  const answer = element('div', 'terminal'); answer.textContent = 'Coach ready. No prompt or response leaves this device in offline mode.';
  const ask = action('ASK OFFLINE COACH', () => {
    answer.textContent = coach(prompt.value, { completed:labResults().filter(row => row.correct).length, kevCount:latestKev?.items.length ?? 0, online:networkState.connected });
  }, 'primary');
  coachCard.append(prompt, ask, answer);
  main.append(coachCard, sectionTitle('AI SECURITY WORKSPACES'));
  const tools = element('section', 'grid two');
  MODULES.filter(module => module.pathway === 'AI & Convergence').forEach(module => {
    const card = element('article', 'card'); card.append(chip('LOCAL CURRICULUM', 'purple'), text('h3', module.title), text('p', module.objective), text('p', `PROOF · ${module.proof}`)); tools.append(card);
  });
  main.append(tools);
  if (pairingOrigin()) main.append(panel('Paired Platform Assistant', `A main-lab origin is configured at ${pairingOrigin()}. Connected AI remains governed by the platform gateway, its identity controls and its evidence boundary; the mobile app contains no model key or service credential.`));
}

function renderRules(): void {
  main.append(hero('BOUNDED LOCAL TRANSLATION', 'Rule Converter', 'Practise field and intent mapping locally. Output is a teaching draft—not authoritative detection content.'));
  const input = document.createElement('textarea'); input.rows = 11; input.value = "title: Suspicious PowerShell Child\nlogsource:\n  category: process_creation\ndetection:\n  selection:\n    ParentImage: WINWORD.EXE\n    Image: powershell.exe\n  condition: selection";
  const target = document.createElement('select');
  (['splunk','kql','elastic'] as const).forEach(value => { const option = document.createElement('option'); option.value=value; option.textContent=value.toUpperCase(); target.append(option); });
  const output = element('div', 'terminal'); output.textContent = 'Select a target and convert a simple Sigma key/value selection.';
  const run = action('CONVERT TEACHING DRAFT', () => {
    try { const result = convertRule(input.value, target.value as 'splunk'|'kql'|'elastic'); output.textContent = `${result.query}\n\nWARNING: ${result.warning}`; }
    catch (error) { output.textContent = `ERROR: ${errorMessage(error)}`; }
  }, 'primary');
  const card = element('section', 'panel'); card.append(text('h2','Sigma-style input'), input, target, run, output); main.append(card);
}

function renderTerminal(): void {
  main.append(hero('SYNTHETIC EVIDENCE · NO DEVICE SHELL', 'Analyst Terminal', 'Use a safe command interpreter over packaged Zeek, Suricata, EDR and OT-style rows. It cannot access Android/iOS commands, files, processes or the network.'));
  const output = element('div', 'terminal');
  output.textContent = 'PROMETHEUS-OT MOBILE ANALYST WORKSPACE\nEvidence rows: 7 synthetic\nRun help to begin.';
  const promptRow = element('form', 'terminal-prompt');
  promptRow.append(text('span', 'analyst ›'));
  const input = document.createElement('input'); input.className='input mono'; input.autocomplete='off'; input.maxLength=120; input.setAttribute('aria-label','Terminal command'); promptRow.append(input);
  promptRow.addEventListener('submit', event => {
    event.preventDefault(); const command=input.value; if (!command.trim()) return;
    const result=runTerminal(command, TERMINAL_EVENTS);
    output.textContent = result === '__CLEAR__' ? '' : `${output.textContent}\n\nanalyst › ${command}\n${result}`;
    input.value=''; output.scrollTop=output.scrollHeight;
  });
  main.append(output, promptRow, panel('Learning boundary', 'This local workspace teaches evidence navigation and hypothesis formation. Pairing may later offer an authenticated, read-only, networkless main-lab terminal; raw phone shell access is deliberately excluded.'));
}

function renderPortfolio(): void {
  main.append(hero('PRIVATE LOCAL EVIDENCE', 'Learning Portfolio', 'Practice records stay on this device unless you explicitly export them. They are not cryptographically signed held-out evidence.'));
  const results = labResults();
  const stats = element('section','stats'); stats.append(stat('ATTEMPTS', String(results.length), 'Recorded locally'), stat('DEMONSTRATED', String(results.filter(r=>r.correct).length), 'Correct decision + reflection'), stat('SIGNED', '0', 'Requires full platform assessment'), stat('SYNC', 'OFF', 'No automatic upload')); main.append(stats);
  const actions = element('div','button-row'); actions.append(action('EXPORT JSON', exportPortfolio, 'primary'), action('CLEAR LOCAL RECORDS', () => { if (confirm('Delete all local practice records from this device?')) { writeJson('lab-results', []); renderPage(); } }, 'warn')); main.append(actions);
  if (!results.length) { main.append(panel('NO PRACTICE RECORDS YET', 'Complete a lab and record your reasoning to create a local portfolio entry.')); return; }
  results.slice().reverse().forEach(result => {
    const lab=LABS.find(item=>item.id===result.labId); const card=panel(lab?.title ?? result.labId, result.reflection || 'No reflection recorded.');
    card.prepend(chip(result.correct ? 'DEMONSTRATED' : 'REVIEW', result.correct ? 'green' : 'amber'));
    card.append(text('p', new Date(result.completedAt).toLocaleString(), 'micro')); main.append(card);
  });
}

function exportPortfolio(): void {
  const artifact = { schema:'prometheus-ot-mobile-practice/v1', exportedAt:new Date().toISOString(), notice:'Self-recorded practice; not independently assessed or signed.', results:labResults() };
  const blob = new Blob([JSON.stringify(artifact,null,2)], {type:'application/json'}); const url=URL.createObjectURL(blob); const link=document.createElement('a');
  link.href=url; link.download=`prometheus-ot-mobile-portfolio-${new Date().toISOString().slice(0,10)}.json`; link.click(); window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}

function renderHowTo(): void {
  main.append(hero('GUIDED USE · EXPECTED OUTCOME · SAFETY NOTE', 'How To Use Prometheus-OT Mobile', 'Short operational guides for standalone learning, intelligence, AI coaching, analysis, pairing and phone installation.'));
  const list = element('section', 'list');
  GUIDES.forEach((guide, index) => {
    const details = element('details', 'card');
    const summary = document.createElement('summary');
    summary.append(text('span', `${String(index + 1).padStart(2,'0')} · GUIDE`, 'eyebrow'), text('strong', guide.title));
    details.append(summary, text('p', `OUTCOME · ${guide.outcome}`));
    const steps = document.createElement('ol');
    guide.steps.forEach(step => steps.append(text('li', step)));
    details.append(steps);
    if (guide.note) details.append(text('p', `BOUNDARY · ${guide.note}`, 'warning'));
    list.append(details);
  });
  main.append(list);
}

function renderFaq(): void {
  main.append(hero('PLATFORM SCOPE · TRUST · DISTRIBUTION', 'Frequently Asked Questions', 'Direct answers about standalone operation, privacy, AI, network visibility, evidence, Android/iOS installation and public distribution.'));
  const filter = document.createElement('input');
  filter.className = 'input mono'; filter.type = 'search'; filter.maxLength = 100; filter.placeholder = 'FILTER FAQ';
  const list = element('section', 'list');
  const draw = (): void => {
    const needle = filter.value.trim().toLowerCase(); list.replaceChildren();
    FAQS.filter(item => !needle || `${item.question} ${item.answer} ${item.tags.join(' ')}`.toLowerCase().includes(needle)).forEach(item => {
      const details = element('details', 'card'); const summary = document.createElement('summary'); summary.append(text('strong', item.question)); details.append(summary, text('p', item.answer)); list.append(details);
    });
    if (!list.childElementCount) list.append(panel('NO FAQ MATCH', 'Try offline, pairing, AI, CVE, terminal, privacy, Android or iOS.'));
  };
  filter.addEventListener('input', draw); draw(); main.append(filter, list);
}

function renderSettings(): void {
  main.append(hero('STANDALONE BY DEFAULT', 'Settings & Main-Lab Pairing', 'The public app ships without an endpoint, credential, API key or private address. Pairing is explicit and optional.'));
  const card=element('section','panel'); card.append(text('h2','Prometheus-OT origin'), text('p','Use HTTPS for remote/Wi-Fi pairing. HTTP is accepted only for localhost USB development.'));
  const input=document.createElement('input'); input.className='input mono'; input.placeholder='https://prometheus.example'; input.value=pairingOrigin(); input.autocapitalize='none'; input.spellcheck=false;
  const feedback=text('p','No automatic discovery or upload.');
  const save=action('SAVE ORIGIN',()=>{ try { const origin=normalisePairOrigin(input.value); writeJson('pair-origin',origin); feedback.textContent=origin ? `Saved ${origin}` : 'Pairing cleared; standalone mode active.'; feedback.className='success'; } catch(error) { feedback.textContent=errorMessage(error); feedback.className='danger'; } },'primary');
  const clear=action('CLEAR',()=>{ input.value=''; writeJson('pair-origin',''); feedback.textContent='Pairing cleared; standalone mode active.'; },'warn');
  card.append(input, elementWithChildren('div',[save,clear],'button-row'), feedback); main.append(card);
  main.append(panel('Privacy posture','Local lab answers, feed caches and coach prompts remain in app storage. The app requests network access only for direct public feeds and an origin you configure. It does not request contacts, location, camera, microphone, SMS, accessibility, VPN or device-administrator privileges.'));
  main.append(panel('Cross-platform boundary','Android and iOS share this learning core. Platform-specific AI accelerators may be added as optional adapters; no learning outcome depends on a particular phone vendor or model.'));
}

function renderSearch(query: string): void {
  const needle=query.trim().toLowerCase(); currentPage='control';
  nav.querySelectorAll('button').forEach(item=>item.removeAttribute('aria-current')); main.replaceChildren(hero('GLOBAL NAVIGATION', 'Search', needle ? `Results for “${query.trim()}”` : 'Enter a term to search labs, learning, AI, feeds and tools.'));
  if (!needle) return;
  const results:Array<{title:string;detail:string;page:PageId;tags:string}>=[];
  LABS.forEach(item=>results.push({title:item.title,detail:item.outcome,page:'labs',tags:item.tags.join(' ')}));
  MODULES.forEach(item=>results.push({title:item.title,detail:item.objective,page:item.pathway==='AI & Convergence'?'ai':'learn',tags:item.tags.join(' ')}));
  FEEDS.forEach(item=>results.push({title:item.name,detail:item.authority,page:'feeds',tags:'rss feed news intelligence'}));
  results.push({title:'CVE & KEV Intelligence',detail:'CISA exploitation evidence and prioritisation',page:'intel',tags:'cve vulnerability kev'}, {title:'Analyst Terminal',detail:'Synthetic Zeek, Suricata, EDR and OT evidence',page:'terminal',tags:'query hunt shell logs'}, {title:'Rule Converter',detail:'Bounded Sigma teaching translation',page:'rules',tags:'sigma splunk kql elastic'}, {title:'Living Engine',detail:'Evidence-labelled device, intelligence and learning observations',page:'observe',tags:'risk network global observation'});
  GUIDES.forEach(item=>results.push({title:`How To: ${item.title}`,detail:item.outcome,page:'howto',tags:item.tags.join(' ')}));
  FAQS.forEach(item=>results.push({title:item.question,detail:item.answer,page:'faq',tags:item.tags.join(' ')}));
  const matched=results.filter(row=>`${row.title} ${row.detail} ${row.tags}`.toLowerCase().includes(needle));
  if (!matched.length) main.append(panel('NO MATCHES','Try CVE, CTI, OT, AI, prompt injection, Sigma, terminal or feeds.'));
  matched.forEach(row=>{ const item=element('button','list-item'); item.type='button'; item.append(text('strong',row.title),text('small',row.detail)); item.addEventListener('click',()=>navigate(row.page)); main.append(item); });
}

function pairingOrigin(): string { return readJson<string>('pair-origin',''); }
function cacheLabel(result:{cached:boolean;fetchedAt:string}):string { return `${result.cached?'offline cache':'live source'} · ${new Date(result.fetchedAt).toLocaleString()}`; }
function hero(kicker:string,titleValue:string,detail:string,actions:HTMLElement[]=[]):HTMLElement { const node=element('section','hero'); node.append(text('span',kicker,'eyebrow'),text('h1',titleValue),text('p',detail)); if(actions.length) node.append(elementWithChildren('div',actions,'hero-actions')); return node; }
function stat(label:string,value:string,detail:string):HTMLElement { const node=element('article','stat'); node.append(text('span',label,'micro'),text('strong',value,'value'),text('p',detail)); return node; }
function panel(titleValue:string,detail:string):HTMLElement { const node=element('section','panel'); node.append(text('h3',titleValue),text('p',detail)); return node; }
function sectionTitle(value:string):HTMLElement { return text('h2',value,'section-title'); }
function chip(value:string,variant=''):HTMLElement { return text('span',value,`chip ${variant}`.trim()); }
function action(label:string,handler:()=>void,variant=''):HTMLButtonElement { const node=button(label,`btn ${variant}`.trim()); node.addEventListener('click',handler); return node; }
function button(label:string,className=''):HTMLButtonElement { const node=document.createElement('button'); node.type='button'; node.className=className; node.textContent=label; return node; }
function text<K extends keyof HTMLElementTagNameMap>(tag:K,value:string,className=''):HTMLElementTagNameMap[K] { const node=document.createElement(tag); node.className=className; node.textContent=value; return node; }
function element<K extends keyof HTMLElementTagNameMap>(tag:K,className=''):HTMLElementTagNameMap[K] { const node=document.createElement(tag); node.className=className; return node; }
function elementWithChildren<K extends keyof HTMLElementTagNameMap>(tag:K,children:HTMLElement[],className=''):HTMLElementTagNameMap[K] { const node=element(tag,className); node.append(...children); return node; }
