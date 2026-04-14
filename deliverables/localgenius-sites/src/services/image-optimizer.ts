/**
 * Image Optimization Pipeline for LocalGenius Sites
 *
 * This service handles the complete image optimization workflow:
 * 1. Receives original image buffer
 * 2. Generates responsive variants (320px, 640px, 1280px)
 * 3. Converts to WebP (primary) with JPEG fallback
 * 4. Uploads original and variants to Cloudflare R2
 * 5. Generates srcset markup for templates
 *
 * Architecture:
 * - Sharp library for image processing (resize, encode)
 * - R2 client for storage (multi-tenant partitioning by site_id)
 * - Metadata extraction for image dimensions and file sizes
 * - Support for PageSpeed optimization (critical for Decision 15: 95+ PageSpeed)
 *
 * Quality Settings:
 * - WebP: quality 80 (excellent visual quality, better compression)
 * - JPEG: quality 85 (fallback for older browsers)
 *
 * Responsive Widths:
 * - 320px: mobile devices
 * - 640px: tablet devices
 * - 1280px: desktop displays
 */

import sharp from "sharp";
import { getR2Client } from "../lib/cloudflare-r2";

/**
 * Options for image optimization
 */
export interface ImageOptimizerOptions {
  /** Custom width variants in pixels (default: [320, 640, 1280]) */
  widths?: number[];
  /** Primary format (default: 'webp') */
  primaryFormat?: string;
  /** WebP quality 0-100 (default: 80) */
  webpQuality?: number;
  /** JPEG quality 0-100 (default: 85) */
  jpegQuality?: number;
  /** Whether to extract EXIF data (default: false) */
  extractMetadata?: boolean;
}

/**
 * Metadata extracted from optimized image
 */
export interface ImageMetadata {
  /** Original image width in pixels */
  width: number;
  /** Original image height in pixels */
  height: number;
  /** Original image format */
  format: string;
  /** Original image size in bytes */
  sizeBytes: number;
  /** Aspect ratio (width/height) */
  aspectRatio: number;
}

/**
 * Optimized image variant (single width)
 */
export interface ImageVariant {
  /** Width in pixels */
  width: number;
  /** WebP format buffer */
  webp: Buffer;
  /** JPEG format buffer (fallback) */
  jpeg: Buffer;
  /** Size of WebP variant in bytes */
  webpSize: number;
  /** Size of JPEG variant in bytes */
  jpegSize: number;
}

/**
 * Result of image optimization pipeline
 */
export interface OptimizeImageResult {
  /** Original image buffer */
  original: Buffer;
  /** Original image metadata */
  metadata: ImageMetadata;
  /** Optimized variants by width */
  variants: Map<number, ImageVariant>;
  /** Suggested srcset string for HTML template use */
  srcset: {
    webp: string;
    jpeg: string;
  };
}

/**
 * Result of uploading optimized images to R2
 */
export interface UploadOptimizedImagesResult {
  /** R2 path to original image */
  originalPath: string;
  /** R2 URL to original image */
  originalUrl: string;
  /** Map of width -> R2 paths for WebP variants */
  variantPaths: {
    webp: Record<number, string>;
    jpeg: Record<number, string>;
  };
  /** Map of width -> R2 URLs for WebP variants */
  variantUrls: {
    webp: Record<number, string>;
    jpeg: Record<number, string>;
  };
  /** Srcset string for use in <img> tags */
  srcsetMarkup: {
    webp: string;
    jpeg: string;
  };
  /** Size savings summary */
  savings: {
    originalSize: number;
    totalOptimizedSize: number;
    percentageReduction: number;
  };
}

/**
 * ImageOptimizer - Production-ready image optimization service
 *
 * Implements sharp-based optimization for PageSpeed compliance:
 * - Responsive image variants for mobile/tablet/desktop
 * - WebP primary format with JPEG fallback
 * - Multi-tenant R2 storage with site_id partitioning
 * - Metadata extraction for template rendering
 *
 * Usage:
 * ```typescript
 * const optimizer = new ImageOptimizer();
 * const imageBuffer = fs.readFileSync('hero.jpg');
 *
 * // Optimize (creates variants, generates srcsets)
 * const optimized = await optimizer.optimizeImage(imageBuffer);
 *
 * // Upload to R2 (stores original + variants)
 * const result = await optimizer.uploadOptimizedImages(
 *   'site-123',
 *   optimized,
 *   'hero.jpg'
 * );
 *
 * // Use in template
 * console.log(result.srcsetMarkup.webp); // srcset attribute value
 * ```
 */
class ImageOptimizer {
  private readonly defaultWidths = [320, 640, 1280];
  private readonly defaultWebpQuality = 80;
  private readonly defaultJpegQuality = 85;

