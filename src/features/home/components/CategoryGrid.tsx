import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setDistance } from '@/features/filters/categoryFilterSlice';
import { CATEGORIES } from '../constants/categories';
import type { ActiveList } from '../types';

interface CategoryGridProps {
  onSelect: (list: ActiveList) => void;
}

// Grid of category shortcuts shown below the hero section.
export default function CategoryGrid({ onSelect }: CategoryGridProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = (key: string) => {
    if (key === 'nearby-nav') {
      dispatch(setDistance('nearby'));
      navigate('/category');
      return;
    }
    onSelect(key as ActiveList);
  };

  return (
    <div className='grid grid-cols-3 gap-x-5 gap-y-5 md:flex md:flex-row md:justify-between'>
      {CATEGORIES.map((category) => (
        <div
          key={category.key}
          className='flex flex-col gap-1 cursor-pointer transition-transform duration-200 hover:scale-[1.1] md:gap-1.5'
          onClick={() => handleClick(category.key)}
        >
          <div className='flex h-25 w-full items-center justify-center rounded-3xl p-2 shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-transform duration-200 hover:scale-[1.02]'>
            <img
              src={category.icon}
              className='h-12 w-12 md:h-16.25 md:w-16.25'
              alt=''
            />
          </div>
          <p className='text-center text-[14px] font-bold leading-7 text-neutral-900 -tracking-[0.02em] md:text-[18px] md:leading-8 md:-tracking-[0.03em]'>
            {category.label}
          </p>
        </div>
      ))}
    </div>
  );
}
