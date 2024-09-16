import { Products } from "./types/products";

const API_URL = "http://localhost:3001/";

export const fetchInventory = async (): Promise<Products[]> => {
  const response = await fetch(`${API_URL}/products`);
  const items = await response.json();
  return items;
};

export const addProduct = async (product: Products): Promise<Products> => {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  const newProduct = await res.json();
  return newProduct;
};
