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
  const selectedSort = searchParams.get("sort") || "";

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

  // Filter products
  const filteredProducts = products.filter((product) => {
    const animeMatch = !selectedAnime || product.anime === selectedAnime;

    const typeMatch = !selectedType || product.type === selectedType;

    const search = selectedSearch.trim().toLowerCase();

    const searchMatch =
      !search ||
      [product.name, product.anime, product.type, product.description].some(
        (value) =>
          String(value || "")
            .toLowerCase()
            .includes(search),
      );

    return animeMatch && typeMatch && searchMatch;
  });

  // Sort products by price
  const sortedProducts = [...filteredProducts];

  if (selectedSort === "low-to-high") {
    sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
  }

  if (selectedSort === "high-to-low") {
    sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
  }

  // Pagination
  const itemsPerPage = 8;

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const currentPage = Math.min(
    Math.max(Number(searchParams.get("page")) || 1, 1),
    Math.max(totalPages, 1),
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Update URL filters
  const handleFilterChange = (filter, value) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(filter, value);
    } else {
      params.delete(filter);
    }

    // Reset to first page when filters change
    params.delete("page");

    setSearchParams(params);
  };

  // Change page
  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
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

          <h1 className="text-4xl font-bold">All Products</h1>

          <p className="mt-3 text-gray-400">
            Discover merchandise from your favourite anime.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10 flex items-center gap-5">
          {/* Anime Filter */}
          <select
            value={selectedAnime}
            onChange={(e) => handleFilterChange("anime", e.target.value)}
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

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-purple-500"
          >
            <option value="">All Types</option>
            <option value="figures">Action Figures</option>
            <option value="weapons">Anime Weapons</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            <option value="posters">Posters & Wall Art</option>
          </select>

          {/* Price Sorting */}
          <select
            value={selectedSort}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            className="rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-purple-500"
          >
            <option value="">Default Sorting</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>

          {/* Clear Filters */}
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
          Showing {sortedProducts.length > 0 ? startIndex + 1 : 0}-
          {Math.min(startIndex + itemsPerPage, sortedProducts.length)} of{" "}
          {sortedProducts.length} products
        </p>

        {/* Product Grid */}
        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
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
                  <p className="text-xs text-purple-400">{product.anime}</p>

                  <h2 className="mt-2 font-semibold">{product.name}</h2>

                  <p className="mt-3 text-lg font-bold text-white">
                    ${Number(product.price).toFixed(2)}
                  </p>

                  <p className="mt-3 text-sm text-gray-400">View Product →</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-semibold">No products found</h2>

            <p className="mt-3 text-gray-400">
              Try changing or clearing your filters.
            </p>
          </div>
        )}

        {/* Pagination Buttons */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:border-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`rounded-lg px-4 py-2 text-sm transition ${
                  currentPage === index + 1
                    ? "bg-purple-600 text-white"
                    : "border border-white/10 text-gray-400 hover:border-purple-500 hover:text-white"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:border-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Products;
