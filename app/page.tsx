'use client';

import { useState } from 'react';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      setAnswer('Failed to process question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about the PDFs"
          className="w-full rounded border p-2"
        />
        <button type="submit" disabled={loading} className="rounded bg-blue-500 px-4 py-2 text-white">
          {loading ? 'Loading...' : 'Ask'}
        </button>
      </form>

      {answer && (
        <div className="mt-8 rounded-2xl bg-zinc-900 p-8">
          <h2 className="font-bold">Respuesta:</h2>
          <p>{answer}</p>
        </div>
      )}
    </main>
  );
}
