"use client";

import React, { FormEventHandler, useState } from "react";
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

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "quantity") {
      // Allow only numeric values for quantity
      if (/^\d*$/.test(value)) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else if (name === "price") {
      // Allow only valid floating-point numbers with up to 2 decimal places for price
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
      alert("Please enter valid numbers for quantity and price.");
      return;
    }

    try {
      await editProduct({
        id: product.id,
        productname: formData.name,
        quantity,
        price,
      });
      setOpenModalEdit(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to edit product", error);
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

  // Handle product deletion
  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(product.id);
      setOpenModalDelete(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  return (
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
        <ProductForm modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
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
              >
                Submit
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
            >
              Yes
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
  );
};

export default Product;
