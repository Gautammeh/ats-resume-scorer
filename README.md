# 📄 ATS Resume Scorer

**A free, instant tool to check how well your resume matches any job description.**

No sign-up. No API. No cost. Just paste and score.

🔗 **Live Tool → [https://ats-checker-gamma.vercel.app/](#)** 

---

## 🎯 What It Does

Most resumes get rejected before a human even reads them — filtered out by **ATS (Applicant Tracking Systems)** that scan for keywords.

This tool helps job seekers:
- See their **ATS match score** as a percentage
- Find **matched keywords** already in their resume
- Spot **missing keywords** they should add
- Get **3 actionable tips** to improve their score

---

## ✨ Features

- ⚡ **Instant scoring** — no loading, no API calls, runs entirely in your browser
- 🔍 **Smart keyword extraction** — filters out generic filler words, focuses on real skills and tech terms
- 🧠 **Bigram detection** — recognizes multi-word phrases like `machine learning`, `project management`, `full stack`
- 🌙 **Dark mode** — toggle with one click, preference saved across sessions
- 📋 **Copy results** — copy your full score report to clipboard in one click
- 📱 **Fully responsive** — works on mobile and desktop
- 🔒 **100% private** — your resume never leaves your browser

---

## 🚀 How to Use

1. Paste your resume text into the left box
2. Paste the job description into the right box
3. Click **Analyze My Resume**
4. Review your score, matched/missing keywords, and tips
5. Update your resume and re-analyze until your score improves

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | HTML, CSS, JavaScript (vanilla) |
| Hosting | Vercel (free Hobby plan) |
| Dependencies | None — zero npm packages |
| APIs | None — fully client-side |

---

## 🧠 How the Scoring Works

1. **Keyword extraction** — pulls meaningful words from the job description, filtering out 150+ stopwords (articles, prepositions, generic HR phrases like "team player", "detail-oriented", etc.)
2. **Bigram detection** — identifies important 2-word technical phrases as single units
3. **Regex matching** — checks each keyword against the resume using word-boundary matching (not just substring)
4. **Score** = `(matched keywords ÷ total keywords) × 100`

---

## 📁 Project Structure

```
ats-resume-scorer/
└── index.html
└── style.css
└── script.js

```

---

## 🏃 Run Locally

No build step needed. Just open the file:

```bash
git clone https://github.com/YOUR_USERNAME/ats-resume-scorer.git
cd ats-resume-scorer
open index.html   # or just double-click the file
```

---

## 🙋 About

Built by **Gautam Mehta** · [gautammehtayt@gmail.com](mailto:gautammehtayt@gmail.com)

---

⚡ [Built for Digital Heroes](https://digitalheroesco.com)