import { useEffect, useState } from "react";

type User = {
  id: number;
  gender: string;
  email: string;
  phone: string;
  cell: string;
  nat: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  location: {
    city: string;
    state: string;
    country: string;
  };
  picture: {
    large: string;
  };
  dob: {
    age: number;
  };
};

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  const fetchUsers = async (pageNumber: number) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `https://api.freeapi.app/api/v1/public/randomusers?page=${pageNumber}&limit=8`
      );

      const data = await res.json();

      // API structure: data.data.data
      setUsers([...data.data.data]); // force new render
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Random Users UI
      </h1>

      {/* Refresh Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          Load New Users
        </button>
      </div>

      {/* User Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-gray-800 rounded-2xl shadow-lg p-5 hover:scale-105 transition"
          >
            <img
              src={user.picture.large}
              alt={user.name.first}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-500"
            />

            <h2 className="text-lg font-semibold text-center">
              {user.name.title} {user.name.first} {user.name.last}
            </h2>

            <p className="text-sm text-gray-400 text-center mb-2">
              {user.location.city}, {user.location.country}
            </p>

            <div className="text-sm space-y-1 mt-3">
              <p>
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {user.phone}
              </p>
              <p>
                <span className="font-semibold">Age:</span> {user.dob.age}
              </p>
              <p>
                <span className="font-semibold">Nationality:</span> {user.nat}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}