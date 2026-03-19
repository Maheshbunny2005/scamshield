// ============================================================
// Scam Detection Engine – rule-based AI analysis
// ============================================================

// Keywords that are strong indicators of scams
const HIGH_RISK_KEYWORDS = [
  "pay to apply",
  "pay money",
  "registration fee",
  "training fee",
  "deposit required",
  "send money",
  "wire transfer",
  "work from home guaranteed",
  "no experience needed earn",
  "make money fast",
  "get rich",
  "unlimited income",
  "100% guaranteed",
  "secret job",
  "government approved",
  "lottery",
  "inheritance",
];

const MEDIUM_RISK_KEYWORDS = [
  "urgent hiring",
  "immediate joining",
  "whatsapp only",
  "no interview",
  "work from home",
  "part time earn",
  "data entry earn",
  "online job earn",
  "bitcoin",
  "crypto payment",
  "cash payment only",
  "no questions asked",
  "call immediately",
];

// Suspicious email domains (free providers used for scams)
const SUSPICIOUS_DOMAINS = [
  "tempmail.com",
  "guerrillamail.com",
  "throwam.com",
  "mailnull.com",
  "sharklasers.com",
];

// Legitimate company domains that are often spoofed
const SPOOFED_PATTERNS = [
  /google[^.]*\.com/i,
  /microsoft[^.]*\.com/i,
  /amazon[^.]*\.com/i,
  /infosys[^.]*\.com/i,
  /tcs[^.]*\.com/i,
];

/**
 * Analyzes a job posting for scam indicators
 * @param {Object} jobData - { companyName, jobDescription, salary, contactEmail }
 * @returns {Object} - { riskScore, riskPercentage, flags, explanation }
 */
const analyzeJob = (jobData) => {
  const { companyName, jobDescription, salary, contactEmail } = jobData;
  const flags = [];
  let riskPoints = 0;

  const descLower = (jobDescription || "").toLowerCase();
  const salaryStr = (salary || "").toLowerCase();
  const emailStr = (contactEmail || "").toLowerCase();
  const companyLower = (companyName || "").toLowerCase();

  // ── 1. High-risk keyword detection ──────────────────────
  HIGH_RISK_KEYWORDS.forEach((kw) => {
    if (descLower.includes(kw)) {
      flags.push(`🚨 High-risk phrase detected: "${kw}"`);
      riskPoints += 20;
    }
  });

  // ── 2. Medium-risk keyword detection ────────────────────
  MEDIUM_RISK_KEYWORDS.forEach((kw) => {
    if (descLower.includes(kw)) {
      flags.push(`⚠️ Suspicious phrase: "${kw}"`);
      riskPoints += 8;
    }
  });

  // ── 3. Unrealistic salary detection ─────────────────────
  const salaryNumbers = salaryStr.match(/[\d,]+/g);
  if (salaryNumbers) {
    const maxSalary = Math.max(
      ...salaryNumbers.map((n) => parseInt(n.replace(/,/g, ""), 10))
    );
    // Flag if salary mentions per day/week amounts that seem too high
    if (
      (salaryStr.includes("per day") || salaryStr.includes("/day")) &&
      maxSalary > 5000
    ) {
      flags.push(`💰 Unrealistic daily salary: ${salary}`);
      riskPoints += 25;
    }
    if (
      (salaryStr.includes("lakh") || salaryStr.includes("lac")) &&
      maxSalary > 20
    ) {
      flags.push(`💰 Extremely high salary claim: ${salary}`);
      riskPoints += 15;
    }
  }
  if (
    salaryStr.includes("unlimited") ||
    salaryStr.includes("no limit") ||
    salaryStr.includes("earn as much")
  ) {
    flags.push(`💰 Unlimited earnings claim is a classic scam indicator`);
    riskPoints += 20;
  }

  // ── 4. Contact email analysis ────────────────────────────
  if (contactEmail) {
    // Check for suspicious free domains
    if (SUSPICIOUS_DOMAINS.some((d) => emailStr.includes(d))) {
      flags.push(`📧 Temporary/disposable email address detected`);
      riskPoints += 30;
    }

    // Check for spoofed company domains
    if (SPOOFED_PATTERNS.some((p) => p.test(emailStr))) {
      const domain = emailStr.split("@")[1];
      if (!["google.com", "microsoft.com", "amazon.com"].includes(domain)) {
        flags.push(`📧 Email domain appears to spoof a major company`);
        riskPoints += 25;
      }
    }

    // Generic email for a "company" is suspicious
    if (
      (emailStr.includes("gmail.com") || emailStr.includes("yahoo.com")) &&
      companyLower.length > 3
    ) {
      flags.push(
        `📧 Company using personal email (${contactEmail}) instead of corporate domain`
      );
      riskPoints += 10;
    }
  }

  // ── 5. Too-short or vague description ───────────────────
  if (jobDescription && jobDescription.trim().split(" ").length < 20) {
    flags.push(`📝 Job description is unusually short and vague`);
    riskPoints += 10;
  }

  // ── 6. All caps company name ─────────────────────────────
  if (
    companyName &&
    companyName === companyName.toUpperCase() &&
    companyName.length > 4
  ) {
    flags.push(`🏢 Company name written in all caps – common in fake postings`);
    riskPoints += 5;
  }

  // ── 7. Calculate final risk level ───────────────────────
  const riskPercentage = Math.min(riskPoints, 100);
  let riskScore = "Low";
  if (riskPercentage >= 60) riskScore = "High";
  else if (riskPercentage >= 30) riskScore = "Medium";

  // ── 8. Build explanation ─────────────────────────────────
  let explanation = "";
  if (riskScore === "Low") {
    explanation =
      "This job posting appears relatively safe based on our analysis. No major red flags were detected. Always verify by researching the company independently.";
  } else if (riskScore === "Medium") {
    explanation = `This posting contains ${flags.length} suspicious indicator(s). Proceed with caution. Research the company thoroughly before sharing personal information or applying.`;
  } else {
    explanation = `HIGH RISK: This posting contains ${flags.length} serious red flag(s) commonly associated with job scams. We strongly advise against engaging with this posting. Do not pay any fees or share sensitive personal information.`;
  }

  return { riskScore, riskPercentage, flags, explanation };
};

module.exports = { analyzeJob };
