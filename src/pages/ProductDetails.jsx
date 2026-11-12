
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { products } from "../data/products";
import { addToCart } from "../store/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../store/slices/wishlistSlice";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Product Not Found</h1>
          <Link
            to="/products"
            className="mt-6 inline-block text-purple-400"
          >
            Back to Products
          </Link>
        </div>
      </section>
    );
  }

  const [activeImage, setActiveImage] = useState(0);

  const isWishlisted = wishlistItems.some(
    (item) => item.id === product.id
  );

  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  return (
    <section className="min-h-screen bg-zinc-950 px-8 py-16 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-16">

        {/* Product Images */}
        <div>
          <div className="flex h-[550px] items-center justify-center rounded-2xl bg-zinc-900 p-10">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          </div>

          <div className="mt-5 flex gap-4">
            {product.images.map((image, index) => (
              <button
                key={image}
                onClick={() => setActiveImage(index)}
                className={`h-24 w-24 rounded-lg border p-2 ${
                  activeImage === index
                    ? "border-purple-500"
                    : "border-white/10"
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="h-full w-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-center">

          <p className="text-sm font-semibold uppercase tracking-widest text-purple-400">
            {product.anime}
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            {product.name}
          </h1>

          <p className="mt-5 text-3xl font-bold text-purple-400">
            ${product.price.toFixed(2)}
          </p>

          <p className="mt-6 leading-7 text-gray-400">
            {product.description}
          </p>

          <p className="mt-5 text-sm text-gray-400">
            {product.stock > 0
              ? `${product.stock} items available`
              : "Out of Stock"}
          </p>

          {/* Quantity */}
          {product.stock > 0 && (
            <>
              <div className="mt-8">
                <p className="mb-3 font-semibold">Quantity</p>

                <div className="flex w-fit items-center overflow-hidden rounded-lg border border-white/10">
                  <button
                    onClick={() =>
                      setQuantity((prev) => Math.max(1, prev - 1))
                    }
                    className="px-5 py-3 hover:bg-zinc-800"
                  >
                    −
                  </button>

                  <span className="min-w-14 text-center">
                    {quantity}
                  </span>

                  <button
                    onClick={() =>
                      setQuantity((prev) =>
                        Math.min(product.stock, prev + 1)
                      )
                    }
                    className="px-5 py-3 hover:bg-zinc-800"
                  >
                    +
                  </button>
                </div>
              </div>

              <p className="mt-6 text-lg">
                Total:{" "}
                <span className="font-bold text-purple-400">
                  ${(product.price * quantity).toFixed(2)}
                </span>
              </p>

              {/* Add to Cart */}
              <button
                onClick={() => {
                  dispatch(addToCart({ product, quantity }));
                  setAdded(true);
                }}
                className="mt-8 w-full rounded-lg bg-purple-600 px-6 py-4 font-semibold hover:bg-purple-700"
              >
                Add to Cart
              </button>

              {added && (
                <Link
                  to="/cart"
                  className="mt-3 text-center text-sm text-green-400 hover:text-green-300"
                >
                  Added to cart! View Cart →
                </Link>
              )}
            </>
          )}

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="mt-4 w-full rounded-lg border border-white/20 px-6 py-4 font-semibold transition hover:border-purple-500 hover:text-purple-400"
          >
            {isWishlisted
              ? "♥ Remove from Wishlist"
              : "♡ Add to Wishlist"}
          </button>

          <Link
            to="/products"
            className="mt-6 text-center text-sm text-gray-400 hover:text-white"
          >
            ← Back to Products
          </Link>

        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
