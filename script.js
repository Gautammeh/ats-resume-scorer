
// Common / stop words to ignore when extracting job description keywords
const STOP_WORDS = new Set([
  // Articles & conjunctions
  'the','and','a','an','or','but','nor','so','yet','for','as',
  // Prepositions
  'in','to','of','with','on','at','by','from','into','through',
  'during','before','after','above','below','between','under','over',
  'per','via','within','across','about','up','out','off','until','while',
  // Pronouns
  'it','its','i','we','you','they','he','she','me','us','them',
  'my','our','your','his','her','their','who','which','what',
  'where','when','how','this','that','these','those',
  // Auxiliary verbs
  'is','are','be','was','were','been','being','have','has','had',
  'do','does','did','will','would','shall','should','may','might',
  'can','could','must',
  // Common filler words
  'if','not','no','just','also','very','too','only','then','than',
  'more','most','some','any','all','each','every','both','few','many',
  'much','such','own','same','other','new','old','etc','ie','eg',
  'able','like','well','need','one','two','three','including','based',
  'ensure','high','include','plus','looking','join','opportunity',
  // Generic HR/JD boilerplate — these appear in every JD so not useful
  'work','working','role','team','company','job','apply','experience',
  'required','preferred','requirements','responsibilities','qualifications',
  'years','year','equivalent','related','relevant','proven','excellent',
  'level','minimum','knowledge','understanding','position','candidates',
  'candidate','strong','ability','skills','good','great','best','help',
  'make','use','build','create','support','manage','develop','provide',
  'ensure','maintain','implement','drive','lead','take','get','set',
  'day','time','people','person','place','way','thing','case','part',
  'point','number','large','small','long','short','right','left',
  'open','close','key','important','grow','growth','fast','quick',
  'effective','efficient','clear','focused','detail','impact','value',
  'success','successful','successful','define','current','different',
  'multiple','various','given','following','real','early','senior',
  'junior','mid','plus','bonus','great','equal','opportunity','employer',
  'full','time','part','contract','remote','hybrid','office','onsite',
  'benefits','salary','compensation','equity','culture','fun','exciting',
  'passionate','motivated','self','starter','independently','collaborate',
  'communication','written','verbal','interpersonal','organizational',
  'problem','solving','analytical','detail','oriented','fast','paced'
]);

// Important 2-word tech/domain phrases to extract as single keywords
const BIGRAMS = [
  'machine learning','deep learning','natural language','computer vision',
  'data science','data analysis','data engineering','data visualization',
  'project management','product management','product design',
  'user experience','user interface','user research',
  'front end','back end','full stack','full-stack','front-end','back-end',
  'rest api','restful api','graphql api','api integration',
  'unit testing','test driven','ci cd','continuous integration',
  'continuous deployment','version control','source control',
  'agile methodology','scrum master','kanban board',
  'cloud computing','cloud infrastructure','aws lambda',
  'google cloud','azure devops','digital marketing',
  'social media','content strategy','seo optimization',
  'a b testing','ab testing','conversion rate',
  'sql server','mongodb atlas','firebase realtime',
  'react native','next js','node js','express js',
  'typescript react','vue js','angular js',
];

/**
 * Extract meaningful keywords from text.
 * Returns a Set of lowercase keyword strings (2+ chars, non-numeric, non-stop-word).
 * Also extracts important 2-word bigrams.
 */
