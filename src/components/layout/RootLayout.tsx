import { Outlet } from 'react-router-dom';

// Wraps all protected pages with shared Navbar and layout.
export default function RootLayout() {
  return (
    <div className='min-h-screen bg-white'>
      <Outlet />
    </div>
  );
}
