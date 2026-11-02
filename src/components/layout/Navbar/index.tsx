import { useNavbar } from './hooks/useNavbar';
import NavbarDesktop from './NavbarDesktop';
import NavbarMobile from './NavbarMobile';

// Renders the app-wide navigation bar using the shared dark surface.
export default function Navbar() {
  const navbar = useNavbar();

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border bg-surface/95 shadow-foody-sm backdrop-blur-md transition-all duration-300'>
      <div className='flex h-16 w-full items-center px-6 sm:px-12 lg:h-20 lg:px-24'>
        <NavbarDesktop navbar={navbar} />
        <NavbarMobile navbar={navbar} />
      </div>
    </header>
  );
}
