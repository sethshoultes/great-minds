# Image Optimizer Service Documentation

## Overview

The `ImageOptimizer` service implements a production-ready image optimization pipeline for LocalGenius Sites. It addresses **Decision 15** from the locked decisions blueprint: **95+ PageSpeed or Don't Ship**.

This service ensures that all images are optimized for PageSpeed Insights compliance before being served to users, with:
- Responsive image variants (320px, 640px, 1280px widths)
- WebP primary format with JPEG fallback for browser compatibility
- Automatic upload to Cloudflare R2 with multi-tenant partitioning
- Srcset generation for use in templates

## Architecture

### Processing Pipeline

```
User Upload
    ↓
ImageOptimizer.optimizeImage()
    ├─ Extract metadata (dimensions, format, size)
    ├─ Generate responsive variants (320/640/1280px)
    │  ├─ WebP (quality 80)
    │  └─ JPEG (quality 85)
    └─ Generate srcset markup
         ↓
ImageOptimizer.uploadOptimizedImages()
    ├─ Upload original to R2: {site_id}/images/original/{filename}
    ├─ Upload variants to R2: {site_id}/images/{width}/{format}/{filename}
    └─ Return URLs + srcset markup
         ↓
Template Usage
    ├─ Picture element (WebP + JPEG fallback)
    └─ Responsive srcset attributes
```

### Multi-Tenant Storage

All images are stored in a single Cloudflare R2 bucket with site_id partitioning:

```
Bucket: localgenius-media/

site-123/
├─ images/
│  ├─ original/
│  │  └─ hero.jpeg
│  ├─ 320/
│  │  ├─ webp/
│  │  │  └─ hero.webp
│  │  └─ jpeg/
│  │     └─ hero.jpg
│  ├─ 640/
│  │  ├─ webp/
│  │  │  └─ hero.webp
│  │  └─ jpeg/
│  │     └─ hero.jpg
│  └─ 1280/
│     ├─ webp/
│     │  └─ hero.webp
│     └─ jpeg/
│        └─ hero.jpg

site-456/
├─ images/
│  ├─ original/
│  │  └─ logo.png
│  ├─ 320/
│  │  └─ ...
│  └─ ...
```

## API Reference

### Core Classes

#### `ImageOptimizer`

Main service class for image optimization and uploading.

**Constructor**
```typescript
const optimizer = new ImageOptimizer();
// or use singleton
const optimizer = getImageOptimizer();
```

**Methods**

##### `optimizeImage(buffer: Buffer, options?: ImageOptimizerOptions): Promise<OptimizeImageResult>`

Optimize an image by generating responsive variants and extracting metadata.

**Parameters:**
- `buffer` (Buffer): Original image data
- `options` (ImageOptimizerOptions, optional):
  - `widths` (number[]): Custom responsive widths (default: [320, 640, 1280])
  - `webpQuality` (number): WebP quality 0-100 (default: 80)
  - `jpegQuality` (number): JPEG quality 0-100 (default: 85)

**Returns:** `Promise<OptimizeImageResult>`

**Example:**
```typescript
const imageBuffer = await fs.promises.readFile('hero.jpg');
const optimized = await optimizer.optimizeImage(imageBuffer);

console.log(optimized.metadata);
// {
//   width: 1920,
//   height: 1080,
//   format: 'jpeg',
//   sizeBytes: 102400,
//   aspectRatio: 1.777...
// }

console.log(optimized.variants.size); // 3 (320, 640, 1280)
```

**Throws:** Error if image buffer is invalid or processing fails.

---

##### `uploadOptimizedImages(siteId: string, optimized: OptimizeImageResult, filename: string): Promise<UploadOptimizedImagesResult>`

Upload optimized images and variants to Cloudflare R2.

**Parameters:**
- `siteId` (string): Tenant identifier (site_id)
- `optimized` (OptimizeImageResult): Result from `optimizeImage()`
- `filename` (string): Original filename (e.g., 'hero.jpg')

**Returns:** `Promise<UploadOptimizedImagesResult>`

**Example:**
```typescript
const result = await optimizer.uploadOptimizedImages(
  'site-123',
  optimized,
  'hero.jpg'
);

console.log(result.originalUrl);
// https://r2.cloudflarestorage.com/site-123/images/original/hero.jpeg

console.log(result.srcsetMarkup.webp);
// https://r2.cloudflarestorage.com/site-123/images/320/webp/hero.webp 320w,
// https://r2.cloudflarestorage.com/site-123/images/640/webp/hero.webp 640w,
// https://r2.cloudflarestorage.com/site-123/images/1280/webp/hero.webp 1280w

console.log(result.savings);
// {
//   originalSize: 102400,
//   totalOptimizedSize: 45000,
//   percentageReduction: 56.05
// }
```

