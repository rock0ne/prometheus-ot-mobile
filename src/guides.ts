export interface Guide {
  id: string;
  title: string;
  outcome: string;
  steps: string[];
  note?: string;
  tags: string[];
}

export interface Faq {
  question: string;
  answer: string;
  tags: string[];
}

export const GUIDES: Guide[] = [
  {
    id:'start', title:'Start in standalone mode', outcome:'Use the complete local learning lab without a PC or main platform.',
    steps:['Open Control and confirm LOCAL LAB READY.','Choose Labs for assessed practice or Learn for outcome-led modules.','Use Observe, Intel and Feeds when network or cached intelligence is available.','Review Portfolio to see locally recorded practice evidence.'],
    note:'No account, pairing origin or AI service key is required for standalone learning.', tags:['start','offline','standalone']
  },
  {
    id:'labs', title:'Complete a lab and record evidence', outcome:'Demonstrate a decision from evidence rather than merely viewing content.',
    steps:['Open Labs and select a role-based scenario.','Read each numbered evidence item before choosing an action.','Record which evidence changed your decision, an alternative and remaining uncertainty.','Submit, review the rationale, then revisit the outcome in Portfolio.'],
    note:'Local practice is self-recorded. Independently assessed and signed evidence requires the full Prometheus-OT assessment engine.', tags:['lab','evidence','portfolio','outcome']
  },
  {
    id:'intel', title:'Use CVE and RSS intelligence', outcome:'Use current or cached sources without confusing global reporting with local exposure.',
    steps:['Open Intel and refresh the direct CISA KEV feed.','Filter by CVE, vendor or product.','Validate asset presence, version, reachability and consequence before setting priority.','Open Feeds to read NCSC, CISA, NIST and independent reporting; remote articles open outside the app.'],
    note:'A CVE or KEV entry is evidence of a known issue or exploitation, not proof that this phone or your environment is vulnerable.', tags:['cve','kev','rss','feed']
  },
  {
    id:'assistant', title:'Use the Platform Learning Coach', outcome:'Structure an investigation or learning decision without outsourcing judgement.',
    steps:['Open AI and state what you need to understand, decide or prove.','Include the asset, evidence and consequence you are considering.','Use the response to form a hypothesis, alternative and proof plan.','Verify consequential claims against authoritative evidence.'],
    note:'Offline Coach is deterministic and private. It does not send prompts away, grade competency or claim live threat knowledge.', tags:['ai','assistant','coach','offline']
  },
  {
    id:'observe', title:'Interpret the Living Engine', outcome:'Combine device transport, intelligence freshness and learning progress without false precision.',
    steps:['Open Observe and read each evidence-labelled observation.','Separate what the phone observed from what is inferred.','Follow the safe next action rather than treating the page as a risk score.','Refresh intelligence only over a connection you trust.'],
    note:'The app does not scan nearby devices, capture packets or inspect other apps.', tags:['living engine','observe','network','risk']
  },
  {
    id:'rules', title:'Practise detection-rule conversion', outcome:'Understand field mapping and query intent across common detection languages.',
    steps:['Open Rules and enter a simple Sigma-style selection.','Choose Splunk, KQL or Elastic.','Inspect the teaching translation and identify required telemetry.','Validate escaping, field names, positives and false positives in a real target before operational use.'],
    note:'The local converter is intentionally bounded and cannot publish or execute a rule.', tags:['rule','sigma','splunk','kql','elastic']
  },
  {
    id:'terminal', title:'Work in the Analyst Terminal', outcome:'Develop evidence navigation and hunting logic in a safe phone workspace.',
    steps:['Open Terminal and run help.','Use events, count, top, timeline and hunt commands.','Cite the rows that support your hypothesis and identify contradictory evidence.','Use show with a row number to inspect a complete synthetic record.'],
    note:'This is not an Android or iOS shell. It cannot access phone files, processes, applications or arbitrary network commands.', tags:['terminal','analyst','hunt','zeek','suricata']
  },
  {
    id:'pair', title:'Pair with the main Prometheus-OT lab', outcome:'Add main-lab capabilities without making the mobile app dependent on them.',
    steps:['In Settings, enter the HTTPS origin of a Prometheus-OT gateway you control.','For local USB development only, use adb reverse and a 127.0.0.1 HTTP origin.','Authenticate only through the main platform’s branded gateway.','Clear the origin to return immediately to standalone mode.'],
    note:'The app contains no platform credential. Full authenticated mobile pairing requires a server-supported mobile session flow; never paste a service token into the app.', tags:['pair','main lab','https','usb','adb']
  },
  {
    id:'android-transfer', title:'Install on another Android phone', outcome:'Transfer a verified APK without exposing project secrets.',
    steps:['Enable Developer options and USB debugging on the target test phone.','Connect the phone and approve its USB debugging fingerprint.','Run adb devices, then adb install -r followed by the verified APK path.','For wider distribution, create a signed release through the GitHub Android workflow or an app store.'],
    note:'Debug APKs are for controlled testing. Public distribution should use a release key held outside the repository.', tags:['android','apk','install','transfer','adb']
  },
  {
    id:'ios-install', title:'Build and install on iPhone or iPad', outcome:'Produce an Apple-signed build from the same shared application.',
    steps:['Check out the public repository on macOS with current Xcode.','Install dependencies, build the web core, and run capacitor sync ios.','Open ios/App/App.xcodeproj, select your Apple development team and a unique bundle identifier if required.','Run on a connected device or archive for TestFlight/App Store distribution.'],
    note:'Apple requires Xcode and code signing. A Windows PC can generate and test the shared code but cannot create a trustworthy signed iOS binary.', tags:['ios','iphone','ipad','xcode','testflight']
  }
];

