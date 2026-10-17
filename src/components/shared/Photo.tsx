import type { ImgHTMLAttributes } from 'react';
import { imageSet } from '../../utils/images';

interface PhotoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  /** Base path from image-manifest.json, e.g. "assets/team/reshma-patil". */
  base: string;
  alt: string;
  sizes: string;
}

/** Responsive <img> for images produced by scripts/process_images.py. */
export default function Photo({ base, alt, sizes, loading = 'lazy', decoding = 'async', ...rest }: PhotoProps) {
  const img = imageSet(base);
  return (
    <img
      src={img.src}
      srcSet={img.srcSet}
      sizes={sizes}
      width={img.width}
      height={img.height}
      alt={alt}
      loading={loading}
      decoding={decoding}
      {...rest}
    />
  );
}
