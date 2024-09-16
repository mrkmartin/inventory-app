import React from 'react';
import { Products } from '@/types/products';

interface ProductProps {
  product: Products;
}

const Product: React.FC<ProductProps> = ({ product }) => {
  return (
    <tr key={product.id}>
      <th>{product.id}</th>
      <td>{product['product name']}</td>
      <td>{product.quantity}</td>
      <td>{`\$${product.price}`}</td>
    </tr>
  );
};

export default Product;
