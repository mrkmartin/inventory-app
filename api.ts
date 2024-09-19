import { Products } from './types/products';

const API_URL = 'http://localhost:3001/products';

export const fetchInventory = async (): Promise<Products[]> => {
  const response = await fetch(API_URL, { cache: 'no-store' });
  const items = await response.json();
  return items;
};

export const addProduct = async (product: Products): Promise<Products> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });

  const newProduct = await res.json();
  return newProduct;
};

export const editProduct = async (product: Products): Promise<Products> => {
  const res = await fetch(`${API_URL}/${product.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });

  const updatedProduct = await res.json();
  return updatedProduct;
};
