import os
from groq import Groq

api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key)

def generate_recommendations(resume_text):
    prompt = f"""
    You are an expert AI career advisor integrated in a web app called SkillSnap.
    SkillSnap analyzes user resumes to guide career growth intelligently.

    TASK:
    Analyze the following resume and generate a detailed, structured response containing:
    
    1. **Extracted Skills** – List all technical, soft, and domain-specific skills found in the resume.
    2. **Education Summary** – Briefly describe the user's education background (degree, field, institution, etc.).
    3. **Experience Summary** – Mention the key roles, companies, and experiences identified.
    4. **Recommended Skills to Learn Next** – Suggest 5–8 new or advanced skills the user should learn based on their current profile.
    5. **Potential Job Roles** – Suggest 4–6 job roles that align with their background and skillset.
    6. **Relevant Online Courses or Certifications** – Recommend specific courses (e.g., from Coursera, Udemy, or LinkedIn Learning) that match the recommended skills.
    7. **Career Growth Advice** – Give 2–3 personalized suggestions to improve their resume or career trajectory.

    IMPORTANT:
    - Be concise, clear, and career-focused.
    - Format the output neatly with headings and bullet points.
    - Avoid generic advice; tailor the output based on the resume content.

    Here is the resume content:
    {resume_text}
    """

    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile"
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error generating recommendations: {e}"
