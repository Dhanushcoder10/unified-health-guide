export type Language = "en" | "te";

export type JourneyEvent = {
  id: string;
  date: string;
  shortDate: string;
  type: "visit" | "test" | "result" | "prescription" | "followup";
  title: string;
  doctor?: string;
  record?: string;
  detail: string;
  extracted: string[];
  connection: string;
};

export type Medication = {
  id: string;
  name: string;
  dose: string;
  schedule: string;
  remaining: number;
  takenAt?: string;
};

export type ChatMessage = { id: string; role: "user" | "assistant"; text: string; sources?: string[]; localizedText?: Partial<Record<Language, string>> };
export type ChatThread = { id: string; title: string; updatedAt: number; messages: ChatMessage[] };

export const journeyEvents: JourneyEvent[] = [
  {
    id: "blood-test-aug",
    date: "12 August 2026",
    shortDate: "12 AUG",
    type: "test",
    title: "Blood test",
    record: "Complete Blood Count · 12 Aug",
    detail: "A routine blood panel was completed after ongoing tiredness was discussed.",
    extracted: ["Haemoglobin 10.8 g/dL", "Vitamin D 16 ng/mL", "Glucose 96 mg/dL"],
    connection: "The low haemoglobin and vitamin D results led to a doctor review.",
  },
  {
    id: "doctor-visit-aug",
    date: "18 August 2026",
    shortDate: "18 AUG",
    type: "visit",
    title: "Doctor visit",
    doctor: "Dr. Kiran Reddy",
    record: "Consultation note · 18 Aug",
    detail: "Reviewed tiredness and the blood test results. No emergency symptoms were recorded.",
    extracted: ["Discussed iron-rich diet", "Repeat labs in four weeks", "Review response to supplements"],
    connection: "The visit resulted in two prescribed supplements and a follow-up test.",
  },
  {
    id: "prescription-aug",
    date: "20 August 2026",
    shortDate: "20 AUG",
    type: "prescription",
    title: "Prescription",
    doctor: "Dr. Kiran Reddy",
    record: "Prescription · 20 Aug",
    detail: "Two supplements were prescribed after the consultation.",
    extracted: ["Ferrous Ascorbate · once daily after breakfast", "Cholecalciferol · once weekly"],
    connection: "The next test checks whether the measured values changed after treatment.",
  },
  {
    id: "followup-sep",
    date: "15 September 2026",
    shortDate: "15 SEP",
    type: "followup",
    title: "Follow-up test",
    record: "Follow-up Blood Report · 15 Sep",
    detail: "Repeat blood work shows improvement in two tracked values.",
    extracted: ["Haemoglobin 11.6 g/dL", "Vitamin D 24 ng/mL", "Glucose 94 mg/dL"],
    connection: "The improved values will be reviewed at the upcoming appointment.",
  },
  {
    id: "review-oct",
    date: "14 October 2026",
    shortDate: "14 OCT",
    type: "visit",
    title: "Upcoming review",
    doctor: "Dr. Kiran Reddy",
    detail: "Review progress, current medicines and the latest blood report.",
    extracted: ["Appointment at 10:30 AM", "Bring latest report", "Discuss continuing supplements"],
    connection: "This closes the current follow-up cycle and sets the next plan with your doctor.",
  },
];

export const initialMedications: Medication[] = [
  { id: "ferrous", name: "Ferrous Ascorbate", dose: "100 mg", schedule: "Daily · after breakfast", remaining: 18 },
  { id: "vitamin-d", name: "Cholecalciferol", dose: "60,000 IU", schedule: "Every Sunday", remaining: 5 },
];

export const records = [
  { id: "sep-report", name: "Follow-up Blood Report", date: "15 Sep 2026", type: "Lab report", summary: "Haemoglobin and vitamin D improved; glucose remained stable.", critical: false },
  { id: "aug-prescription", name: "Prescription", date: "20 Aug 2026", type: "Prescription", summary: "Ferrous Ascorbate daily and Cholecalciferol weekly were prescribed.", critical: false },
  { id: "aug-consult", name: "Consultation Note", date: "18 Aug 2026", type: "Visit note", summary: "Repeat labs in four weeks and review supplement response.", critical: false },
  { id: "aug-report", name: "Complete Blood Count", date: "12 Aug 2026", type: "Lab report", summary: "Haemoglobin and vitamin D were below the report reference range.", critical: false },
];