export const FAQS: Faq[] = [
  { question:'Does the app work without Prometheus-OT on a PC?', answer:'Yes. Labs, learning paths, the offline coach, Living Engine, cached CVE/RSS intelligence, rule practice, analyst terminal, search and local portfolio are standalone. Pairing adds governed main-lab services but is optional.', tags:['offline','standalone','pairing'] },
  { question:'Is this the same as running Security Onion or Splunk on the phone?', answer:'No. The app teaches analysis and can optionally connect to real main-lab services. It does not pretend that service-heavy SIEM, SOAR, packet-capture or HMI infrastructure is running locally.', tags:['security onion','splunk','soar'] },
  { question:'Does the app scan my phone or network?', answer:'No. It observes basic connection availability and type. It does not capture packets, enumerate nearby devices, inspect other apps, read contacts or messages, or claim that a device is vulnerable.', tags:['privacy','network','scan'] },
  { question:'Is the Platform Assistant sending prompts online?', answer:'The packaged Offline Coach does not. Future paired or platform-specific AI providers must be explicitly selected and clearly labelled; their requests are governed by their own disclosed boundary.', tags:['ai','assistant','privacy'] },
  { question:'Can AI complete or pass a lab for me?', answer:'No. AI may coach reasoning, but the learner must make the decision and record evidence. Local practice is not independent certification; signed held-out evidence belongs to the main assessment workflow.', tags:['ai','assessment','evidence'] },
  { question:'Are CVE and KEV records proof that I am affected?', answer:'No. They are global intelligence. Validate product and version presence, exposure, exploitability, consequence and controls in the actual environment before asserting risk.', tags:['cve','kev','vulnerability'] },
  { question:'Can Terminal run Linux, Android or iOS commands?', answer:'No. It is a deliberately bounded interpreter over embedded synthetic security events. Unknown commands are rejected and it has no general phone shell.', tags:['terminal','shell','security'] },
  { question:'Why does iOS require a Mac if the app supports both platforms?', answer:'The shared application and iOS project are cross-platform, but Apple’s final compile, simulator/device validation and code signing require Xcode on macOS. CI provides that gate without changing the shared code.', tags:['ios','mac','xcode'] },
  { question:'How are updates transferred to other phones?', answer:'Android testers can install a verified APK with adb or a managed distribution link. iOS testers use an Xcode development build or TestFlight. Store releases should be signed in CI using secrets that are never committed.', tags:['update','android','ios','testflight'] },
  { question:'Does the public repository contain private lab data or secrets?', answer:'It is designed not to. The public repository contains the mobile client, synthetic documentation ranges and public feed URLs only. CI runs secret and private-endpoint checks; signing keys and service credentials remain external.', tags:['github','secret','public'] }
];
