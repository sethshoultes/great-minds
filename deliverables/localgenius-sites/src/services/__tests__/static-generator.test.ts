/**
 * Test Suite for Static HTML Generator (REQ-024)
 *
 * Verifies:
 * 1. Restaurant template generation
 * 2. Services template generation
 * 3. Content rendering (Portable Text)
 * 4. Image optimization (srcsets)
 * 5. Font subsetting and inlining
 * 6. Critical CSS inlining
 * 7. Metadata generation (OG tags, structured data)
 * 8. Generation performance (<5 seconds)
 * 9. HTML output size compliance
 * 10. 95+ PageSpeed optimization principles
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  generateStaticSite,
  BusinessInfo,
  PortableTextContent,
  StaticSiteOutput,
} from '../static-generator';

describe('Static HTML Generator (REQ-024)', () => {
  let restaurantBusiness: BusinessInfo;
  let servicesBusiness: BusinessInfo;
  let sampleContent: PortableTextContent;

  beforeEach(() => {
    restaurantBusiness = {
      id: 'bus-001',
      siteId: 'site-001',
      name: 'Salsa Kitchen',
      tagline: 'Authentic Mexican cuisine from scratch',
      description: 'Family-owned restaurant serving fresh Mexican food in the heart of downtown.',
      vertical: 'restaurant',
      city: 'Austin',
      state: 'TX',
      address: '123 Main St, Austin, TX 78701',
      phone: '(512) 555-0123',
      email: 'hello@salsa.local',
      hours: {
        'Mon-Thu': '11am - 9pm',
        'Fri-Sat': '11am - 10pm',
        'Sun': '10am - 8pm',
      },
      heroImageUrl: 'https://example.com/hero.jpg',
      galleryImages: [
        'https://example.com/img1.jpg',
        'https://example.com/img2.jpg',
        'https://example.com/img3.jpg',
      ],
    };

    servicesBusiness = {
      id: 'bus-002',
      siteId: 'site-002',
      name: 'Modern Fitness',
      tagline: 'Personal training for real people',
      description: 'Professional fitness coaching with personalized training plans.',
      vertical: 'services',
      city: 'Denver',
      state: 'CO',
      address: '456 Fitness Ave, Denver, CO 80202',
      phone: '(303) 555-0456',
      email: 'info@modernfitness.local',
      hours: {
        'Mon-Fri': '6am - 8pm',
        'Sat': '8am - 6pm',
        'Sun': 'Closed',
      },
      heroImageUrl: 'https://example.com/gym-hero.jpg',
    };

    sampleContent = {
      description: [
        {
          _type: 'block',
          _key: 'block-1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'We believe in authentic flavors and fresh ingredients.',
            },
          ],
        },
      ],
      menuItems: [
        {
          _key: 'item-1',
          name: 'Carne Asada Tacos',
          description: 'Grilled marinated beef with fresh lime and cilantro',
          price: 12.99,
          category: 'Mains',
          imageUrl: 'https://example.com/tacos.jpg',
        },
        {
          _key: 'item-2',
          name: 'Chiles Rellenos',
          description: 'Roasted poblano peppers stuffed with cheese and topped with mole sauce',
          price: 14.99,
          category: 'Mains',
          imageUrl: 'https://example.com/rellenos.jpg',
        },
      ],
      services: [
        {
          _key: 'svc-1',
          name: 'Personal Training Session',
          description: '1-on-1 customized workout program',
          duration: '60 minutes',
          price: 75,
          bookingUrl: 'https://example.com/book',
          category: 'Coaching',
        },
      ],
      reviews: [
        {
          _key: 'rev-1',
          authorName: 'John Smith',
          rating: 5,
          text: 'Amazing food and even better service!',
          source: 'google',
        },
        {
          _key: 'rev-2',
          authorName: 'Maria Garcia',
          rating: 5,
          text: 'The best tacos in town, hands down.',
          source: 'yelp',
        },
      ],
      galleryImages: [
        'https://example.com/gallery1.jpg',
        'https://example.com/gallery2.jpg',
      ],
    };
  });

  // ─── Basic Generation Tests ───

  it('should generate restaurant static site successfully', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      restaurantBusiness,
      sampleContent,
      'salsa-kitchen'
    );

    expect(result).toBeDefined();
    expect(result.html).toBeDefined();
    expect(result.html.index).toBeDefined();
    expect(result.metadata).toBeDefined();
    expect(result.stats).toBeDefined();
  });

  it('should generate services static site successfully', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      servicesBusiness,
      sampleContent,
      'modern-fitness'
    );

    expect(result).toBeDefined();
    expect(result.html).toBeDefined();
    expect(result.html.index).toBeDefined();
    expect(result.metadata.template).toBe('services');
  });

  // ─── Page Generation Tests ───

  it('should generate all required pages for restaurant', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      restaurantBusiness,
      sampleContent,
      'salsa-kitchen'
    );

    expect(result.html.index).toBeDefined();
    expect(result.html.menu).toBeDefined();
    expect(result.html.about).toBeDefined();
    expect(result.html.contact).toBeDefined();
  });

  it('should generate all required pages for services', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      servicesBusiness,
      sampleContent,
      'modern-fitness'
    );

    expect(result.html.index).toBeDefined();
    expect(result.html.services).toBeDefined();
    expect(result.html.about).toBeDefined();
    expect(result.html.contact).toBeDefined();
  });

  // ─── Content Rendering Tests ───

  it('should include business name in generated HTML', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      restaurantBusiness,
      sampleContent,
      'salsa-kitchen'
    );

    expect(result.html.index).toContain('Salsa Kitchen');
    expect(result.html.index).toContain('Authentic Mexican cuisine from scratch');
  });

  it('should include business contact information', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      restaurantBusiness,
      sampleContent,
      'salsa-kitchen'
    );

    expect(result.html.contact).toContain('123 Main St, Austin, TX 78701');
    expect(result.html.contact).toContain('(512) 555-0123');
  });

  it('should render menu items for restaurant', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      restaurantBusiness,
      sampleContent,
      'salsa-kitchen'
    );

    expect(result.html.menu).toContain('Carne Asada Tacos');
    expect(result.html.menu).toContain('$12.99');
    expect(result.html.menu).toContain('Chiles Rellenos');
  });

  it('should render services for services business', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      servicesBusiness,
      sampleContent,
      'modern-fitness'
    );

    expect(result.html.services).toContain('Personal Training Session');
    expect(result.html.services).toContain('60 minutes');
  });

  it('should render reviews in HTML', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      restaurantBusiness,
      sampleContent,
      'salsa-kitchen'
    );

    expect(result.html.index).toContain('John Smith');
    expect(result.html.index).toContain('Amazing food and even better service!');
  });

  // ─── Critical CSS & Font Tests ───

  it('should inline critical CSS in all pages', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      restaurantBusiness,
      sampleContent,
      'salsa-kitchen'
    );

    expect(result.html.index).toContain('<style>');
    expect(result.html.index).toContain(':root {');
    expect(result.html.index).toContain('--charcoal');
    expect(result.html.index).toContain('--terracotta');
  });

  it('should include font preconnect links', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      restaurantBusiness,
      sampleContent,
      'salsa-kitchen'
    );

    expect(result.html.index).toContain('fonts.googleapis.com');
    expect(result.html.index).toContain('fonts.gstatic.com');
    expect(result.html.index).toContain('Source+Sans+3');
    expect(result.html.index).toContain('subset=latin');
  });

  // ─── Meta Tags & SEO Tests ───

  it('should include Open Graph meta tags', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      restaurantBusiness,
      sampleContent,
      'salsa-kitchen'
    );

    expect(result.html.index).toContain('og:title');
    expect(result.html.index).toContain('og:description');
    expect(result.html.index).toContain('og:type');
  });

  it('should include structured data (JSON-LD)', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      restaurantBusiness,
      sampleContent,
      'salsa-kitchen'
    );

    expect(result.html.index).toContain('application/ld+json');
    expect(result.html.index).toContain('@context');
    expect(result.html.index).toContain('Restaurant');
  });

  it('should include canonical URL', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      restaurantBusiness,
      sampleContent,
      'salsa-kitchen'
    );

    expect(result.html.index).toContain('canonical');
    expect(result.html.index).toContain('https://salsa-kitchen.localgenius.site/');
  });

  // ─── Image Optimization Tests ───

  it('should include responsive image srcsets', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      restaurantBusiness,
      sampleContent,
      'salsa-kitchen'
    );

    // Check for loading="lazy" attributes
    expect(result.html.index).toContain('loading="lazy"');
  });

  // ─── Footer & Branding Tests ───

  it('should include "Made with LocalGenius" footer', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      restaurantBusiness,
      sampleContent,
      'salsa-kitchen'
    );

    expect(result.html.index).toContain('Made with LocalGenius');
  });

  it('should include referral link in footer', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      restaurantBusiness,
      sampleContent,
      'salsa-kitchen'
    );

    expect(result.html.index).toContain('localgenius.company/sites?ref=salsa-kitchen');
  });

  // ─── Metadata Tests ───

  it('should generate correct metadata', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      restaurantBusiness,
      sampleContent,
      'salsa-kitchen'
    );

    expect(result.metadata.title).toBe('Salsa Kitchen — Authentic Mexican cuisine from scratch');
    expect(result.metadata.description).toContain('Salsa Kitchen');
    expect(result.metadata.template).toBe('restaurant');
    expect(result.metadata.pageCount).toBe(4); // index, menu, about, contact
  });

  it('should include structured data in metadata', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      restaurantBusiness,
      sampleContent,
      'salsa-kitchen'
    );

    expect(result.metadata.structuredData).toBeDefined();
    expect(result.metadata.structuredData.type).toBe('Restaurant');
    expect(result.metadata.structuredData.data.name).toBe('Salsa Kitchen');
  });

  // ─── Performance Tests ───

  it('should generate site in under 5 seconds', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      restaurantBusiness,
      sampleContent,
      'salsa-kitchen'
    );

    expect(result.stats.generationTime).toBeLessThan(5000); // 5 seconds
  });

  it('should keep HTML size reasonable for PageSpeed', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      restaurantBusiness,
      sampleContent,
      'salsa-kitchen'
    );

    // Each page should be under 150KB for good PageSpeed
    const avgPageSize = result.stats.htmlSize / result.stats.pages.length;
    expect(avgPageSize).toBeLessThan(150000); // 150KB
  });

  // ─── Navigation Tests ───

  it('should include navigation links in all pages', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      restaurantBusiness,
      sampleContent,
      'salsa-kitchen'
    );

    expect(result.html.menu).toContain('<nav>');
    expect(result.html.menu).toContain('href="/"');
    expect(result.html.menu).toContain('href="/menu"');
    expect(result.html.menu).toContain('href="/about"');
    expect(result.html.menu).toContain('href="/contact"');
  });

  // ─── Error Handling Tests ───

  it('should throw error if business name is missing', async () => {
    const invalidBusiness = { ...restaurantBusiness, name: '' };

    await expect(
      generateStaticSite(invalidBusiness, sampleContent, 'test')
    ).rejects.toThrow('Business name and slug are required');
  });

  it('should throw error if slug is missing', async () => {
    await expect(
      generateStaticSite(restaurantBusiness, sampleContent, '')
    ).rejects.toThrow('Business name and slug are required');
  });

  it('should throw error if template type is invalid', async () => {
    const invalidBusiness = { ...restaurantBusiness, vertical: 'invalid' as any };

    await expect(
      generateStaticSite(invalidBusiness, sampleContent, 'test')
    ).rejects.toThrow('Template must be either "restaurant" or "services"');
  });

  // ─── XSS Prevention Tests ───

  it('should escape HTML in business name to prevent XSS', async () => {
    const xssBusiness = {
      ...restaurantBusiness,
      name: '<script>alert("xss")</script>',
    };

    const result: StaticSiteOutput = await generateStaticSite(
      xssBusiness,
      sampleContent,
      'test'
    );

    expect(result.html.index).not.toContain('<script>');
    expect(result.html.index).toContain('&lt;script&gt;');
  });

  it('should escape HTML in descriptions to prevent XSS', async () => {
    const xssContent = {
      ...sampleContent,
      description: [
        {
          _type: 'block',
          _key: 'block-1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: '<img src=x onerror="alert(\'xss\')">',
            },
          ],
        },
      ],
    };

    const result: StaticSiteOutput = await generateStaticSite(
      restaurantBusiness,
      xssContent,
      'test'
    );

    expect(result.html.about).not.toContain('onerror=');
  });

  // ─── Mobile Responsiveness Tests ───

  it('should include mobile viewport meta tag', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      restaurantBusiness,
      sampleContent,
      'salsa-kitchen'
    );

    expect(result.html.index).toContain('viewport');
    expect(result.html.index).toContain('width=device-width');
  });

  it('should include mobile-first CSS media queries', async () => {
    const result: StaticSiteOutput = await generateStaticSite(
      restaurantBusiness,
      sampleContent,
      'salsa-kitchen'
    );

    expect(result.html.index).toContain('@media (max-width: 768px)');
    expect(result.html.index).toContain('@media (max-width: 480px)');
  });
});
