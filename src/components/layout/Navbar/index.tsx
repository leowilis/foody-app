import { useNavbar } from './hooks/useNavbar';
import NavbarDesktop from './NavbarDesktop';
import NavbarMobile from './NavbarMobile';

// App-wide navigation bar — transparent when at top, white when scrolled.
export default function Navbar() {
  const navbar = useNavbar();

  return (
    <header className='sticky top-0 z-50 w-full border-b border-neutral-100 bg-white/95 backdrop-blur-md transition-all duration-300 shadow-sm'>
      <div className='flex h-16 w-full items-center px-6 sm:px-12 lg:h-20 lg:px-24'>
        <NavbarDesktop navbar={navbar} />
        <NavbarMobile navbar={navbar} />
      </div>
    </header>
  );
}
