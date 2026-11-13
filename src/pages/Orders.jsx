
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import api from "../services/api";

function Orders() {
  const user = useSelector((state) => state.auth.user);
  const queryClient = useQueryClient();

  // Fetch logged-in user's orders
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const response = await api.get("/orders", {
        params: { userId: user.id },
      });

      return response.data;
    },
  });

  // Delete an order
  const deleteOrder = useMutation({
    mutationFn: async (orderId) => {
      await api.delete(`/orders/${orderId}`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders", user?.id],
      });
    },
  });

  const handleDeleteOrder = (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (confirmed) {
      deleteOrder.mutate(orderId);
    }
  };

  if (!user?.id) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-8 text-white">
        <h1 className="text-4xl font-bold">
          Login to View Your Orders
        </h1>

        <Link
          to="/login"
          className="mt-8 rounded-lg bg-purple-600 px-8 py-3 font-semibold"
        >
          Login
        </Link>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        Loading your orders...
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-zinc-950 text-red-400">
        Could not load your orders. Please try again.
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-8 text-white">
        <h1 className="text-4xl font-bold">
          No Orders Yet
        </h1>

        <p className="mt-4 text-gray-400">
          You haven't placed any orders yet.
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
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-purple-400">
            Your purchases
          </p>

          <h1 className="text-4xl font-bold">
            My Orders
          </h1>

          <p className="mt-3 text-gray-400">
            Track and view your previous purchases.
          </p>
        </div>

        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <div>
                  <p className="text-sm text-gray-400">
                    Order ID
                  </p>

                  <p className="mt-1 font-semibold">
                    #{order.id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Order Date
                  </p>

                  <p className="mt-1">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Status
                  </p>

                  <span className="mt-1 inline-block rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400">
                    {order.status}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Total
                  </p>

                  <p className="mt-1 font-bold text-purple-400">
                    ${Number(order.total).toFixed(2)}
                  </p>
                </div>

                {/* Delete Order Button */}
                <button
                  onClick={() => handleDeleteOrder(order.id)}
                  disabled={deleteOrder.isPending}
                  className="rounded-lg bg-red-600/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleteOrder.isPending
                    ? "Deleting..."
                    : "Delete Order"}
                </button>
              </div>

              {/* Ordered Products */}
              <div className="space-y-5 p-6">
                <h2 className="text-lg font-semibold">
                  Ordered Products
                </h2>

                {order.items.map((item, index) => (
                  <div
                    key={`${item.productId || item.id}-${index}`}
                    className="flex items-center gap-5 rounded-lg bg-zinc-800 p-4"
                  >
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-zinc-700 p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {item.name}
                      </h3>

                      <p className="mt-2 text-sm text-gray-400">
                        Quantity: {item.quantity}
                      </p>

                      <p className="mt-1 text-sm text-purple-400">
                        ${Number(item.price).toFixed(2)} each
                      </p>
                    </div>

                    <p className="font-semibold">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Shipping Information */}
              <div className="grid grid-cols-2 gap-8 border-t border-white/10 p-6">
                <div>
                  <h2 className="mb-3 font-semibold">
                    Shipping Details
                  </h2>

                  <p className="text-sm text-gray-400">
                    {order.shippingDetails?.fullName}
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    {order.shippingDetails?.address}
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    {order.shippingDetails?.city},{" "}
                    {order.shippingDetails?.postalCode}
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    {order.shippingDetails?.country}
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    {order.shippingDetails?.phone}
                  </p>
                </div>

                <div>
                  <h2 className="mb-3 font-semibold">
                    Payment Information
                  </h2>

                  <p className="text-sm text-gray-400">
                    {order.shippingDetails?.paymentMethod === "cod"
                      ? "Cash on Delivery (Demo)"
                      : "Online Payment (Demo)"}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Payment is not processed in this demo.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link
          to="/products"
          className="mt-10 inline-block rounded-lg bg-purple-600 px-8 py-3 font-semibold transition hover:bg-purple-700"
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}

export default Orders;
