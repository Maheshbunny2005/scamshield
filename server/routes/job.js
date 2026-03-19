// ============================================================
// Job Routes – analyze, report, rate job postings
// ============================================================
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { protect } = require("../middleware/auth");
const JobReport = require("../models/JobReport");
const { analyzeJob } = require("../config/scamDetector");

// ── POST /api/job/analyze ────────────────────────────────────
// Analyze a job posting for scam indicators
router.post(
  "/analyze",
  protect,
  [
    body("companyName").trim().notEmpty().withMessage("Company name is required"),
    body("jobDescription").trim().notEmpty().withMessage("Job description is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { companyName, jobDescription, salary, contactEmail } = req.body;

    try {
      // Run scam detection engine
      const analysis = analyzeJob({ companyName, jobDescription, salary, contactEmail });

      // Save analysis to DB
      const report = await JobReport.create({
        user: req.user._id,
        userName: req.user.name,
        companyName,
        jobDescription,
        salary,
        contactEmail,
        ...analysis,
      });

      res.status(201).json({
        message: "Analysis complete",
        reportId: report._id,
        ...analysis,
      });
    } catch (err) {
      console.error("Analyze error:", err.message);
      res.status(500).json({ message: "Analysis failed. Please try again." });
    }
  }
);

// ── GET /api/job/reports ─────────────────────────────────────
// Get all community reports (latest 20)
router.get("/reports", protect, async (req, res) => {
  try {
    const reports = await JobReport.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select("-ratings"); // exclude raw ratings array for cleaner response

    res.json({ reports });
  } catch (err) {
    console.error("Get reports error:", err.message);
    res.status(500).json({ message: "Failed to fetch reports." });
  }
});

// ── POST /api/job/report ─────────────────────────────────────
// Manually report a scam (job link / call / email)
router.post(
  "/report",
  protect,
  [
    body("companyName").trim().notEmpty().withMessage("Company name is required"),
    body("jobDescription").trim().notEmpty().withMessage("Description is required"),
    body("reportType").isIn(["job_post", "scam_call", "phishing_email", "fake_website", "other"])
      .withMessage("Invalid report type"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { companyName, jobDescription, salary, contactEmail, jobLink, reportType } = req.body;

    try {
      // Also run analysis on manual reports
      const analysis = analyzeJob({ companyName, jobDescription, salary, contactEmail });

      const report = await JobReport.create({
        user: req.user._id,
        userName: req.user.name,
        companyName,
        jobDescription,
        salary,
        contactEmail,
        jobLink,
        reportType,
        isUserReport: true,
        ...analysis,
      });

      res.status(201).json({ message: "Scam reported successfully!", report });
    } catch (err) {
      console.error("Report error:", err.message);
      res.status(500).json({ message: "Failed to submit report." });
    }
  }
);

// ── POST /api/job/rate ───────────────────────────────────────
// Rate a job report (1-5 stars trust score)
router.post(
  "/rate",
  protect,
  [
    body("reportId").notEmpty().withMessage("Report ID is required"),
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { reportId, rating } = req.body;

    try {
      const report = await JobReport.findById(reportId);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      // Check if user already rated
      const existingRating = report.ratings.find(
        (r) => r.userId.toString() === req.user._id.toString()
      );

      if (existingRating) {
        existingRating.rating = rating; // update existing rating
      } else {
        report.ratings.push({ userId: req.user._id, rating });
      }

      await report.save();

      res.json({
        message: "Rating submitted",
        averageRating: report.averageRating,
      });
    } catch (err) {
      console.error("Rating error:", err.message);
      res.status(500).json({ message: "Failed to submit rating." });
    }
  }
);

// ── GET /api/job/my-reports ──────────────────────────────────
// Get current user's own reports
router.get("/my-reports", protect, async (req, res) => {
  try {
    const reports = await JobReport.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ reports });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your reports." });
  }
});

module.exports = router;
