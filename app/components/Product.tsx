'use client';

import React, { FormEventHandler, useState, useEffect } from 'react';
import { Products } from '@/types/products';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import ProductForm from './ProductForm';
import { deleteProduct, editProduct } from '@/api';
import { useRouter } from 'next/navigation';
import Message from './Message';

// Constants for delay times
const MESSAGE_DISPLAY_TIME = 1500; // Time in milliseconds to display the message
const EDIT_SUCCESS_DELAY = 1000; // Time in milliseconds to wait before showing the edit success message
const DELETE_CONFIRM_DELAY = 500; // Time in milliseconds to wait before deleting the product

interface ProductProps {
  product: Products;
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const router = useRouter();
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false); // State to manage the visibility of the edit modal
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false); // State to manage the visibility of the delete confirmation modal
  const [formData, setFormData] = useState({
    name: product.productname, // Initial form data set from the product props
    quantity: product.quantity.toString(),
    price: product.price.toString(),
  });
  const [message, setMessage] = useState<string | null>(null); // State to manage success/error messages
  const [loading, setLoading] = useState<boolean>(false); // State to handle loading indicator

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (message) {
      timeoutId = setTimeout(() => {
        setMessage(null); // Clear message after specified time
      }, MESSAGE_DISPLAY_TIME);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId); // Cleanup timeout if the component unmounts
      }
    };
  }, [message]);

  // Validate quantity input: allows only digits
  const validateQuantity = (value: string) => /^\d*$/.test(value);

  // Validate price input: allows only digits and up to two decimal places
  const validatePrice = (value: string) => /^\d*\.?\d{0,2}$/.test(value);

  // Handle input changes for the form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'quantity' && validateQuantity(value)) {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    } else if (name === 'price' && validatePrice(value)) {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    } else if (name !== 'quantity' && name !== 'price') {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Handle form submission for editing product
  const handleSubmitEdit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // Convert quantity and price to numbers
    const quantity = parseFloat(formData.quantity);
    const price = parseFloat(formData.price);

    // Validate quantity and price values
    if (isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
      setMessage('Please enter valid numbers for quantity and price.');
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

      // Delay showing success message and closing modal
      setTimeout(() => {
        setMessage('Product updated successfully!');
        setOpenModalEdit(false);
        router.refresh();
      }, EDIT_SUCCESS_DELAY);
    } catch (error) {
      setMessage('Failed to update product. Please try again.');
      console.error('Failed to edit product', error);
    } finally {
      setTimeout(() => setLoading(false), EDIT_SUCCESS_DELAY);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async () => {
    setLoading(true);

    // Delay before actually deleting the product
    setTimeout(async () => {
      try {
        await deleteProduct(product.id);
        setMessage('Product deleted successfully!');
        setOpenModalDelete(false);
        router.refresh();
      } catch (error) {
        setMessage('Failed to delete product. Please try again.');
        console.error('Failed to delete product', error);
      } finally {
        setLoading(false);
      }
    }, DELETE_CONFIRM_DELAY);
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
      {/* Display success or error message */}
      <Message message={message} />
      <tr key={product.id}>
        <th>{product.id}</th>
        <td>{product.productname}</td>
        <td>{product.quantity}</td>
        <td>{`\$${Number(product.price).toFixed(2)}`}</td>
        <td className='flex gap-5'>
          {/* Edit product button */}
          <FiEdit
            onClick={handleEditClick}
            cursor='pointer'
            className='text-blue-500'
            size={25}
          />
          <ProductForm
            modalOpen={openModalEdit}
            setModalOpen={setOpenModalEdit}
          >
            <form onSubmit={handleSubmitEdit}>
              <h3 className='font-bold text-lg text-center'>Edit Product</h3>
              <div className='modal-action flex flex-col max-w-xs px-3 py-4 gap-5 mx-auto'>
                {/* Input fields for editing product */}
                <InputField
                  label='Product Name'
                  value={formData.name}
                  onChange={handleChange}
                  name='name'
                  placeholder='Type here'
                />
                <InputField
                  label='Quantity'
                  value={formData.quantity}
                  onChange={handleChange}
                  name='quantity'
                  placeholder='Type here'
                />
                <InputField
                  label='Price'
                  value={formData.price}
                  onChange={handleChange}
                  name='price'
                  placeholder='Type here'
                />
                <button
                  type='submit'
                  className='btn btn-success text-white uppercase font-bold'
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </ProductForm>
          {/* Delete product button */}
          <FiTrash2
            onClick={() => setOpenModalDelete(true)}
            cursor='pointer'
            className='text-red-500'
            size={25}
          />
          <ProductForm
            modalOpen={openModalDelete}
            setModalOpen={setOpenModalDelete}
          >
            <h3 className='text-lg'>
              Are you sure you want to delete this product?
            </h3>
            <div className='modal-action'>
              {/* Confirm delete button */}
              <button
                onClick={handleDeleteProduct}
                className='btn bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Yes'}
              </button>
              {/* Cancel delete button */}
              <button
                onClick={() => setOpenModalDelete(false)}
                className='btn bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500'
              >
                No
              </button>
            </div>
          </ProductForm>
        </td>
      </tr>
    </>
  );
};

// Extracted InputField component for reusable form fields
const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  placeholder: string;
}> = ({ label, value, onChange, name, placeholder }) => (
  <label className='form-control w-full max-w-xs'>
    <div className='label'>
      <span className='label-text font-bold'>{label}</span>
    </div>
    <input
      value={value}
      onChange={onChange}
      type='text'
      name={name}
      placeholder={placeholder}
      className='input input-bordered w-full max-w-xs'
      required
    />
  </label>
);

export default Product;
