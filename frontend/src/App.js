import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Companies from './pages/Companies';
import EligibilityChecker from './pages/EligibilityChecker';
import ResumeReviewer from './pages/ResumeReviewer';
import InterviewQuestions from './pages/InterviewQuestions';
import EmailGenerator from './pages/EmailGenerator';
import Chatbot from './pages/Chatbot';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/eligibility" element={<EligibilityChecker />} />
              <Route path="/resume-review" element={<ResumeReviewer />} />
              <Route path="/interview-questions" element={<InterviewQuestions />} />
              <Route path="/email-generator" element={<EmailGenerator />} />
              <Route path="/chatbot" element={<Chatbot />} />
            </Route>
          </Route>

          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
