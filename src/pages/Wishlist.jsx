import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { useProducts } from "../hooks/useProducts";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";

function Wishlist() {
  const user = useSelector((state) => state.auth.user);

  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts,
    isFetching: productsFetching,
  } = useProducts();

  const {
    wishlist,
    isLoading: wishlistLoading,
    isError: wishlistError,
    refetch: refetchWishlist,
    isFetching: wishlistFetching,
    removeItem,
    clearWishlist,
  } = useWishlist(user?.id);

  const { addItem: addToCart } = useCart(user?.id);

  const wishlistItems = (wishlist?.productIds || [])
    .map((id) =>
      products.find(
        (product) => String(product.id) === String(id)
      )
    )
    .filter(Boolean);

  const handleAddToCart = (product) => {
    addToCart.mutate(
      { product, quantity: 1 },
      {
        onSuccess: () => {
          removeItem.mutate(product.id);
        },
      }
    );
  };

  const handleRetry = () => {
    refetchProducts();
    refetchWishlist();
  };

  if (!user?.id) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-8 text-white">
        <h1 className="text-4xl font-bold">
          Login to View Your Wishlist
        </h1>

        <Link
          to="/login"
          className="mt-8 rounded-lg bg-purple-600 px-8 py-3 font-semibold hover:bg-purple-700"
        >
          Login
        </Link>
      </section>
    );
  }

  if (productsLoading || wishlistLoading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        Loading wishlist...
      </section>
    );
  }

  if (productsError || wishlistError) {
    const isRetrying = productsFetching || wishlistFetching;

    return (
      <section className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
        <p className="mb-5 text-red-400">
          Could not load wishlist. Please try again.
        </p>

        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="rounded-lg bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700 disabled:opacity-50"
        >
          {isRetrying ? "Retrying..." : "Try Again"}
        </button>
      </section>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-8 text-white">
        <h1 className="text-4xl font-bold">
          Your Wishlist is Empty
        </h1>

        <p className="mt-4 text-gray-400">
          Save your favourite anime products here.
        </p>

        <Link
          to="/products"
          className="mt-8 rounded-lg bg-purple-600 px-8 py-3 font-semibold hover:bg-purple-700"
        >
          Explore Products
        </Link>
      </section>
    );
  }

  const hasMutationError =
    addToCart.isError ||
    removeItem.isError ||
    clearWishlist.isError;

  return (
    <section className="min-h-screen bg-zinc-950 px-8 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-purple-400">
              Your favourites
            </p>

            <h1 className="text-4xl font-bold">
              My Wishlist
            </h1>

            <p className="mt-3 text-gray-400">
              {wishlistItems.length} saved products
            </p>
          </div>

          <button
            onClick={() => clearWishlist.mutate()}
            disabled={clearWishlist.isPending}
            className="text-sm text-red-400 transition hover:text-red-300 disabled:opacity-50"
          >
            {clearWishlist.isPending
              ? "Clearing..."
              : "Clear Wishlist"}
          </button>
        </div>

        {hasMutationError && (
          <p className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            An action failed. Please try again.
          </p>
        )}

        <div className="grid grid-cols-4 gap-8">
          {wishlistItems.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900 transition hover:-translate-y-1 hover:border-purple-500/50"
            >
              <Link to={`/products/${product.id}`}>
                <div className="flex h-64 items-center justify-center bg-zinc-800 p-5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                </div>
              </Link>

              <div className="p-5">
                <p className="text-xs uppercase tracking-wider text-purple-400">
                  {product.anime}
                </p>

                <Link to={`/products/${product.id}`}>
                  <h2 className="mt-2 text-lg font-semibold hover:text-purple-400">
                    {product.name}
                  </h2>
                </Link>

                <p className="mt-3 text-xl font-bold text-purple-400">
                  ${Number(product.price).toFixed(2)}
                </p>

                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={
                    product.stock <= 0 ||
                    addToCart.isPending ||
                    removeItem.isPending
                  }
                  className="mt-5 w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {product.stock <= 0
                    ? "Out of Stock"
                    : addToCart.isPending
                      ? "Adding..."
                      : "Add to Cart"}
                </button>

                <button
                  onClick={() => removeItem.mutate(product.id)}
                  disabled={
                    removeItem.isPending ||
                    addToCart.isPending
                  }
                  className="mt-3 w-full text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                >
                  {removeItem.isPending
                    ? "Removing..."
                    : "Remove"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Wishlist;