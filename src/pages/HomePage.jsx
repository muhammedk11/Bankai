
import { Link } from "react-router-dom";
import heroVideo from "../assets/videos/hero video 1.mp4";
import { useProducts } from "../hooks/useProducts";

function Home() {
  const { data: products = [], isLoading, isError } = useProducts();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Hero Section */}
      <section className="relative flex min-h-[650px] items-center overflow-hidden bg-zinc-950 px-8 py-24">

        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/20" />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="max-w-2xl">

            <p className="mb-4 font-semibold uppercase tracking-[0.3em] text-purple-400">
              Welcome to BANKAI
            </p>

            <h1 className="text-7xl font-black leading-tight">
              UNLEASH YOUR
              <span className="block text-purple-500">FANDOM.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-7 text-gray-300">
              Discover anime-inspired merchandise, collectibles and
              everything your favourite worlds have to offer.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-block rounded-lg bg-purple-600 px-8 py-3 font-semibold transition hover:bg-purple-700"
            >
              Shop Now →
            </Link>

          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-zinc-900/60 px-8 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-purple-400">
              Handpicked for you
            </p>

            <h2 className="text-4xl font-bold">
              Featured Merchandise
            </h2>

            <p className="mt-3 text-gray-400">
              Find something that represents your favourite anime.
            </p>
          </div>

          {isLoading ? (
            <p className="py-10 text-center text-gray-400">
              Loading products...
            </p>
          ) : isError ? (
            <p className="py-10 text-center text-red-400">
              Failed to load products.
            </p>
          ) : products.length === 0 ? (
            <p className="py-10 text-center text-gray-400">
              No products available.
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-6">
              {products.slice(0, 4).map((product) => (
                <Link
                  to={`/products/${product.id}`}
                  key={product.id}
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

                    <h3 className="mt-2 font-semibold transition group-hover:text-purple-400">
                      {product.name}
                    </h3>

                    <p className="mt-3 text-sm text-gray-400">
                      View Product →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/products"
              className="inline-block rounded-lg border border-purple-500 px-8 py-3 font-semibold text-purple-400 transition hover:bg-purple-600 hover:text-white"
            >
              Explore All Products
            </Link>
          </div>

        </div>
      </section>

      {/* Promotional Section */}
      <section className="px-8 py-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950 via-purple-800 to-zinc-900 px-16 py-16 text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-purple-300">
            Your anime world awaits
          </p>

          <h2 className="text-5xl font-black">
            YOUR FANDOM.
            <span className="block text-purple-300">YOUR STYLE.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-gray-300">
            From iconic characters to legendary collectibles,
            find your next favourite piece at BANKAI.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-bold text-purple-900 transition hover:bg-gray-200"
          >
            Start Exploring →
          </Link>

        </div>
      </section>

    </div>
  );
}

export default Home;
