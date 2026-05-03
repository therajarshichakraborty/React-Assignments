import { useEffect, useState } from "react";

type Cat = {
  id: number;
  name: string;
  temperament: string;
  origin: string;
  description: string;
  life_span: string;
  image: string;
};

export default function App() {
  const [cat, setCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCat = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://api.freeapi.app/api/v1/public/cats/cat/random"
      );
      const data = await res.json();

      // 🔥 Correct extraction
      setCat(data.data);
    } catch (error) {
      console.error("Error fetching cat:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCat();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">🐱 Random Cat Viewer</h1>

      {loading ? (
        <p className="text-lg">Loading cat...</p>
      ) : cat ? (
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full text-center">
          <img
            src={cat.image}
            alt={cat.name}
            className="rounded-lg mb-4 w-full h-64 object-cover"
          />

          <h2 className="text-2xl font-semibold">{cat.name}</h2>
          <p className="text-sm text-gray-400">{cat.origin}</p>

          <p className="mt-3 text-sm">{cat.description}</p>

          <p className="mt-3 text-sm">
            🧬 Temperament:{" "}
            <span className="text-blue-400">{cat.temperament}</span>
          </p>

          <p className="mt-2 text-sm">
            ⏳ Life Span:{" "}
            <span className="text-green-400">{cat.life_span} years</span>
          </p>

          <button
            onClick={fetchCat}
            className="mt-6 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
          >
            🔄 Show Another Cat
          </button>
        </div>
      ) : (
        <p>No cat found.</p>
      )}
    </div>
  );
}