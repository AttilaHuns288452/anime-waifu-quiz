"use client";

import { useState } from "react";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSe_QcrdDBOxYw_a4xtU-I0xX6P5_Qw9gYaxytKfcI-ipNRIfg/formResponse";

export default function FeedbackForm() {
  const [type, setType] = useState("Comments");
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      await fetch(FORM_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          "entry.1591633300": type,
          "entry.326955045": message,
          "entry.1696159737": suggestions,
          "entry.485428648": name,
          "entry.879531967": email,
          fvv: "1",
          pageHistory: "0",
          fbzx: "0",
        }),
      });
    } catch {}
    setSent(true);
    setSending(false);
  };

  if (sent) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-6xl mb-4">💕</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h1>
        <p className="text-green-600 font-medium">Your feedback helps us improve! 🎉</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
        💬 Feedback &amp; Suggestions
      </h1>
      <p className="text-gray-500 mb-6">
        Want us to add more characters? Found a bug? Let us know!
      </p>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Feedback Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Type</label>
            <div className="flex flex-wrap gap-2">
              {["Comments", "Questions", "Bug Reports", "Feature Request"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    type === t
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t === "Comments" && "💬 "}
                  {t === "Questions" && "❓ "}
                  {t === "Bug Reports" && "🐛 "}
                  {t === "Feature Request" && "✨ "}
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback message */}
          <textarea
            placeholder="What did you think? Any characters we should add?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
          />

          {/* Suggestions */}
          <textarea
            placeholder="Suggestions for improvement (optional)"
            value={suggestions}
            onChange={(e) => setSuggestions(e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
          />

          {/* Name */}
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Your email (optional — if you want a reply)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
          />

          <button
            type="submit"
            disabled={sending}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-300/50 transition-all duration-300 disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send Feedback 💬"}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-4 text-center">
          📬 Sent directly via Google Forms. We'll review your feedback!
        </p>
      </div>
    </div>
  );
}
