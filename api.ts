import { Products } from './types/products';

const API_URL = 'http://localhost:3001/';

export const fetchInventory = async (): Promise<Products[]> => {
  const response = await fetch(`${API_URL}/products`);
  const items = await response.json();
  return items;
};