**Throws:** Error if upload fails or R2 client is unavailable.

---

##### `generatePictureElement(uploadResult: UploadOptimizedImagesResult, altText: string, className?: string): string`

Generate HTML `<picture>` element with WebP + JPEG fallback.

**Parameters:**
- `uploadResult` (UploadOptimizedImagesResult): Result from `uploadOptimizedImages()`
- `altText` (string): Alt text for accessibility
- `className` (string, optional): CSS class name

**Returns:** HTML string

**Example:**
```typescript
const html = optimizer.generatePictureElement(result, 'Hero image', 'hero-img');
// Output:
// <picture>
//   <source srcset="..." type="image/webp" sizes="(max-width: 640px) 320px, ...">
//   <source srcset="..." type="image/jpeg" sizes="(max-width: 640px) 320px, ...">
//   <img src="..." alt="Hero image" loading="lazy" class="hero-img">
// </picture>
```

---

##### `generateImgTag(uploadResult: UploadOptimizedImagesResult, altText: string, className?: string): string`

Generate simple `<img>` tag with srcset attribute.

**Parameters:**
- `uploadResult` (UploadOptimizedImagesResult): Result from `uploadOptimizedImages()`
- `altText` (string): Alt text for accessibility
- `className` (string, optional): CSS class name

**Returns:** HTML string

**Example:**
```typescript
const html = optimizer.generateImgTag(result, 'Hero image', 'hero-img');
// Output:
// <img srcset="..." src="..." alt="Hero image" loading="lazy" class="hero-img">
```

---

##### `getTemplateContext(uploadResult: UploadOptimizedImagesResult): Object`

Get structured data for template context (e.g., Astro, Svelte).

**Returns:** Object with:
- `original`: { url, width, height }
- `variants`: Array<{ width, webpUrl, jpegUrl }>
- `srcset`: { webp, jpeg }
- `sizes`: CSS media query string

**Example:**
```typescript
const context = optimizer.getTemplateContext(result);
// Output:
// {
//   original: {
//     url: 'https://...',
//     width: 0,
//     height: 0
//   },
//   variants: [
//     { width: 320, webpUrl: '...', jpegUrl: '...' },
//     { width: 640, webpUrl: '...', jpegUrl: '...' },
//     { width: 1280, webpUrl: '...', jpegUrl: '...' }
//   ],
//   srcset: { webp: '...', jpeg: '...' },
//   sizes: '(max-width: 640px) 320px, ...'
// }
```

---

### Interfaces

#### `ImageOptimizerOptions`
```typescript
interface ImageOptimizerOptions {
  widths?: number[];           // Default: [320, 640, 1280]
  primaryFormat?: string;       // Default: 'webp'
  webpQuality?: number;         // Default: 80
  jpegQuality?: number;         // Default: 85
  extractMetadata?: boolean;    // Default: false
}
```

#### `ImageMetadata`
```typescript
interface ImageMetadata {
  width: number;                // Original width in pixels
  height: number;               // Original height in pixels
  format: string;               // Image format (jpeg, png, webp, etc)
  sizeBytes: number;            // File size in bytes
  aspectRatio: number;          // width / height
}
```

#### `ImageVariant`
```typescript
interface ImageVariant {
  width: number;                // Variant width in pixels
  webp: Buffer;                 // WebP-encoded image
  jpeg: Buffer;                 // JPEG-encoded image
  webpSize: number;             // WebP size in bytes
  jpegSize: number;             // JPEG size in bytes
}
```

#### `OptimizeImageResult`
```typescript
interface OptimizeImageResult {
  original: Buffer;             // Original image buffer
  metadata: ImageMetadata;      // Extracted metadata
  variants: Map<number, ImageVariant>;  // Responsive variants by width
  srcset: {
    webp: string;               // WebP srcset string
    jpeg: string;               // JPEG srcset string
  };
}
```

#### `UploadOptimizedImagesResult`
```typescript
interface UploadOptimizedImagesResult {
  originalPath: string;         // R2 path to original
  originalUrl: string;          // R2 public URL to original
  variantPaths: {
    webp: Record<number, string>;   // Width → R2 path
    jpeg: Record<number, string>;   // Width → R2 path
  };
  variantUrls: {
    webp: Record<number, string>;   // Width → R2 URL
    jpeg: Record<number, string>;   // Width → R2 URL
  };
  srcsetMarkup: {
    webp: string;               // Ready-to-use srcset attribute
    jpeg: string;               // Ready-to-use srcset attribute
  };
  savings: {
    originalSize: number;       // Original file size in bytes
    totalOptimizedSize: number; // Combined variant sizes
    percentageReduction: number; // Compression percentage
  };
}
```

