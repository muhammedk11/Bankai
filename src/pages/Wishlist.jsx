
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { removeFromWishlist, clearWishlist } from "../store/slices/wishlistSlice";
import { addToCart } from "../store/slices/cartSlice";

function Wishlist() {
  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      product,
      quantity: 1,
    }));

    dispatch(removeFromWishlist(product.id));
  };

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

  return (
    <section className="min-h-screen bg-zinc-950 px-8 py-16 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
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
            onClick={() => dispatch(clearWishlist())}
            className="text-sm text-red-400 transition hover:text-red-300"
          >
            Clear Wishlist
          </button>
        </div>

        {/* Products Grid */}
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
                  ${product.price.toFixed(2)}
                </p>

                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                  className="mt-5 w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>

                <button
                  onClick={() =>
                    dispatch(removeFromWishlist(product.id))
                  }
                  className="mt-3 w-full text-sm text-red-400 hover:text-red-300"
                >
                  Remove
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
  