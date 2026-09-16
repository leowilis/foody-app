import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setDistance } from '@/features/filters/categoryFilterSlice';
import { CATEGORIES } from '../constants/categories';
import { CATEGORY_CONFIG } from '../constants/category.constants';
import type { ActiveList } from '../types';

interface CategoryGridProps {
  onSelect: (list: ActiveList) => void;
}

export default function CategoryGrid({ onSelect }: CategoryGridProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = (key: ActiveList | 'nearby-nav') => {
    if (key === 'nearby-nav') {
      dispatch(setDistance('nearby'));
      onSelect('nearby');
      navigate('/category');
      return;
    }
    onSelect(key);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;

    // The 3D Tilt Effect logic uses values from the constants file
    const tiltX = (yc - y) / CATEGORY_CONFIG.TILT_DIVIDER_X;
    const tiltY = (x - xc) / CATEGORY_CONFIG.TILT_DIVIDER_Y;
    card.style.transform = `perspective(${CATEGORY_CONFIG.PERSPECTIVE_PX}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${CATEGORY_CONFIG.HOVER_SCALE})`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(${CATEGORY_CONFIG.PERSPECTIVE_PX}px) rotateX(0deg) rotateY(0deg) scale(1)`;
  };

  return (
    <section
      aria-labelledby='category-heading'
      className='space-y-5 select-none'
    >
      <div className='flex items-end justify-between'>
        <div>
          <p className='text-xs font-black uppercase tracking-[0.18em] text-primary-100'>
            Explore
          </p>
          <h2
            id='category-heading'
            className='mt-1 text-2xl font-black tracking-tight text-neutral-950 sm:text-3xl'
          >
            Find what you’re craving
          </h2>
        </div>
      </div>

      {/* Grid Container */}
      <div
        className='flex w-full overflow-x-auto overflow-y-visible pt-2 pb-4 scrollbar-none lg:grid lg:grid-cols-6 lg:overflow-visible lg:pt-1 lg:pb-1'
        style={{
          gap: `${CATEGORY_CONFIG.CONTAINER_GAP}px`,
        }}
      >
        {CATEGORIES.map((category) => (
          <button
            key={category.key}
            type='button'
            onClick={() => handleClick(category.key)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            aria-label={`Explore ${category.label} category`}
            className='flex shrink-0 flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-3 py-4 text-center transition-all duration-300 outline-none hover:border-neutral-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.04)] focus-visible:ring-2 focus-visible:ring-primary-100 active:translate-y-0 lg:w-full lg:mr-0'
            style={{
              transformStyle: 'preserve-3d',
              minWidth: `${CATEGORY_CONFIG.CARD_MIN_WIDTH_MOBILE}px`,
            }}
          >
            {/* Category icon */}
            <span
              className='flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-50 transition-colors duration-300'
              style={{
                transform: `translateZ(${CATEGORY_CONFIG.ICON_Z_OFFSET_PX}px)`,
              }}
            >
              <img
                src={category.icon}
                alt=''
                aria-hidden='true'
                className='h-8 w-8 object-contain'
              />
            </span>

            {/* Category label */}
            <span
              className='text-sm font-bold text-neutral-800 tracking-tight'
              style={{
                transform: `translateZ(${CATEGORY_CONFIG.LABEL_Z_OFFSET_PX}px)`,
              }}
            >
              {category.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
