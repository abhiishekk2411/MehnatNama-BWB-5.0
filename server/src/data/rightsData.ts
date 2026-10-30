export interface RightsGuide {
  id: string;
  category: string;
  categoryHindi: string;
  title: string;
  titleHindi: string;
  summary: string;
  summaryHindi: string;
  keyPoints: string[];
  keyPointsHindi: string[];
  officialReference: string;
  officialSourceUrl: string;
  lastReviewedDate: string;
}

export interface EscalationResource {
  id: string;
  stepNumber: number;
  title: string;
  titleHindi: string;
  description: string;
  descriptionHindi: string;
  authorityName: string;
  contactDetails: {
    helpline?: string;
    portalUrl?: string;
    address?: string;
  };
  officialSourceUrl: string;
  actionGuidance: string;
  actionGuidanceHindi: string;
}

export const RIGHTS_GUIDES: RightsGuide[] = [
  {
    id: 'guide-min-wage',
    category: 'MINIMUM_WAGE',
    categoryHindi: 'न्यूनतम मजदूरी अधिकार',
    title: 'Statutory Right to Minimum Wage (Section 12, Minimum Wages Act 1948)',
    titleHindi: 'न्यूनतम मजदूरी का कानूनी अधिकार (धारा 12, न्यूनतम मजदूरी अधिनियम 1948)',
    summary:
      'Every employer/contractor is legally obligated to pay not less than the statutory minimum rate of wages fixed by the state government or central sphere for the scheduled employment, regardless of any oral contract.',
    summaryHindi:
      'प्रत्येक ठेकेदार अथवा मालिक के लिए राज्य सरकार द्वारा अधिसूचित न्यूनतम मजदूरी दर से कम भुगतान करना कानूनन जुर्म है। कोई भी मौखिक समझौता न्यूनतम मजदूरी से कम नहीं हो सकता।',
    keyPoints: [
      'Applies to all scheduled informal employments including construction, agriculture, stone breaking, and brick kilns.',
      'Wages include Basic Rate plus Variable Dearness Allowance (VDA) revised semi-annually based on Consumer Price Index.',
      'Contractor cannot deduct any arbitrary penalty from minimum wage.',
    ],
    keyPointsHindi: [
      'निर्माण कार्य, कृषि, ईंट भट्टा और अन्य सभी असंगठित कार्यों पर लागू होता है।',
      'मूल वेतन के साथ महंगाई भत्ता (VDA) भी शामिल होता है जिसे सरकार समय-समय पर बढ़ाती है।',
      'ठेकेदार बिना रसीद या सहमति के कोई भी गैरकानूनी कटौती नहीं कर सकता।',
    ],
    officialReference: 'The Minimum Wages Act, 1948 (Act No. 11 of 1948) / Code on Wages 2019',
    officialSourceUrl: 'https://labour.gov.in/sites/default/files/TheMinimumWagesAct1948.pdf',
    lastReviewedDate: '2026-10-01',
  },
  {
    id: 'guide-wage-payment-cycle',
    category: 'WAGE_PAYMENT',
    categoryHindi: 'मजदूरी भुगतान समय सीमा',
    title: 'Timely Payment and Wage Period (Payment of Wages Act 1936)',
    titleHindi: 'समय पर मजदूरी पाने का अधिकार (वेतन भुगतान अधिनियम 1936)',
    summary:
      'Wages must be paid in current currency notes or direct digital transfer. The wage period cannot exceed one month, and wages must be settled within 7 to 10 days following the wage period.',
    summaryHindi:
      'मजदूरी का भुगतान कानूनी मुद्रा या सीधे डिजिटल/बैंक खाते में होना अनिवार्य है। मजदूरी तय तारीख के बाद 7 से 10 दिनों के भीतर चुकाई जानी चाहिए।',
    keyPoints: [
      'Daily wage workers must be settled daily or at the close of the agreed weekly period (usually Saturday/Sunday).',
      'Upon termination or leaving work, all accumulated wages must be cleared within 2 working days.',
    ],
    keyPointsHindi: [
      'दैनिक मजदूरों को हफ्ते के अंत में पूरी मजदूरी का भुगतान अनिवार्य है।',
      'काम छूटने या समाप्त होने पर दो कार्य दिवसों के भीतर पूरा बकाया चुकाना ठेकेदार का दायित्व है।',
    ],
    officialReference: 'Payment of Wages Act, 1936, Section 4 & 5',
    officialSourceUrl: 'https://clc.gov.in/clc/acts-rules/payment-wages-act-1936',
    lastReviewedDate: '2026-10-01',
  },
  {
    id: 'guide-documentation-ledger',
    category: 'DOCUMENTATION',
    categoryHindi: 'दस्तावेजी सबूत व डायरी',
    title: 'Importance of Maintaining Work Records and Receipts',
    titleHindi: 'हाजिरी व खर्चे का रिकॉर्ड रखने का महत्व',
    summary:
      'In informal labour disputes, a contemporaneous written or digital wage diary maintained daily with contractor details serves as credible primary supporting evidence before Labour Conciliation Officers.',
    summaryHindi:
      'असंगठित क्षेत्र में मौखिक दावों के मुकाबले हर दिन तारीखवार दर्ज की गई डिजिटल डायरी और व्हाट्सएप संदेश श्रम विभाग के समक्ष प्राथमिक साक्ष्य के रूप में अत्यधिक उपयोगी होते हैं।',
    keyPoints: [
      'Record work date, site name, and agreed rate on the same day work is performed.',
      'Record all cash advances ("kharcha") immediately with purpose to prevent false deductions later.',
      'Request link-based contractor verification periodically (weekly or fortnightly).',
    ],
    keyPointsHindi: [
      'हर दिन काम पूरा होते ही तारीख और दिहाड़ी फोन में दर्ज करें।',
      'दुकान, राशन या दवाई के लिए लिए गए खर्चे (पेशगी) को तुरंत दर्ज करें।',
      'समय-समय पर ठेकेदार को लिंक भेजकर हाजिरी की पुष्टि कराएं।',
    ],
    officialReference: 'Contract Labour (Regulation & Abolition) Act, 1970 — Register of Wages Rule 75',
    officialSourceUrl: 'https://clc.gov.in/clc/acts-rules/contract-labour-regulation-and-abolition-act-1970',
    lastReviewedDate: '2026-10-01',
  },
  {
    id: 'guide-dispute-resolution',
    category: 'DISPUTE_RESOLUTION',
    categoryHindi: 'विवाद समाधान व बातचीत',
    title: 'Constructive Communication and Disagreement Handling',
    titleHindi: 'ठेकेदार से बातचीत और मतभेद सुलझाना',
    summary:
      'Clear, calm, and evidence-backed communication with the contractor resolves most payment misunderstandings before needing formal administrative escalations.',
    summaryHindi:
      'ठेकेदार से विवाद होने पर शांत रहकर अपनी डायरी का हिसाब (PDF या WhatsApp सारांश) दिखाना सबसे असरदार तरीका है।',
    keyPoints: [
      'Share a neutral MehnatNama PDF statement rather than verbal accusations.',
      'Separate agreed daily wage rates from cash advances received.',
      'If the contractor disputes a specific day, note their reason and verify against site logs.',
    ],
    keyPointsHindi: [
      'बिना झगड़ा किए मेहनतनामा पर्चा साझा करें जिसमें कुल दिन और खर्चे स्पष्ट हों।',
      'यदि ठेकेदार किसी दिन की हाजिरी पर आपत्ति करे तो कारण पूछकर दर्ज करें।',
    ],
    officialReference: 'Industrial Relations Code 2020 — Grievance Redressal Mechanisms',
    officialSourceUrl: 'https://labour.gov.in/labour-codes',
    lastReviewedDate: '2026-10-01',
  },
];

