import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { RiLogoutCircleLine } from 'react-icons/ri';
import ProfileDummy from '@/assets/profile-dummy.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileMenuProps {
  profileName: string;
  profileAvatar: string | null;
  onLogout: () => void;
  getInitials: (name: string) => string;
}

// Renders the user avatar menu with profile and account actions.
export default function ProfileMenu({
  profileName,
  profileAvatar,
  onLogout,
  getInitials,
}: ProfileMenuProps) {
  const navigate = useNavigate();
  const avatarSrc = profileAvatar || ProfileDummy;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          aria-label={`Open user menu for ${profileName}`}
          className='group flex cursor-pointer flex-row items-center gap-4 border-0 bg-transparent p-0 text-left outline-none focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
        >
          <Avatar className='h-10 w-10 transition-transform active:scale-95 md:h-12 md:w-12'>
            <AvatarImage
              src={avatarSrc}
              alt={profileName}
              className='object-cover'
            />

            <AvatarFallback className='bg-primary-100 font-bold text-primary-foreground'>
              {getInitials(profileName)}
            </AvatarFallback>
          </Avatar>

          <span className='hidden text-base font-semibold leading-relaxed tracking-tight text-text transition-colors group-hover:text-primary-100 md:block'>
            {profileName}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        sideOffset={12}
        className='w-[197px] rounded-3xl border border-border bg-surface p-4 shadow-foody-lg'
      >
        {/* User Identity Header Card */}
        <div className='flex select-none items-center gap-3 border-b border-border pb-3'>
          <Avatar className='h-9 w-9'>
            <AvatarImage
              src={avatarSrc}
              alt={profileName}
              className='object-cover'
            />

            <AvatarFallback className='bg-primary-100 font-bold text-primary-foreground'>
              {getInitials(profileName)}
            </AvatarFallback>
          </Avatar>

          <span className='max-w-[120px] truncate text-base font-bold tracking-tight text-text'>
            {profileName}
          </span>
        </div>

        {/* Dropdown Options List */}
        <div className='flex flex-col gap-0 pt-3'>
          <DropdownMenuItem
            className='cursor-pointer gap-3 rounded-xl px-2 py-2 outline-none hover:bg-surface-subtle focus:bg-surface-subtle'
            onClick={() => navigate('/favorites')}
          >
            <Heart
              aria-hidden='true'
              className='h-5 w-5 shrink-0 text-text-secondary'
            />

            <span className='text-sm font-medium text-text'>Favorites</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className='cursor-pointer gap-3 rounded-xl px-2 py-2 outline-none hover:bg-surface-subtle focus:bg-surface-subtle'
            onClick={() => navigate('/myorders')}
          >
            <IoDocumentTextOutline
              aria-hidden='true'
              className='shrink-0 text-xl text-text-secondary'
            />

            <span className='text-sm font-medium text-text'>My Orders</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className='cursor-pointer gap-3 rounded-xl px-2 py-2 text-primary-100 outline-none hover:bg-primary-100/10 focus:bg-primary-100/10 focus:text-primary-100'
            onClick={onLogout}
          >
            <RiLogoutCircleLine
              aria-hidden='true'
              className='shrink-0 text-xl'
            />

            <span className='text-sm font-bold'>Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
