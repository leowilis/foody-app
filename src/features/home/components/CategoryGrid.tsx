import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setDistance } from '@/features/filters/categoryFilterSlice';
import { CATEGORIES } from '../constants/categories';
import { CATEGORY_CONFIG } from '../constants/category.constants';
import type { ActiveList } from '../types';

interface CategoryGridProps {
  onSelect: (list: ActiveList) => void;
}

// Displays food categories with a subtle 3D hover effect.
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

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (centerY - y) / CATEGORY_CONFIG.tilt.dividerX;
    const rotateY = (x - centerX) / CATEGORY_CONFIG.tilt.dividerY;
    card.style.transform = `
      perspective(${CATEGORY_CONFIG.tilt.perspective}px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(${CATEGORY_CONFIG.tilt.scale})
    `;
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.style.transform = `
      perspective(${CATEGORY_CONFIG.tilt.perspective}px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;
  };

  return (
    <section aria-labelledby='category-heading' className='select-none'>
      <div className='mb-6 flex items-end justify-between'>
        <div>
          <p className='text-[11px] font-extrabold uppercase tracking-[0.24em] text-primary-100'>
            Explore
          </p>

          <h2
            id='category-heading'
            className='mt-2 text-2xl font-black tracking-[-0.035em] text-neutral-950 sm:text-3xl'
          >
            Find what you&apos;re craving
          </h2>
        </div>

        <button
          type='button'
          onClick={() => navigate('/category')}
          className='hidden cursor-pointer text-sm font-bold text-neutral-500 outline-none transition-colors duration-200 hover:text-primary-100 focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2 sm:block'
        >
          View all
        </button>
      </div>

      <div className='flex w-full gap-3 overflow-x-auto overflow-y-visible px-1 pb-4 pt-2 scrollbar-none sm:gap-4 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0 lg:pb-1 lg:pt-1'>
        {CATEGORIES.map((category) => (
          <button
            key={category.key}
            type='button'
            onClick={() => handleClick(category.key)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            aria-label={`Explore ${category.label} category`}
            className='group flex shrink-0 cursor-pointer flex-col items-center rounded-[24px] border border-neutral-200/80 bg-white px-4 py-5 text-center shadow-[0_6px_24px_rgba(0,0,0,0.04)] outline-none transition-[transform,box-shadow,border-color] duration-300 ease-out will-change-transform hover:border-neutral-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2 lg:w-full'
            style={{
              minWidth: `${CATEGORY_CONFIG.card.minWidthMobile}px`,
              transformStyle: 'preserve-3d',
            }}
          >
            <span
              className='flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff5ef] transition-transform duration-300 ease-out group-hover:scale-105'
              style={{
                transform: `translateZ(${CATEGORY_CONFIG.depth.icon}px)`,
              }}
            >
              <img
                src={category.icon}
                alt=''
                aria-hidden='true'
                className='h-8 w-8 object-contain'
              />
            </span>

            <span
              className='mt-3 text-sm font-bold tracking-tight text-neutral-900'
              style={{
                transform: `translateZ(${CATEGORY_CONFIG.depth.label}px)`,
              }}
            >
              {category.label}
            </span>
          </button>
        ))}
      </div>

      <button
        type='button'
        onClick={() => navigate('/category')}
        className='mt-1 block cursor-pointer text-sm font-bold text-neutral-500 outline-none transition-colors duration-200 hover:text-primary-100 focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2 sm:hidden'
      >
        View all categories
      </button>
    </section>
  );
}
