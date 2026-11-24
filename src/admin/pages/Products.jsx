
import { useState } from "react";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";

import {
  useAdminProducts,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../hooks/useAdminProducts";

const initialFormData = {
  name: "",
  anime: "",
  type: "",
  price: "",
  stock: "",
  description: "",
  frontImage: "",
  sideImage: "",
  backImage: "",
};

const inputClass =
  "rounded-lg border border-white/10 bg-[#15151f] p-3 text-white placeholder:text-gray-400 outline-none focus:border-purple-500";

function Products() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [formData, setFormData] = useState({ ...initialFormData });

  const { data: products = [], isLoading, isError } =
    useAdminProducts();

  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const productsPerPage = 8;

  const isSaving =
    addProductMutation.isPending || updateProductMutation.isPending;

  const resetForm = () => {
    setFormData({ ...initialFormData });
    setEditingProductId(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const images = [
      formData.frontImage,
      formData.sideImage,
      formData.backImage,
    ].filter((image) => image.trim() !== "");

    const productData = {
      name: formData.name,
      anime: formData.anime,
      type: formData.type,
      price: Number(formData.price),
      stock: Number(formData.stock),
      description: formData.description,
      image: formData.frontImage,
      images,
    };

    if (editingProductId) {
      updateProductMutation.mutate(
        {
          id: editingProductId,
          updatedProduct: productData,
        },
        {
          onSuccess: resetForm,
        }
      );
    } else {
      addProductMutation.mutate(productData, {
        onSuccess: resetForm,
      });
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name || "",
      anime: product.anime || "",
      type: product.type || "",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
      description: product.description || "",
      frontImage: product.image || product.images?.[0] || "",
      sideImage: product.images?.[1] || "",
      backImage: product.images?.[2] || "",
    });

    setEditingProductId(product.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Move this product to Trash?"
    );

    if (confirmDelete) {
      deleteProductMutation.mutate(id);
    }
  };

  // Show only active products
  const activeProducts = products.filter(
    (product) => !product.isDeleted
  );

  // Search products
  const filteredProducts = activeProducts.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
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

  // Table columns
  const columns = [
    { key: "image", label: "Image", type: "image" },
    { key: "name", label: "Product Name" },
    { key: "anime", label: "Anime" },
    { key: "type", label: "Category" },
    { key: "price", label: "Price ($)" },
    { key: "stock", label: "Stock" },
    {
      key: "actions",
      label: "Actions",
      render: (product) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(product)}
            className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(product.id)}
            className="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Failed to load products.</p>;

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your store products"
        action={
          <button
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setEditingProductId(null);
                setFormData({ ...initialFormData });
                setShowForm(true);
              }
            }}
            className="rounded-lg bg-purple-600 px-4 py-2 text-white"
          >
            {showForm ? "Close Form" : "Add Product"}
          </button>
        }
      />

      {/* Add / Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="my-6 grid grid-cols-2 gap-4 rounded-xl border border-white/10 p-5"
        >
          <h2 className="col-span-2 text-lg font-semibold text-white">
            {editingProductId ? "Edit Product" : "Add New Product"}
          </h2>

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product name"
            required
            className={inputClass}
          />

          <input
            name="anime"
            value={formData.anime}
            onChange={handleChange}
            placeholder="Anime"
            required
            className={inputClass}
          />

          <input
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Category"
            required
            className={inputClass}
          />

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            min="0"
            step="0.01"
            required
            className={`${inputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
          />

          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock"
            min="0"
            required
            className={`${inputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
          />

          <input
            name="frontImage"
            value={formData.frontImage}
            onChange={handleChange}
            placeholder="Front image path"
            required
            className={inputClass}
          />

          <input
            name="sideImage"
            value={formData.sideImage}
            onChange={handleChange}
            placeholder="Side image path (optional)"
            className={inputClass}
          />

          <input
            name="backImage"
            value={formData.backImage}
            onChange={handleChange}
            placeholder="Back image path (optional)"
            className={inputClass}
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product description"
            required
            className={`col-span-2 ${inputClass}`}
          />

          <div className="col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-purple-600 px-5 py-2 text-white disabled:opacity-50"
            >
              {isSaving
                ? "Saving..."
                : editingProductId
                  ? "Update Product"
                  : "Add Product"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-white/20 px-5 py-2 text-white"
            >
              Cancel
            </button>
          </div>

          {(addProductMutation.isError ||
            updateProductMutation.isError) && (
            <p className="col-span-2 text-red-500">
              Failed to save product. Please try again.
            </p>
          )}
        </form>
      )}

      {/* Search */}
      <div className="my-5">
        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search products..."
        />
      </div>

      {deleteProductMutation.isError && (
        <p className="mb-3 text-red-500">
          Failed to move product to Trash.
        </p>
      )}

      {/* Product Table */}
      <DataTable columns={columns} data={currentProducts} />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default Products;
  