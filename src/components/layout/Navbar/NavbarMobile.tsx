import { useNavbar } from './hooks/useNavbar';
import Logo from '@/assets/logo-foody.svg';
import CartButton from './CartButton';
import ProfileMenu from './ProfileMenu';

interface NavbarMobileProps {
  navbar: ReturnType<typeof useNavbar>;
}

// Renders the mobile navigation with branding and user actions.
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
        className='rounded-lg outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary-100'
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
            className='rounded-pill border border-border-strong px-4 py-2 text-sm font-bold text-text outline-none transition-colors hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-primary-100'
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
            className='rounded-pill bg-primary-100 px-4 py-2 text-sm font-bold text-primary-foreground shadow-foody-sm outline-none transition-colors hover:bg-primary-200 focus-visible:ring-2 focus-visible:ring-primary-100'
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
}