function extractKeywords(text) {
  const lowerText = text.toLowerCase().replace(/[^a-z0-9\s\-\/\+\#\.]/g, ' ');

  const keywords = new Set();

  // Extract bigrams first
  for (const bigram of BIGRAMS) {
    if (lowerText.includes(bigram)) {
      keywords.add(bigram);
    }
  }

  // Extract single words
  const words = lowerText
    .split(/\s+/)
    .filter(w => w.length >= 2);

  for (const word of words) {
    const clean = word.replace(/^[\-\.]+|[\-\.]+$/g, '');
    if (clean.length < 2) continue;
    if (STOP_WORDS.has(clean)) continue;
    if (/^\d+$/.test(clean)) continue;
    // Skip if it's already part of a bigram we captured
    const inBigram = Array.from(keywords).some(k => k.includes(' ') && k.split(' ').includes(clean));
    if (!inBigram) keywords.add(clean);
  }
  return keywords;
}

/**
 * Generate three actionable tips based on missing keywords and score.
 */
function generateTips(missingKeywords, score, matchedCount, missingCount) {
  const tips = [];
  const missing = Array.from(missingKeywords);

  if (missing.length === 0) {
    tips.push('Your resume covers all extracted keywords. Review the job posting for any nuanced phrasing you can mirror.');
    tips.push('Consider adding quantified achievements (numbers, percentages, dollar amounts) to strengthen each bullet point.');
    tips.push('Tailor your summary or objective section to directly echo the job title and company mission.');
    return tips;
  }

  // Tip 1 — Incorporate specific missing keywords
  const sample = missing.slice(0, 5).map(k => `"${k}"`).join(', ');
  tips.push(
    `Add the following missing terms to your resume: ${sample}${missing.length > 5 ? ` and ${missing.length - 5} more` : ''}. Weave them naturally into your experience bullets rather than keyword-stuffing.`
  );

  // Tip 2 — Skills section
  if (score < 60) {
    tips.push(
      'Create or expand a dedicated "Skills" or "Technical Skills" section that lists the hard skills from the job description. ATS parsers often look for an explicit skills block.'
    );
  } else {
    tips.push(
      'Mirror the exact phrasing from the job description. If they say "cross-functional collaboration," use that phrase verbatim instead of a synonym like "working with other teams."'
    );
  }

  // Tip 3 — Structure & formatting
  if (score < 40) {
    tips.push(
      'Your resume may need a significant rewrite for this role. Focus on restructuring your experience to highlight relevant projects, certifications, or transferable skills that align with the job description.'
    );
  } else {
    tips.push(
      'Use a clean, ATS-friendly format: avoid tables, columns, headers/footers, and images. Stick to standard section headings like "Experience," "Education," and "Skills."'
    );
  }

  return tips;
}

/**
 * Animate the circular score ring and number.
 */
function animateScore(score) {
  const ring = document.getElementById('scoreRing');
  const numberEl = document.getElementById('scoreNumber');
  const circumference = 2 * Math.PI * 80; // r=80
  const offset = circumference - (score / 100) * circumference;

  // Set stroke color based on score
  if (score >= 70) {
    ring.style.stroke = 'var(--green)';
  } else if (score >= 40) {
    ring.style.stroke = '#f59e0b';
  } else {
    ring.style.stroke = 'var(--red)';
  }

  // Reset then animate
  ring.style.strokeDashoffset = circumference;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ring.style.strokeDashoffset = offset;
    });
  });

  // Animate number count-up
  let current = 0;
  const step = Math.max(1, Math.ceil(score / 60));
  const interval = setInterval(() => {
    current += step;
    if (current >= score) {
      current = score;
      clearInterval(interval);
    }
    numberEl.innerHTML = `${current}<span class="percent">%</span>`;
  }, 20);
}

/**
 * Main analysis function.
 */
function analyzeResume() {
  const resumeText = document.getElementById('resumeInput').value.trim();
  const jobText = document.getElementById('jobInput').value.trim();

  if (!resumeText || !jobText) {
    showToast('Please paste both your resume and the job description.');
    return;
  }

  const jobKeywords = extractKeywords(jobText);

  if (jobKeywords.size === 0) {
    showToast('Could not extract meaningful keywords from the job description.');
    return;
  }

  const resumeLower = resumeText.toLowerCase();

  const matched = new Set();
  const missing = new Set();

  for (const kw of jobKeywords) {
    // Check if the keyword appears as a word boundary match in the resume
    const regex = new RegExp('(?:^|[\\s\\-\\/\\.\\,\\;\\:\\(\\)])' + escapeRegex(kw) + '(?:$|[\\s\\-\\/\\.\\,\\;\\:\\(\\)])', 'i');
    if (regex.test(resumeLower)) {
      matched.add(kw);
    } else {
      missing.add(kw);
    }
  }

  const score = Math.round((matched.size / jobKeywords.size) * 100);

  // Populate UI
  renderResults(score, matched, missing);
}

/**
 * Render all result cards.
 */
