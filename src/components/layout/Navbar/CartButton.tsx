import CartIcon from '@/assets/cart-white.svg';

interface CartButtonProps {
  cartCount: number;
  onClick: () => void;
}

// Renders the shopping cart action and current item count.
export default function CartButton({ cartCount, onClick }: CartButtonProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={`Shopping cart containing ${cartCount} ${
        cartCount === 1 ? 'item' : 'items'
      }`}
      className='relative cursor-pointer select-none rounded-full p-1 outline-none transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-primary-100'
    >
      <img
        src={CartIcon}
        alt=''
        aria-hidden='true'
        className='h-7 w-7 object-contain md:h-8 md:w-8'
      />

      {cartCount > 0 && (
        <span
          aria-hidden='true'
          className='absolute -right-0.5 -top-0.5 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-primary-100 shadow-sm motion-reduce:animate-none'
        >
          <span className='text-[10px] font-bold leading-none text-white md:text-[11px]'>
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        </span>
      )}
    </button>
  );
}