---

## Quality Settings

### Default Quality Values

| Format | Quality | Purpose |
|--------|---------|---------|
| WebP   | 80      | Primary format; excellent quality/compression ratio |
| JPEG   | 85      | Fallback for older browsers; slightly higher quality |

### Recommendations

- **WebP 80**: Recommended for most images (photos, illustrations)
  - 60-75% file size reduction vs original JPEG
  - Indistinguishable quality loss from original

- **JPEG 85**: Used as fallback for browser compatibility
  - Similar file sizes to WebP in most cases
  - Universal browser support

### Custom Settings

```typescript
// Aggressive compression for thumbnails
const optimized = await optimizer.optimizeImage(buffer, {
  webpQuality: 70,
  jpegQuality: 75
});

// High-quality for hero images
const optimized = await optimizer.optimizeImage(buffer, {
  webpQuality: 90,
  jpegQuality: 95
});
```

---

## Responsive Widths

### Default Breakpoints

| Width | Use Case |
|-------|----------|
| 320px | Mobile devices (iPhone 12 Mini) |
| 640px | Tablets and larger phones (iPad) |
| 1280px | Desktop displays and 2x retina |

### Custom Breakpoints

```typescript
// Mobile-first only
const optimized = await optimizer.optimizeImage(buffer, {
  widths: [375, 768, 1440]  // iPhone 12, iPad, MacBook
});

// Aggressive responsive
const optimized = await optimizer.optimizeImage(buffer, {
  widths: [256, 384, 512, 768, 1024, 1280, 1920]
});
```

---

## Integration Guide

### With Astro Templates

```astro
---
import { getImageOptimizer } from '@/services/image-optimizer';
import { getR2Client } from '@/lib/cloudflare-r2';

const optimizer = getImageOptimizer();

// In API route or build process:
const imageBuffer = await fetch(imageUrl).then(r => r.arrayBuffer());
const optimized = await optimizer.optimizeImage(Buffer.from(imageBuffer));
const result = await optimizer.uploadOptimizedImages('site-123', optimized, 'hero.jpg');
---

<picture>
  <source
    srcset={result.srcsetMarkup.webp}
    type="image/webp"
    sizes="(max-width: 640px) 320px, (max-width: 1280px) 640px, 1280px"
  />
  <source
    srcset={result.srcsetMarkup.jpeg}
    type="image/jpeg"
    sizes="(max-width: 640px) 320px, (max-width: 1280px) 640px, 1280px"
  />
  <img
    src={result.originalUrl}
    alt="Hero image"
    loading="lazy"
    class="w-full h-auto"
  />
</picture>
```

### With React/Next.js

```typescript
import { getImageOptimizer } from '@/services/image-optimizer';

export async function optimizeUserImage(siteId: string, file: File) {
  const buffer = await file.arrayBuffer();
  const optimizer = getImageOptimizer();

  const optimized = await optimizer.optimizeImage(Buffer.from(buffer));
  const result = await optimizer.uploadOptimizedImages(
    siteId,
    optimized,
    file.name
  );

  return result;
}

// In component:
export function HeroImage({ result }) {
  return (
    <picture>
      <source
        srcSet={result.srcsetMarkup.webp}
        type="image/webp"
      />
      <source
        srcSet={result.srcsetMarkup.jpeg}
        type="image/jpeg"
      />
      <img
        src={result.originalUrl}
        alt="Hero"
        loading="lazy"
      />
    </picture>
  );
}
```

### During Site Provisioning

```typescript
// In provisioning pipeline (emdash-mcp.ts or provision-site.ts)
async function provisionSiteWithImages(siteId: string, businessData: BusinessData) {
  const optimizer = getImageOptimizer();

  // Optimize and upload all business photos
  const imageResults = await Promise.all(
    businessData.photos.map(async (photo) => {
      const buffer = await downloadImage(photo.url);
      const optimized = await optimizer.optimizeImage(buffer);
      return optimizer.uploadOptimizedImages(
        siteId,
        optimized,
        photo.filename
      );
    })
  );

  // Store URLs in D1 or pass to template
  return {
    hero: imageResults[0].srcsetMarkup.webp,
    gallery: imageResults.map(r => r.variantUrls.webp)
  };
}
```

---

## Error Handling

### Common Errors

| Error | Cause | Resolution |
|-------|-------|-----------|
| `Image buffer cannot be empty` | Zero-length buffer | Validate file upload before optimization |
| `Unable to read image dimensions` | Corrupted image file | Validate MIME type and file integrity |
| `Failed to upload optimized images to R2` | R2 credentials or bucket issue | Check `R2_*` environment variables |
| `Invalid site_id` | Non-alphanumeric characters | Sanitize site_id before passing |

