/**
 * Cover/hero image. Uses a plain <img> because covers can be local uploads
 * or arbitrary https URLs; swap to next/image once storage is a known host.
 * @param {{ src: string, alt: string, className?: string, priority?: boolean }} props
 */
export function CoverImage({ src, alt, className = '', priority = false }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`block h-auto w-full border-2 border-grape-900 bg-grape-100 object-cover ${className}`}
    />
  );
}
