import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

// Provides the shared application shell for all nested routes.
export default function RootLayout() {
  return (
    <div className='min-h-screen w-full bg-background'>
      <Navbar />

      <main className='min-w-0'>
        <Outlet />
      </main>
    </div>
  );
}
