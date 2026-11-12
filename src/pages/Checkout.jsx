
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { addOrder } from "../store/slices/orderSlice";
import { clearCart } from "../store/slices/cartSlice";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const order = {
      id: Date.now(),
      items: cartItems,
      shippingDetails: formData,
      total: subtotal,
      status: "Placed",
      date: new Date().toISOString(),
    };

    dispatch(addOrder(order));
    dispatch(clearCart());

    navigate("/orders");
  };

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
                      ${(item.price * item.quantity).toFixed(2)}
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

          {/* Place Order — Outside Grid */}
          <button
            type="submit"
            className="mt-8 w-full rounded-lg bg-purple-600 px-8 py-4 font-semibold transition hover:bg-purple-700"
          >
            Place Order
          </button>

        </form>

      </div>
    </section>
  );
}

export default Checkout;
