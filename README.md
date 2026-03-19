# 🛡️ ScamShield – Fake Job & Scam Detection Platform

A full-stack web application that helps job seekers detect fraudulent job postings using AI-based rule analysis and community reporting.

---

## 🧩 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Axios |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB (Mongoose ODM)              |
| Auth       | JWT + bcryptjs                      |

---

## 📁 Project Structure

```
scamshield/
├── server/                    # Node.js + Express backend
│   ├── index.js               # Server entry point
│   ├── .env                   # Environment variables
│   ├── package.json
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── JobReport.js       # Job report schema
│   ├── routes/
│   │   ├── auth.js            # /api/auth/signup, /api/auth/login
│   │   └── job.js             # /api/job/* routes
│   ├── middleware/
│   │   └── auth.js            # JWT protect middleware
│   └── config/
│       └── scamDetector.js    # AI scam detection engine
│
└── client/                    # React + Vite frontend
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx            # Routes + Protected routes
        ├── index.css          # Tailwind + global styles
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Signup.jsx
        │   └── Dashboard.jsx
        └── components/
            ├── Navbar.jsx
            ├── RiskResult.jsx
            ├── AnalyzeTab.jsx
            ├── ReportsTab.jsx
            ├── ReportScamTab.jsx
            └── ActivityTab.jsx
```

---

## ⚙️ Prerequisites

Make sure you have these installed:
- **Node.js** v18+ → https://nodejs.org
- **MongoDB** (local) → https://www.mongodb.com/try/download/community
  - OR use **MongoDB Atlas** (free cloud DB) → https://www.mongodb.com/atlas

---

## 🚀 Setup & Run Instructions

### Step 1 – Clone / Download the project

```bash
# If downloaded as zip, extract it first
cd scamshield
```

### Step 2 – Setup the Backend (Server)

```bash
cd server
npm install
```

Edit `.env` if needed:
```env
MONGO_URI=mongodb://localhost:27017/scamshield
JWT_SECRET=scamshield_super_secret_jwt_key_2024_change_in_production
PORT=5000
CLIENT_URL=http://localhost:5173
```

> 💡 If using MongoDB Atlas, replace MONGO_URI with your Atlas connection string.

Start the server:
```bash
# Development (auto-restart)
npm run dev

# Or production
npm start
```

You should see:
```
✅ MongoDB connected
🚀 ScamShield server running on port 5000
```

### Step 3 – Setup the Frontend (Client)

Open a **new terminal**:

```bash
cd client
npm install
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

### Step 4 – Open in Browser

Visit: **http://localhost:5173**

---

## 🔐 API Endpoints

### Auth Routes
| Method | Endpoint           | Description         | Auth Required |
|--------|--------------------|---------------------|---------------|
| POST   | /api/auth/signup   | Register new user   | No            |
| POST   | /api/auth/login    | Login, get JWT      | No            |

### Job Routes
| Method | Endpoint              | Description                     | Auth Required |
|--------|-----------------------|---------------------------------|---------------|
| POST   | /api/job/analyze      | Analyze job for scams           | ✅ Yes         |
| GET    | /api/job/reports      | Get all community reports       | ✅ Yes         |
| POST   | /api/job/report       | Submit a manual scam report     | ✅ Yes         |
| POST   | /api/job/rate         | Rate a report (1-5 stars)       | ✅ Yes         |
| GET    | /api/job/my-reports   | Get current user's reports      | ✅ Yes         |

---

## 🧪 Sample Test Data

### Test User Signup
```json
{
  "name": "Ravi Kumar",
  "email": "ravi@example.com",
  "password": "password123"
}
```

### Test Job Analysis – HIGH RISK (will trigger alerts)
```json
{
  "companyName": "GOOGLE JOBS INDIA",
  "jobDescription": "Urgent hiring! Work from home guaranteed. No experience needed earn ₹50,000 per day. Pay registration fee of ₹2000 to apply. Get rich with our secret government approved program. 100% guaranteed income. Whatsapp only.",
  "salary": "Unlimited income, earn as much as you want",
  "contactEmail": "hr.google.jobs@gmail.com"
}
```

### Test Job Analysis – LOW RISK (should pass)
```json
{
  "companyName": "Infosys Limited",
  "jobDescription": "We are looking for a Software Engineer with 2+ years of experience in Java and Spring Boot. The candidate should have good knowledge of REST APIs and microservices. You will work with a team of 10 engineers on enterprise applications. Interview process includes 2 technical rounds.",
  "salary": "₹8-12 LPA",
  "contactEmail": "careers@infosys.com"
}
```

### Test Scam Report
```json
{
  "companyName": "Fake TCS Recruiter",
  "jobDescription": "I received a call from someone claiming to be from TCS HR. They asked me to pay ₹5000 training fee before joining. When I checked TCS website, there was no such opening.",
  "reportType": "scam_call",
  "contactEmail": "tcs.hr.india@yahoo.com"
}
```

---

## 🧠 How the Scam Detector Works

The AI engine in `server/config/scamDetector.js` uses rule-based analysis:

1. **High-risk keywords** (20 pts each): "pay to apply", "registration fee", "pay money", "get rich", etc.
2. **Medium-risk keywords** (8 pts each): "urgent hiring", "whatsapp only", "no interview", etc.
3. **Unrealistic salary** (15-25 pts): e.g., "₹50,000 per day", "unlimited income"
4. **Suspicious email** (10-30 pts): Gmail for company, temp domains, spoofed domains
5. **Vague description** (10 pts): Less than 20 words
6. **All-caps company name** (5 pts)

**Risk Score:**
- 0–29 pts → 🟢 Low Risk
- 30–59 pts → 🟡 Medium Risk  
- 60–100 pts → 🔴 High Risk

---

## 🔐 Security Features

- Passwords hashed with **bcryptjs** (12 salt rounds)
- **JWT tokens** expire in 7 days
- All job routes are **protected** by middleware
- Input validation using **express-validator**
- CORS restricted to frontend origin

---

## 🎨 UI Features

- Dark mode by default
- Fully responsive (mobile + desktop)
- Animated risk meter bar
- Star rating system
- Real-time password strength indicator
- Toast-free but clear error/success states

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB connection failed | Make sure MongoDB is running: `mongod` |
| Port already in use | Change PORT in .env or kill process on port 5000 |
| CORS error | Check CLIENT_URL in server .env matches your frontend URL |
| npm install fails | Try `npm install --legacy-peer-deps` |

---

## 📄 License

MIT – Free to use and modify for educational purposes.
