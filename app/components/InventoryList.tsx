import { Products } from '@/types/products';
import React from 'react';
import Product from './Product';

interface ProductsListProps {
  products: Products[];
}

const InventoryList: React.FC<ProductsListProps> = ({ products }) => {
  if (products.length === 0) {
    return <p>No products available.</p>; // Handle empty state
  }

  return (
    <div className='overflow-x-auto mt-8'>
      <table className='table'>
        {/* head */}
        <thead>
          <tr className='bg-gray-100'>
            <th className='px-4 py-2 font-semibold text-gray-700 text-base'>
              Product ID
            </th>
            <th className='px-4 py-2 font-semibold text-gray-700 text-base'>
              Product Name
            </th>
            <th className='px-4 py-2 font-semibold text-gray-700 text-base'>
              Quantity
            </th>
            <th className='px-4 py-2 font-semibold text-gray-700 text-base'>
              Price
            </th>
            <th className='px-4 py-2 font-semibold text-gray-700 text-base'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryList;
