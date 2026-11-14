
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import api from "../services/api";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const {
    data: product,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await api.get(`/products/${id}`);
      return response.data;
    },
    retry: 2,
  });

  const { addItem } = useCart(user?.id);

  const {
    wishlist,
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
  } = useWishlist(user?.id);

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  if (isLoading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        Loading product...
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Failed to Load Product
          </h1>

          <p className="mt-3 text-gray-400">
            Something went wrong. Please try again.
          </p>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-6 rounded-lg bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700 disabled:opacity-50"
          >
            {isFetching ? "Retrying..." : "Try Again"}
          </button>

          <Link
            to="/products"
            className="mt-4 block text-purple-400"
          >
            Back to Products
          </Link>
        </div>
      </section>
    );
  }

  if (!product || product.id == null) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Product Not Found
          </h1>

          <p className="mt-3 text-gray-400">
            The product you're looking for doesn't exist.
          </p>

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

  const wishlistIds = wishlist?.productIds || [];

  const isWishlisted = wishlistIds.some(
    (itemId) => String(itemId) === String(product.id)
  );

  const handleWishlist = () => {
    if (!user?.id) return;

    if (isWishlisted) {
      removeFromWishlist.mutate(product.id);
    } else {
      addToWishlist.mutate(product.id);
    }
  };

  const handleAddToCart = () => {
    setAdded(false);

    addItem.mutate(
      { product, quantity },
      {
        onSuccess: () => setAdded(true),
      }
    );
  };

  const handleBuyNow = () => {
    if (!user?.id || Number(product.stock) < 1) return;

    navigate(
      `/checkout?buyNow=${product.id}&quantity=${quantity}`
    );
  };

  const wishlistPending =
    addToWishlist.isPending || removeFromWishlist.isPending;

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
            ${Number(product.price).toFixed(2)}
          </p>

          <p className="mt-6 leading-7 text-gray-400">
            {product.description}
          </p>

          <p className="mt-5 text-sm text-gray-400">
            {product.stock > 0
              ? `${product.stock} items available`
              : "Out of Stock"}
          </p>

          {/* Quantity and Purchase Buttons */}
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
                        Math.min(Number(product.stock), prev + 1)
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
                  ${(Number(product.price) * quantity).toFixed(2)}
                </span>
              </p>

              <button
                onClick={handleAddToCart}
                disabled={!user?.id || addItem.isPending}
                className="mt-8 w-full rounded-lg bg-purple-600 px-6 py-4 font-semibold hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {!user?.id
                  ? "Login to Add to Cart"
                  : addItem.isPending
                    ? "Adding..."
                    : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!user?.id}
                className="mt-3 w-full rounded-lg border border-purple-500 px-6 py-4 font-semibold text-purple-400 transition hover:bg-purple-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {!user?.id ? "Login to Buy" : "Buy Now"}
              </button>

              {added && (
                <Link
                  to="/cart"
                  className="mt-3 text-center text-sm text-green-400 hover:text-green-300"
                >
                  Added to cart! View Cart →
                </Link>
              )}

              {addItem.isError && (
                <p className="mt-3 text-center text-sm text-red-400">
                  Could not add this product. Please try again.
                </p>
              )}
            </>
          )}

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            disabled={!user?.id || wishlistPending}
            className="mt-4 w-full rounded-lg border border-white/20 px-6 py-4 font-semibold transition hover:border-purple-500 hover:text-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {!user?.id
              ? "Login to Save"
              : wishlistPending
                ? "Updating..."
                : isWishlisted
                  ? "♥ Remove from Wishlist"
                  : "♡ Add to Wishlist"}
          </button>

          {(addToWishlist.isError || removeFromWishlist.isError) && (
            <p className="mt-3 text-center text-sm text-red-400">
              Could not update wishlist. Please try again.
            </p>
          )}

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
