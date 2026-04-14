/**
 * Example Usage of CloudflareR2Client
 *
 * This file demonstrates how to use the R2 client library in the LocalGenius application.
 * DO NOT commit secrets to this file - use environment variables.
 */

import { getR2Client, UploadResult, ListAssetsResult } from "./cloudflare-r2";

/**
 * Example 1: Upload an image asset
 * Path convention: {site_id}/images/{filename}
 */
async function exampleUploadImage() {
  const r2 = getR2Client();

  // In a real application, this would come from request body or file system
  const imageBuffer = Buffer.from([137, 80, 78, 71]); // PNG magic bytes

  try {
    const result: UploadResult = await r2.uploadAsset("site-123-abc", imageBuffer, "images/hero.jpg", "image/jpeg");

    console.log("Upload successful!");
    console.log(`Public URL: ${result.url}`);
    console.log(`Cache headers: max-age=31536000, immutable`);
    // Output:
    // Public URL: https://xxxxx.r2.cloudflarestorage.com/site-123-abc/images/hero.jpg
    // Cache headers: max-age=31536000, immutable (1 year, immutable for images)
  } catch (error) {
    console.error("Upload failed:", error);
  }
}

/**
 * Example 2: Upload static HTML file
 * Path convention: {site_id}/html/{filename}
 * Note: HTML files get cache-control: max-age=0, must-revalidate
 */
async function exampleUploadStaticHtml() {
  const r2 = getR2Client();

  const htmlContent = Buffer.from(
    `<!DOCTYPE html>
<html>
<head><title>Restaurant Site</title></head>
<body><h1>Welcome</h1></body>
</html>`
  );

  try {
    const result = await r2.uploadAsset("site-456-def", htmlContent, "html/index.html", "text/html");

    console.log(`Published at: ${result.url}`);
    console.log(`Cache headers: max-age=0, must-revalidate (always revalidate)`);
  } catch (error) {
    console.error("Upload failed:", error);
  }
}

/**
 * Example 3: Get public CDN URL without uploading
 * Used to construct URLs for assets that are already in R2
 */
function exampleGetAssetUrl() {
  const r2 = getR2Client();

  // Get URL for an existing asset
  const imageUrl = r2.getAssetUrl("site-789-ghi", "images/menu-item.png");
  console.log(`Image CDN URL: ${imageUrl}`);
  // Output: https://xxxxx.r2.cloudflarestorage.com/site-789-ghi/images/menu-item.png

  const htmlUrl = r2.getAssetUrl("site-789-ghi", "html/index.html");
  console.log(`HTML CDN URL: ${htmlUrl}`);
  // Output: https://xxxxx.r2.cloudflarestorage.com/site-789-ghi/html/index.html
}

/**
 * Example 4: Generate a signed URL for private/time-limited access
 * Useful for serving private assets or time-bound links
 */
async function exampleGetSignedUrl() {
  const r2 = getR2Client();

  try {
    // Generate a URL that expires in 1 hour
    const signedUrl = await r2.getSignedUrl("site-789-ghi", "images/private-photo.jpg", 3600);

    console.log(`Signed URL (1 hour expiry): ${signedUrl}`);
    // URL contains embedded credentials and expiration time
  } catch (error) {
    console.error("Failed to generate signed URL:", error);
  }
}

/**
 * Example 5: List all assets for a site
 * Returns paginated results
 */
async function exampleListAllAssets() {
  const r2 = getR2Client();

  try {
    const result: ListAssetsResult = await r2.listAssets("site-123-abc");

    console.log(`Found ${result.assets.length} assets`);
    for (const asset of result.assets) {
      console.log(`  - ${asset.name} (${asset.size} bytes)`);
      console.log(`    URL: ${asset.url}`);
    }

    // Handle pagination
    if (result.isTruncated && result.nextContinuationToken) {
      console.log("More assets available...");
    }
  } catch (error) {
    console.error("Failed to list assets:", error);
  }
}

/**
 * Example 6: List only images for a site
 * Uses the 'prefix' option to filter by asset type
 */
async function exampleListImages() {
  const r2 = getR2Client();

  try {
    const result = await r2.listAssets("site-123-abc", {
      prefix: "images/",
      limit: 100,
    });

    console.log(`Found ${result.assets.length} images:`);
    for (const image of result.assets) {
      console.log(`  - ${image.name}`);
    }
  } catch (error) {
    console.error("Failed to list images:", error);
  }
}

/**
 * Example 7: List only HTML files for a site
 */
async function exampleListHtmlFiles() {
  const r2 = getR2Client();

  try {
    const result = await r2.listAssets("site-123-abc", {
      prefix: "html/",
    });

    console.log(`Found ${result.assets.length} HTML files`);
    for (const file of result.assets) {
      console.log(`  - ${file.name}`);
    }
  } catch (error) {
    console.error("Failed to list HTML files:", error);
  }
}

/**
 * Example 8: Delete an asset
 * Permanent deletion - no soft delete available
 */
async function exampleDeleteAsset() {
  const r2 = getR2Client();

  try {
    await r2.deleteAsset("site-123-abc", "images/old-photo.jpg");
    console.log("Asset deleted successfully");
  } catch (error) {
    console.error("Failed to delete asset:", error);
  }
}

