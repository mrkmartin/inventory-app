'use client';

import React, { FormEventHandler, useState } from 'react';
import { Products } from '@/types/products';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import ProductForm from './ProductForm';
import { editProduct } from '@/api';

interface ProductProps {
  product: Products;
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: product['product name'],
    quantity: product.quantity,
    price: product.price,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitEdit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    // await editProduct({
    //   id: product.id,
    //   'product name': formData.name,
    //   quantity: formData.quantity,
    //   price: formData.price,
    // });
    try {
      await editProduct({
        id: product.id,
        'product name': formData.name,
        quantity: formData.quantity,
        price: formData.price,
      });
      // Optionally refetch the product data here or update local state
    } catch (error) {
      console.error('Failed to edit product', error);
    }
  };

  return (
    <tr key={product.id}>
      <th>{product.id}</th>
      <td>{product['product name']}</td>
      <td>{product.quantity}</td>
      <td>{`\$${product.price}`}</td>
      <td className='flex gap-5'>
        <FiEdit
          onClick={() => setOpenModalEdit(true)}
          cursor='pointer'
          className='text-blue-500'
          size={25}
        />
        <ProductForm modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
          <form onSubmit={handleSubmitEdit}>
            <h3 className='font-bold text-lg'>Edit Product</h3>
            <div className='modal-action flex flex-col max-w-xs px-3 py-4 gap-5 mx-auto'>
              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <span className='label-text'>Product Name</span>
                </div>
                <input
                  value={formData.name}
                  onChange={handleChange}
                  type='text'
                  name='product name'
                  placeholder='Type here'
                  className='input input-bordered w-full max-w-xs'
                />
              </label>
              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <span className='label-text'>Quantity</span>
                </div>
                <input
                  value={formData.quantity}
                  onChange={handleChange}
                  type='text'
                  name='quantity'
                  placeholder='Type here'
                  className='input input-bordered w-full max-w-xs'
                />
              </label>
              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <span className='label-text'>Price</span>
                </div>
                <input
                  value={formData.price}
                  onChange={handleChange}
                  type='text'
                  name='price'
                  placeholder='Type here'
                  className='input input-bordered w-full max-w-xs'
                />
              </label>
              <button
                type='submit'
                className='btn btn-success text-white uppercase'
              >
                Submit
              </button>
            </div>
          </form>
        </ProductForm>
        <FiTrash2 cursor='pointer' className='text-red-500' size={25} />
      </td>
    </tr>
  );
};

export default Product;
