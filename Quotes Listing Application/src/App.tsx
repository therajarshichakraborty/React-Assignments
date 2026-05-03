import { useEffect, useState } from "react";

type Quote = {
  id: number;
  content: string;
  author: string;
  tags: string[];
};

export default function App() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [current, setCurrent] = useState<Quote | null>(null);

  const fetchQuotes = async () => {
    const res = await fetch("https://api.freeapi.app/api/v1/public/quotes");
    const json = await res.json();
    const list = json.data.data;
    setQuotes(list);
    setCurrent(list[Math.floor(Math.random() * list.length)]);
  };

  const newQuote = () => {
    if (quotes.length === 0) return;
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrent(random);
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-8">Quote Generator</h1>

      {current && (
        <div className="max-w-2xl w-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg text-center">
          <p className="text-xl leading-relaxed">
            “{current.content}”
          </p>

          <div className="mt-4 text-indigo-400 font-semibold">
            — {current.author}
          </div>

          {current.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {current.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={newQuote}
        className="mt-8 bg-indigo-600 px-6 py-2 rounded-xl hover:bg-indigo-700 transition"
      >
        New Quote
      </button>
    </div>
  );
}