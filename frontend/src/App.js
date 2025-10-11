import React, { useState } from 'react';
import './App.css';

function App() {
  const [userName, setUserName] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : '');
  };

  const formatRecommendations = (text) => {
    if (!text) return '';
    
    let lines = text.split('\n');
    let formattedHTML = '';
    let inList = false;
    
    lines.forEach((line) => {
      line = line.trim();
      
      // Empty line
      if (!line) {
        if (inList) {
          formattedHTML += '</ul>';
          inList = false;
        }
        formattedHTML += '<br />';
        return;
      }
      
      // Handle headers - #### (h4), ### (h3), ## (h2), # (h1)
      if (line.startsWith('#### ')) {
        if (inList) { formattedHTML += '</ul>'; inList = false; }
        formattedHTML += '<h4 class="rec-h4">' + line.substring(5) + '</h4>';
      } else if (line.startsWith('### ')) {
        if (inList) { formattedHTML += '</ul>'; inList = false; }
        formattedHTML += '<h3 class="rec-h3">' + line.substring(4) + '</h3>';
      } else if (line.startsWith('## ')) {
        if (inList) { formattedHTML += '</ul>'; inList = false; }
        formattedHTML += '<h2 class="rec-h2">' + line.substring(3) + '</h2>';
      } else if (line.startsWith('# ')) {
        if (inList) { formattedHTML += '</ul>'; inList = false; }
        formattedHTML += '<h1 class="rec-h1">' + line.substring(2) + '</h1>';
      }
      // Handle bullet points (-, *, •)
      else if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
        if (!inList) {
          formattedHTML += '<ul class="rec-list">';
          inList = true;
        }
        let listItem = line.substring(2);
        // Handle bold in list items
        listItem = listItem.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedHTML += '<li>' + listItem + '</li>';
      }
      // Handle numbered lists
      else if (/^\d+\.\s/.test(line)) {
        if (!inList) {
          formattedHTML += '<ol class="rec-list-numbered">';
          inList = true;
        }
        let listItem = line.replace(/^\d+\.\s/, '');
        // Handle bold in list items
        listItem = listItem.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedHTML += '<li>' + listItem + '</li>';
      }
      // Regular paragraph
      else {
        if (inList) {
          formattedHTML += '</ul>';
          inList = false;
        }
        // Handle bold text **text**
        let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedHTML += '<p class="rec-paragraph">' + formatted + '</p>';
      }
    });
    
    // Close any open list
    if (inList) {
      formattedHTML += '</ul>';
    }
    
    return formattedHTML;
  };

  const formatResumeText = (text) => {
    if (!text) return '';
    return text.split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n\n');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please select a file.'); return; }
    const formData = new FormData();
    formData.append('user_name', userName);
    formData.append('file', file);
    setLoading(true); setError(null); setOutput(null);
    try {
      const res = await fetch('http://127.0.0.1:5000/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setOutput(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app"><header className="header"><div className="logo"><span className="logo-icon"></span><span className="logo-text">SkillSnap</span></div><p className="tagline">AI-Powered Resume Intelligence</p></header><div className="main-content"><div className="upload-card"><div className="card-header"><h2> Analyze Your Resume</h2><p>Upload your resume and get instant AI-powered insights</p></div><form onSubmit={handleSubmit} className="upload-form"><div className="form-group"><label className="form-label"><span className="label-icon"></span>Full Name</label><input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Enter your full name" className="form-input" required /></div><div className="form-group"><label className="form-label"><span className="label-icon"></span>Resume Document</label><div className="file-input-wrapper"><input type="file" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" className="file-input" id="file-upload" required /><label htmlFor="file-upload" className="file-label"><span className="upload-icon"></span>{fileName || 'Choose file (PDF, JPG, PNG)'}</label></div>{fileName && (<div className="file-selected"> Selected: <strong>{fileName}</strong></div>)}</div><button type="submit" disabled={loading} className="submit-btn">{loading ? (<><span className="btn-loader"></span><span>Analyzing...</span></>) : (<><span> Analyze Resume</span></>)}</button></form></div>{loading && (<div className="results-card loading-card"><div className="loading-content"><div className="loading-spinner"></div><h3>Processing Your Resume</h3><p>Our AI is analyzing your document...</p><div className="loading-steps"><div className="step"> Uploading to secure cloud</div><div className="step"> Extracting text content</div><div className="step active"> Generating AI recommendations</div></div></div></div>)}{error && (<div className="results-card error-card"><div className="error-icon"></div><h3>Oops! Something went wrong</h3><p className="error-message">{error}</p><button onClick={() => setError(null)} className="retry-btn">Try Again</button></div>)}{output && !loading && (<div className="results-container"><div className="success-badge"><span className="badge-icon"></span>Analysis Complete!</div><div className="results-card"><div className="card-section-header"><span className="section-icon"></span><h3>Extracted Resume Content</h3></div><div className="content-box"><pre className="resume-text">{formatResumeText(output.resume_text)}</pre></div></div><div className="results-card recommendations-card"><div className="card-section-header"><span className="section-icon"></span><h3>AI-Powered Recommendations</h3></div><div className="content-box recommendations-content"><div className="recommendations-formatted" dangerouslySetInnerHTML={{ __html: formatRecommendations(output.recommendations) }} /></div></div><div className="download-card"><div className="download-content"><span className="download-icon"></span><div className="download-info"><h4>Your resume is securely stored</h4><p>Access your document anytime from cloud storage</p></div><a href={output.presigned_url} target="_blank" rel="noopener noreferrer" className="download-btn"><span></span>Download from S3</a></div></div></div>)}</div><footer className="footer"><p>Powered by AI  Secured by AWS  Built with </p></footer></div>
  );
}

export default App;
