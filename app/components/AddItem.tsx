'use client';

import { AiOutlinePlus } from 'react-icons/ai';
import ProductForm from './ProductForm';
import { FormEventHandler, useState } from 'react';
import { addProduct } from '@/api';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

const AddItem = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [newProductName, setNewProductName] = useState<string>('');
  const [newQuantity, setNewQuantity] = useState(0);
  const [newPrice, setNewPrice] = useState(0);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await addProduct({
      id: uuidv4(),
      'product name': newProductName,
      quantity: newQuantity,
      price: newPrice,
    });
    setNewProductName('');
    setNewQuantity(0);
    setNewPrice(0);
    setModalOpen(false);
    router.refresh();
  };

  return (
    <div>
      <button
        onClick={() => setModalOpen(true)}
        className='btn btn-primary w-full uppercase font-bold'
      >
        Add New Item <AiOutlinePlus className='ml-2' size={18} />
      </button>

      <ProductForm modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <form onSubmit={handleSubmit}>
          <h3 className='font-bold text-lg'>Add New Product</h3>
          <div className='modal-action flex flex-col max-w-xs px-3 py-4 gap-5 mx-auto'>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Product Name</span>
              </div>
              <input
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                type='text'
                placeholder='Type here'
                className='input input-bordered w-full max-w-xs'
              />
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Quantity</span>
              </div>
              <input
                value={newQuantity}
                onChange={(e) => setNewQuantity(Number(e.target.value))}
                type='text'
                placeholder='Type here'
                className='input input-bordered w-full max-w-xs'
              />
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Price</span>
              </div>
              <input
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                type='text'
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
    </div>
  );
};

export default AddItem;