function renderResults(score, matched, missing) {
  const results = document.getElementById('results');
  results.classList.remove('visible');

  // Force reflow so animation replays
  void results.offsetWidth;

  // Score
  animateScore(score);

  // Verdict
  const verdict = document.getElementById('scoreVerdict');
  if (score >= 70) {
    verdict.textContent = '🟢 Excellent Match';
    verdict.className = 'score-verdict excellent';
  } else if (score >= 40) {
    verdict.textContent = '🟡 Needs Improvement';
    verdict.className = 'score-verdict good';
  } else {
    verdict.textContent = '🔴 Low Match — Major Revision Needed';
    verdict.className = 'score-verdict poor';
  }

  // Counts
  document.getElementById('matchedCount').textContent = matched.size;
  document.getElementById('missingCount').textContent = missing.size;
  const total = matched.size + missing.size;
  document.getElementById('totalKeywordsLabel').textContent = `${total} meaningful keywords analyzed from job description`;

  // Matched badges
  const matchedContainer = document.getElementById('matchedBadges');
  matchedContainer.innerHTML = '';
  if (matched.size === 0) {
    matchedContainer.innerHTML = '<span class="no-keywords-msg">No matched keywords found.</span>';
  } else {
    for (const kw of Array.from(matched).sort()) {
      const span = document.createElement('span');
      span.className = 'badge badge-green';
      span.textContent = kw;
      matchedContainer.appendChild(span);
    }
  }

  // Missing badges
  const missingContainer = document.getElementById('missingBadges');
  missingContainer.innerHTML = '';
  if (missing.size === 0) {
    missingContainer.innerHTML = '<span class="no-keywords-msg">No missing keywords — great job!</span>';
  } else {
    for (const kw of Array.from(missing).sort()) {
      const span = document.createElement('span');
      span.className = 'badge badge-red';
      span.textContent = kw;
      missingContainer.appendChild(span);
    }
  }

  // Tips
  const tips = generateTips(missing, score, matched.size, missing.size);
  const tipsList = document.getElementById('tipsList');
  tipsList.innerHTML = '';
  tips.forEach((tip, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="tip-number">${i + 1}</span><span>${tip}</span>`;
    tipsList.appendChild(li);
  });

  // Show results with animation
  results.classList.add('visible');

  // Show copy button
  document.getElementById('copyBtn').style.display = 'inline-flex';

  // Scroll to results
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Clear all inputs and results.
 */
function clearAll() {
  document.getElementById('resumeInput').value = '';
  document.getElementById('jobInput').value = '';
  document.getElementById('results').classList.remove('visible');
  document.getElementById('copyBtn').style.display = 'none';

  // Reset ring
  const ring = document.getElementById('scoreRing');
  ring.style.strokeDashoffset = 502.65;
  document.getElementById('scoreNumber').innerHTML = '0<span class="percent">%</span>';
}

/**
 * Copy results summary to clipboard.
 */
function copyResults() {
  const score = document.getElementById('scoreNumber').textContent;
  const matchedCount = document.getElementById('matchedCount').textContent;
  const missingCount = document.getElementById('missingCount').textContent;

  const matchedBadges = Array.from(document.querySelectorAll('#matchedBadges .badge-green'))
    .map(b => b.textContent);
  const missingBadges = Array.from(document.querySelectorAll('#missingBadges .badge-red'))
    .map(b => b.textContent);
  const tips = Array.from(document.querySelectorAll('#tipsList li'))
    .map((li, i) => `${i + 1}. ${li.textContent.trim().substring(1)}`);

  const text = [
    `ATS Resume Score: ${score}`,
    `Matched Keywords (${matchedCount}): ${matchedBadges.join(', ') || 'None'}`,
    `Missing Keywords (${missingCount}): ${missingBadges.join(', ') || 'None'}`,
    '',
    'Actionable Tips:',
    ...tips,
    '',
    'Generated by ATS Resume Scorer — https://digitalheroesco.com'
  ].join('\n');

  navigator.clipboard.writeText(text).then(() => {
    showToast('Results copied to clipboard!');
  }).catch(() => {
    showToast('Could not copy — try selecting the text manually.');
  });
}

/**
 * Show a toast notification.
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/**
 * Escape special regex characters in a string.
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toggleDark() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  document.getElementById('darkToggle').textContent = isDark ? '☀️' : '🌙';
}

// On load, apply saved theme
(function() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.body.classList.add('dark');
    document.addEventListener('DOMContentLoaded', () => {
      const btn = document.getElementById('darkToggle');
      if (btn) btn.textContent = '☀️';
    });
  }
})();

