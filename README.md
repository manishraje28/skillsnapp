# 🚀 SkillSnap

## About SkillSnap

SkillSnap is an **AI-powered career path recommender**. It analyzes your resume and provides personalized guidance to help you plan your career smarter.

---

## ☁️ Cloud Services Powering SkillSnap

### 📦 AWS S3 (Storage)

Used to securely store uploaded resumes (PDF/Image) and host the high-speed frontend application.

### 📄 Amazon Textract (OCR)

Leveraged to automatically extract structured data, including skills, experience, and education, from resumes.

### 🗄️ AWS DynamoDB (DB)

A flexible NoSQL database storing parsed resume data, user profiles, and AI-generated career recommendations.

---

## ⚙️ How SkillSnap Works

### 1. Resume Upload

Users upload a resume (PDF/Image) via a secure web interface, triggering the serverless workflow.

### 2. Data Extraction

Amazon Textract is invoked, extracting all relevant structured text and tabular data.

### 3. AI Analysis

The extracted skills, experience, and education data are fed to the AI engine for analysis.

### 4. Recommendation Generation

Personalized, data-driven career recommendations and skill gaps are generated.

### 5. Storage & Export

Recommendations are stored in DynamoDB for history and can be exported as a CSV file.

---

## 🔄 Workflow Diagram

```text
User Uploads Resume
         │
         ▼
      AWS S3
         │
         ▼
 Amazon Textract
         │
         ▼
Extracted Resume Data
(Skills, Experience,
   Education)
         │
         ▼
     AI Engine
         │
         ▼
Career Recommendations
 & Skill Gap Analysis
         │
         ▼
   AWS DynamoDB
         │
         ▼
 CSV Export & History
```

---

## 🌟 Vision

Transform your resume data into a clear, actionable career path with SkillSnap's secure AI platform.
