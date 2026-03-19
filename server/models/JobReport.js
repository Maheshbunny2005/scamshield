// ============================================================
// JobReport Model – stores job analysis results and user reports
// ============================================================
const mongoose = require("mongoose");

const jobReportSchema = new mongoose.Schema(
  {
    // Reference to the user who submitted this
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: { type: String, required: true },

    // Job details submitted by user
    companyName: { type: String, required: true, trim: true },
    jobDescription: { type: String, required: true },
    salary: { type: String, trim: true },
    contactEmail: { type: String, trim: true, lowercase: true },
    jobLink: { type: String, trim: true },

    // AI analysis results
    riskScore: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
    riskPercentage: { type: Number, default: 0 },
    flags: [{ type: String }],       // List of detected red flags
    explanation: { type: String },   // Human-readable summary

    // Community reporting
    isUserReport: { type: Boolean, default: false }, // true = manual scam report
    reportType: {
      type: String,
      enum: ["job_post", "scam_call", "phishing_email", "fake_website", "other"],
      default: "job_post",
    },

    // Community ratings
    ratings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
      },
    ],
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-calculate average rating before save
jobReportSchema.pre("save", function (next) {
  if (this.ratings && this.ratings.length > 0) {
    const total = this.ratings.reduce((sum, r) => sum + r.rating, 0);
    this.averageRating = +(total / this.ratings.length).toFixed(1);
  }
  next();
});

module.exports = mongoose.model("JobReport", jobReportSchema);
