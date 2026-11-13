
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";

function Cart() {
  const user = useSelector((state) => state.auth.user);

  const {
    cart,
    isLoading: cartLoading,
    isError: cartError,
    refetch: refetchCart,
    isFetching: cartFetching,
    updateItem,
    removeItem,
    clearCart,
  } = useCart(user?.id);

  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts,
    isFetching: productsFetching,
  } = useProducts();

  const isLoading = cartLoading || productsLoading;
  const isError = cartError || productsError;
  const isFetching = cartFetching || productsFetching;

  const handleRetry = () => {
    refetchCart();
    refetchProducts();
  };

  // Match cart product IDs with actual product details
  const cartItems = (cart?.items || [])
    .map((item) => {
      const product = products.find(
        (product) =>
          String(product.id) === String(item.productId)
      );

      if (!product) return null;

      return {
        ...product,
        quantity: item.quantity,
      };
    })
    .filter(Boolean);

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (!user) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-8 text-white">
        <h1 className="text-3xl font-bold">
          Please Login
        </h1>

        <p className="mt-4 text-gray-400">
          Login to view your shopping cart.
        </p>

        <Link
          to="/login"
          className="mt-8 rounded-lg bg-purple-600 px-8 py-3 font-semibold transition hover:bg-purple-700"
        >
          Login
        </Link>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-lg text-gray-400">
          Loading your cart...
        </p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
        <p className="text-lg text-red-400">
          Failed to load your cart. Please try again.
        </p>

        <button
          onClick={handleRetry}
          disabled={isFetching}
          className="mt-6 rounded-lg bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700 disabled:opacity-50"
        >
          {isFetching ? "Retrying..." : "Try Again"}
        </button>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-8 text-white">
        <h1 className="text-4xl font-bold">
          Your Cart is Empty
        </h1>

        <p className="mt-4 text-gray-400">
          Looks like you haven't added anything yet.
        </p>

        <Link
          to="/products"
          className="mt-8 rounded-lg bg-purple-600 px-8 py-3 font-semibold transition hover:bg-purple-700"
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
              Your selections
            </p>

            <h1 className="text-4xl font-bold">
              Shopping Cart
            </h1>
          </div>

          <button
            onClick={() => clearCart.mutate()}
            disabled={clearCart.isPending}
            className="text-sm text-red-400 transition hover:text-red-300 disabled:opacity-50"
          >
            {clearCart.isPending ? "Clearing..." : "Clear Cart"}
          </button>
        </div>

        {/* Mutation Error Messages */}
        {(updateItem.isError ||
          removeItem.isError ||
          clearCart.isError) && (
          <p className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            Could not update your cart. Please try again.
          </p>
        )}

        <div className="grid grid-cols-3 gap-10">

          {/* Cart Items */}
          <div className="col-span-2 space-y-5">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-6 rounded-xl border border-white/10 bg-zinc-900 p-5"
              >
                {/* Product Image */}
                <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-lg bg-zinc-800 p-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Product Information */}
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {item.name}
                    </h2>

                    <p className="mt-2 text-purple-400">
                      ${Number(item.price).toFixed(2)}
                    </p>

                    {/* Quantity */}
                    <div className="mt-5 flex w-fit items-center overflow-hidden rounded-lg border border-white/10">
                      <button
                        onClick={() =>
                          updateItem.mutate({
                            productId: item.id,
                            quantity: item.quantity - 1,
                            stock: item.stock,
                          })
                        }
                        disabled={
                          item.quantity <= 1 ||
                          updateItem.isPending
                        }
                        className="px-4 py-2 transition hover:bg-zinc-800 disabled:opacity-40"
                      >
                        −
                      </button>

                      <span className="min-w-12 text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateItem.mutate({
                            productId: item.id,
                            quantity: item.quantity + 1,
                            stock: item.stock,
                          })
                        }
                        disabled={
                          item.quantity >= item.stock ||
                          updateItem.isPending
                        }
                        className="px-4 py-2 transition hover:bg-zinc-800 disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Item Total and Remove */}
                  <div className="text-right">
                    <p className="font-semibold">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>

                    <button
                      onClick={() => removeItem.mutate(item.id)}
                      disabled={removeItem.isPending}
                      className="mt-5 text-sm text-red-400 transition hover:text-red-300 disabled:opacity-50"
                    >
                      {removeItem.isPending ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="h-fit rounded-xl border border-white/10 bg-zinc-900 p-6">
            <h2 className="text-xl font-bold">
              Order Summary
            </h2>

            <div className="mt-6 flex justify-between text-gray-400">
              <span>Items ({totalItems})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="mt-4 border-t border-white/10 pt-5">
              <div className="flex justify-between text-lg font-bold">
                <span>Subtotal</span>

                <span className="text-purple-400">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                Shipping and taxes calculated at checkout.
              </p>
            </div>

            <Link
              to="/checkout"
              className="mt-8 block rounded-lg bg-purple-600 px-6 py-3 text-center font-semibold transition hover:bg-purple-700"
            >
              Proceed to Checkout →
            </Link>

            <Link
              to="/products"
              className="mt-4 block text-center text-sm text-gray-400 transition hover:text-white"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cart;
