"use client";

import { AiOutlinePlus } from "react-icons/ai";
import ProductForm from "./ProductForm";
import { FormEventHandler, useState } from "react";
import { addProduct } from "@/api";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

const AddItem = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [newProductName, setNewProductName] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<string>("");
  const [newPrice, setNewPrice] = useState<string>("");

  // Handle form submission
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // Convert quantity and price to numbers and check for validity
    const quantity = parseFloat(newQuantity);
    const price = parseFloat(newPrice);

    if (isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
      alert("Please enter valid numbers for quantity and price.");
      return;
    }

    await addProduct({
      id: uuidv4(),
      productname: newProductName,
      quantity,
      price,
    });

    // Reset fields and close modal
    setNewProductName("");
    setNewQuantity("");
    setNewPrice("");
    setModalOpen(false);
    router.refresh();
  };

  // Handle quantity input change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only positive numeric values
    if (/^\d*$/.test(value)) {
      setNewQuantity(value);
    }
  };

  // Handle price input change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow digits, a single period, and up to 2 decimal places
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setNewPrice(value);
    }
  };

  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={() => setModalOpen(true)}
        className="btn btn-primary w-auto h-auto px-4 py-2 uppercase font-bold"
      >
        Add New Product <AiOutlinePlus className="ml-2" size={18} />
      </button>

      <ProductForm modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <form onSubmit={handleSubmit}>
          <h3 className="font-bold text-lg">Add New Product</h3>
          <div className="modal-action flex flex-col max-w-xs px-3 py-4 gap-5 mx-auto">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Product Name</span>
              </div>
              <input
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                type="text"
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
                value={newQuantity}
                onChange={handleQuantityChange}
                type="text"
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
                value={newPrice}
                onChange={handlePriceChange}
                type="text"
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
    </div>
  );
};

export default AddItem;
