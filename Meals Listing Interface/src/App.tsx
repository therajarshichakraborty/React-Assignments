import { useEffect, useState } from "react";

type Meal = {
  id: number;
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
};

export default function App() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const fetchMeals = async (pageNumber: number) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `https://api.freeapi.app/api/v1/public/meals?page=${pageNumber}&limit=8`
      );

      const data = await res.json();

      const mealsData = data.data.data;
      setMeals(mealsData);
      setFilteredMeals(mealsData);

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch meals");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals(page);
  }, [page]);

  useEffect(() => {
    const filtered = meals.filter((meal) =>
      meal.strMeal.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredMeals(filtered);
  }, [search, meals]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        Loading meals...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        🍽️ Meals Explorer
      </h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search meals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg text-black w-80"
        />
      </div>

      <div className="flex justify-center mb-6 gap-4">
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Load More Meals
        </button>

        <button
          onClick={() => setPage(Math.floor(Math.random() * 1000))}
          className="px-5 py-2 bg-green-600 rounded-lg hover:bg-green-700"
        >
          Random Meals
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredMeals.map((meal) => (
          <div
            key={meal.idMeal}
            className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition"
          >
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h2 className="text-lg font-semibold">{meal.strMeal}</h2>

              <p className="text-sm text-gray-400">
                {meal.strCategory} • {meal.strArea}
              </p>

              <button
                onClick={() => setSelectedMeal(meal)}
                className="mt-3 w-full bg-blue-600 py-2 rounded-lg hover:bg-blue-700"
              >
                View Recipe
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedMeal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-900 max-w-2xl w-full rounded-xl p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-3">
              {selectedMeal.strMeal}
            </h2>

            <img
              src={selectedMeal.strMealThumb}
              className="w-full rounded-lg mb-4"
            />

            <p className="text-sm text-gray-400 mb-2">
              {selectedMeal.strCategory} • {selectedMeal.strArea}
            </p>

            <p className="text-sm mb-4 whitespace-pre-line">
              {selectedMeal.strInstructions}
            </p>

            <a
              href={selectedMeal.strYoutube}
              target="_blank"
              className="block text-blue-400 underline mb-4"
            >
              ▶ Watch on YouTube
            </a>

            <button
              onClick={() => setSelectedMeal(null)}
              className="w-full bg-red-600 py-2 rounded-lg hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}