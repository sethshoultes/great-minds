# Services Directory

This directory contains core business logic services for LocalGenius Sites.

## Image Optimizer Service

**File**: `image-optimizer.ts`
**Purpose**: Image optimization pipeline with responsive variants, format conversion, and R2 upload
**Status**: Production-ready

### Quick Start

```typescript
import { getImageOptimizer } from '@/services/image-optimizer';
import fs from 'fs/promises';

const optimizer = getImageOptimizer();
const buffer = await fs.readFile('hero.jpg');

// Optimize: generates 320/640/1280px variants in WebP + JPEG
const optimized = await optimizer.optimizeImage(buffer);

// Upload to R2: stores original + 6 variants
const result = await optimizer.uploadOptimizedImages(
  'site-123',
  optimized,
  'hero.jpg'
);

// Generate HTML for templates
const html = optimizer.generatePictureElement(result, 'Hero image');
```

### Features

- **Responsive Variants**: 320px (mobile), 640px (tablet), 1280px (desktop)
- **Format Conversion**: WebP primary (quality 80) + JPEG fallback (quality 85)
- **R2 Integration**: Multi-tenant storage with site_id partitioning
- **Metadata Extraction**: Dimensions, format, file size, aspect ratio
- **HTML Helpers**: Picture elements, img tags, template context
- **PageSpeed Optimization**: 40-60% compression, lazy loading, responsive images

### API Reference

**Main Methods**:
- `optimizeImage(buffer, options?)` - Generate responsive variants
- `uploadOptimizedImages(siteId, optimized, filename)` - Upload to R2
- `generatePictureElement(result, altText, className?)` - Picture element HTML
- `generateImgTag(result, altText, className?)` - Img tag with srcset
- `getTemplateContext(result)` - Structured data for templates

**Singleton**:
```typescript
const optimizer = getImageOptimizer();  // Reuses single instance
```

### Dependencies

- `sharp`: Image processing library (resize, encode)
- `cloudflare-r2`: R2 client for multi-tenant storage

### Documentation

- `IMAGE_OPTIMIZER_DOCUMENTATION.md` - Complete developer guide (675 lines)
- `__tests__/image-optimizer.test.ts` - Unit tests (14 test cases)
- `../IMAGE_OPTIMIZER_VERIFICATION.md` - Task completion report

### Decision 15 Alignment

Directly addresses **95+ PageSpeed or Don't Ship** requirement:
- Image size reduction: 40-60% via WebP
- Responsive images: Correct size for each device
- Modern formats: WebP + JPEG fallback
- Lazy loading: `loading="lazy"` on all images
- Cache optimization: 1-year immutable headers

---

## Other Services

### provisioning-queue.ts
Async job processor for site creation and provisioning pipeline.

### static-generator.ts
Static HTML generation for instant preview moments during provisioning.

---

## Environment Setup

```bash
# Install sharp library (required for image-optimizer)
npm install sharp

# Verify R2 credentials in .env
R2_ACCESS_KEY_ID=your_key
R2_SECRET_ACCESS_KEY=your_secret
R2_BUCKET_NAME=localgenius-media
R2_ENDPOINT=https://xxxxx.r2.cloudflarestorage.com
```

---

**Last Updated**: 2026-04-14
**Status**: Production-Ready ✅
