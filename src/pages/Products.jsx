
import { useSearchParams, Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";

function Products() {
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useProducts();

  const [searchParams, setSearchParams] = useSearchParams();

  const selectedAnime = searchParams.get("anime") || "";
  const selectedType = searchParams.get("type") || "";
  const selectedSearch = searchParams.get("search") || "";

  if (isLoading) {
    return <p className="p-8 text-center">Loading products...</p>;
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4">Failed to load products.</p>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="rounded-lg bg-purple-600 px-5 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
        >
          {isFetching ? "Retrying..." : "Try Again"}
        </button>
      </div>
    );
  }

  const filteredProducts = products.filter((product) => {
    const animeMatch =
      !selectedAnime || product.anime === selectedAnime;

    const typeMatch =
      !selectedType || product.type === selectedType;

    const search = selectedSearch.trim().toLowerCase();

    const searchMatch =
      !search ||
      [
        product.name,
        product.anime,
        product.type,
        product.description,
      ].some((value) =>
        String(value || "").toLowerCase().includes(search)
      );

    return animeMatch && typeMatch && searchMatch;
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

        {/* Active Search */}
        {selectedSearch && (
          <p className="mb-4 text-sm text-gray-400">
            Search results for:{" "}
            <span className="font-semibold text-purple-400">
              {selectedSearch}
            </span>
          </p>
        )}

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
