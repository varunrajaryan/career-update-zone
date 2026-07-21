import type { FaqItem } from '../lib/supabase';

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string; // category slug
  author: string;
  date: string; // ISO
  lastUpdated: string; // ISO
  readTime: number; // minutes
  cover: string; // image url
  youtubeId: string; // embedded video
  tags: string[];
  body: string; // simple HTML-ish content (paragraphs, headings, lists)
  faqs: FaqItem[];
  seoTitle?: string;
  seoDescription?: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'bihar-panchayat-recruitment-2026',
    title: 'Bihar Panchayat Recruitment 2026: Notification, Eligibility & How to Apply',
    excerpt:
      'Bihar Panchayat recruitment 2026 notification is out. Check vacancy details, eligibility, important dates, and the step-by-step online application process.',
    category: 'bihar-jobs',
    author: 'Career Update Zone',
    date: '2026-07-09',
    lastUpdated: '2026-07-14',
    readTime: 7,
    cover: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg',
    youtubeId: 'dQw4w9WgXcQ',
    tags: ['bihar panchayat', 'bihar jobs', 'recruitment', 'apply online'],
    body: `
<p>The Bihar Panchayat Recruitment 2026 notification has been released, opening vacancies for Panchayat Secretary, Panchayat Rojgar Sevak, and other posts across districts. This is a major state-level recruitment for candidates who have passed Class 12 or graduation.</p>

<h2>Important dates</h2>
<ul>
<li><strong>Notification release:</strong> 8 July 2026</li>
<li><strong>Online application starts:</strong> 10 July 2026</li>
<li><strong>Last date to apply:</strong> 10 August 2026</li>
<li><strong>Admit card release:</strong> 15 days before the exam</li>
<li><strong>Written exam date:</strong> September 2026 (tentative)</li>
</ul>

<h2>Vacancy details</h2>
<ul>
<li>Panchayat Secretary — 1,800 posts</li>
<li>Panchayat Rojgar Sevak — 2,400 posts</li>
<li>Panchayat Technical Assistant — 600 posts</li>
<li>Panchayat Account Assistant — 900 posts</li>
</ul>

<h2>Eligibility criteria</h2>
<h3>Educational qualification</h3>
<p>The minimum qualification varies by post. Panchayat Secretary requires a graduation degree from a recognized university. Rojgar Sevak and Technical Assistant posts accept Class 12 pass with relevant computer or technical skills. Always check the post-wise details in the official notification.</p>

<h3>Age limit</h3>
<p>The general age limit is <strong>18 to 37 years</strong> as on 1 January 2026. Age relaxation applies for reserved categories (OBC, SC, ST, EBC, PwD, and female candidates) as per Bihar government rules.</p>

<blockquote>Keep your category certificate, domicile, and educational documents ready before starting the online application. You will need the details to fill the form correctly.</blockquote>

<h2>How to apply online — step by step</h2>
<ol>
<li>Visit the official Bihar Panchayat recruitment portal.</li>
<li>Click on the "New Registration" link and enter your basic details, mobile number, and email.</li>
<li>Verify the OTP sent to your mobile to proceed.</li>
<li>Fill in your educational qualification, category, and post preference.</li>
<li>Upload your photograph, signature, and required documents in the prescribed format.</li>
<li>Pay the application fee online and submit the form.</li>
<li>Download and print the confirmation page for future reference.</li>
</ol>

<h2>Selection process</h2>
<p>The selection is based on a written examination followed by document verification. The written exam is objective (multiple-choice) and covers General Knowledge, Mathematics, Hindi, and post-specific subjects. Candidates who clear the written exam are called for document verification.</p>

<p>For more Sarkari job notifications across Bihar, see our <a href="/blog?category=bihar-jobs">Bihar Jobs</a> category. You can also check the latest <a href="/blog?category=admit-card">admit card</a> releases and <a href="/blog?category=results">results</a> updates.</p>

<h2>Preparation tips</h2>
<ul>
<li>Download the official syllabus and exam pattern first — do not start preparation blindly.</li>
<li>Focus on Bihar-specific General Knowledge and current affairs.</li>
<li>Practice previous year question papers to understand the difficulty level.</li>
<li>Give weekly mock tests and track your score trend.</li>
</ul>

<p>The Bihar Panchayat recruitment is a great opportunity for local candidates. Apply early to avoid last-minute server issues, and start your preparation today.</p>
`,
    faqs: [
      {
        q: 'What is the last date to apply for Bihar Panchayat Recruitment 2026?',
        a: 'The last date to submit the online application is 10 August 2026 (11:59 PM). Candidates are advised to apply well before the deadline to avoid last-minute server issues.',
      },
      {
        q: 'Can 12th-pass candidates apply for Bihar Panchayat Recruitment 2026?',
        a: 'Yes. Several posts like Panchayat Rojgar Sevak and Technical Assistant accept Class 12-pass candidates. Panchayat Secretary requires graduation. Check the post-wise eligibility in the official notification before applying.',
      },
      {
        q: 'Is there negative marking in the Bihar Panchayat written exam?',
        a: 'The marking scheme varies by post. Most Bihar Panchayat exams do not have negative marking, but always confirm the exam pattern in the official notification before attempting the paper.',
      },
      {
        q: 'How will I know if my application is accepted?',
        a: 'After successful submission and fee payment, you will receive a confirmation email and SMS on your registered mobile number. You can also check your application status by logging into the recruitment portal.',
      },
    ],
  },
  {
    slug: 'ssc-cgl-2026-notification-apply-online',
    title: 'SSC CGL 2026 Notification Out: Eligibility, Dates & How to Apply Online',
    excerpt:
      'The Staff Selection Commission has released the SSC CGL 2026 notification. Here is everything you need to know — eligibility, important dates, fees, and the step-by-step online application process.',
    category: 'latest-jobs',
    author: 'Career Update Zone',
    date: '2026-07-10',
    lastUpdated: '2026-07-12',
    readTime: 8,
    cover: 'https://images.pexels.com/photos/5905702/pexels-photo-5905702.jpeg',
    youtubeId: 'dQw4w9WgXcQ',
    tags: ['ssc cgl', 'sarkari job', 'graduation', 'apply online'],
    body: `
<p>The Staff Selection Commission (SSC) has officially released the Combined Graduate Level (CGL) 2026 notification. This is one of the biggest Sarkari job recruitment drives of the year, with thousands of vacancies across multiple central government ministries and departments.</p>

<h2>Important dates to remember</h2>
<ul>
<li><strong>Notification release:</strong> 9 July 2026</li>
<li><strong>Online application starts:</strong> 10 July 2026</li>
<li><strong>Last date to apply:</strong> 8 August 2026 (11:59 PM)</li>
<li><strong>Tier-I exam date:</strong> September 2026 (tentative)</li>
<li><strong>Admit card release:</strong> 10–12 days before the exam</li>
</ul>

<h2>Eligibility criteria</h2>
<h3>Educational qualification</h3>
<p>Candidates must hold a Bachelor's degree from a recognized university as on the cut-off date mentioned in the notification. Some posts require specific subjects or higher qualifications — check the post-wise details in the official PDF.</p>

<h3>Age limit</h3>
<p>The general age limit is <strong>18 to 27 years</strong>, with post-wise variations. Age relaxation applies as per government rules for reserved categories (SC/ST, OBC, PwD, Ex-Servicemen).</p>

<blockquote>Always keep your category certificate and educational documents ready before starting the application — you will need the details to fill the form correctly.</blockquote>

<h2>Application fee</h2>
<ul>
<li><strong>General / OBC:</strong> Rs. 100</li>
<li><strong>SC / ST / PwD / Ex-Servicemen / Female candidates:</strong> No fee</li>
</ul>
<p>The fee can be paid online through net banking, UPI, or credit/debit card, or offline via SBI challan.</p>

<h2>How to apply online — step by step</h2>
<ol>
<li>Visit the official SSC website and click on the CGL 2026 registration link.</li>
<li>Complete Part-I registration with your basic details and a valid mobile number and email.</li>
<li>Verify the OTP sent to your mobile and email to proceed.</li>
<li>Fill Part-II registration with educational qualifications, post preferences, and category details.</li>
<li>Upload your photograph and signature in the prescribed format and size.</li>
<li>Pay the application fee (if applicable) and submit the form.</li>
<li>Download and print the confirmation page for future reference.</li>
</ol>

<h2>Selection process</h2>
<p>The SSC CGL recruitment happens in four tiers:</p>
<ul>
<li><strong>Tier-I:</strong> Computer-based, objective, 100 questions — qualifying.</li>
<li><strong>Tier-II:</strong> Computer-based, objective + descriptive — marks counted for merit.</li>
<li><strong>Tier-III:</strong> Descriptive paper (essay/letter/application) in English or Hindi.</li>
<li><strong>Tier-IV:</strong> Skill test (DEST/CPT) or document verification, as per post.</li>
</ul>

<p>For the full syllabus and exam pattern, see our <a href="/blog?category=syllabus">Syllabus</a> category. You can also find <a href="/blog?category=exam-preparation">exam preparation</a> strategy and <a href="/blog?category=admit-card">admit card</a> updates on the blog.</p>

<h2>Preparation tips</h2>
<ul>
<li>Start with the syllabus and exam pattern — do not begin preparation blindly.</li>
<li>Give at least one mock test per week and analyze your mistakes.</li>
<li>Current affairs of the last 6–8 months are critical for the General Awareness section.</li>
<li>Revise Quantitative Aptitude formulas daily — speed and accuracy win this section.</li>
</ul>

<p>The SSC CGL is a marathon, not a sprint. Start your application early to avoid last-minute server issues, and build a consistent study routine from day one.</p>
`,
    faqs: [
      {
        q: 'Can final-year graduation students apply for SSC CGL 2026?',
        a: 'Yes, candidates appearing in the final year of their Bachelor\u2019s degree can apply, provided they obtain their qualification on or before the cut-off date mentioned in the notification. You must produce the degree certificate at the time of document verification.',
      },
      {
        q: 'Is there negative marking in the SSC CGL Tier-I exam?',
        a: 'Yes, there is a negative marking of 0.50 marks for each incorrect answer in Tier-I. There is no negative marking for unattempted questions, so attempt only what you are confident about.',
      },
      {
        q: 'How many post preferences can I select while applying?',
        a: 'You can select all eligible posts based on your qualification and age. Post preference order matters — it is used during final allocation, so rank your preferred posts carefully in the application form.',
      },
      {
        q: 'What is the application fee for female candidates?',
        a: 'Female candidates of all categories are exempt from the application fee. They can submit the form without any payment, as per the SSC notification.',
      },
    ],
  },
  {
    slug: 'railway-recruitment-2026-rrb-ntpc-group-d',
    title: 'Railway Recruitment 2026: RRB NTPC & Group D Notification, Eligibility & Apply Online',
    excerpt:
      'Railway Recruitment 2026 is here. Get the full details on RRB NTPC and Group D vacancies, eligibility, exam dates, and how to apply online.',
    category: 'latest-jobs',
    author: 'Career Update Zone',
    date: '2026-07-07',
    lastUpdated: '2026-07-13',
    readTime: 9,
    cover: 'https://images.pexels.com/photos/5905702/pexels-photo-5905702.jpeg',
    youtubeId: 'dQw4w9WgXcQ',
    tags: ['railway recruitment', 'rrb ntpc', 'group d', 'sarkari job'],
    body: `
<p>The Railway Recruitment Boards (RRBs) have announced the Railway Recruitment 2026 drive for NTPC (Non-Technical Popular Categories) and Group D posts. This is one of the largest recruitment exercises in India, with lakhs of vacancies expected across all RRB zones.</p>

<h2>Important dates</h2>
<ul>
<li><strong>Notification release:</strong> 5 July 2026</li>
<li><strong>Online application starts:</strong> 7 July 2026</li>
<li><strong>Last date to apply:</strong> 6 August 2026</li>
<li><strong>CBT-1 exam date:</strong> October–November 2026 (tentative)</li>
<li><strong>Admit card release:</strong> 10 days before the exam</li>
</ul>

<h2>Vacancy overview</h2>
<h3>RRB NTPC (Graduate & Undergraduate)</h3>
<ul>
<li>Station Master, Goods Guard, Senior Clerk, Typist, and other posts</li>
<li>Total vacancies: approximately 35,000+</li>
<li>Qualification: Class 12 or Graduation depending on post</li>
</ul>

<h3>RRB Group D (Level 1)</h3>
<ul>
<li>Track Maintainer, Helper, Assistant Pointsman, and other posts</li>
<li>Total vacancies: approximately 1,00,000+</li>
<li>Qualification: Class 10 pass / ITI</li>
</ul>

<blockquote>Railway recruitment is highly competitive. Start your preparation the day the notification is released — do not wait for the last date to apply.</blockquote>

<h2>Eligibility criteria</h2>
<h3>Educational qualification</h3>
<p>For NTPC graduate posts, a Bachelor's degree is required. For NTPC undergraduate posts, Class 12 pass is sufficient. For Group D, Class 10 pass or ITI is the minimum requirement. Check post-wise details in the official notification.</p>

<h3>Age limit</h3>
<p>The age limit varies by post: NTPC is typically 18 to 33 years, and Group D is 18 to 33 years. Age relaxation applies for reserved categories as per central government rules.</p>

<h2>How to apply online</h2>
<ol>
<li>Visit the official RRB regional website for your zone.</li>
<li>Click on the NTPC or Group D 2026 application link.</li>
<li>Complete Part-I registration with your name, date of birth, mobile, and email.</li>
<li>Verify the OTP and proceed to Part-II registration.</li>
<li>Fill in educational, category, and post preference details.</li>
<li>Upload photograph, signature, and certificates as per the prescribed format.</li>
<li>Pay the application fee and submit the form.</li>
<li>Print the application confirmation for your records.</li>
</ol>

<h2>Application fee</h2>
<ul>
<li><strong>General / OBC:</strong> Rs. 500 (Rs. 400 refunded after CBT-1)</li>
<li><strong>SC / ST / PwD / Ex-Servicemen / Female:</strong> Rs. 250 (fully refunded after CBT-1)</li>
</ul>

<p>For the complete exam pattern and subject-wise syllabus, visit our <a href="/blog?category=syllabus">Syllabus</a> section. You can also find <a href="/blog?category=exam-preparation">exam preparation</a> guides and <a href="/blog?category=answer-key">answer key</a> updates.</p>

<h2>Selection process</h2>
<ul>
<li><strong>CBT-1:</strong> Computer-based test, objective, qualifying.</li>
<li><strong>CBT-2:</strong> Computer-based test, objective, marks counted for merit.</li>
<li><strong>Typing/Aptitude Test:</strong> As per post requirement.</li>
<li><strong>Document Verification & Medical:</strong> Final stage before appointment.</li>
</ul>

<h2>Preparation strategy</h2>
<ul>
<li>Focus on Mathematics, General Intelligence & Reasoning, General Science, and General Awareness.</li>
<li>Practice previous year papers — RRB repeats question patterns.</li>
<li>Give full-length mock tests twice a week and analyze mistakes.</li>
<li>Current affairs of the last 12 months are important for General Awareness.</li>
</ul>

<p>Railway recruitment rewards consistency. Apply early, understand the syllabus, and practice daily — lakhs of candidates compete, but the prepared ones always rise to the top.</p>
`,
    faqs: [
      {
        q: 'Can 10th-pass candidates apply for Railway Recruitment 2026?',
        a: 'Yes. RRB Group D (Level 1) posts require only Class 10 pass or ITI. NTPC posts require Class 12 or graduation depending on the specific post. Always check post-wise eligibility in the official notification.',
      },
      {
        q: 'Is the RRB application fee refundable?',
        a: 'Yes. For General/OBC candidates, Rs. 400 out of Rs. 500 is refunded after appearing in CBT-1. For SC/ST/PwD/Female candidates, the full Rs. 250 fee is refunded after appearing in CBT-1.',
      },
      {
        q: 'How many RRB zones can I apply to?',
        a: 'You can apply to only one RRB zone for a given post category. Choose the zone nearest to your residence, as your exam centre and future posting will be in that zone.',
      },
      {
        q: 'What is the salary for RRB Group D posts?',
        a: 'RRB Group D employees get a basic pay of Rs. 18,000 per month (Level 1 of the 7th CPC), plus allowances like DA, HRA, and transport allowance. The total in-hand salary varies by location.',
      },
    ],
  },
  {
    slug: 'bihar-police-vacancy-2026-constable-si',
    title: 'Bihar Police Vacancy 2026: Constable & SI Notification, Eligibility & Apply Online',
    excerpt:
      'Bihar Police vacancy 2026 for Constable and Sub-Inspector posts. Check eligibility, physical standards, important dates, and how to apply online.',
    category: 'bihar-jobs',
    author: 'Career Update Zone',
    date: '2026-07-05',
    lastUpdated: '2026-07-11',
    readTime: 8,
    cover: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg',
    youtubeId: 'dQw4w9WgXcQ',
    tags: ['bihar police', 'constable', 'sub-inspector', 'vacancy'],
    body: `
<p>The Bihar Police Department has released the vacancy notification for Constable and Sub-Inspector (SI) posts for 2026. This is one of the most awaited Bihar government recruitments, with thousands of vacancies for both male and female candidates.</p>

<h2>Important dates</h2>
<ul>
<li><strong>Notification release:</strong> 3 July 2026</li>
<li><strong>Online application starts:</strong> 5 July 2026</li>
<li><strong>Last date to apply:</strong> 4 August 2026</li>
<li><strong>Written exam date:</strong> October 2026 (tentative)</li>
<li><strong>Admit card release:</strong> 12 days before the exam</li>
</ul>

<h2>Vacancy details</h2>
<ul>
<li>Constable (Male) — 6,500 posts</li>
<li>Constable (Female) — 2,000 posts</li>
<li>Sub-Inspector (SI) — 800 posts</li>
<li><strong>Total vacancies:</strong> 9,300+</li>
</ul>

<h2>Eligibility criteria</h2>
<h3>Educational qualification</h3>
<p>For Constable, candidates must have passed Class 12 (Intermediate) from a recognized board. For Sub-Inspector, a graduation degree from a recognized university is required.</p>

<h3>Age limit</h3>
<ul>
<li><strong>Constable (Male):</strong> 18 to 25 years</li>
<li><strong>Constable (Female):</strong> 18 to 28 years</li>
<li><strong>Sub-Inspector:</strong> 20 to 25 years</li>
</ul>
<p>Age relaxation applies for reserved categories (OBC, SC, ST, EBC) as per Bihar government norms.</p>

<blockquote>Physical efficiency is a qualifying stage. Start running and fitness training alongside written exam preparation — do not leave it for the last month.</blockquote>

<h2>Physical standards</h2>
<h3>For male candidates</h3>
<ul>
<li>Height: 165 cm (General), 160 cm (SC/ST/OBC)</li>
<li>Chest: 81–86 cm (General), 79–84 cm (reserved)</li>
<li>Running: 1.6 km in 6 minutes</li>
</ul>

<h3>For female candidates</h3>
<ul>
<li>Height: 155 cm (General), 150 cm (SC/ST/OBC)</li>
<li>Running: 1 km in 5 minutes</li>
</ul>

<h2>How to apply online</h2>
<ol>
<li>Visit the official Bihar Police recruitment website.</li>
<li>Click on the Constable or SI 2026 application link.</li>
<li>Register with your basic details, mobile number, and email.</li>
<li>Fill in educational, category, and personal details.</li>
<li>Upload photograph, signature, and required documents.</li>
<li>Pay the application fee and submit the form.</li>
<li>Print the confirmation page for future reference.</li>
</ol>

<p>For more Bihar government job updates, visit our <a href="/blog?category=bihar-jobs">Bihar Jobs</a> category. You can also check <a href="/blog?category=admit-card">admit card</a> releases and <a href="/blog?category=results">results</a> as they are announced.</p>

<h2>Selection process</h2>
<ol>
<li>Written examination (objective, OMR-based)</li>
<li>Physical Efficiency Test (PET) and Physical Standard Test (PST)</li>
<li>Document verification</li>
<li>Final merit list</li>
</ol>

<h2>Preparation tips</h2>
<ul>
<li>Focus on General Studies, Mathematics, Hindi, and Bihar-specific current affairs.</li>
<li>Practice previous year question papers to understand the pattern.</li>
<li>Start physical training 3 months before PET — run daily and practice long jump.</li>
<li>Give weekly mock tests and track your progress.</li>
</ul>

<p>The Bihar Police vacancy is a golden opportunity for state youth. Apply early, prepare consistently, and do not ignore the physical test — both stages count toward final selection.</p>
`,
    faqs: [
      {
        q: 'What is the qualification for Bihar Police Constable 2026?',
        a: 'Candidates must have passed Class 12 (Intermediate) from a recognized board. For Sub-Inspector posts, a graduation degree from a recognized university is required.',
      },
      {
        q: 'Is there a physical test for Bihar Police recruitment?',
        a: 'Yes. After the written exam, qualified candidates must appear for the Physical Efficiency Test (PET) and Physical Standard Test (PST). Running, long jump, and height/chest measurements are tested. Start physical training alongside written exam preparation.',
      },
      {
        q: 'Can female candidates apply for Bihar Police Constable 2026?',
        a: 'Yes. There are 2,000 vacancies reserved for female constables. Female candidates must meet the prescribed height and running standards, which are different from male candidates.',
      },
      {
        q: 'What is the salary of a Bihar Police Sub-Inspector?',
        a: 'A Bihar Police Sub-Inspector receives a basic pay of approximately Rs. 35,400 per month (Level 6 of the 7th CPC), plus allowances like DA, HRA, and transport allowance. The total in-hand salary varies by posting location.',
      },
    ],
  },
  {
    slug: 'ctet-2026-updates-exam-date-syllabus-admit-card',
    title: 'CTET 2026 Updates: Exam Date, Syllabus, Admit Card & Preparation Tips',
    excerpt:
      'CTET 2026 updates: exam date, syllabus changes, admit card download link, and preparation tips for Paper 1 and Paper 2 aspirants.',
    category: 'exam-preparation',
    author: 'Career Update Zone',
    date: '2026-07-03',
    lastUpdated: '2026-07-10',
    readTime: 7,
    cover: 'https://images.pexels.com/photos/5905702/pexels-photo-5905702.jpeg',
    youtubeId: 'dQw4w9WgXcQ',
    tags: ['ctet', 'teacher eligibility test', 'exam preparation', 'admit card'],
    body: `
<p>The Central Teacher Eligibility Test (CTET) 2026 notification has been released by the Central Board of Secondary Education (CBSE). CTET is a qualifying exam for candidates who want to become teachers in central government schools (KVS, NVS, Central Tibetan Schools) and many state and private schools.</p>

<h2>Important dates</h2>
<ul>
<li><strong>Notification release:</strong> 1 July 2026</li>
<li><strong>Online application starts:</strong> 2 July 2026</li>
<li><strong>Last date to apply:</strong> 1 August 2026</li>
<li><strong>Admit card release:</strong> 10 days before the exam</li>
<li><strong>CTET exam date:</strong> August 2026 (tentative)</li>
</ul>

<h2>Exam pattern</h2>
<p>CTET is conducted in two papers:</p>
<ul>
<li><strong>Paper 1:</strong> For candidates who want to teach Classes 1 to 5 (Primary Teacher).</li>
<li><strong>Paper 2:</strong> For candidates who want to teach Classes 6 to 8 (Upper Primary Teacher).</li>
</ul>
<p>Both papers are computer-based (CBT), objective, and of 150 marks each. There is no negative marking.</p>

<h3>Paper 1 structure (150 marks)</h3>
<ul>
<li>Child Development & Pedagogy — 30 marks</li>
<li>Language I (English/Hindi) — 30 marks</li>
<li>Language II — 30 marks</li>
<li>Mathematics — 30 marks</li>
<li>Environmental Studies — 30 marks</li>
</ul>

<h3>Paper 2 structure (150 marks)</h3>
<ul>
<li>Child Development & Pedagogy — 30 marks</li>
<li>Language I — 30 marks</li>
<li>Language II — 30 marks</li>
<li>Mathematics & Science OR Social Studies/Social Science — 60 marks</li>
</ul>

<blockquote>CTET qualifying is valid for lifetime. Once you pass, you are eligible to apply for teacher recruitment in CTET-accepting schools forever.</blockquote>

<h2>Syllabus highlights</h2>
<p>The CTET syllabus focuses on teaching aptitude, child psychology, language proficiency, and subject knowledge. For the full subject-wise breakdown, see our <a href="/blog?category=syllabus">Syllabus</a> category. You can also find <a href="/blog?category=exam-preparation">exam preparation</a> strategy and <a href="/blog?category=admit-card">admit card</a> updates.</p>

<h2>How to download the admit card</h2>
<ol>
<li>Visit the official CTET website.</li>
<li>Click on the "CTET 2026 Admit Card" link.</li>
<li>Enter your application number and date of birth.</li>
<li>Download and print your admit card.</li>
<li>Carry a printed copy and a valid photo ID to the exam centre.</li>
</ol>

<h2>Preparation tips</h2>
<ul>
<li>Focus on Child Development & Pedagogy — it carries 30 marks in both papers and is highly scoring.</li>
<li>Practice previous year question papers to understand the question pattern.</li>
<li>Improve your language proficiency in both Language I and Language II.</li>
<li>Give mock tests weekly and analyze your weak areas.</li>
<li>Revise NCERT textbooks for Classes 1 to 8 for subject knowledge.</li>
</ul>

<p>CTET is a qualifying exam, not a recruitment exam. Clearing it makes you eligible to apply for teacher posts — it does not guarantee a job. Prepare well, pass CTET, and then apply for teacher recruitments separately.</p>
`,
    faqs: [
      {
        q: 'Is CTET qualifying valid for lifetime?',
        a: 'Yes. As per the latest CBSE notification, the CTET qualifying certificate is valid for lifetime. Once you pass CTET, you are eligible to apply for teacher recruitment in CTET-accepting schools indefinitely.',
      },
      {
        q: 'Can I appear for both Paper 1 and Paper 2 of CTET?',
        a: 'Yes. If you meet the eligibility for both (Class 12 with D.El.Ed for Paper 1 and graduation with B.Ed for Paper 2), you can appear for both papers. Many candidates attempt both to maximize their teaching eligibility.',
      },
      {
        q: 'Is there negative marking in CTET 2026?',
        a: 'No. There is no negative marking in CTET. Each correct answer awards 1 mark, and incorrect or unattempted answers carry no penalty. Attempt all questions confidently.',
      },
      {
        q: 'What is the passing mark for CTET 2026?',
        a: 'General category candidates need 60% (90 out of 150 marks) to pass CTET. Reserved categories (SC/ST/OBC/PwD) get a relaxation of 5%, so they need 55% (82 marks). Check the official notification for the exact qualifying criteria.',
      },
    ],
  },
  {
    slug: 'scholarship-updates-2026-post-matric-bihar',
    title: 'Scholarship Updates 2026: Post Matric Scholarship Bihar & National Schemes',
    excerpt:
      'Latest scholarship updates for 2026 — Post Matric Scholarship Bihar, national scholarships, eligibility, documents, and how to apply online.',
    category: 'scholarships',
    author: 'Career Update Zone',
    date: '2026-06-28',
    lastUpdated: '2026-07-08',
    readTime: 7,
    cover: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg',
    youtubeId: 'dQw4w9WgXcQ',
    tags: ['scholarship', 'post matric', 'bihar', 'students'],
    body: `
<p>Scholarship season for 2026 is here. Multiple government and private scholarships are now open for applications, including the Post Matric Scholarship for Bihar students and several national-level schemes. This guide covers the key scholarships, eligibility, documents, and how to apply online.</p>

<h2>1. Post Matric Scholarship Bihar 2026</h2>
<p>This state-sponsored scheme provides financial assistance to students from SC, ST, OBC, and EBC categories pursuing post-matriculation (Class 11 onwards) studies.</p>
<ul>
<li><strong>Eligibility:</strong> Bihar resident, SC/ST/OBC/EBC category, family income within the prescribed limit.</li>
<li><strong>Award:</strong> Tuition fee + maintenance allowance, credited via DBT.</li>
<li><strong>Last date:</strong> 31 August 2026.</li>
</ul>

<h2>2. National Scholarship Portal (NSP) schemes</h2>
<p>The NSP hosts multiple central government scholarships for school, college, and professional course students. Key schemes include:</p>
<ul>
<li>Pre-Matric Scholarship for SC/ST students</li>
<li>Post-Matric Scholarship for SC/ST/OBC students</li>
<li>Merit-cum-Means Scholarship for minority communities</li>
<li>Central Sector Scheme of Scholarships for College and University Students</li>
</ul>

<blockquote>The scholarship amount is credited directly to the student\u2019s bank account via DBT. Ensure your bank account is linked to your Aadhaar.</blockquote>

<h2>Documents required</h2>
<ul>
<li>Aadhaar card</li>
<li>Residence/domicile certificate</li>
<li>Caste certificate (for category-based scholarships)</li>
<li>Income certificate (issued by a competent authority)</li>
<li>Mark sheet of the last passed examination</li>
<li>Bank passbook (for direct benefit transfer)</li>
<li>Recent passport-size photograph</li>
<li>Institution verification form (if required)</li>
</ul>

<h2>How to apply online</h2>
<ol>
<li>Visit the official scholarship portal (Bihar scholarship portal or NSP).</li>
<li>Register as a new student with your Aadhaar number and mobile number.</li>
<li>Log in and complete your profile with personal and academic details.</li>
<li>Upload all required documents in the prescribed format.</li>
<li>Select your course and institution details.</li>
<li>Submit the application and note the application ID for tracking.</li>
</ol>

<p>For government scheme benefits beyond scholarships, see our <a href="/blog?category=government-schemes">Government Schemes</a> category. You can also find <a href="/blog?category=exam-preparation">exam preparation</a> guides and <a href="/blog?category=latest-jobs">latest job</a> notifications on the blog.</p>

<h2>Tips to avoid rejection</h2>
<ul>
<li>Ensure your name and date of birth match exactly across all documents.</li>
<li>Upload clear, readable scans — blurry documents are the most common rejection reason.</li>
<li>Confirm with your institution that they will verify your application before the deadline.</li>
<li>Do not wait for the last day — the portal often slows down due to heavy traffic.</li>
</ul>

<p>Scholarships can cover tuition, maintenance, and other study expenses. Apply early, keep your documents ready, and follow up with your institution for timely verification.</p>
`,
    faqs: [
      {
        q: 'Can general category students apply for the Post Matric Scholarship in Bihar?',
        a: 'No. The Post Matric Scholarship in Bihar is for students belonging to SC, ST, OBC, and EBC categories. General category students should check other central or state scholarship schemes on the National Scholarship Portal.',
      },
      {
        q: 'How will I receive the scholarship amount?',
        a: 'The scholarship is credited directly to the student\u2019s registered bank account through Direct Benefit Transfer (DBT). Ensure your bank account is active and linked to your Aadhaar number.',
      },
      {
        q: 'What should I do if my scholarship application is rejected by the institution?',
        a: 'Contact your institution\u2019s scholarship nodal officer immediately to understand the rejection reason. Common causes are incorrect documents or mismatched details. You can correct and resubmit before the deadline if the portal allows it.',
      },
      {
        q: 'Where can I find all central government scholarships in one place?',
        a: 'The National Scholarship Portal (scholarships.gov.in) lists most central government scholarships. You can register once and apply to multiple schemes for which you are eligible.',
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return blogPosts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      post: p,
      score:
        (p.category === post.category ? 2 : 0) +
        p.tags.filter((t) => post.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.post);
}
