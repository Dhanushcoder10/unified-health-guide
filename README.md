# HealthJourney AI

Build a polished, unique, competition-ready and fully responsive web app called “HealthPilot AI” — an AI-powered Personal Health Copilot.

CORE PRODUCT IDENTITY:
HealthPilot AI is NOT a generic hospital, fitness, appointment-booking, or medical chatbot website.
Its main purpose is:
“Turn scattered medical records into one clear, understandable health journey.”
The entire UI and user experience should communicate this idea.

DESIGN DIRECTION:
Create a calm, premium, modern healthcare interface using:
- White as the main background
- Soft blue, teal and subtle green accents
- Gentle gradients
- Soft glass/blur effects
- Rounded but professional cards
- Subtle shadows
- Elegant icons
- Smooth micro-animations
- Clean typography
- Plenty of breathing space
Do NOT make it dull, overly minimal, childish, overly blue, or similar to a hospital website.
The interface should feel like a premium personal health command center.

IMPORTANT:
Do not simply create many separate cards and dashboards. The Health Journey should be the visual centerpiece.

--------------------------------------------------
KEY CORE FUNCTIONALITIES TO IMPLEMENT:
--------------------------------------------------
1. AI COPILOT
Make it answer the exact question using only relevant health records.
• Latest report → explain latest report
• What changed → compare reports
• Medicines → show prescribed medicines
• Health history → show timeline
• Doctor questions → generate relevant questions
• Insights → explain the exact source
• “Hi/Hello” → normal greeting
Never invent medical information or diagnoses.
Display "Based on your records" with clickable source record links/badges.

2. AI VOICE ASSISTANT
Add a working microphone in Copilot:
Voice (speech-to-text with Web Speech API) → text → Copilot answer → optional voice response (speech synthesis).
If voice isn't supported, provide a working text fallback.

3. CONNECT DEVICE
Add “Connect Device” feature.
Simulate phone/wearable connection (e.g. Apple Health, Google Fit, Smartwatch) and import:
Steps, heart rate, sleep, water, and activity.
Update the Dashboard automatically in real time.

4. MEDICAL ALERT
When an uploaded/valid record contains an explicitly critical result (e.g., critical glucose, high BP crisis, abnormal lab markers), show a prominent alert modal/banner:
“Important: Please consult a qualified doctor promptly.”
Show the record causing the alert. Do not diagnose.

5. MEDICATIONS
“Mark as taken” must update status, date/time, remaining count, and Health Journey. Prevent duplicate doses.

6. CONNECTED DATA SYNCHRONIZATION
Keep everything synchronized:
Records → Journey → Insights → Copilot
Medication → Journey → Dashboard → Copilot
Device → Health Metrics → Dashboard → Insights → Copilot

7. DASHBOARD — “YOUR HEALTH, CONNECTED”
Hero section:
“Your Health, Connected.”
Subtitle:
“HealthPilot brings your scattered medical information together so you can understand what changed, what matters, and what to discuss next.”
Visual flow:
Medical Records → AI Understanding → Connected Health Journey → Doctor Conversation
Also show:
- Simple health summary
- What needs your attention?
- Recent medical activity
- Upcoming medication
- Upcoming appointment
- Recent AI insights
- Quick Upload Medical Record
- Quick Ask AI Copilot

8. SIGNATURE FEATURE — “YOUR HEALTH JOURNEY”
Interactive chronological health timeline showing:
Visit → Test → Lab Result → Diagnosis → Prescription → Follow-up
Use connected nodes, subtle animations, and visual relationships.
When users click an event, show:
- What happened
- Related medical record
- Related medication
- Related appointment
- Important extracted information
- AI explanation
- Why this event is connected to the next event ("AI Connection")

9. MEDICAL RECORD INTELLIGENCE
Allow users to upload prescriptions, lab reports, diagnostic reports, and discharge summaries.
Realistic flow:
UPLOAD → PROCESSING (“Reading document...”, “Finding dates...”, “Identifying medicines...”, “Connecting medical information...”) → AI/OCR EXTRACTION → REVIEW (editable before saving) → SAVE → AI SUMMARY → HEALTH JOURNEY.

10. “WHAT CHANGED?” — COMPARISON TOOL
Prominent feature inside Medical Records:
Compare two records (e.g., Previous Blood Report vs Latest Blood Report).
Show differences clearly (Value A → Value B).
Provide “Explain the changes” in simple terms, plus “Questions to ask your doctor”.

11. “EXPLAIN THIS TO ME”
For every medical record:
Three simple tabs/modes:
1. Medical (original terminology)
2. Simple (everyday language explanation)
3. Questions (questions to ask the doctor)

12. DOCTOR VISIT BRIEF
When an appointment is approaching, provide:
“Prepare for my visit” → Personalized DOCTOR VISIT BRIEF (recent changes, records, medications, follow-ups, questions to ask).
Also add “Create my 1-minute summary” (concise patient-friendly summary to read or show doctor).

13. SMART INSIGHTS & “WHY AM I SEEING THIS?”
Simple trends explained in plain language with sources and “Why am I seeing this?” transparency explanation.

14. MULTI-LANGUAGE
Working English + Telugu language switcher for interface text, health summaries, AI explanations, and suggested questions.

15. FHIR-STYLE / ABDM-READY HEALTH DATA STRUCTURE
Structure demo data in an FHIR-style format with sample ABHA card/number.

16. EMERGENCY INFORMATION
Blood group, allergies, current medications, emergency contact.

17. NAVIGATION
Sidebar with: Dashboard, Health Journey, Medical Records, AI Copilot, Medications, Appointments, Insights, Profile, Settings.

18. AI SAFETY & TRUST
Clear, subtle disclaimer: “HealthPilot AI helps organize and understand health information. It does not diagnose or replace healthcare professionals.”

19. FULLY RESPONSIVE
Optimized for desktop, tablet, and mobile. Provide rich, realistic initial sample records so the complete journey is immediately explorable.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://unified-health-guide.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/899f5bd0-9505-4dbc-b3ea-f834697e090b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
