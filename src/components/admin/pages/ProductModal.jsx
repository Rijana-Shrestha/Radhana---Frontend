import React, { useState, useEffect, useRef } from "react";
import ImageSelector from "../ImageSelector";
import { axiosInstance } from "../../../utils/axios";

const ProductModal = ({ 
  isOpen, 
  isEditing, 
  formData, 
  onInputChange, 
  onSubmit, 
  onClose,
  submitting = false
}) => {
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [addingCat, setAddingCat] = useState(false);
  const [catError, setCatError] = useState("");
  const newCatInputRef = useRef(null);

  // Fetch categories from DB whenever modal opens
  useEffect(() => {
    if (!isOpen) return;
    const fetchCategories = async () => {
      setLoadingCats(true);
      try {
        const res = await axiosInstance.get("/categories");
        setCategories(res.data);
      } catch {
        // fallback to defaults if API fails
        setCategories([
          { _id: "wooden", name: "wooden" },
          { _id: "qr", name: "qr" },
          { _id: "keyring", name: "keyring" },
          { _id: "award", name: "award" },
          { _id: "numberplate", name: "numberplate" },
          { _id: "signboard", name: "signboard" },
        ]);
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCategories();
  }, [isOpen]);

  // Focus the new category input when it appears
  useEffect(() => {
    if (showAddInput && newCatInputRef.current) {
      newCatInputRef.current.focus();
    }
  }, [showAddInput]);

  const handleSelectChange = (e) => {
    if (e.target.value === "__add_new__") {
      // Don't change formData category yet, just show input
      setShowAddInput(true);
      setCatError("");
      setNewCatName("");
    } else {
      setShowAddInput(false);
      onInputChange(e);
    }
  };

  const handleAddCategory = async () => {
    const trimmed = newCatName.trim().toLowerCase();
    if (!trimmed) {
      setCatError("Category name cannot be empty.");
      return;
    }
    const alreadyExists = categories.some((c) => c.name === trimmed);
    if (alreadyExists) {
      setCatError("This category already exists.");
      return;
    }

    setAddingCat(true);
    setCatError("");
    try {
      const res = await axiosInstance.post("/categories", { name: trimmed });
      const added = res.data;
      setCategories((prev) =>
        [...prev, added].sort((a, b) => a.name.localeCompare(b.name)),
      );
      // Auto-select the newly added category in the form
      onInputChange({ target: { name: "category", value: added.name } });
      setShowAddInput(false);
      setNewCatName("");
    } catch (err) {
      setCatError(err.response?.data?.message || "Failed to add category.");
    } finally {
      setAddingCat(false);
    }
  };

  const handleCancelAdd = () => {
    setShowAddInput(false);
    setNewCatName("");
    setCatError("");
  };

  const handleImageChange = (imageData) => {
    onInputChange({
      target: {
        name: 'imageFiles',
        value: imageData,
        type: "file",
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h3 className="text-xl font-bold text-gray-900">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                placeholder="Enter product name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>

              {/* Dropdown */}
              <select
                name="category"
                value={showAddInput ? "__add_new__" : formData.category}
                onChange={handleSelectChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                required={!showAddInput}
                disabled={loadingCats}
              >
                <option value="">
                  {loadingCats
                    ? "Loading categories..."
                    : categories.length === 0
                      ? "No categories yet — add one below"
                      : "Select category"}
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
                {/* ── Add new category option ── */}
                <option
                  value="__add_new__"
                  style={{ color: "#2563eb", fontWeight: 600 }}
                >
                  ＋ Add new category...
                </option>
              </select>

              {/* Inline add-new-category input — appears below dropdown */}
              {showAddInput && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-medium text-blue-700 mb-2">
                    New category name
                  </p>
                  <div className="flex gap-2">
                    <input
                      ref={newCatInputRef}
                      type="text"
                      value={newCatName}
                      onChange={(e) => {
                        setNewCatName(e.target.value);
                        setCatError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCategory();
                        }
                        if (e.key === "Escape") handleCancelAdd();
                      }}
                      placeholder="e.g. photoframe"
                      className="flex-1 px-3 py-1.5 text-sm border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      disabled={addingCat}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-1"
                    >
                      {addingCat ? (
                        <>
                          <i className="fas fa-spinner fa-spin text-xs"></i>{" "}
                          Adding...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-plus text-xs"></i> Add
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelAdd}
                      className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                  {catError && (
                    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                      <i className="fas fa-exclamation-circle"></i> {catError}
                    </p>
                  )}
                </div>
              )}

              {/* Show currently selected category as a confirmation pill */}
              {formData.category && !showAddInput && (
                <p className="text-xs text-gray-500 mt-1">
                  Selected:{" "}
                  <span className="font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                    {formData.category}
                  </span>
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={onInputChange}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                required
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <input
                type="number"
                name="maxPrice"
                value={formData.maxPrice}
                onChange={onInputChange}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={onInputChange}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                required
              />
            </div>

            {/* Badge */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Badge
              </label>
              <input
                type="text"
                name="badge"
                value={formData.badge}
                onChange={onInputChange}
                placeholder="e.g., Popular, Trending"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={onInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>

            {/* Image URL */}
            <ImageSelector 
              image={formData.imageFiles}
              onImageChange={handleImageChange}
              label="Product Images (Multiple)"
              preview={true}
              multiple={true}
              returnFile={true}
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-gray-200 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-primary-600 text-black py-2 rounded-lg hover:bg-primary-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  {isEditing ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                isEditing ? 'Update Product' : 'Add Product'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
