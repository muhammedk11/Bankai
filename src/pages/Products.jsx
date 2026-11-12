
import { useSearchParams, Link } from "react-router-dom";

// Product images
import zenitsu from "../assets/images/products/zenitsu-figure.webp";
import katana from "../assets/images/products/demon-slayer-katana.webp";
import madara1 from "../assets/images/products/madara-figure-1.jpg";
import narutoKnife from "../assets/images/products/naruto-knife.jpg";
import zoro from "../assets/images/products/zoro-figure.jpg";
import sukuna from "../assets/images/products/sukuna-figure.jpg";
import madara2 from "../assets/images/products/madara-figure-2.webp";
import yuji from "../assets/images/products/yuji-figure.jpeg";

// Temporary product data
const products = [
  {
    id: 1,
    name: "Zenitsu Action Figure",
    anime: "Demon Slayer",
    type: "figures",
    image: zenitsu,
  },
  {
    id: 2,
    name: "Demon Slayer Katana",
    anime: "Demon Slayer",
    type: "weapons",
    image: katana,
  },
  {
    id: 3,
    name: "Madara Uchiha Figure - Version 1",
    anime: "Naruto",
    type: "figures",
    image: madara1,
  },
  {
    id: 4,
    name: "Naruto Knife",
    anime: "Naruto",
    type: "weapons",
    image: narutoKnife,
  },
  {
    id: 5,
    name: "Roronoa Zoro Action Figure",
    anime: "One Piece",
    type: "figures",
    image: zoro,
  },
  {
    id: 6,
    name: "Ryomen Sukuna Action Figure",
    anime: "Jujutsu Kaisen",
    type: "figures",
    image: sukuna,
  },
  {
    id: 7,
    name: "Madara Uchiha Figure - Version 2",
    anime: "Naruto",
    type: "figures",
    image: madara2,
  },
  {
    id: 8,
    name: "Yuji Itadori Action Figure",
    anime: "Jujutsu Kaisen",
    type: "figures",
    image: yuji,
  },
];

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedAnime = searchParams.get("anime") || "";
  const selectedType = searchParams.get("type") || "";

  const filteredProducts = products.filter((product) => {
    const animeMatch =
      !selectedAnime || product.anime === selectedAnime;

    const typeMatch =
      !selectedType || product.type === selectedType;

    return animeMatch && typeMatch;
  });

  const handleFilterChange = (filter, value) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(filter, value);
    } else {
      params.delete(filter);
    }

    setSearchParams(params);
  };

  return (
    <section className="min-h-screen bg-zinc-950 px-8 py-16 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Page Heading */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-purple-400">
            Explore our collection
          </p>

          <h1 className="text-4xl font-bold">
            All Products
          </h1>

          <p className="mt-3 text-gray-400">
            Discover merchandise from your favourite anime.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10 flex items-center gap-5">

          <select
            value={selectedAnime}
            onChange={(e) =>
              handleFilterChange("anime", e.target.value)
            }
            className="rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-purple-500"
          >
            <option value="">All Anime</option>
            <option value="Attack on Titan">Attack on Titan</option>
            <option value="Bleach">Bleach</option>
            <option value="Blue Lock">Blue Lock</option>
            <option value="Death Note">Death Note</option>
            <option value="Demon Slayer">Demon Slayer</option>
            <option value="Chainsaw Man">Chainsaw Man</option>
            <option value="Jujutsu Kaisen">Jujutsu Kaisen</option>
            <option value="Naruto">Naruto</option>
            <option value="One Piece">One Piece</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) =>
              handleFilterChange("type", e.target.value)
            }
            className="rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-purple-500"
          >
            <option value="">All Types</option>
            <option value="figures">Action Figures</option>
            <option value="weapons">Anime Weapons</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            <option value="posters">Posters & Wall Art</option>
          </select>

          <button
            onClick={() => setSearchParams({})}
            className="rounded-lg border border-purple-500 px-5 py-3 text-purple-400 transition hover:bg-purple-600 hover:text-white"
          >
            Clear Filters
          </button>

        </div>

        {/* Product Count */}
        <p className="mb-6 text-sm text-gray-400">
          Showing {filteredProducts.length} products
        </p>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group overflow-hidden rounded-xl border border-white/5 bg-zinc-900 transition hover:border-purple-500/50"
              >
                <div className="flex aspect-square items-center justify-center overflow-hidden bg-zinc-800 p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-4">
                  <p className="text-xs text-purple-400">
                    {product.anime}
                  </p>

                  <h2 className="mt-2 font-semibold">
                    {product.name}
                  </h2>

                  <p className="mt-3 text-sm text-gray-400">
                    View Product →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-semibold">
              No products found
            </h2>
            <p className="mt-3 text-gray-400">
              Try changing or clearing your filters.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}

export default Products;
