import { useEffect, useState } from "react";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
};

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("https://api.freeapi.app/api/v1/public/randomproducts")
      .then(res => res.json())
      .then(data => setProducts(data.data.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Product Listing</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-40 w-full object-cover rounded-xl mb-4"
            />

            <h2 className="text-lg font-semibold line-clamp-1">
              {product.title}
            </h2>

            <p className="text-sm text-gray-500 line-clamp-2 mt-1">
              {product.description}
            </p>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xl font-bold text-indigo-600">
                ${product.price}
              </span>
              <span className="text-sm text-green-500">
                {product.discountPercentage}% off
              </span>
            </div>

            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <span>⭐ {product.rating}</span>
              <span>{product.stock} left</span>
            </div>

            <button className="mt-4 bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}