import CartButton from './CartButton';
import ProfileMenu from './ProfileMenu';
import type { useNavbar } from './hooks/useNavbar';
import Logo from '@/assets/logo-foody.svg';

interface NavbarDesktopProps {
  navbar: ReturnType<typeof useNavbar>;
}

// Desktop navbar — logo, cart, and profile menu.
export default function NavbarDesktop({ navbar }: NavbarDesktopProps) {
  const {
    isScrolled,
    isLogin,
    profileName,
    profileAvatar,
    cartCount,
    handleCartClick,
    handleLogout,
    getInitials,
    navigate,
  } = navbar;

  return (
    <div className='hidden w-full items-center justify-between md:flex'>
      {/* Logo */}
      <button
        type='button'
        aria-label='Foody Homepage'
        onClick={() => navigate('/')}
        className='flex cursor-pointer flex-row items-center gap-3.5 outline-none transition-opacity hover:opacity-90'
      >
        <img
          src={Logo}
          className='h-8 w-8 object-contain'
          alt='Foody Brand Logo'
        />
        <span
          className={`text-[32px] font-extrabold leading-normal text-black tracking-tight`}
        >
          Foody
        </span>
      </button>

      {/* Auth actions */}
      {isLogin ? (
        <div className='flex flex-row items-center gap-6'>
          <CartButton cartCount={cartCount} onClick={handleCartClick} />
          <ProfileMenu
            profileName={profileName}
            profileAvatar={profileAvatar}
            isScrolled={isScrolled}
            onLogout={handleLogout}
            getInitials={getInitials}
          />
        </div>
      ) : (
        <div className='flex flex-row gap-4 items-center'>
          {/* Sign In Navigation Route CTA */}
          <button
            type='button'
            onClick={() => navigate('/auth', { state: { tab: 'signin' } })}
            className={`h-12 w-[163px] cursor-pointer rounded-[100px] px-2 py-2 text-[16px] font-bold leading-none ring-1 ring-inset transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-100 ${
              isScrolled
                ? 'ring-neutral-300 text-neutral-800 hover:bg-neutral-50'
                : 'ring-white/30 text-white hover:bg-white/10'
            }`}
          >
            Sign In
          </button>

          {/* Sign Up Navigation Route CTA */}
          <button
            type='button'
            onClick={() => navigate('/auth', { state: { tab: 'signup' } })}
            className={`h-12 w-[163px] cursor-pointer rounded-[100px] px-2 py-2 text-[16px] font-bold leading-none transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary-100 shadow-sm ${
              isScrolled
                ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                : 'bg-white text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
}
