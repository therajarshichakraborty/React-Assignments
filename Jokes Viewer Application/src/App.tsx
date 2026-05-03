import { useEffect, useState } from "react";

type Joke = {
  id: number;
  content: string;
  categories: string[];
};

export default function App() {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchJokes = async (pageNumber: number) => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://api.freeapi.app/api/v1/public/randomjokes?page=${pageNumber}`
      );
      const data = await res.json();

      // 🔥 Correct extraction
      const jokesArray = data.data.data;

      setJokes(jokesArray);
    } catch (error) {
      console.error("Error fetching jokes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJokes(page);
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">😂 Jokes Viewer</h1>

      {loading ? (
        <p className="text-lg">Loading jokes...</p>
      ) : (
        <div className="grid gap-4 w-full max-w-2xl">
          {jokes.map((joke) => (
            <div
              key={joke.id}
              className="bg-gray-800 p-4 rounded-xl shadow-md hover:scale-[1.02] transition"
            >
              <p className="text-lg">{joke.content}</p>

              {joke.categories.length > 0 && (
                <span className="text-xs text-red-400 mt-2 block">
                  ⚠ {joke.categories.join(", ")}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
        >
          Prev
        </button>

        <span className="px-4 py-2 bg-gray-800 rounded-lg">
          Page {page}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500"
        >
          Next
        </button>
      </div>
    </div>
  );
}