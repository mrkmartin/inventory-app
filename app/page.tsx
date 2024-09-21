import { fetchInventory } from '@/api';
import AddItem from './components/AddItem';
import InventoryList from './components/InventoryList';

export default async function Home() {
  const products = await fetchInventory();
  return (
    <main className='max-w-4xl mx-auto mt-4'>
      <div className='text-center my-5 flex flex-col gap-4'>
        <h1 className='text-3xl font-bold'>Inventory App</h1>
        <AddItem />
      </div>
      <InventoryList products={products} />
    </main>
  );
}
