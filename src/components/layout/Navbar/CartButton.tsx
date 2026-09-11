import CartIcon from '@/assets/cart-black.svg';

interface CartButtonProps {
  cartCount: number;
  onClick: () => void;
}

export default function CartButton({ cartCount, onClick }: CartButtonProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`Shopping cart containing ${cartCount} items`}
      className='relative cursor-pointer select-none rounded-full p-1 outline-none transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-primary-100'
    >
      <img
        alt='Cart Icon'
        src={CartIcon}
        className='h-7 w-7 md:h-8 md:w-8 object-contain'
      />

      {cartCount > 0 && (
        <div className='absolute -right-0.5 -top-0.5 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-primary-100 shadow-sm'>
          <span className='text-[10px] font-bold text-white md:text-[11px] leading-none'>
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        </div>
      )}
    </div>
  );
}
