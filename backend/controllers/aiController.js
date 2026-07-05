const { askGroq } = require('../services/groqService');
const ChatHistory = require('../models/ChatHistory');
const Student = require('../models/Student');
const Company = require('../models/Company');

// 1. Eligibility Checker
exports.checkEligibility = async (req, res) => {
  try {
    const { studentId, companyId } = req.body;
    const student = await Student.findById(studentId);
    const company = await Company.findById(companyId);

    if (!student || !company) {
      return res.status(404).json({ message: 'Student or Company not found' });
    }

    const prompt = `You are an experienced Placement Officer.

Student:
CGPA: ${student.cgpa}
Department: ${student.department}
Arrears: ${student.arrears}
Graduation Year: ${student.graduationYear}
Skills: ${student.skills.join(', ')}

Company: ${company.companyName}
Minimum CGPA: ${company.cgpaCriteria}
Max Arrears Allowed: ${company.maxArrears}
Departments Allowed: ${company.departmentsAllowed.join(', ') || 'Any'}
Required Skills: ${company.requiredSkills.join(', ')}

Step 1: Check CGPA.
Step 2: Check Department.
Step 3: Check Arrears.
Step 4: Check Skills.
Step 5: Give a final verdict: Eligible or Not Eligible, with a short explanation.
If not eligible, suggest concrete improvements.`;

    const result = await askGroq(prompt);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. AI Resume Reviewer
exports.reviewResume = async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) return res.status(400).json({ message: 'resumeText is required' });

    const prompt = `You are an HR Recruiter reviewing a resume.

Resume:
"""
${resumeText}
"""

Provide the response in this exact structure:
Resume Score (/100):
ATS Compatibility:
Strengths:
Weaknesses:
Missing Skills:
Suggestions:`;

    const result = await askGroq(prompt);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. AI Interview Question Generator
exports.generateInterviewQuestions = async (req, res) => {
  try {
    const { companyName, topic, count } = req.body;
    const prompt = `Generate ${count || 15} ${topic || 'technical'} interview questions for ${
      companyName || 'a top IT company'
    }.

Group them by difficulty:
Easy
Medium
Hard`;

    const result = await askGroq(prompt);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. AI Email Generator
exports.generateEmail = async (req, res) => {
  try {
    const { type, companyName, date, venue, tone, studentName } = req.body;

    const prompt = `Write a professional ${type || 'interview invitation'} email.

Company: ${companyName || 'N/A'}
Student: ${studentName || 'N/A'}
Date: ${date || 'N/A'}
Venue: ${venue || 'N/A'}
Tone: ${tone || 'Professional'}

Keep it concise and ready to send.`;

    const result = await askGroq(prompt);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5. Student Chatbot
exports.chat = async (req, res) => {
  try {
    const { user, question } = req.body;
    if (!question) return res.status(400).json({ message: 'question is required' });

    const prompt = `You are a friendly and knowledgeable Placement Cell Assistant chatbot for a college.
Answer the student's question clearly and helpfully.

Student question: "${question}"`;

    const answer = await askGroq(prompt);

    await ChatHistory.create({ user: user || 'anonymous', question, answer });

    res.json({ answer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const history = await ChatHistory.find().sort({ createdAt: -1 }).limit(50);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
