import { Products } from './types/products';

const API_URL = 'http://localhost:3001/products';

const fetchOptions = (method: string, body?: any) => ({
  method,
  headers: {
    'Content-Type': 'application/json',
  },
  body: body ? JSON.stringify(body) : null,
});

// Fetch all products
export const fetchInventory = async (): Promise<Products[]> => {
  try {
    const response = await fetch(API_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch inventory');

    return await response.json();
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
};

// Add a new product
export const addProduct = async (product: Products): Promise<Products> => {
  try {
    const res = await fetch(API_URL, fetchOptions('POST', product));
    if (!res.ok) throw new Error('Failed to add product');

    return await res.json();
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Edit an existing product
export const editProduct = async (product: Products): Promise<Products> => {
  try {
    const res = await fetch(
      `${API_URL}/${product.id}`,
      fetchOptions('PUT', product)
    );
    if (!res.ok) throw new Error('Failed to update product');

    return await res.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a product by ID
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const res = await fetch(`${API_URL}/${id}`, fetchOptions('DELETE'));
    if (!res.ok) throw new Error('Failed to delete product');
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
