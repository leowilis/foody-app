import CartButton from './CartButton';
import ProfileMenu from './ProfileMenu';
import type { useNavbar } from './hooks/useNavbar';
import Logo from '@/assets/logo-foody.svg';

interface NavbarMobileProps {
  navbar: ReturnType<typeof useNavbar>;
}

// Mobile navbar — logo, cart, and profile avatar.
export default function NavbarMobile({ navbar }: NavbarMobileProps) {
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
    <div className='flex w-full items-center justify-between md:hidden select-none px-4 py-3'>
      {/* Logo */}
      <button
        type='button'
        aria-label='Go to homepage'
        onClick={() => navigate('/')}
        className='flex cursor-pointer items-center transition-opacity hover:opacity-90 outline-none'
      >
        <img src={Logo} className='h-10 w-10 object-contain' alt='Foody Logo' />
      </button>

      {/* Auth actions */}
      {isLogin ? (
        <div className='flex flex-row items-center gap-4'>
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
        <div className='flex flex-row gap-3 items-center'>
          {/* Sign In Trigger Button */}
          <button
            type='button'
            onClick={() => navigate('/auth', { state: { tab: 'signin' } })}
            className={`cursor-pointer rounded-[100px] px-4 py-2.5 text-[14px] font-bold ring-1 ring-inset transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-100 ${
              isScrolled
                ? 'ring-neutral-300 text-neutral-800 hover:bg-neutral-50'
                : 'ring-white/30 text-white hover:bg-white/10'
            }`}
          >
            Sign In
          </button>

          {/* Sign Up Trigger Button */}
          <button
            type='button'
            onClick={() => navigate('/auth', { state: { tab: 'signup' } })}
            className={`cursor-pointer rounded-[100px] px-4 py-2.5 text-[14px] font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary-100 shadow-sm ${
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
