"use client";

import React, { FormEventHandler, useState, useEffect } from "react";
import { Products } from "@/types/products";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import ProductForm from "./ProductForm";
import { deleteProduct, editProduct } from "@/api";
import { useRouter } from "next/navigation";

interface ProductProps {
  product: Products;
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const router = useRouter();
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: product.productname,
    quantity: product.quantity.toString(),
    price: product.price.toString(),
  });
  const [message, setMessage] = useState<string | null>(null); // For success/error message
  const [loading, setLoading] = useState<boolean>(false); // To handle delay

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (message) {
      timeoutId = setTimeout(() => {
        setMessage(null);
      }, 1500); // 1.5 seconds delay to clear the message
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [message]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "quantity") {
      if (/^\d*$/.test(value)) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else if (name === "price") {
      if (/^\d*\.?\d{0,2}$/.test(value)) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle form submission for editing
  const handleSubmitEdit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // Convert quantity and price to numbers
    const quantity = parseFloat(formData.quantity);
    const price = parseFloat(formData.price);

    // Validate quantity and price
    if (isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
      setMessage("Please enter valid numbers for quantity and price.");
      return;
    }

    setLoading(true);

    try {
      await editProduct({
        id: product.id,
        productname: formData.name,
        quantity,
        price,
      });
      setMessage("Product updated successfully!");
      setOpenModalEdit(false);
      router.refresh();
    } catch (error) {
      setMessage("Failed to update product. Please try again.");
      console.error("Failed to edit product", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async () => {
    setLoading(true);

    try {
      await deleteProduct(product.id);
      setMessage("Product deleted successfully!");
      setOpenModalDelete(false);
      router.refresh();
    } catch (error) {
      setMessage("Failed to delete product. Please try again.");
      console.error("Failed to delete product", error);
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal and initialize form data
  const handleEditClick = () => {
    setFormData({
      name: product.productname,
      quantity: product.quantity.toString(),
      price: product.price.toString(),
    });
    setOpenModalEdit(true);
  };

  return (
    <>
      <tr key={product.id}>
        <th>{product.id}</th>
        <td>{product.productname}</td>
        <td>{product.quantity}</td>
        <td>{`\$${Number(product.price).toFixed(2)}`}</td>
        <td className="flex gap-5">
          <FiEdit
            onClick={handleEditClick}
            cursor="pointer"
            className="text-blue-500"
            size={25}
          />
          <ProductForm
            modalOpen={openModalEdit}
            setModalOpen={setOpenModalEdit}
          >
            <form onSubmit={handleSubmitEdit}>
              <h3 className="font-bold text-lg text-center">Edit Product</h3>
              <div className="modal-action flex flex-col max-w-xs px-3 py-4 gap-5 mx-auto">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Product Name</span>
                  </div>
                  <input
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    name="name"
                    placeholder="Type here"
                    className="input input-bordered w-full max-w-xs"
                    required
                  />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Quantity</span>
                  </div>
                  <input
                    value={formData.quantity}
                    onChange={handleChange}
                    type="text"
                    name="quantity"
                    placeholder="Type here"
                    className="input input-bordered w-full max-w-xs"
                    required
                  />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Price</span>
                  </div>
                  <input
                    value={formData.price}
                    onChange={handleChange}
                    type="text"
                    name="price"
                    placeholder="Type here"
                    className="input input-bordered w-full max-w-xs"
                    required
                  />
                </label>
                <button
                  type="submit"
                  className="btn btn-success text-white uppercase"
                  disabled={loading} // Disable button during loading
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </ProductForm>
          <FiTrash2
            onClick={() => setOpenModalDelete(true)}
            cursor="pointer"
            className="text-red-500"
            size={25}
          />
          <ProductForm
            modalOpen={openModalDelete}
            setModalOpen={setOpenModalDelete}
          >
            <h3 className="text-lg">
              Are you sure you want to delete this product?
            </h3>
            <div className="modal-action">
              <button
                onClick={handleDeleteProduct}
                className="btn bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={loading} // Disable button during loading
              >
                {loading ? "Deleting..." : "Yes"}
              </button>
              <button
                onClick={() => setOpenModalDelete(false)}
                className="btn bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                No
              </button>
            </div>
          </ProductForm>
        </td>
      </tr>
      {/* Display success or error message below the table */}
      {message && (
        <tr>
          <td
            colSpan={5}
            className={`p-3 ${
              message.startsWith("Failed")
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {message}
          </td>
        </tr>
      )}
    </>
  );
};

export default Product;
