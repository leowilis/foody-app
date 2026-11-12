const CLOUDINARY_HOST = 'res.cloudinary.com';
const DEFAULT_IMAGE_WIDTH = 800;

// Optimizes versioned Cloudinary image URLs without changing other sources.
export function getOptimizedImageUrl(
  source: string,
  width = DEFAULT_IMAGE_WIDTH,
): string {
  if (!source || !Number.isSafeInteger(width) || width <= 0) {
    return source;
  }

  let url: URL;

  try {
    url = new URL(source);
  } catch {
    return source;
  }

  if (
    url.hostname !== CLOUDINARY_HOST ||
    !['https:', 'http:'].includes(url.protocol)
  ) {
    return source;
  }

  const versionedImagePath = /\/image\/upload\/(v\d+\/)/;

  if (!versionedImagePath.test(url.pathname)) {
    return source;
  }

  url.pathname = url.pathname.replace(
    versionedImagePath,
    `/image/upload/f_auto,q_auto,w_${width},c_limit/$1`,
  );

  return url.toString();
}
