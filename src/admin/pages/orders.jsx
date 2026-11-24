
import { useState } from "react";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";

import {
  useAdminOrders,
  useUpdateOrderStatus,
} from "../hooks/useAdminOrders";

const orderStatuses = [
  "Placed",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function Orders() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: orders = [], isLoading, isError } = useAdminOrders();

  const updateStatusMutation = useUpdateOrderStatus();

  const ordersPerPage = 8;

  // Search orders
  const filteredOrders = orders.filter((order) => {
    const searchValue = search.toLowerCase();

    return (
      order.id.toLowerCase().includes(searchValue) ||
      order.shippingDetails.fullName.toLowerCase().includes(searchValue) ||
      order.shippingDetails.email.toLowerCase().includes(searchValue)
    );
  });

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ordersPerPage)
  );

  const startIndex = (currentPage - 1) * ordersPerPage;

  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + ordersPerPage
  );

  // Update order status
  const handleStatusChange = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  // Table columns
  const columns = [
    {
      key: "id",
      label: "Order ID",
    },
    {
      key: "customer",
      label: "Customer",
      render: (order) => order.shippingDetails.fullName,
    },
    {
      key: "email",
      label: "Email",
      render: (order) => order.shippingDetails.email,
    },
    {
      key: "date",
      label: "Date",
      render: (order) => new Date(order.date).toLocaleDateString(),
    },
    {
      key: "total",
      label: "Total ($)",
      render: (order) => order.total.toFixed(2),
    },
    {
      key: "status",
      label: "Status",
      render: (order) => (
        <div className="space-y-2">
          <StatusBadge status={order.status} />

          <select
            value={order.status}
            onChange={(e) =>
              handleStatusChange(order.id, e.target.value)
            }
            disabled={updateStatusMutation.isPending}
            className="w-full rounded-lg border border-white/10 bg-[#15151f] p-2 text-xs text-white outline-none focus:border-purple-500 disabled:opacity-50"
          >
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (order) => (
        <button
          onClick={() => setSelectedOrder(order)}
          className="rounded-lg bg-purple-600 px-3 py-2 text-white hover:bg-purple-700"
        >
          View Details
        </button>
      ),
    },
  ];

  if (isLoading) {
    return <p className="text-white">Loading orders...</p>;
  }

  if (isError) {
    return <p className="text-red-400">Failed to load orders.</p>;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Order Management"
        description="View and manage customer orders."
      />

      <SearchBar
        value={search}
        onChange={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        placeholder="Search by order ID, customer or email..."
      />

      {updateStatusMutation.isError && (
        <p className="text-red-400">
          Failed to update order status. Please try again.
        </p>
      )}

      <DataTable columns={columns} data={currentOrders} />

      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-white/10 bg-[#15151f] p-6 text-white">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Order Details
              </h2>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-2xl text-gray-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="mb-6 space-y-2">
              <p>
                <span className="text-gray-400">Order ID:</span>{" "}
                {selectedOrder.id}
              </p>

              <p>
                <span className="text-gray-400">Date:</span>{" "}
                {new Date(selectedOrder.date).toLocaleString()}
              </p>

              <p className="flex items-center gap-2">
                <span className="text-gray-400">Status:</span>
                <StatusBadge status={selectedOrder.status} />
              </p>
            </div>

            <h3 className="mb-3 font-semibold">Customer Details</h3>

            <div className="mb-6 space-y-2 text-sm text-gray-300">
              <p>Name: {selectedOrder.shippingDetails.fullName}</p>
              <p>Email: {selectedOrder.shippingDetails.email}</p>
              <p>Phone: {selectedOrder.shippingDetails.phone}</p>
              <p>Address: {selectedOrder.shippingDetails.address}</p>
              <p>City: {selectedOrder.shippingDetails.city}</p>
              <p>Postal Code: {selectedOrder.shippingDetails.postalCode}</p>
              <p>Country: {selectedOrder.shippingDetails.country}</p>
              <p>Payment: {selectedOrder.shippingDetails.paymentMethod}</p>
            </div>

            <h3 className="mb-3 font-semibold">Ordered Products</h3>

            <div className="space-y-4">
              {selectedOrder.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 rounded-lg border border-white/10 p-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-400">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-400">
                      Price: ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <p className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-white/10 pt-4 text-right">
              <p className="text-lg font-semibold">
                Total: ${selectedOrder.total.toFixed(2)}
              </p>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-6 rounded-lg bg-purple-600 px-5 py-2 text-white hover:bg-purple-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