export const compareRows = [
  { label: "Haemoglobin", before: "10.8 g/dL", after: "11.6 g/dL", note: "Moved upward toward the report reference range" },
  { label: "Vitamin D", before: "16 ng/mL", after: "24 ng/mL", note: "Improved, but still worth reviewing with your doctor" },
  { label: "Glucose", before: "96 mg/dL", after: "94 mg/dL", note: "Remained stable between these reports" },
];

export const translations = {
  en: {
    dashboard: "Dashboard", journey: "Health Journey", records: "Medical Records", copilot: "AI Copilot",
    medications: "Medications", appointments: "Appointments", insights: "Insights", profile: "Profile", settings: "Settings",
    greeting: "Hello", hero: "Your Health, Connected.",
    subtitle: "HealthPilot brings your scattered medical information together so you can understand what changed, what matters, and what to discuss next.",
    upload: "Upload medical record", ask: "Ask AI Copilot", connect: "Connect device",
  },
  te: {
    dashboard: "డాష్‌బోర్డ్", journey: "ఆరోగ్య ప్రయాణం", records: "వైద్య రికార్డులు", copilot: "AI సహాయకుడు",
    medications: "మందులు", appointments: "అపాయింట్‌మెంట్లు", insights: "అవగాహనలు", profile: "ప్రొఫైల్", settings: "సెట్టింగులు",
    greeting: "నమస్కారం", hero: "మీ ఆరోగ్యం, అనుసంధానించబడింది.",
    subtitle: "ఏం మారింది, ఏది ముఖ్యం, వైద్యుడితో ఏం మాట్లాడాలో అర్థం చేసుకునేందుకు HealthPilot మీ వైద్య సమాచారాన్ని ఒకచోట చేర్చుతుంది.",
    upload: "వైద్య రికార్డు అప్‌లోడ్", ask: "AI సహాయకుడిని అడగండి", connect: "పరికరాన్ని కలపండి",
  },
};

