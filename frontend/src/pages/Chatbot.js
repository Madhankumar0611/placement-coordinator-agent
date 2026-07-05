import React, { useRef, useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import api from '../services/api';

const STARTERS = [
  'Am I eligible for Zoho?',
  'When is the next drive?',
  "What's the package for TCS Digital?",
  'Give me interview tips for a first drive.',
];

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm the placement cell assistant. Ask me about eligibility, drives, packages, or interview prep." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const question = text ?? input;
    if (!question.trim()) return;
    setMessages((m) => [...m, { role: 'user', text: question }]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { user: 'student-demo', question });
      setMessages((m) => [...m, { role: 'bot', text: data.answer }]);
    } catch {
      setMessages((m) => [...m, { role: 'bot', text: "I couldn't reach the AI service. Make sure the backend is running and GEMINI_API_KEY is set." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Topbar eyebrow="AI Tool" title="Student Chatbot" />
      <div className="page-content">
        <div className="card" style={{ maxWidth: 720 }}>
          <div className="chat-window" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role}`}>{m.text}</div>
            ))}
            {loading && <div className="chat-bubble bot">Thinking…</div>}
          </div>

          <div className="flex-wrap gap-8" style={{ marginBottom: 12 }}>
            {STARTERS.map((s) => (
              <button key={s} className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            style={{ display: 'flex', gap: 10 }}
          >
            <input
              style={{
                flex: 1, border: '1px solid var(--border)', borderRadius: 10,
                padding: '10px 12px', fontSize: 14, fontFamily: 'var(--font-body)',
              }}
              placeholder="Ask about eligibility, drives, packages…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="btn btn-primary" type="submit" disabled={loading}>Send</button>
          </form>
        </div>
      </div>
    </>
  );
}
