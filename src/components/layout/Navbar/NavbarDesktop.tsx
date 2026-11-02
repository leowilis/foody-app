import { useNavbar } from './hooks/useNavbar';
import Logo from '@/assets/logo-foody.svg';
import CartButton from './CartButton';
import ProfileMenu from './ProfileMenu';

interface NavbarDesktopProps {
  navbar: ReturnType<typeof useNavbar>;
}

// Renders the desktop navigation with branding and user actions.
export default function NavbarDesktop({ navbar }: NavbarDesktopProps) {
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
    <div className='hidden w-full select-none items-center justify-between py-2 md:flex'>
      {/* Brand */}
      <button
        type='button'
        onClick={() => navigate('/')}
        aria-label='Foody homepage'
        className='flex items-center gap-3 outline-none transition-opacity hover:opacity-80 focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-primary-100'
      >
        <img src={Logo} alt='Foody logo' className='h-9 w-9 object-contain' />

        <span className='text-2xl font-black tracking-tight text-text'>
          Foody
        </span>
      </button>

      {/* Actions */}
      {isLogin ? (
        <div className='flex items-center gap-5'>
          <CartButton cartCount={cartCount} onClick={handleCartClick} />

          <ProfileMenu
            profileName={profileName}
            profileAvatar={profileAvatar}
            onLogout={handleLogout}
            getInitials={getInitials}
          />
        </div>
      ) : (
        <div className='flex items-center gap-3'>
          {/* Sign In Button */}
          <button
            type='button'
            onClick={() =>
              navigate('/auth', {
                state: { tab: 'signin' },
              })
            }
            className='rounded-pill border border-border-strong px-5 py-2.5 text-sm font-bold text-text outline-none transition-colors hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-primary-100'
          >
            Sign In
          </button>

          {/* Sign Up Button */}
          <button
            type='button'
            onClick={() =>
              navigate('/auth', {
                state: { tab: 'signup' },
              })
            }
            className='rounded-pill bg-primary-100 px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-foody-sm outline-none transition-colors hover:bg-primary-200 focus-visible:ring-2 focus-visible:ring-primary-100'
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
}
