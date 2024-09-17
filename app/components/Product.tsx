import React from "react";
import { Products } from "@/types/products";
import { FiEdit, FiTrash2 } from "react-icons/fi";

interface ProductProps {
  product: Products;
}

const Product: React.FC<ProductProps> = ({ product }) => {
  return (
    <tr key={product.id}>
      <th>{product.id}</th>
      <td>{product["product name"]}</td>
      <td>{product.quantity}</td>
      <td>{`\$${product.price}`}</td>
      <FiEdit size={25} />
      <FiTrash2 />
    </tr>
  );
};

export default Product;