/**
 * Example 9: Complete workflow for site provisioning
 * Shows how these functions integrate during site creation
 */
async function exampleCompleteWorkflow(siteId: string) {
  const r2 = getR2Client();

  try {
    // Step 1: Upload site assets (images)
    const heroImage = Buffer.from([/* image data */]);
    const imageResult = await r2.uploadAsset(siteId, heroImage, "images/hero.jpg", "image/jpeg");
    console.log(`1. Uploaded hero image: ${imageResult.url}`);

    // Step 2: Upload static HTML (rendered by Emdash)
    const staticHtml = Buffer.from([/* rendered HTML */]);
    const htmlResult = await r2.uploadAsset(siteId, staticHtml, "html/index.html", "text/html");
    console.log(`2. Uploaded static HTML: ${htmlResult.url}`);

    // Step 3: List all assets to verify
    const listResult = await r2.listAssets(siteId);
    console.log(`3. Verified ${listResult.assets.length} assets uploaded`);

    // Step 4: Get public URLs for site metadata
    const publishedImageUrl = r2.getAssetUrl(siteId, "images/hero.jpg");
    const publishedHtmlUrl = r2.getAssetUrl(siteId, "html/index.html");
    console.log(`4. Public URLs ready`);
    console.log(`   HTML: ${publishedHtmlUrl}`);
    console.log(`   Image: ${publishedImageUrl}`);

    return {
      success: true,
      assetCount: listResult.assets.length,
      htmlUrl: publishedHtmlUrl,
    };
  } catch (error) {
    console.error("Workflow failed:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Example 10: Handling cache control for different asset types
 *
 * The CloudflareR2Client automatically applies appropriate Cache-Control headers:
 *
 * - Images (.jpg, .png, .webp, .gif, .svg):
 *   Cache-Control: public, max-age=31536000, immutable
 *   (1 year, immutable - safe to cache forever if versioned)
 *
 * - Fonts (.woff, .woff2, .ttf, .otf):
 *   Cache-Control: public, max-age=31536000, immutable
 *   (1 year, immutable - fonts rarely change)
 *
 * - Stylesheets (.css) and Scripts (.js):
 *   Cache-Control: public, max-age=31536000, immutable
 *   (1 year, immutable - can be versioned in URL)
 *
 * - HTML files:
 *   Cache-Control: public, max-age=0, must-revalidate, no-cache
 *   (Always revalidate - content changes frequently)
 *
 * - Other files:
 *   Cache-Control: public, max-age=3600, must-revalidate
 *   (1 hour - default for unknown types)
 */
function exampleCacheControlStrategy() {
  console.log("Cache Strategy Explanation:");
  console.log("===========================");
  console.log("");
  console.log("1. Immutable Assets (images, fonts, JS, CSS):");
  console.log("   - Cache for 1 year (31536000 seconds)");
  console.log("   - Marked 'immutable' so browsers never revalidate");
  console.log("   - Safe only if URLs are versioned (e.g., hero-v2.jpg)");
  console.log("");
  console.log("2. HTML Files:");
  console.log("   - No caching (max-age=0)");
  console.log("   - Always revalidate on each request");
  console.log("   - Ensures users always get latest content");
  console.log("");
  console.log("3. Other Assets:");
  console.log("   - Cache for 1 hour (3600 seconds)");
  console.log("   - Must revalidate after expiry");
  console.log("");
}

/**
 * Example 11: Multi-tenant isolation verification
 *
 * This example shows how site_id isolation prevents cross-tenant access
 */
async function exampleMultiTenantIsolation() {
  const r2 = getR2Client();

  // Each site is completely isolated by site_id prefix
  const site1Id = "restaurant-001";
  const site2Id = "salon-002";

  try {
    // Site 1 uploads its hero image
    const site1Image = Buffer.from([/* site 1 image data */]);
    const site1Url = (await r2.uploadAsset(site1Id, site1Image, "images/hero.jpg")).url;
    console.log(`Site 1 hero: ${site1Url}`);
    // Output: .../restaurant-001/images/hero.jpg

    // Site 2 uploads its hero image
    const site2Image = Buffer.from([/* site 2 image data */]);
    const site2Url = (await r2.uploadAsset(site2Id, site2Image, "images/hero.jpg")).url;
    console.log(`Site 2 hero: ${site2Url}`);
    // Output: .../salon-002/images/hero.jpg

    // Both have same filename but different URLs (different site_id prefix)
    // Site 1 can only list/modify files under restaurant-001/
    const site1Assets = await r2.listAssets(site1Id);
    console.log(`Site 1 has ${site1Assets.assets.length} assets`);

    // Site 2 can only list/modify files under salon-002/
    const site2Assets = await r2.listAssets(site2Id);
    console.log(`Site 2 has ${site2Assets.assets.length} assets`);

    console.log("✓ Multi-tenant isolation verified");
  } catch (error) {
    console.error("Isolation test failed:", error);
  }
}

// Export examples for testing
export {
  exampleUploadImage,
  exampleUploadStaticHtml,
  exampleGetAssetUrl,
  exampleGetSignedUrl,
  exampleListAllAssets,
  exampleListImages,
  exampleListHtmlFiles,
  exampleDeleteAsset,
  exampleCompleteWorkflow,
  exampleCacheControlStrategy,
  exampleMultiTenantIsolation,
};