export const ESCALATION_RESOURCES: EscalationResource[] = [
  {
    id: 'step-1-review',
    stepNumber: 1,
    title: 'Review Your Work and Payment Entries',
    titleHindi: 'चरण 1: अपने काम और भुगतान के रिकॉर्ड की जांच करें',
    description:
      'Double check all logged workdays, advance amounts, and wage calculations in your MehnatNama diary to ensure no dates were missed or incorrectly entered.',
    descriptionHindi:
      'सबसे पहले अपनी मेहनतनामा डायरी में सभी दिन, दिहाड़ी और लिए गए खर्चे (पेशगी) की जांच कर लें ताकि कोई गलती न हो।',
    authorityName: 'Self-Verification / व्यक्तिगत जांच',
    contactDetails: {},
    officialSourceUrl: 'https://mehnatnama.in',
    actionGuidance:
      'Generate a Work and Dues PDF statement from My Reports to verify total days and net outstanding dues.',
    actionGuidanceHindi: 'माई रिपोर्ट्स से हिसाब पर्चा (PDF) तैयार करें और कुल बकाया रकम देख लें।',
  },
  {
    id: 'step-2-contractor-dialogue',
    stepNumber: 2,
    title: 'Constructive Dialogue with Contractor via MehnatNama Summary',
    titleHindi: 'चरण 2: ठेकेदार को हिसाब पर्चा भेजकर बातचीत करें',
    description:
      'Send a WhatsApp confirmation link or PDF summary to the contractor. Polite, clear, and documentation-backed communication settles over 80% of wage delays amicably.',
    descriptionHindi:
      'ठेकेदार को व्हाट्सएप पर पुष्टिकरण लिंक या पीडीएफ पर्चा भेजें और शांतिपूर्वक हिसाब मिलाने का आग्रह करें।',
    authorityName: 'Direct Negotiation / आपसी बातचीत',
    contactDetails: {},
    officialSourceUrl: 'https://mehnatnama.in',
    actionGuidance:
      'Use the 1-click WhatsApp share button to share the confirmation link. Give 3-5 days for response.',
    actionGuidanceHindi: 'व्हाट्सएप शेयर बटन से लिंक भेजें और 3-5 दिन का समय दें।',
  },
  {
    id: 'step-3-organize-evidence',
    stepNumber: 3,
    title: 'Organise Supporting Records and Worksite Evidence',
    titleHindi: 'चरण 3: कार्यस्थल के प्रमाण और गवाहों के नाम एकत्र करें',
    description:
      'Collect site photos, witness co-workers contact details, contractor phone records, and UPI payment transaction IDs.',
    descriptionHindi:
      'काम करने की जगह की तस्वीर, साथी कामगारों के फोन नंबर और ऑनलाइन मिले भुगतान के यूपीआई स्क्रीनशॉट सुरक्षित रखें।',
    authorityName: 'Evidence Preparation / साक्ष्य संग्रह',
    contactDetails: {},
    officialSourceUrl: 'https://labour.gov.in',
    actionGuidance:
      'Keep co-worker contacts who worked on the same site on those dates for witness corroboration.',
    actionGuidanceHindi: 'साथ में काम करने वाले 2-3 साथियों के नंबर संभाल कर रखें।',
  },
  {
    id: 'step-4-national-helpline',
    stepNumber: 4,
    title: 'Contact the National Shramik Helpline (14434)',
    titleHindi: 'चरण 4: राष्ट्रीय श्रमिक हेल्पलाइन (14434) पर संपर्क करें',
    description:
      'Ministry of Labour and Employment Government of India operates a free 24x7 toll-free multilingual grievance assistance helpline.',
    descriptionHindi:
      'भारत सरकार के श्रम एवं रोजगार मंत्रालय द्वारा संचालित राष्ट्रीय टोल-फ्री हेल्पलाइन पर मुफ्त परामर्श लें।',
    authorityName: 'Ministry of Labour & Employment, Govt of India',
    contactDetails: {
      helpline: '14434 (Toll-Free, Multilingual)',
      portalUrl: 'https://samadhan.labour.gov.in',
    },
    officialSourceUrl: 'https://labour.gov.in/helpline-numbers',
    actionGuidance:
      'Call 14434 from your registered mobile phone. Explain that you have a recorded wage diary of unpaid dues.',
    actionGuidanceHindi: '14434 पर कॉल करें और बताएं कि आपके पास काम की तारीखवार डिजिटल डायरी मौजूद है।',
  },
  {
    id: 'step-5-dlc-legal-aid',
    stepNumber: 5,
    title: 'Approach District Labour Commissioner or NALSA Free Legal Aid',
    titleHindi: 'चरण 5: जिला श्रम अधिकारी (DLC) या मुफ्त विधिक सेवा (NALSA)',
    description:
      'Under the Minimum Wages Act (Section 20), a claim can be presented to the Labour Commissioner Authority within 6 months. NALSA provides free legal advocates for informal workers.',
    descriptionHindi:
      'यदि ठेकेदार भुगतान से इंकार करता है, तो जिला श्रम कार्यालय में उप-श्रमायुक्त के समक्ष दावा दर्ज किया जा सकता है। NALSA असंगठित कामगारों को मुफ्त सरकारी वकील उपलब्ध कराता है।',
    authorityName: 'National Legal Services Authority (NALSA) / District Labour Office',
    contactDetails: {
      helpline: '15100 (NALSA Toll-Free Legal Aid)',
      portalUrl: 'https://nalsa.gov.in',
    },
    officialSourceUrl: 'https://nalsa.gov.in/legal-services/legal-aid',
    actionGuidance:
      'Dial 15100 for free legal advice or visit your nearest District Court Legal Services Authority (DLSA).',
    actionGuidanceHindi: 'मुफ्त कानूनी सलाह के लिए 15100 डायल करें अथवा जिला विधिक सेवा प्राधिकरण में संपर्क करें।',
  },
];
