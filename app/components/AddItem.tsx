'use client';

import { AiOutlinePlus } from 'react-icons/ai';
import ProductForm from './ProductForm';
import { useState } from 'react';

const AddItem = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  return (
    <div>
      <button
        onClick={() => setModalOpen(true)}
        className='btn btn-primary w-full uppercase font-bold'
      >
        Add New Item <AiOutlinePlus className='ml-2' size={18} />
      </button>

      <ProductForm modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <form>
          <h3 className='font-bold text-lg'>Add New Product</h3>
          <div className='modal-action flex flex-col'>
            <label>
              Product Name
              <input
                type='text'
                placeholder='Product Name'
                className='input input-bordered w-full max-w-xs flex self-end'
              />
            </label>

            <input
              type='text'
              placeholder='Quantity'
              className='input input-bordered w-full max-w-xs'
            />
            <input
              type='text'
              placeholder='Price'
              className='input input-bordered w-full max-w-xs'
            />
            <input
              type='text'
              placeholder='Type here'
              className='input input-bordered w-full max-w-xs'
            />
            <button type='submit' className='btn'>
              Submit
            </button>
          </div>
        </form>
      </ProductForm>
    </div>
  );
};

export default AddItem;
