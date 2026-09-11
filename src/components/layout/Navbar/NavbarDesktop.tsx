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
    <div className='hidden w-full items-center justify-between md:flex select-none py-2'>
      {/* Brand */}
      <button
        type='button'
        onClick={() => navigate('/')}
        aria-label='Foody homepage'
        className='flex items-center gap-3 transition-opacity hover:opacity-80 outline-none focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:rounded-lg'
      >
        <img src={Logo} alt='Foody logo' className='h-9 w-9 object-contain' />
        <span className='text-2xl font-black tracking-tight text-neutral-950'>
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
            isScrolled
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
            className='rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-bold text-neutral-900 transition-colors hover:bg-neutral-50 outline-none focus-visible:ring-2 focus-visible:ring-primary-100'
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
            className='rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-neutral-800 outline-none focus-visible:ring-2 focus-visible:ring-primary-100 shadow-sm'
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
}
