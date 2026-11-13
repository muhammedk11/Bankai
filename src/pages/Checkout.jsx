
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import api from "../services/api";
import { useCart } from "../hooks/useCart";
import { useProducts } from "../hooks/useProducts";

function Checkout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const user = useSelector((state) => state.auth.user);

  const {
    cart,
    isLoading: cartLoading,
    isError: cartError,
    clearCart,
  } = useCart(user?.id);

  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useProducts();

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    paymentMethod: "cod",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const cartItems = (cart?.items || [])
    .map((item) => {
      const product = products.find(
        (product) => String(product.id) === String(item.productId)
      );

      if (!product) return null;

      return {
        ...product,
        quantity: item.quantity,
      };
    })
    .filter(Boolean);

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const placeOrder = useMutation({
    mutationFn: async (orders) => {
      const responses = await Promise.all(
        orders.map((order) => api.post("/orders", order))
      );

      return responses;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders", user?.id],
      });

      clearCart.mutate(undefined, {
        onSuccess: () => navigate("/orders"),
        onError: () =>
          setErrorMessage(
            "Orders were placed, but your cart could not be cleared."
          ),
      });
    },

    onError: () => {
      setErrorMessage("Could not place your orders. Please try again.");
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!user?.id || cartItems.length === 0) return;

    const orderDate = new Date().toISOString();

    const orders = cartItems.map((item, index) => ({
      id: `ORD-${Date.now()}-${index + 1}`,
      userId: user.id,

      items: [
        {
          productId: String(item.id),
          name: item.name,
          image: item.image,
          price: Number(item.price),
          quantity: item.quantity,
        },
      ],

      shippingDetails: formData,
      total: Number(item.price) * item.quantity,
      status: "Placed",
      date: orderDate,
    }));

    placeOrder.mutate(orders);
  };

  if (!user?.id) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
        <h1 className="text-3xl font-bold">Please Login</h1>
        <Link to="/login" className="mt-6 rounded-lg bg-purple-600 px-6 py-3">
          Login
        </Link>
      </section>
    );
  }

  if (cartLoading || productsLoading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        Loading checkout...
      </section>
    );
  }

  if (cartError || productsError) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        Could not load checkout details.
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
        <h1 className="text-3xl font-bold">
          Your cart is empty
        </h1>

        <Link
          to="/products"
          className="mt-6 rounded-lg bg-purple-600 px-6 py-3"
        >
          Explore Products
        </Link>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-zinc-950 px-8 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-10 text-4xl font-bold">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-10">
            {/* Shipping Information */}
            <div className="col-span-2 rounded-xl border border-white/10 bg-zinc-900 p-8">
              <h2 className="mb-6 text-2xl font-semibold">
                Shipping Information
              </h2>

              <div className="grid grid-cols-2 gap-5">
                {[
                  { name: "fullName", label: "Full Name", type: "text" },
                  { name: "email", label: "Email", type: "email" },
                  { name: "phone", label: "Phone", type: "tel" },
                  { name: "city", label: "City", type: "text" },
                  { name: "postalCode", label: "Postal Code", type: "text" },
                  { name: "country", label: "Country", type: "text" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="mb-2 block text-sm text-gray-400">
                      {field.label}
                    </label>

                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-3 outline-none focus:border-purple-500"
                    />
                  </div>
                ))}

                <div className="col-span-2">
                  <label className="mb-2 block text-sm text-gray-400">
                    Street Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-3 outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <h2 className="mb-5 mt-10 text-2xl font-semibold">
                Payment Method
              </h2>

              <div className="space-y-4">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-zinc-800 p-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleChange}
                  />
                  <span>Cash on Delivery (Demo)</span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-zinc-800 p-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === "online"}
                    onChange={handleChange}
                  />
                  <span>Online Payment (Demo)</span>
                </label>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Payments are not processed in this demo application.
              </p>
            </div>

            {/* Order Summary */}
            <div className="h-fit rounded-xl border border-white/10 bg-zinc-900 p-6">
              <h2 className="text-xl font-bold">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-4 text-sm"
                  >
                    <span className="text-gray-400">
                      {item.name} × {item.quantity}
                    </span>

                    <span>
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>

                  <span className="text-purple-400">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                to="/cart"
                className="mt-6 block text-center text-sm text-gray-400 hover:text-white"
              >
                Back to Cart
              </Link>
            </div>
          </div>

          {errorMessage && (
            <p className="mt-5 text-center text-red-400">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={placeOrder.isPending || clearCart.isPending}
            className="mt-8 w-full rounded-lg bg-purple-600 px-8 py-4 font-semibold transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {placeOrder.isPending || clearCart.isPending
              ? "Placing Orders..."
              : "Place Order"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Checkout;
