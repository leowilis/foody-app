import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { RiLogoutCircleLine } from 'react-icons/ri';
import { SlLocationPin } from 'react-icons/sl';

interface ProfileMenuProps {
  profileName: string;
  profileAvatar: string | null;
  isScrolled: boolean;
  onLogout: () => void;
  getInitials: (name: string) => string;
}

// Avatar dropdown menu with profile, orders, and logout options.
export default function ProfileMenu({
  profileName,
  profileAvatar,
  isScrolled,
  onLogout,
  getInitials,
}: ProfileMenuProps) {
  const navigate = useNavigate();
  const avatarSrc = profileAvatar || '/src/assets/profile-dummy.svg';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          aria-label={`Open user menu for ${profileName}`}
          className='flex cursor-pointer flex-row items-center gap-4 bg-transparent border-0 p-0 text-left outline-none group focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2 focus-visible:rounded-lg'
        >
          <Avatar className='h-10 w-10 transition-transform active:scale-95 md:h-12 md:w-12'>
            <AvatarImage
              src={avatarSrc}
              alt={profileName}
              className='object-cover'
            />
            <AvatarFallback className='bg-primary-100 font-bold text-white'>
              {getInitials(profileName)}
            </AvatarFallback>
          </Avatar>
          <span
            className={`hidden text-base font-semibold leading-relaxed tracking-tight transition-colors md:block group-hover:text-primary-100 ${
              isScrolled ? 'text-black' : 'text-white'
            }`}
          >
            {profileName}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        sideOffset={12}
        className='w-[197px] rounded-3xl p-4 shadow-lg bg-white border border-neutral-100'
      >
        {/* User Identity Header Card */}
        <div className='flex items-center gap-3 border-b border-neutral-200 pb-3 select-none'>
          <Avatar className='h-9 w-9'>
            <AvatarImage
              src={avatarSrc}
              alt={profileName}
              className='object-cover'
            />
            <AvatarFallback>{getInitials(profileName)}</AvatarFallback>
          </Avatar>
          <span className='text-base font-bold tracking-tight text-neutral-900 truncate max-w-[120px]'>
            {profileName}
          </span>
        </div>

        {/* Dropdown Options List */}
        <div className='flex flex-col gap-0 pt-3'>
          <DropdownMenuItem
            className='cursor-pointer gap-3 rounded-xl px-2 py-2 hover:bg-neutral-50 outline-none'
            onClick={() => navigate('/profile')}
          >
            <SlLocationPin className='text-xl text-neutral-500 shrink-0' />
            <span className='text-sm font-medium text-neutral-700'>
              Delivery Address
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className='cursor-pointer gap-3 rounded-xl px-2 py-2 hover:bg-neutral-50 outline-none'
            onClick={() => navigate('/myorders')}
          >
            <IoDocumentTextOutline className='text-xl text-neutral-500 shrink-0' />
            <span className='text-sm font-medium text-neutral-700'>
              My Orders
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className='cursor-pointer gap-3 rounded-xl px-2 py-2 text-primary-100 hover:bg-red-50/50 outline-none focus:text-primary-100'
            onClick={onLogout}
          >
            <RiLogoutCircleLine className='text-xl shrink-0' />
            <span className='text-sm font-bold'>Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
