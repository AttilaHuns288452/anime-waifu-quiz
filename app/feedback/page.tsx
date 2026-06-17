"use client";

export default function Feedback() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">💬 Feedback & Suggestions</h1>
      <p className="text-gray-600 mb-6">Want us to add more characters? Found a bug? Let us know!</p>
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSdummy/viewform?embedded=true"
        width="100%"
        height="600"
        className="border-0 rounded-xl"
      >
        Loading...
      </iframe>
    </div>
  );
}
