import React, { useState } from "react";
import "./HomePage.css";

const HomePage = ({ goToUpload }) => {
  const infoCards = [
    {
      title: "What is SkillSnap?",
      description:
        "SkillSnap is an AI-powered career path recommender. It analyzes your resume and offers personalized guidance on skills to learn, job roles to explore, and relevant courses—helping you plan your career smarter.",
      icon: "🤖",
    },
    {
      title: "Who is it for?",
      description:
        "Job seekers looking for focused career guidance, students planning their professional path, and anyone who wants AI-driven insights into their skills and opportunities.",
      icon: "👤",
    },
    {
      title: "Why choose SkillSnap?",
      description:
        "It provides AI-powered, personalized recommendations without manual effort. Built serverlessly on AWS, it ensures scalability, security, and efficiency while helping users take informed career steps.",
      icon: "🎯",
    },
    {
      title: "How does it work?",
      description:
        "Upload your resume → AWS Textract extracts structured data → AI analyzes skills and education → Personalized career recommendations are stored in DynamoDB → Download a CSV summary or view insights online.",
      icon: "⚡",
    },
  ];

  // FAQ data
  const faqs = [
    {
      question: "How does SkillSnap analyze my resume?",
      answer:
        "SkillSnap uses AI to extract key skills, education, and experience from your resume, then maps them to relevant career paths and skill gaps.",
    },
    {
      question: "Is my resume data secure?",
      answer:
        "Yes. Your data is processed securely using encrypted communication and is never shared with third parties.",
    },
    {
      question: "What kind of recommendations will I receive?",
      answer:
        "You’ll get personalized skill suggestions, trending job roles, and learning resources tailored to your background.",
    },
    {
      question: "Can I download my career insights?",
      answer:
        "Absolutely. You can download your insights in PDF or CSV format for offline reference.",
    },
    {
      question: "What file formats are supported?",
      answer: "Currently, we support PDF, JPG, and PNG resume uploads.",
    },
    {
      question: "How accurate are the AI recommendations?",
      answer:
        "Our AI models are trained on thousands of job market data points and resume patterns, ensuring highly relevant suggestions.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="homepage-container">
      {/* INTRO SECTION */}
      <div className="homepage-intro-section">
        <div className="homepage-intro-content">
          <h1>Welcome to SkillSnap — Your AI Career Companion</h1>
          <p>
            SkillSnap helps you discover your strengths, explore career paths, and make smarter decisions.
            Upload your resume, and let AI reveal insights about your skills, growth areas, and opportunities — all in one place.
          </p>
          <button className="get-started-button" onClick={goToUpload}>
            Get Started Now →
          </button>
        </div>
        <div className="homepage-intro-image-wrapper">
          <img
            src="resume_analyzer.png"
            alt="Upload Resume on SkillSnap"
            className="homepage-intro-image"
          />
        </div>
      </div>

      {/* HEADER */}
      <div className="homepage-header">
        <h1>Everything You Need to Know</h1>
        <p>Understanding SkillSnap in 4 simple questions</p>
      </div>

      {/* INFO CARDS */}
      <div className="homepage-cards">
        {infoCards.map((card, index) => (
          <div key={index} className="homepage-card">
            <div className="homepage-card-icon">{card.icon}</div>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </div>
        ))}
      </div>

      {/* FAQ SECTION */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <p className="faq-subtitle">Everything you need to know about SkillSnap</p>

        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <span>{faq.question}</span>
                <span className="faq-arrow">
                  {activeIndex === index ? "▲" : "▼"}
                </span>
              </div>
              {activeIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;