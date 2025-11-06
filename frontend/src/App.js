import React, { useState } from "react";
import "./App.css";
import { FaFileAlt } from "react-icons/fa";
import Login from "./Login";
import HomePage from "./HomePage";
import AboutPage from "./AboutPage";

function App() {
  // Page states
  const [showLogin, setShowLogin] = useState(false);
  const [currentPage, setCurrentPage] = useState("home"); // "home", "upload", "about"

  // Resume upload states
  const [userName, setUserName] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // File change handler
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : "");
  };

  // Format resume text
  const formatResumeText = (text) => {
    if (!text) return "";
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n\n");
  };

  // Format recommendations - removes all markdown symbols and formats professionally
  const formatRecommendations = (text) => {
    if (!text) return "";
    
    // Check if text is a string
    if (typeof text !== 'string') {
      text = String(text);
    }
    
    let lines = text.split("\n");
    let formattedHTML = "";
    let inList = false;
    let listType = "ul"; // Track if we're in ul or ol

    lines.forEach((line) => {
      line = line.trim();
      
      // Empty line
      if (!line) {
        if (inList) { 
          formattedHTML += `</${listType}>`;
          inList = false; 
        }
        formattedHTML += "<br />";
        return;
      }
      
      // Handle headers - #### (h4), ### (h3), ## (h2), # (h1)
      if (line.startsWith("#### ")) {
        if (inList) { formattedHTML += `</${listType}>`; inList = false; }
        let headerText = line.substring(5).replace(/\*\*/g, ''); // Remove **
        formattedHTML += `<h4 class="rec-h4">${headerText}</h4>`;
      } 
      else if (line.startsWith("### ")) {
        if (inList) { formattedHTML += `</${listType}>`; inList = false; }
        let headerText = line.substring(4).replace(/\*\*/g, ''); // Remove **
        formattedHTML += `<h3 class="rec-h3">${headerText}</h3>`;
      } 
      else if (line.startsWith("## ")) {
        if (inList) { formattedHTML += `</${listType}>`; inList = false; }
        let headerText = line.substring(3).replace(/\*\*/g, ''); // Remove **
        formattedHTML += `<h2 class="rec-h2">${headerText}</h2>`;
      } 
      else if (line.startsWith("# ")) {
        if (inList) { formattedHTML += `</${listType}>`; inList = false; }
        let headerText = line.substring(2).replace(/\*\*/g, ''); // Remove **
        formattedHTML += `<h1 class="rec-h1">${headerText}</h1>`;
      }
      // Handle bullet points (-, *, •)
      else if (line.startsWith("- ") || line.startsWith("* ") || line.startsWith("• ")) {
        if (!inList) { 
          formattedHTML += '<ul class="rec-list">'; 
          inList = true;
          listType = "ul";
        } else if (listType === "ol") {
          formattedHTML += '</ol><ul class="rec-list">';
          listType = "ul";
        }
        let listItem = line.substring(2);
        // Remove ** but keep the text bold with strong tags
        listItem = listItem.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedHTML += `<li>${listItem}</li>`;
      }
      // Handle numbered lists
      else if (/^\d+\.\s/.test(line)) {
        if (!inList) { 
          formattedHTML += '<ol class="rec-list-numbered">'; 
          inList = true;
          listType = "ol";
        } else if (listType === "ul") {
          formattedHTML += '</ul><ol class="rec-list-numbered">';
          listType = "ol";
        }
        let listItem = line.replace(/^\d+\.\s/, '');
        // Remove ** but keep the text bold with strong tags
        listItem = listItem.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedHTML += `<li>${listItem}</li>`;
      }
      // Regular paragraph
      else {
        if (inList) { 
          formattedHTML += `</${listType}>`; 
          inList = false; 
        }
        // Remove ** but keep the text bold with strong tags
        let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Also handle other markdown symbols
        formatted = formatted.replace(/\*/g, ''); // Remove stray *
        formatted = formatted.replace(/#{1,6}\s/g, ''); // Remove any # symbols
        formattedHTML += `<p class="rec-paragraph">${formatted}</p>`;
      }
    });

    // Close any open list
    if (inList) { 
      formattedHTML += `</${listType}>`; 
    }
    
    return formattedHTML;
  };

  // Handle resume upload submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError("Please select a file."); return; }

    const formData = new FormData();
    formData.append("user_name", userName);
    formData.append("file", file);

    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }
      setOutput(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage goToUpload={() => setCurrentPage("upload")} />;
      case "about":
        return <AboutPage />;
      case "upload":
        return (
          <div className="main-content">
            <div className="upload-card">
              <div className="card-header">
                <h2>Analyze Your Resume</h2>
                <p>Upload your resume and get AI-powered career recommendations</p>
              </div>

              <form onSubmit={handleSubmit} className="upload-form">
                <div className="form-group">
                  <label className="form-label">
                    <FaFileAlt className="label-icon" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your full name"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FaFileAlt className="label-icon" /> Resume Document
                  </label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="file-input"
                      id="file-upload"
                      required
                    />
                    <label htmlFor="file-upload" className="file-label">
                      {fileName || "Choose file (PDF, JPG, PNG)"}
                    </label>
                  </div>
                  {fileName && (
                    <div className="file-selected">
                      Selected: <strong>{fileName}</strong>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn submit-btn"
                  disabled={loading}
                >
                  {loading ? "Analyzing..." : "Analyze Resume"}
                </button>
              </form>

              {loading && (
                <div className="results-card loading-card">
                  <h3>Processing Your Resume...</h3>
                </div>
              )}
              {error && (
                <div className="results-card error-card">
                  <h3>{error}</h3>
                </div>
              )}
              {output && !loading && (
                <div className="results-container">
                  <div className="results-card">
                    <h3>Extracted Resume Content</h3>
                    <div className="content-box">
                      <pre>{formatResumeText(output.resume_text)}</pre>
                    </div>
                  </div>
                  <div className="results-card">
                    <h3>AI-Powered Recommendations</h3>
                    <div
                      className="content-box"
                      dangerouslySetInnerHTML={{
                        __html: formatRecommendations(output.recommendations),
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return <HomePage goToUpload={() => setCurrentPage("upload")} />;
    }
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div className="logo">
          <FaFileAlt className="logo-icon" />
          <span className="logo-text">SkillSnap</span>
        </div>
        <p className="tagline">AI-Powered Career Path Recommender</p>

        {/* NAV BUTTONS */}
        <div className="header-buttons">
          <button className="btn login-btn" onClick={() => setShowLogin(true)}>
            Login
          </button>
          <button className="btn home-btn" onClick={() => setCurrentPage("home")}>
            Home
          </button>
          <button className="btn upload-btn" onClick={() => setCurrentPage("upload")}>
            Upload Resume
          </button>
          <button className="btn about-btn" onClick={() => setCurrentPage("about")}>
            About
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main>{renderPage()}</main>

      {/* FOOTER */}
      <footer className="footer">
        <p>✨ Powered by AI • Secured by AWS • Built with 💻 React</p>
      </footer>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="login-overlay">
          <div className="login-popup">
            <button className="close-btn" onClick={() => setShowLogin(false)}>
              ✕
            </button>
            <Login />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;