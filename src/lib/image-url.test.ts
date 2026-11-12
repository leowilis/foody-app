import { describe, expect, it } from 'vitest';
import { getOptimizedImageUrl } from './image-url';

describe('getOptimizedImageUrl', () => {
  const cloudinaryUrl =
    'https://res.cloudinary.com/dvz5kmwqx/image/upload/v1765177617/burger-king-1_rxso80.png';

  it('adds automatic format, quality, and responsive width transformations', () => {
    expect(getOptimizedImageUrl(cloudinaryUrl)).toBe(
      'https://res.cloudinary.com/dvz5kmwqx/image/upload/f_auto,q_auto,w_800,c_limit/v1765177617/burger-king-1_rxso80.png',
    );
  });

  it('uses the requested image width', () => {
    expect(getOptimizedImageUrl(cloudinaryUrl, 600)).toContain(
      '/image/upload/f_auto,q_auto,w_600,c_limit/',
    );
  });

  it('preserves query parameters', () => {
    const source = `${cloudinaryUrl}?version=1`;

    expect(getOptimizedImageUrl(source)).toContain('?version=1');
  });

  it('does not modify non-Cloudinary URLs', () => {
    const source = 'https://example.com/restaurant.png';

    expect(getOptimizedImageUrl(source)).toBe(source);
  });

  it('does not modify local asset paths', () => {
    const source = '/assets/restaurant-dummy.webp';

    expect(getOptimizedImageUrl(source)).toBe(source);
  });

  it('does not modify Cloudinary URLs without a versioned image path', () => {
    const source = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';

    expect(getOptimizedImageUrl(source)).toBe(source);
  });

  it('does not modify invalid URLs', () => {
    const source = 'not-a-valid-url';

    expect(getOptimizedImageUrl(source)).toBe(source);
  });

  it('does not modify URLs when the requested width is invalid', () => {
    expect(getOptimizedImageUrl(cloudinaryUrl, 0)).toBe(cloudinaryUrl);
    expect(getOptimizedImageUrl(cloudinaryUrl, -800)).toBe(cloudinaryUrl);
    expect(getOptimizedImageUrl(cloudinaryUrl, 800.5)).toBe(cloudinaryUrl);
  });
});
