import { useState } from "react";

import {
  useAdminProducts,
  useRestoreProduct,
  useHardDeleteProduct,
} from "../hooks/useAdminProducts";

import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";

function Trash() {
  const { data: products = [], isLoading, isError } = useAdminProducts();

  const restoreMutation = useRestoreProduct();
  const hardDeleteMutation = useHardDeleteProduct();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productToDelete, setProductToDelete] = useState(null);

  const productsPerPage = 8;

  // Get only deleted products
  const deletedProducts = products.filter(
    (product) => product.isDeleted === true
  );

  // Search deleted products
  const filteredProducts = deletedProducts.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / productsPerPage)
  );

  const startIndex = (currentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // Restore product
  const handleRestore = (id) => {
    restoreMutation.mutate(id);
  };

  // Permanently delete product
  const confirmPermanentDelete = () => {
    hardDeleteMutation.mutate(productToDelete.id, {
      onSuccess: () => {
        setProductToDelete(null);
      },
    });
  };

  const columns = [
    {
      key: "image",
      label: "Image",
      type: "image",
    },
    {
      key: "name",
      label: "Product",
    },
    {
      key: "anime",
      label: "Anime",
    },
    {
      key: "type",
      label: "Category",
    },
    {
      key: "price",
      label: "Price",
      render: (product) => `$${product.price}`,
    },
    {
      key: "stock",
      label: "Stock",
    },
    {
      key: "actions",
      label: "Actions",
      render: (product) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleRestore(product.id)}
            disabled={restoreMutation.isPending}
            className="text-green-400 hover:text-green-300 disabled:opacity-50"
          >
            Restore
          </button>

          <button
            onClick={() => setProductToDelete(product)}
            className="text-red-400 hover:text-red-300"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <p className="text-gray-400">Loading trash...</p>
    );
  }

  if (isError) {
    return (
      <p className="text-red-400">Failed to load deleted products.</p>
    );
  }

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Trash</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage deleted products
          </p>
        </div>

        <span className="text-sm text-gray-400">
          {deletedProducts.length} deleted products
        </span>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search deleted products..."
          className="w-full max-w-sm rounded-lg border border-white/10 bg-[#15151f] px-4 py-3 text-white outline-none focus:border-purple-500"
        />
      </div>

      {/* Products table */}
      <DataTable
        columns={columns}
        data={currentProducts}
      />

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Permanent delete confirmation */}
      {productToDelete && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="pointer-events-auto w-full max-w-md rounded-xl border border-white/10 bg-[#15151f] p-6 text-white shadow-2xl">
            <h2 className="text-lg font-semibold">
              Permanently Delete Product?
            </h2>

            <p className="mt-3 text-sm text-gray-400">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-white">
                {productToDelete.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                onClick={confirmPermanentDelete}
                disabled={hardDeleteMutation.isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
              >
                {hardDeleteMutation.isPending
                  ? "Deleting..."
                  : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Trash;
