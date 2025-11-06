import React from 'react';
import { CloudCog, FileText, Database } from 'lucide-react';
import './AboutPage.css';

/**
 * Reusable component for the AWS Service Cards.
 * It uses Lucide icons and applies dynamic color styling via props.
 */
const CardIcon = ({ icon: IconComponent, color, title, description }) => (
    <div 
        // Applies all standard styling (shadow, rounded corners, padding)
        className="aws-card"
        // Applies the dynamic color border at the top
        style={{ borderColor: color }} 
    >
        <div className="card-header">
            {/* Renders the icon with dynamic color */}
            <IconComponent className="w-8 h-8" style={{ color: color }} />
            <h3 className="card-title">{title}</h3>
        </div>
        <p className="card-description">{description}</p>
    </div>
);

const AboutPage = () => {
    return (
        <div className="about-container">
            
            {/* Hero Section */}
            <section className="about-hero">
                <h1 style={{
                    // Gradient text for a modern, high-impact title
                    background: 'linear-gradient(90deg, #3b82f6 0%, #ff6b6b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    About SkillSnap
                </h1>
                <p>
                    SkillSnap is an *AI-powered career path recommender*. It analyzes your resume and provides personalized guidance to help you plan your career smarter.
                </p>
            </section>

            {/* AWS Services Section (Colorful Cards with Icons) */}
            <section className="about-aws">
                <h2 className="section-title">
                    Cloud Services Powering SkillSnap
                    <div className="title-divider"></div>
                </h2>
                
                <div className="aws-cards">
                    
                    {/* AWS S3 Card (CloudCog icon, Coral color) */}
                    <CardIcon 
                        icon={CloudCog}
                        color="#ff6b6b" // Vibrant Coral
                        title="AWS S3 (Storage)"
                        description="Used to securely store uploaded resumes (PDF/Image) and host the high-speed frontend application."
                    />

                    {/* Amazon Textract Card (FileText icon, Blue color) */}
                    <CardIcon 
                        icon={FileText}
                        color="#3b82f6" // Bright Blue
                        title="Amazon Textract (OCR)"
                        description="Leveraged to automatically extract structured data, including skills, experience, and education, from resumes."
                    />
                    
                    {/* AWS DynamoDB Card (Database icon, Yellow color) */}
                    <CardIcon 
                        icon={Database}
                        color="#ffd166" // Sunny Yellow/Accent
                        title="AWS DynamoDB (DB)"
                        description="A flexible NoSQL database storing parsed resume data, user profiles, and AI-generated career recommendations."
                    />

                </div>
            </section>

            {/* How It Works Section (Detailed Workflow Steps) */}
            <section className="about-workflow">
                <h2 className="section-title">
                    How SkillSnap Works
                    <div className="title-divider"></div>
                </h2>
                
                <div className="workflow-content">
                    
                    {/* Workflow Steps List */}
                    <ol className="workflow-steps">
                        {[
                            "User uploads resume (PDF/Image) via a secure web interface, triggering the serverless workflow.",
                            "Amazon Textract is invoked, extracting all relevant structured text and tabular data.",
                            "The extracted skills, experience, and education data are fed to the AI engine for analysis.",
                            "Personalized, data-driven career recommendations and skill gaps are generated.",
                            "Recommendations are stored in DynamoDB for history and can be exported as a CSV file.",
                        ].map((step, index) => (
                            // Each step uses custom styling for the numbering bubble and hover effect
                            <li key={index} className="workflow-step-item">
                                <div className="step-number">
                                    {index + 1}
                                </div>
                                <span className="step-text">{step}</span>
                            </li>
                        ))}
                    </ol>
                    
                    {/* Workflow Image (Placeholder with Fallback) */}
                    <div className="workflow-image">
                        {/* Using a placeholder image that fits the theme */}
                        <img 
                            src="archi.png" 
                            alt="Workflow Diagram" 
                            // Add an onError fallback for robustness
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/9ca3af/ffffff?text=Architecture+Diagram"; }}
                        />
                    </div>
                </div>
            </section>


            {/* Final Conclusion Text (Single Catchy Sentence) */}
            <section className="about-conclusion">
                <p className="conclusion-text" style={{
                    // Text gradient for an attractive, vibrant look
                    background: 'linear-gradient(45deg, #3b82f6 30%, #ff6b6b 80%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Transform your resume data into a clear, actionable career path with SkillSnap's secure AI platform.
                </p>
            </section>
            
        </div>
    );
};

export default AboutPage;