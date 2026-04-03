import { useState, useEffect } from "react";

function App() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [showMsg, setShowMsg] = useState(false);
  const [error, setError] = useState(false);

  // 1. New State for Color Selection
  const colors = [
    { name: "Crimson", hex: "#dc2626", tailwind: "bg-red-600" },
    { name: "Ocean", hex: "#2563eb", tailwind: "bg-blue-600" },
    { name: "Midnight", hex: "#111827", tailwind: "bg-gray-900" },
    { name: "Forest", hex: "#166534", tailwind: "bg-green-800" },
    { name: "Sand", hex: "#d4d4d8", tailwind: "bg-zinc-300" },
  ];
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products/16")
      .then((res) => res.json())
      .then((data) => {
        setProduct({
          ...data,
          title: "Nestify Air-Walk Sneakers",
          category: "Footwear",
          image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000",
          description:
            "Engineered for maximum comfort and durability, the Air-Walk series features a breathable mesh upper.",
        });
        setLoading(false);
      });
  }, []);

  const addToCart = () => {
    // Reset any previous message
    setShowMsg(false);
    setError(false);

    fetch("https://fakestoreapi.com/my-products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: 1,
        date: new Date().toISOString().split("T")[0],
        products: [{ productId: product.id, quantity: 1 }],
        color: selectedColor.name,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add to cart");
        return res.json();
      })
      .then(() => {
        setCartCount((prev) => prev + 1);
        setError(false);
        setShowMsg(true);
      })
      .catch(() => {
        setError(true);
        setShowMsg(true);
      });
  };

  if (loading)
    return <div className="p-20 text-center">Loading Nestify...</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <nav className="border-b border-gray-100 p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter text-blue-600">
          NESTIFY.
        </div>
        <div className="font-bold">Cart ({cartCount})</div>
      </nav>

      <main className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 mt-16 p-4">
        {/* Image Container with Dynamic Background Color Tint */}
        <div
          className="rounded-3xl p-8 flex items-center justify-center h-[500px] transition-colors duration-500"
          style={{ backgroundColor: `${selectedColor.hex}10` }} // 10 is 6% opacity in hex
        >
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain mix-blend-multiply"
            style={{
              filter: `drop-shadow(0 20px 30px ${selectedColor.hex}40)`,
            }}
          />
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="text-gray-400 text-sm font-bold uppercase mb-2">
            {product.category}
          </h2>
          <h1 className="text-5xl font-extrabold mb-4">{product.title}</h1>
          <p className="text-3xl font-light text-blue-600 mb-6">
            ${product.price}
          </p>

          {/* 2. Color Selection UI */}
          <div className="mb-8">
            <p className="text-sm font-bold uppercase text-gray-400 mb-3">
              Select Color: {selectedColor.name}
            </p>
            <div className="flex gap-3">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedColor.name === color.name
                      ? "border-blue-600 scale-110"
                      : "border-transparent"
                  } ${color.tailwind}`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <p className="text-gray-500 text-lg mb-8">{product.description}</p>

          <div className="space-y-4">
            <button
              onClick={addToCart}
              className="w-full md:w-auto px-12 py-5 bg-gray-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all active:scale-95"
            >
              Add to Bag
            </button>

            {showMsg &&
              (error ? (
                <p className="text-red-600 font-medium">
                  ✕ Oops! Unable to add item to the cart
                </p>
              ) : (
                <p className="text-green-600 font-medium animate-pulse">
                  ✓ Added in {selectedColor.name}!
                </p>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
