import { Products } from "@/types/products";
import React from "react";
import Product from "./Product";

interface ProductsListProps {
  products: Products[];
}

const InventoryList: React.FC<ProductsListProps> = ({ products }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Actions</th>
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