### Graceful Degradation

```typescript
async function uploadImageSafely(siteId: string, file: File) {
  try {
    const buffer = await file.arrayBuffer();
    const optimizer = getImageOptimizer();

    const optimized = await optimizer.optimizeImage(Buffer.from(buffer));
    const result = await optimizer.uploadOptimizedImages(
      siteId,
      optimized,
      file.name
    );

    return { success: true, result };
  } catch (error) {
    console.error('Image optimization failed:', error);

    // Fallback: store original image without optimization
    return {
      success: false,
      fallback: {
        url: originalUploadUrl,
        error: error.message
      }
    };
  }
}
```

---

## Performance Characteristics

### Optimization Time

Based on sharp performance:
- **Small images (< 1MB)**: 50-200ms per variant
- **Medium images (1-5MB)**: 200-500ms per variant
- **Large images (5MB+)**: 500ms-2s per variant

*Times vary by image format, dimensions, and system load.*

### File Size Reductions

Typical compression ratios:

| Original Format | WebP 80 | JPEG 85 | Savings |
|-----------------|---------|---------|---------|
| JPEG (original) | 65-75% | 85-95% | 25-35% |
| PNG (original) | 40-60% | 75-85% | 40-60% |
| GIF (original) | 50-70% | 85-95% | 30-50% |

---

## PageSpeed Impact

This optimization directly addresses **Decision 15: 95+ PageSpeed or Don't Ship**.

### Key Improvements

1. **Image Size Reduction**: 40-60% smaller files = faster downloads
2. **Responsive Images**: Correct size for viewport = faster rendering
3. **Modern Formats**: WebP (15-20% smaller than JPEG)
4. **Lazy Loading**: `loading="lazy"` defers off-screen image loading
5. **Immutable Cache Headers**: 1-year cache on optimized images

### Expected PageSpeed Gains

- **Largest Contentful Paint (LCP)**: 30-50% improvement
- **Cumulative Layout Shift (CLS)**: Responsive images = stable layouts
- **Speed Index**: Faster image downloads = faster visually complete

### Verification

```bash
# Test individual image
curl -I https://r2.example.com/site-123/images/640/webp/hero.webp

# Check response headers:
# Cache-Control: public, max-age=31536000, immutable
# Content-Type: image/webp
# Content-Length: (optimized size)
```

---

## Testing

### Unit Tests

Located in `src/services/__tests__/image-optimizer.test.ts`

```bash
npm test -- image-optimizer.test.ts
```

Tests cover:
- Metadata extraction
- Responsive variant generation
- Format conversion (WebP/JPEG)
- R2 path construction
- HTML markup generation
- Size savings calculation

### Integration Tests

Test with real images:

```typescript
import fs from 'fs/promises';

const buffer = await fs.readFile('./test-images/hero.jpg');
const optimizer = getImageOptimizer();
const optimized = await optimizer.optimizeImage(buffer);

console.log('Variants generated:', optimized.variants.size); // Should be 3
console.log('Metadata:', optimized.metadata);
```

---

## Future Enhancements

### Planned Features

1. **AVIF Support**: Next-gen format with 10-20% better compression
2. **Blur Hash**: Placeholder generation for progressive image loading
3. **Adaptive Bitrate**: Auto-adjust quality based on network conditions
4. **Batch Processing**: Optimize multiple images in parallel
5. **Smart Cropping**: Detect faces/focal points and crop accordingly

### Configuration Expansion

```typescript
interface AdvancedOptions {
  formats: ('webp' | 'jpeg' | 'avif' | 'heic')[];
  blurHash: boolean;
  smartCrop: boolean;
  adaptiveBitrate: boolean;
  ccl: 'high' | 'medium' | 'low';  // Critical Content Loading
}
```

---

## Support & Troubleshooting

### Common Issues

**Issue**: Images not appearing in templates
- Check that R2 credentials are set (`R2_*` env vars)
- Verify site_id is alphanumeric
- Confirm R2 bucket exists and is writable

**Issue**: Large file sizes despite optimization
- Check quality settings (may be too high)
- Verify source image isn't already optimized
- Consider custom widths for smaller images

**Issue**: Slow optimization
- Sharp uses system resources; optimize during off-peak
- Consider batch processing with rate limiting
- Use `withoutEnlargement: true` to skip upscaling

**Issue**: Memory errors during optimization
- Large images (8MP+) may need streaming
- Implement streaming resize for very large batches
- Monitor system memory during provisioning

---

## References

- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [WebP Format](https://developers.google.com/speed/webp)
- [Responsive Images (MDN)](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Decision 15: 95+ PageSpeed](../decisions.md)
- [R2 Client Documentation](../lib/README_R2_CLIENT.md)
