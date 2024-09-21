'use client';

import { AiOutlinePlus } from 'react-icons/ai';
import ProductForm from './ProductForm';
import { FormEventHandler, useState, useEffect } from 'react';
import { addProduct } from '@/api';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import Message from './Message';

const AddItem = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [newProductName, setNewProductName] = useState<string>('');
  const [newQuantity, setNewQuantity] = useState<string>('');
  const [newPrice, setNewPrice] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null); // For displaying success/error messages
  const [loading, setLoading] = useState<boolean>(false); // To handle loading state

  // Effect to clear message after a delay
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

  // Handle form submission
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // Reset message
    setMessage(null);

    // Validate quantity and price inputs
    const errorMessage = validateInputs(newQuantity, newPrice);
    if (errorMessage) {
      setMessage(errorMessage);
      return;
    }

    setLoading(true);

    try {
      await addProduct({
        id: uuidv4(),
        productname: newProductName,
        quantity: parseFloat(newQuantity),
        price: parseFloat(newPrice),
      });

      // Display success message and reset form after a delay
      setTimeout(() => {
        setMessage('Product added successfully!');
        setLoading(false);
        setNewProductName('');
        setNewQuantity('');
        setNewPrice('');
        setModalOpen(false);
        router.refresh();
      }, 1000); // 1 second delay
    } catch (error) {
      setTimeout(() => {
        setMessage('Failed to add product. Please try again.');
        setLoading(false);
      }, 1000); // 1 second delay
    }
  };

  // Validate quantity and price inputs
  const validateInputs = (quantity: string, price: string): string | null => {
    const quantityNum = parseFloat(quantity);
    const priceNum = parseFloat(price);
    if (
      isNaN(quantityNum) ||
      quantityNum <= 0 ||
      isNaN(priceNum) ||
      priceNum <= 0
    ) {
      return 'Please enter valid numbers for quantity and price.';
    }
    return null;
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
    if (/^\d*(\.\d{0,2})?$/.test(value)) {
      setNewPrice(value);
    }
  };

  return (
    <div className='flex flex-col mb-4 relative'>
      {/* Display success/error message */}
      <Message message={message} />
      <div className='flex justify-end mb-4'>
        <button
          onClick={() => setModalOpen(true)}
          className='btn btn-primary w-auto h-auto px-4 py-2 uppercase font-bold'
        >
          Add New Product <AiOutlinePlus className='ml-2' size={18} />
        </button>
      </div>

      <ProductForm modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <form onSubmit={handleSubmit}>
          <h3 className='font-bold text-lg'>Add New Product</h3>
          <div className='modal-action flex flex-col max-w-xs px-3 py-4 gap-5 mx-auto'>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text font-bold'>Product Name</span>
              </div>
              <input
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                type='text'
                placeholder='Type here'
                className='input input-bordered w-full max-w-xs'
                required
              />
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text font-bold'>Quantity</span>
              </div>
              <input
                value={newQuantity}
                onChange={handleQuantityChange}
                type='text'
                placeholder='Type here'
                className='input input-bordered w-full max-w-xs'
                required
              />
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text font-bold'>Price</span>
              </div>
              <input
                value={newPrice}
                onChange={handlePriceChange}
                type='text'
                placeholder='Type here'
                className='input input-bordered w-full max-w-xs'
                required
              />
            </label>
            <button
              type='submit'
              className='btn btn-success text-white uppercase font-bold'
              disabled={loading} // Disable button during loading
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </ProductForm>
    </div>
  );
};

export default AddItem;