  /**
   * Optimize image: resize to multiple widths, convert formats
   *
   * @param buffer Original image buffer
   * @param options Optimization options
   * @returns Optimized image data with metadata and variants
   * @throws Error if image processing fails
   */
  async optimizeImage(buffer: Buffer, options: ImageOptimizerOptions = {}): Promise<OptimizeImageResult> {
    try {
      // Validate input
      if (!buffer || buffer.length === 0) {
        throw new Error("Image buffer cannot be empty");
      }

      // Configuration
      const widths = options.widths || this.defaultWidths;
      const webpQuality = options.webpQuality ?? this.defaultWebpQuality;
      const jpegQuality = options.jpegQuality ?? this.defaultJpegQuality;

      // Create sharp instance for metadata extraction
      const sharpInstance = sharp(buffer);
      const metadata = await sharpInstance.metadata();

      // Validate image
      if (!metadata.width || !metadata.height) {
        throw new Error("Unable to read image dimensions");
      }

      // Extract metadata
      const imageMetadata: ImageMetadata = {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format || "unknown",
        sizeBytes: buffer.length,
        aspectRatio: metadata.width / metadata.height,
      };

      // Generate variants
      const variants = new Map<number, ImageVariant>();

      for (const width of widths) {
        // Ensure width doesn't exceed original
        const targetWidth = Math.min(width, metadata.width);

        // Generate WebP variant
        const webpBuffer = await sharp(buffer)
          .resize(targetWidth, Math.round((targetWidth / metadata.width) * metadata.height), {
            fit: "cover",
            withoutEnlargement: true,
            position: "center",
          })
          .webp({ quality: webpQuality })
          .toBuffer();

        // Generate JPEG variant (fallback)
        const jpegBuffer = await sharp(buffer)
          .resize(targetWidth, Math.round((targetWidth / metadata.width) * metadata.height), {
            fit: "cover",
            withoutEnlargement: true,
            position: "center",
          })
          .jpeg({ quality: jpegQuality })
          .toBuffer();

        variants.set(width, {
          width: targetWidth,
          webp: webpBuffer,
          jpeg: jpegBuffer,
          webpSize: webpBuffer.length,
          jpegSize: jpegBuffer.length,
        });
      }

      // Generate srcset strings
      const variantsArray = Array.from(variants.entries());
      const srcsetWebp = variantsArray
        .sort(([widthA], [widthB]) => widthA - widthB)
        .map(([width]) => `{url-webp-${width}} ${width}w`)
        .join(", ");

      const srcsetJpeg = variantsArray
        .sort(([widthA], [widthB]) => widthA - widthB)
        .map(([width]) => `{url-jpeg-${width}} ${width}w`)
        .join(", ");

      return {
        original: buffer,
        metadata: imageMetadata,
        variants,
        srcset: {
          webp: srcsetWebp,
          jpeg: srcsetJpeg,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Image optimization failed: ${errorMessage}`);
    }
  }

  /**
   * Upload optimized images to Cloudflare R2
   *
   * Storage structure:
   * - Original: {site_id}/images/original/{filename}
   * - WebP variants: {site_id}/images/{width}/webp/{filename}.webp
   * - JPEG variants: {site_id}/images/{width}/jpeg/{filename}.jpg
   *
   * @param siteId Tenant identifier (site_id)
   * @param optimized Result from optimizeImage()
   * @param filename Original filename (e.g., 'hero.jpg')
   * @returns Upload result with R2 paths, URLs, and srcset markup
   * @throws Error if upload fails
   */
  async uploadOptimizedImages(
    siteId: string,
    optimized: OptimizeImageResult,
    filename: string
  ): Promise<UploadOptimizedImagesResult> {
    try {
      // Validate inputs
      if (!siteId || !filename) {
        throw new Error("siteId and filename are required");
      }

      const r2 = getR2Client();

      // Normalize filename (remove extension, will be added per format)
      const baseFilename = filename.replace(/\.[^.]+$/, "");

      // Upload original image
      const originalPath = `images/original/${baseFilename}.${optimized.metadata.format}`;
      const originalResult = await r2.uploadAsset(siteId, optimized.original, originalPath);

      // Upload variants
      const variantPaths = {
        webp: {} as Record<number, string>,
        jpeg: {} as Record<number, string>,
      };

      const variantUrls = {
        webp: {} as Record<number, string>,
        jpeg: {} as Record<number, string>,
      };

      let totalOptimizedSize = 0;

      const variantsArray = Array.from(optimized.variants.entries());
      for (const [width, variant] of variantsArray) {
        // Upload WebP variant
        const webpPath = `images/${width}/webp/${baseFilename}.webp`;
        const webpResult = await r2.uploadAsset(siteId, variant.webp, webpPath, "image/webp");
        variantPaths.webp[width] = webpResult.path;
        variantUrls.webp[width] = webpResult.url;
        totalOptimizedSize += variant.webpSize;

        // Upload JPEG variant (fallback)
        const jpegPath = `images/${width}/jpeg/${baseFilename}.jpg`;
        const jpegResult = await r2.uploadAsset(siteId, variant.jpeg, jpegPath, "image/jpeg");
        variantPaths.jpeg[width] = jpegResult.path;
        variantUrls.jpeg[width] = jpegResult.url;
        totalOptimizedSize += variant.jpegSize;
      }

      // Generate srcset markup
      const srcsetWebp = Object.entries(variantUrls.webp)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([width, url]) => `${url} ${width}w`)
        .join(", ");

      const srcsetJpeg = Object.entries(variantUrls.jpeg)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([width, url]) => `${url} ${width}w`)
        .join(", ");

      // Calculate size savings
      const percentageReduction =
        ((optimized.metadata.sizeBytes - totalOptimizedSize) / optimized.metadata.sizeBytes) * 100;

      return {
        originalPath: originalResult.path,
        originalUrl: originalResult.url,
        variantPaths,
        variantUrls,
        srcsetMarkup: {
          webp: srcsetWebp,
          jpeg: srcsetJpeg,
        },
        savings: {
          originalSize: optimized.metadata.sizeBytes,
          totalOptimizedSize,
          percentageReduction: Math.round(percentageReduction * 100) / 100,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to upload optimized images to R2: ${errorMessage}`);
    }
  }

  /**
   * Generate HTML <picture> element with responsive images
   *
   * This helper generates production-ready HTML for use in templates.
   *
   * @param uploadResult Result from uploadOptimizedImages()
   * @param altText Alt text for accessibility
   * @param className Optional CSS class for styling
   * @returns HTML string with picture element
   *
   * @example
   * ```html
   * <picture>
   *   <source srcset="..." type="image/webp" sizes="(max-width: 640px) 320px, (max-width: 1280px) 640px, 1280px">
   *   <source srcset="..." type="image/jpeg" sizes="(max-width: 640px) 320px, (max-width: 1280px) 640px, 1280px">
   *   <img src="..." alt="..." loading="lazy">
   * </picture>
   * ```
   */
  generatePictureElement(
    uploadResult: UploadOptimizedImagesResult,
    altText: string,
    className?: string
  ): string {
    const sizes = "(max-width: 640px) 320px, (max-width: 1280px) 640px, 1280px";
    const classAttr = className ? ` class="${className}"` : "";
    const fallbackUrl = uploadResult.originalUrl;

    return `<picture>
  <source srcset="${uploadResult.srcsetMarkup.webp}" type="image/webp" sizes="${sizes}">
  <source srcset="${uploadResult.srcsetMarkup.jpeg}" type="image/jpeg" sizes="${sizes}">
  <img src="${fallbackUrl}" alt="${altText}" loading="lazy"${classAttr}>
</picture>`;
  }

  /**
   * Generate HTML <img> tag with srcset (simpler alternative to picture element)
   *
   * Returns just the img tag with srcset. Useful for templates that prefer
   * semantic HTML without picture element.
   *
   * @param uploadResult Result from uploadOptimizedImages()
   * @param altText Alt text for accessibility
   * @param className Optional CSS class for styling
   * @returns HTML string with img element
   *
   * @example
   * ```html
   * <img srcset="..." src="..." alt="..." loading="lazy">
   * ```
   */
  generateImgTag(uploadResult: UploadOptimizedImagesResult, altText: string, className?: string): string {
    const classAttr = className ? ` class="${className}"` : "";
    const fallbackUrl = uploadResult.originalUrl;

    // Use WebP srcset as primary, JPEG as fallback
    return `<img srcset="${uploadResult.srcsetMarkup.webp}" src="${fallbackUrl}" alt="${altText}" loading="lazy"${classAttr}>`;
  }

  /**
   * Get responsive image metadata for template context
   *
   * Useful for templates that need raw data instead of HTML markup.
   *
   * @param uploadResult Result from uploadOptimizedImages()
   * @returns Object with all image data for template use
   */
  getTemplateContext(
    uploadResult: UploadOptimizedImagesResult
  ): {
    original: { url: string; width: number; height: number };
    variants: Array<{ width: number; webpUrl: string; jpegUrl: string }>;
    srcset: { webp: string; jpeg: string };
    sizes: string;
  } {
    // Extract metadata from URLs (we'd need to store this separately in production)
    // For now, return the essential URLs and srcsets
    const variants = Object.entries(uploadResult.variantUrls.webp).map(([width, webpUrl]) => ({
      width: Number(width),
      webpUrl,
      jpegUrl: uploadResult.variantUrls.jpeg[Number(width)],
    }));

    return {
      original: {
        url: uploadResult.originalUrl,
        width: 0, // Would need to be tracked separately
        height: 0,
      },
      variants,
      srcset: uploadResult.srcsetMarkup,
      sizes: "(max-width: 640px) 320px, (max-width: 1280px) 640px, 1280px",
    };
  }
}

/**
 * Singleton instance of ImageOptimizer
 */
let optimizerInstance: ImageOptimizer | null = null;

/**
 * Get or create ImageOptimizer singleton
 *
 * Usage:
 * ```typescript
 * import { getImageOptimizer } from './image-optimizer';
 *
 * const optimizer = getImageOptimizer();
 * const optimized = await optimizer.optimizeImage(buffer);
 * const result = await optimizer.uploadOptimizedImages('site-123', optimized, 'hero.jpg');
 * ```
 *
 * @returns ImageOptimizer instance
 */
export function getImageOptimizer(): ImageOptimizer {
  if (!optimizerInstance) {
    optimizerInstance = new ImageOptimizer();
  }
  return optimizerInstance;
}

export default ImageOptimizer;
