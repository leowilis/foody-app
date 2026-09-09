import { useNavbar } from './hooks/useNavbar';
import NavbarDesktop from './NavbarDesktop';
import NavbarMobile from './NavbarMobile';

// App-wide navigation bar — transparent when at top, white when scrolled.
export default function Navbar() {
  const navbar = useNavbar();

  return (
    <header className='sticky top-0 z-50 w-full border-b border-neutral-100 bg-white/95 backdrop-blur-md'>
      <div className='mx-auto flex h-16 w-full max-w-[1280px] items-center px-5 sm:px-8 lg:h-20 lg:px-10'>
        <NavbarDesktop navbar={navbar} />
        <NavbarMobile navbar={navbar} />
      </div>
    </header>
  );
}
