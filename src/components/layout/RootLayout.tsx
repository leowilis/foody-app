import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

// Wraps all protected pages with shared Navbar and layout.
export default function RootLayout() {
  return (
    <div className='min-h-screen w-full bg-white'>
      <Navbar />

      <main className='min-w-0'>
        <Outlet />
      </main>
    </div>
  );
}
