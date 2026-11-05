import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useCartHandlers } from '@/features/cart/hooks/useCartHandlers';
import { useCartMutations } from '@/features/cart/hooks/useCartMutations';
import CheckoutBar from './components/CheckoutBar';
import ImageGallery from './components/ImageGallery';
import MenuSection from './components/MenuSection';
import RestaurantInfo from './components/RestaurantInfo';
import ReviewSection from './components/ReviewSection';
import ShareDialog from './components/ShareDialog';
import { useRestaurantDetail } from './hooks/useRestaurantDetail';
import type { MenuFilter } from './schemas/restaurantSchema';

const MENU_STEP = 10;
const REVIEW_STEP = 6;

// Renders restaurant details, menu, reviews, and cart actions.
export default function DetailsPage() {
  const { id } = useParams();
  const [menuLimit, setMenuLimit] = useState(MENU_STEP);
  const [reviewLimit, setReviewLimit] = useState(REVIEW_STEP);
  const [menuFilter, setMenuFilter] = useState<MenuFilter>('all');
  const [shareOpen, setShareOpen] = useState(false);

  const { detail, isLoading, isFetching, isError, errorMessage } =
    useRestaurantDetail(id, menuLimit, reviewLimit);

  const mutations = useCartMutations();
  const handlers = useCartHandlers({
    mutations,
  });

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = async () => {
    if (!navigator.share) {
      setShareOpen(true);
      return;
    }

    try {
      await navigator.share({
        title: detail?.name ? `Foody - ${detail.name}` : 'Foody',
        text: 'Check out this restaurant on Foody!',
        url: shareUrl,
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      setShareOpen(true);
    }
  };

  return (
    <div className='mt-16 flex w-full flex-col gap-4 px-4 pt-4 text-text md:mt-32 md:gap-8 md:px-30 md:pt-0'>
      {isLoading && (
        <div className='flex flex-col gap-4 md:gap-8'>
          <div className='hidden h-117.5 md:grid md:grid-cols-2 md:gap-5'>
            <Skeleton className='h-117.5 rounded-3xl' />
            <div className='flex h-full flex-col gap-5'>
              <Skeleton className='h-75.5 rounded-3xl' />
              <div className='flex h-37.5 flex-row gap-5'>
                <Skeleton className='h-full w-full rounded-3xl' />
                <Skeleton className='h-full w-full rounded-3xl' />
              </div>
            </div>
          </div>

          <Skeleton className='h-64 w-full rounded-3xl md:hidden' />
        </div>
      )}

      {isError && (
        <Alert variant='destructive'>
          <AlertTitle>Failed to load details</AlertTitle>

          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && detail && (
        <>
          <ImageGallery images={detail.images} name={detail.name} />
          <RestaurantInfo detail={detail} onShare={handleShare} />
          <ShareDialog
            open={shareOpen}
            onOpenChange={setShareOpen}
            shareUrl={shareUrl}
          />

          <hr />

          <MenuSection
            menus={detail.menus}
            menuFilter={menuFilter}
            onFilterChange={setMenuFilter}
            restaurantId={detail.id}
            restaurantName={detail.name}
            cartItems={mutations.cartItems}
            handlers={handlers}
            hasMore={detail.menus.length < detail.totalMenus}
            isFetching={isFetching}
            onShowMore={() => setMenuLimit((previous) => previous + MENU_STEP)}
          />

          <hr />

          <ReviewSection
            reviews={detail.reviews}
            averageRating={detail.averageRating}
            totalReviews={detail.totalReviews}
            hasMore={detail.reviews.length < detail.totalReviews}
            isFetching={isFetching}
            onShowMore={() =>
              setReviewLimit((previous) => previous + REVIEW_STEP)
            }
          />

          <CheckoutBar />
        </>
      )}
    </div>
  );
}