export function answerHealthQuestion(input: string, language: Language, patientName = "there", doctorName = "your doctor"): { text: string; sources: string[] } {
  const q = input.toLowerCase().replace(/హీమోగ్లోబిన్|రక్తహీనత|ఐరన్/g, " haemoglobin ").replace(/విటమిన్ డి|విటమిన్ డీ|విటమిన్ D/g, " vitamin d ").replace(/గ్లూకోజ్|చక్కెర|మధుమేహం/g, " glucose ").replace(/అలర్జీ/g, " allergy ").replace(/రక్త వర్గం|రక్త గ్రూపు/g, " blood group ").replace(/అపాయింట్‌మెంట్|తదుపరి సందర్శన/g, " appointment ").replace(/అలసట/g, " tired ").replace(/జాగ్రత్త|తగ్గించ|ఆహారం/g, " precaution ").replace(/వ్యాయామ|విశ్రాంతి|ఒత్తిడి|నిద్ర/g, " relax ").replace(/అత్యవసర|అంబులెన్స్/g, " emergency ").replace(/వైద్యు|డాక్టర్|ప్రశ్న/g, " doctor ");
  const telugu = language === "te";
  if (/^(hi|hello|hey|namaste|హాయ్|నమస్కారం)/i.test(input.trim())) {
    return { text: telugu ? `నమస్కారం ${patientName}. మీ రికార్డులు, మందులు లేదా తదుపరి వైద్య సందర్శన గురించి ఏం తెలుసుకోవాలనుకుంటున్నారు?` : `Hello ${patientName}. I can help you understand your records, medicines, changes, precautions, or prepare for your next visit. What would you like to know?`, sources: [] };
  }
  const en = (text: string, sources: string[] = []) => ({ text, sources });
  if (/thank|thanks|ధన్యవాద/.test(q)) return en(telugu ? "మీకు స్వాగతం! ఇంకేమైనా అడగండి." : `You're welcome, ${patientName}. Ask me anything else about your records whenever you need.`);
  if (/haemoglobin|hemoglobin|\bhb\b|anaemia|anemia|iron/.test(q)) return en(telugu ? "హీమోగ్లోబిన్ 12 ఆగస్టున 10.8 g/dL, 15 సెప్టెంబర్‌న 11.6 g/dL. ఐరన్ సప్లిమెంట్ సూచించబడింది. ఆకుకూరలు, పప్పులు, బెల్లం, విటమిన్ C ఉన్న పండ్లు సహాయపడతాయి; భోజనంతో టీ/కాఫీ తగ్గించండి." : "Your haemoglobin rose from **10.8 g/dL (12 Aug)** to **11.6 g/dL (15 Sep)** after starting Ferrous Ascorbate. To support it: eat iron-rich foods (leafy greens, lentils, dates, jaggery), pair them with vitamin C (citrus, amla), avoid tea or coffee within an hour of meals or the iron tablet, and keep your repeat test. Report breathlessness, palpitations or fainting promptly.", ["Complete Blood Count · 12 Aug", "Follow-up Blood Report · 15 Sep", "Prescription · 20 Aug"]);
  if (/vitamin d|vit d|sun|bone/.test(q)) return en(telugu ? "విటమిన్ D 16 నుండి 24 ng/mLకి పెరిగింది. ప్రతి ఆదివారం కొలెకాల్సిఫెరాల్ 60,000 IU కొనసాగించండి, ఉదయం 15–20 నిమిషాలు ఎండలో ఉండండి." : "Your vitamin D improved from **16 to 24 ng/mL**, but it is still below the commonly used sufficient range. Keep taking **Cholecalciferol 60,000 IU every Sunday** with a meal containing some fat, get 15–20 minutes of morning sunlight when possible, and include milk, curd, eggs or fortified foods. Ask your doctor when to recheck it.", ["Complete Blood Count · 12 Aug", "Follow-up Blood Report · 15 Sep"]);
  if (/glucose|sugar|diabet/.test(q)) return en(telugu ? "మీ సాధారణ గ్లూకోజ్ 96 మరియు 94 mg/dL. కానీ 08 అక్టోబర్ నివేదికలో 420 mg/dL క్రిటికల్‌గా గుర్తించబడింది — వెంటనే వైద్యుడిని సంప్రదించండి." : "Your routine fasting glucose was **96 and 94 mg/dL**, which is stable. However, the **08 Oct urgent lab report shows 420 mg/dL marked CRITICAL HIGH** — please consult a doctor promptly about it. Meanwhile drink water, avoid sugary drinks and sweets, and call **108** if you feel very drowsy, confused, or are vomiting.", ["Follow-up Blood Report · 15 Sep", "Urgent Lab Report · 08 Oct"]);
  if (/allerg|penicillin/.test(q)) return en(telugu ? "మీ రికార్డుల్లో పెనిసిలిన్ అలర్జీ ఉంది. ఏ కొత్త మందు తీసుకునే ముందు వైద్యుడికి చెప్పండి." : "Your records list a **Penicillin allergy**. Always mention it before any new prescription, injection or procedure, and avoid penicillin-group antibiotics (such as amoxicillin) unless a doctor confirms it is safe.", ["Emergency profile"]);
  if (/blood group|blood type/.test(q)) return en(telugu ? "మీ బ్లడ్ గ్రూప్ B+." : "Your recorded blood group is **B+**.", ["Emergency profile"]);
  if (/appointment|next visit|when.*doctor|follow.?up/.test(q)) return en(telugu ? `మీ తదుపరి సందర్శన ${doctorName}తో 14 అక్టోబర్ 2026 ఉదయం 10:30కి.` : `Your next appointment is with **${doctorName} on 14 October 2026 at 10:30 AM**. Bring your latest blood report and medication list, and use "Prepare for my visit" in Appointments for a ready brief.`, ["Appointment · 14 Oct"]);
  if (/step|walk|heart|pulse|water|hydrat|activity/.test(q)) return en(telugu ? "కనెక్ట్ చేసిన పరికరం నుండి మీ అడుగులు, హృదయ స్పందన, నిద్ర, నీటి వివరాలు డాష్‌బోర్డ్‌లో కనిపిస్తాయి. రోజుకు 2–3 లీటర్ల నీరు, సౌకర్యవంతమైన నడక మంచిది." : "Your connected device data (steps, heart rate, sleep and water) is shown on the Dashboard. General tips: aim for steady daily walking you find comfortable, drink about 2–3 litres of water unless your doctor advised otherwise, and seek advice if your resting heart rate is unusually high or you feel dizzy during activity.", ["Connected device"]);
  if (/headache|fever|cold|cough|pain|vomit|dizz/.test(q)) return en(telugu ? "ఈ లక్షణం మీ రికార్డుల్లో లేదు. విశ్రాంతి తీసుకోండి, నీరు తాగండి; లక్షణాలు తీవ్రమైతే లేదా కొనసాగితే వైద్యుడిని సంప్రదించండి." : "This symptom isn't in your records, so I can't link it to a cause. General precautions: rest, drink fluids, eat light meals, and monitor how you feel. Contact a doctor if it lasts more than 2–3 days or worsens, and call **108** for chest pain, severe breathlessness, fainting or confusion. Note that your iron tablet can sometimes upset the stomach — mention this to " + doctorName + " if relevant.", ["Prescription · 20 Aug"]);
  if (q.includes("changed") || q.includes("change") || q.includes("మార")) {
    return { text: telugu ? "మీ రెండు రక్త పరీక్షల మధ్య హీమోగ్లోబిన్ 10.8 నుండి 11.6 g/dLకి, విటమిన్ D 16 నుండి 24 ng/mLకి పెరిగాయి. గ్లూకోజ్ 96 నుండి 94 mg/dL వద్ద స్థిరంగా ఉంది. ఈ మార్పుల అర్థాన్ని మీ వైద్యుడితో నిర్ధారించండి." : "Between your two blood reports, haemoglobin increased from **10.8 to 11.6 g/dL** and vitamin D from **16 to 24 ng/mL**. Glucose stayed similar at **96 to 94 mg/dL**. These are record-based changes, not a diagnosis—confirm what they mean for you with your doctor.", sources: ["Complete Blood Count · 12 Aug", "Follow-up Blood Report · 15 Sep"] };
  }
  if (q.includes("medicine") || q.includes("medication") || q.includes("tablet") || q.includes("మంద")) {
    return { text: telugu ? "మీ రికార్డుల్లో ఫెర్రస్ ఆస్కార్బేట్ 100 mg ప్రతిరోజు అల్పాహారం తర్వాత, కొలెకాల్సిఫెరాల్ 60,000 IU ప్రతి ఆదివారం అని ఉంది. మోతాదును మార్చే ముందు వైద్యుడిని సంప్రదించండి." : "Your prescription lists **Ferrous Ascorbate 100 mg once daily after breakfast** and **Cholecalciferol 60,000 IU every Sunday**. Follow the prescription and speak with your clinician before changing a dose.", sources: ["Prescription · 20 Aug"] };
  }
  if (q.includes("resolve") || q.includes("what should") || q.includes("suffering") || q.includes("tired") || q.includes("problem")) {
    return { text: telugu ? "మీ రికార్డుల ప్రకారం అలసటతో పాటు హీమోగ్లోబిన్ మరియు విటమిన్ D తక్కువగా ఉన్నాయి. సూచించిన మందులను రికార్డు ప్రకారం తీసుకోండి, సమతుల్య ఆహారం తీసుకోండి, తగినంత నీరు తాగండి, విశ్రాంతి తీసుకోండి, తదుపరి పరీక్ష మరియు అక్టోబర్ 14 సమీక్షకు వెళ్లండి. శ్వాస తీసుకోవడం కష్టంగా ఉండటం, ఛాతి నొప్పి, మూర్ఛ లేదా లక్షణాలు వేగంగా పెరిగితే వెంటనే వైద్య సహాయం పొందండి." : "Based on your records, tiredness was discussed alongside low haemoglobin and vitamin D. The recorded plan is to **take the prescribed supplements, complete follow-up testing, and review progress on 14 October**. Helpful precautions include taking medicines exactly as prescribed, eating regular balanced meals, staying hydrated, resting when tired, and avoiding strenuous activity if it makes symptoms worse. **Do not add or change supplements** without checking with a qualified clinician. Seek urgent medical help for chest pain, fainting, severe breathlessness, or rapidly worsening symptoms. I cannot promise a cure or diagnose the cause, but I can help you follow the recorded plan.", sources: ["Consultation note · 18 Aug", "Prescription · 20 Aug", "Follow-up Blood Report · 15 Sep"] };
  }
  if (q.includes("precaution") || q.includes("avoid") || q.includes("reduce") || q.includes("diet") || q.includes("food")) {
    return { text: telugu ? "మీ రికార్డుల్లో తక్కువ హీమోగ్లోబిన్ మరియు విటమిన్ D కోసం సప్లిమెంట్లు, పునఃపరీక్ష మరియు వైద్య సమీక్ష నమోదు అయ్యాయి. మందులను సూచించిన విధంగా మాత్రమే తీసుకోండి, సమతుల్య ఆహారం తీసుకోండి, తగినంత నీరు తాగండి, మరియు మీ వైద్యుడి అనుమతి లేకుండా మోతాదును మార్చవద్దు." : "Based on your records, the plan for low haemoglobin and vitamin D is prescribed supplementation, repeat testing, and a clinical review. Take each medicine only as prescribed, keep regular balanced meals, stay hydrated, and do not add or change supplements without checking with a qualified clinician. Gentle activity is reasonable if comfortable; stop and seek advice if it causes dizziness, chest pain, or unusual breathlessness.", sources: ["Consultation note · 18 Aug", "Prescription · 20 Aug", "Follow-up Blood Report · 15 Sep"] };
  }
  if (q.includes("exercise") || q.includes("relax") || q.includes("stress") || q.includes("sleep")) {
    return { text: telugu ? "మనసును ప్రశాంతంగా ఉంచేందుకు నెమ్మదిగా శ్వాస తీసుకోవడం, ఐదు నిమిషాల సున్నితమైన స్ట్రెచింగ్, లేదా సౌకర్యవంతమైన చిన్న నడక ప్రయత్నించండి. తల తిరగడం, ఛాతి నొప్పి లేదా శ్వాస ఇబ్బంది ఉంటే ఆపి వైద్య సలహా పొందండి." : "For relaxation, try **slow breathing for 3–5 minutes**, **gentle seated stretching**, or a **short comfortable walk**. These support relaxation but do not treat the recorded low values. Stop if you feel dizzy, faint, unusually breathless, or have chest pain, and seek medical advice.", sources: ["Consultation note · 18 Aug"] };
  }
  if (q.includes("emergency") || q.includes("ambulance") || q.includes("108")) {
    return { text: telugu ? "ఛాతి నొప్పి, తీవ్రమైన శ్వాస ఇబ్బంది, మూర్ఛ, స్పందించకపోవడం లేదా వేగంగా తీవ్రమవుతున్న లక్షణాలు ఉంటే 108కి కాల్ చేయండి లేదా సమీప అత్యవసర విభాగానికి వెళ్లండి." : "Call **108 for an ambulance** if there is chest pain, severe difficulty breathing, fainting, unresponsiveness, heavy bleeding, or rapidly worsening symptoms. If you are unsure but the situation feels urgent, seek emergency help rather than waiting for an online answer.", sources: [] };
  }
  if (q.includes("question") || q.includes("doctor") || q.includes("visit")) {
    return { text: telugu ? "వైద్యుడిని అడగండి: 1) మారిన విలువలు నాకు ఏమి సూచిస్తున్నాయి? 2) మందులను ఎంతకాలం కొనసాగించాలి? 3) తదుపరి పరీక్ష ఎప్పుడు? 4) ఏ లక్షణాలు త్వరగా సంప్రదించాల్సినవి?" : `Questions for ${doctorName}:\n1. Are the haemoglobin and vitamin D changes progressing as expected?\n2. How long should I continue each supplement?\n3. When should the next blood test be done?\n4. Which symptoms should prompt an earlier review?`, sources: ["Follow-up Blood Report · 15 Sep", "Prescription · 20 Aug", "Appointment · 14 Oct"] };
  }
  return { text: telugu ? "మీ తాజా రికార్డు సెప్టెంబర్ 15 ఫాలో-అప్ రక్త నివేదిక. హీమోగ్లోబిన్ మరియు విటమిన్ D పెరిగాయి, గ్లూకోజ్ స్థిరంగా ఉంది. మీ ప్రశ్నను ఇంకా స్పష్టంగా అడిగితే సంబంధిత రికార్డుల నుంచే సమాధానం ఇస్తాను." : "Your latest record is the **15 September follow-up blood report**. It shows higher haemoglobin and vitamin D values than August, while glucose remained similar. Ask me about a specific result, medicine, change, or doctor visit and I’ll answer only from the relevant records.", sources: ["Follow-up Blood Report · 15 Sep"] };
}