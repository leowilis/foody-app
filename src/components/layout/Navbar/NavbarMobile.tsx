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
    <div className='flex w-full items-center justify-between md:hidden'>
      {/* Brand */}
      <button
        type='button'
        onClick={() => navigate('/')}
        aria-label='Foody homepage'
        className='transition-opacity hover:opacity-80'
      >
        <img src={Logo} alt='Foody' className='h-9 w-9 object-contain' />
      </button>

      {/* Actions */}
      {isLogin ? (
        <div className='flex items-center gap-4'>
          <CartButton cartCount={cartCount} onClick={handleCartClick} />

          <ProfileMenu
            profileName={profileName}
            profileAvatar={profileAvatar}
            isScrolled
            onLogout={handleLogout}
            getInitials={getInitials}
          />
        </div>
      ) : (
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={() =>
              navigate('/auth', {
                state: { tab: 'signin' },
              })
            }
            className='rounded-full border border-neutral-200 px-4 py-2 text-sm font-bold text-neutral-900 transition-colors hover:bg-neutral-50'
          >
            Sign In
          </button>

          <button
            type='button'
            onClick={() =>
              navigate('/auth', {
                state: { tab: 'signup' },
              })
            }
            className='rounded-full bg-neutral-950 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-neutral-800'
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
}
