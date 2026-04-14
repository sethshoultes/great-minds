# LocalGenius Sites — DNS & SSL/TLS Configuration

**Last Updated**: 2026-04-14
**Status**: Production Ready
**Owner**: Engineering

---

## Overview

This document covers DNS and SSL/TLS setup for the LocalGenius Sites subdomain infrastructure. All sites are hosted at `{slug}.localgenius.site`, with automatic wildcard DNS and edge certificate provisioning.

**Key Points:**
- Primary domain: `localgenius.site` (registered, DNS at Cloudflare)
- Wildcard CNAME: `*.localgenius.site` → `localgenius.site`
- SSL/TLS: Cloudflare automatic edge certificates (Universal SSL)
- No per-site DNS records needed (wildcard handles all)
- Provisioning is instant; no DNS propagation delays

---

## Part 1: Wildcard DNS Setup

### Architecture

```
User visits: https://acme-pizza-sf.localgenius.site
                     ↓
Cloudflare DNS: *.localgenius.site CNAME → localgenius.site
                     ↓
Cloudflare Worker or Pages: Routes to site content
                     ↓
Site rendered from D1 + R2 (static HTML or dynamic SSR)
```

### Initial Setup (One-Time)

This setup is performed once during infrastructure initialization. It is **not** repeated for each site.

#### 1. Register Domain

- Domain: `localgenius.site`
- Registrar: Your choice (Namecheap, Google Domains, etc.)
- DNS: Delegate to Cloudflare nameservers

#### 2. Point Registrar to Cloudflare

At your domain registrar, update nameservers to:

```
Nameserver 1: nina.ns.cloudflare.com
Nameserver 2: tom.ns.cloudflare.com
```

(These are examples; use the actual nameservers from your Cloudflare dashboard.)

Propagation typically takes 1-24 hours. Verify with:

```bash
nslookup ns localgenius.site
# Should return Cloudflare nameservers
```

#### 3. Create Wildcard CNAME in Cloudflare

In Cloudflare Dashboard → DNS → Records:

| Type | Name | Content | TTL | Proxied |
|------|------|---------|-----|---------|
| CNAME | `*` | `localgenius.site` | 3600 | Yes (orange cloud) |

**Why Proxied?**
- Enables Cloudflare edge features (caching, WAF, analytics)
- Automatic SSL certificate provisioning
- Single point of control for all subdomains

**Verification:**

```bash
dig *.localgenius.site
# Should show CNAME → localgenius.site
```

#### 4. Create Apex (Root) Record

Also create a record for the root domain (without `*`):

| Type | Name | Content | TTL | Proxied |
|------|------|---------|-----|---------|
| CNAME | `localgenius.site` | `localgenius.company` | 3600 | Yes |

This allows:
- Marketing site at `localgenius.site` (redirects to `localgenius.company`)
- API at `api.localgenius.site` (if needed)
- All subdomains at `{slug}.localgenius.site` (via wildcard)

---

## Part 2: SSL/TLS Configuration

### Automatic Certificate Provisioning

Cloudflare automatically provisions SSL certificates for:
- `localgenius.site` (root domain)
- `*.localgenius.site` (all subdomains)

**No manual certificate management needed.** Cloudflare handles certificate renewal automatically.

### Certificate Type

- **Universal SSL**: Included with all Cloudflare accounts
- **Coverage**: `*.localgenius.site` (wildcard)
- **Validation**: Automatic (Cloudflare controls DNS)
- **Renewal**: Automatic, 30 days before expiry

### TLS Minimum Version

Set in Cloudflare Dashboard → SSL/TLS → Edge Certificates:

**Recommended Setting**: TLS 1.3 minimum

```
Minimum TLS Version: 1.3
```

**Rationale:**
- TLS 1.2 is legacy (2008)
- TLS 1.3 is modern, faster, more secure
- All modern browsers support TLS 1.3

### Cipher Suite Configuration

Cloudflare automatically selects optimal ciphers. Recommended order:

1. ECDHE-RSA-AES128-GCM-SHA256 (high performance)
2. ECDHE-RSA-AES256-GCM-SHA384 (stronger)
3. ECDHE-RSA-CHACHA20-POLY1305 (mobile optimized)
4. AES128-GCM-SHA256 (fallback)
5. AES256-GCM-SHA384 (fallback)

Cloudflare → SSL/TLS → Origin Server:

```
Minimum TLS Version: 1.3
Cipher Order: Cloudflare's default (automatic)
```

### Always Use HTTPS

Enable "Always Use HTTPS" in Cloudflare Dashboard → SSL/TLS → Edge Certificates:

```
Always Use HTTPS: ON
```

This redirects all HTTP traffic to HTTPS, ensuring all sites are served securely.

---

## Part 3: Per-Site Subdomain Setup

When a new site is provisioned, DNS setup is automated via the `createSubdomainRecord()` function.

### Automated Flow

```typescript
// 1. User completes onboarding
const businessName = "Maria's Kitchen";
const city = "Austin";

// 2. Generate slug
const slug = generateSlug(businessName, city);
// → "marias-kitchen-austin"

// 3. Create DNS record (automated)
await createSubdomainRecord(slug, zoneId);

// 4. Verify subdomain is live
const isLive = await verifySubdomain(slug, zoneId);

// 5. Get public URL
const url = getSubdomainUrl(slug);
// → "https://marias-kitchen-austin.localgenius.site"
```

### DNS Record Details

Each site gets a CNAME record:

| Type | Name | Content | TTL | Proxied |
|------|------|---------|-----|---------|
| CNAME | `{slug}` | `localgenius.site` | 3600 | Yes |

**Example:**

| Type | Name | Content | TTL | Proxied |
|------|------|---------|-----|---------|
| CNAME | `acme-pizza-sf` | `localgenius.site` | 3600 | Yes |

### Certificate Provisioning

Once the subdomain CNAME is created, Cloudflare automatically:

1. Validates the domain ownership (via DNS)
2. Provisions an SSL certificate for `acme-pizza-sf.localgenius.site`
3. Deploys the certificate to Cloudflare edge (takes 5-15 minutes)

The site is live over HTTPS immediately, but certificate edge deployment may take a few minutes.

### Propagation & Timing

- **DNS Propagation**: Usually <1 second (Cloudflare is authoritative)
- **Certificate Provisioning**: 5-15 minutes for edge deployment
- **Page Load**: Instant after DNS propagation
- **HTTPS Ready**: After certificate provisioning

---

## Part 4: Worker/Pages Configuration

### Cloudflare Pages (Static Sites)

If serving static HTML via Pages:

```toml
# wrangler.toml
name = "localgenius-sites"
type = "javascript"
account_id = "your-account-id"
workers_dev = true

[env.production]
routes = [
  { pattern = "*.localgenius.site", zone_name = "localgenius.site" }
]

[build]
command = "npm run build"
output_dir = "dist"
```

### Cloudflare Worker (Dynamic Routing)

If using a Worker for subdomain routing:

```typescript
// worker/index.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const subdomain = url.hostname.split('.')[0]; // Extract slug

    if (subdomain === 'localgenius') {
      // Root domain → marketing site
      return await handleRootDomain(request, env);
    } else {
      // {slug}.localgenius.site → fetch from D1 + render
      return await handleSiteRequest(subdomain, request, env);
    }
  }
};
```

---

## Part 5: Monitoring & Troubleshooting

### Health Checks

**DNS Propagation:**

```bash
# Check DNS resolves
dig acme-pizza-sf.localgenius.site

# Should output:
# acme-pizza-sf.localgenius.site. 3600 IN CNAME localgenius.site.
# localgenius.site. 300 IN A 104.16.x.x (Cloudflare IP)
```

**Certificate Status:**

```bash
# Check SSL certificate
openssl s_client -connect acme-pizza-sf.localgenius.site:443 -servername acme-pizza-sf.localgenius.site

# Should show:
# subject=CN = *.localgenius.site
# issuer=C=US, O=Cloudflare, Inc., CN=Cloudflare Inc ECC CA-3
```

**Page Load:**

```bash
# Check page loads
curl -I https://acme-pizza-sf.localgenius.site

# Should show:
# HTTP/2 200
# cf-cache-status: HIT or MISS
# content-type: text/html; charset=utf-8
```

### Common Issues

#### Issue: DNS Not Resolving

**Symptom**: `nslookup` shows "server failed" or no records

**Solution**:
1. Verify nameservers at registrar point to Cloudflare
2. Wait 24 hours for propagation
3. Check Cloudflare Dashboard → DNS → Records (wildcard CNAME exists)
4. Clear local DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (macOS)

#### Issue: Certificate Not Trusted

**Symptom**: Browser shows "Your connection is not private"

**Solution**:
1. Wait 5-15 minutes for certificate edge deployment
2. Clear browser cache and cookies
3. Check Cloudflare Dashboard → SSL/TLS → Edge Certificates
4. Verify CNAME record is created and proxied (orange cloud)

#### Issue: Mixed Content Warnings

**Symptom**: Browser console shows "Mixed Content" warnings

**Solution**:
1. Enable "Always Use HTTPS" in Cloudflare (see Part 2)
2. Update all internal links to use HTTPS
3. Ensure Worker/Pages serve over HTTPS only

#### Issue: High Latency to Edge

**Symptom**: Slow page loads, high Time to First Byte (TTFB)

**Solution**:
1. Check Worker performance via Cloudflare Analytics
2. Verify D1 database queries are optimized (add indexes)
3. Check R2 image CDN caching headers
4. Enable Cloudflare caching rules for static assets

---

## Part 6: Deployment Checklist

### Pre-Production

- [ ] Domain `localgenius.site` registered
- [ ] Nameservers updated at registrar to point to Cloudflare
- [ ] Wildcard CNAME (`*.localgenius.site` → `localgenius.site`) created and proxied
- [ ] Apex record (`localgenius.site` → marketing domain) created
- [ ] SSL certificate provisioned (check Cloudflare Dashboard)
- [ ] "Always Use HTTPS" enabled
- [ ] Worker or Pages configured to handle `*.localgenius.site`

### Production

- [ ] Load test with 100+ concurrent requests
- [ ] Verify certificate valid for all subdomains
- [ ] Test site provisioning flow (DNS + certificate)
- [ ] Verify edge cache headers (Cache-Control, CDN-Cache-Control)
- [ ] Monitor error rates and latency (Cloudflare Analytics)
- [ ] Set up alerts for DNS/certificate failures

---

## Part 7: Billing & Costs

### Cloudflare Costs

| Component | Plan | Cost |
|-----------|------|------|
| **Domain Registration** | External registrar | ~$12/year |
| **Cloudflare DNS** | Free plan or Pro | Free or $20/month |
| **Universal SSL** | Free (included) | Included |
| **Cloudflare Pages** | Free tier (100 GB/month) | Free → $20/month |
| **Cloudflare Workers** | Free tier (100K requests/day) | Free → $0.15/CPU-ms |
| **D1 Database** | Billed separately | $0.75/month + usage |
| **R2 Bucket** | $0.015/GB storage + $0.20/GB egress | Usage-based |

**Typical Monthly Cost (at 1K sites, 5GB stored):**
- Domain: $1
- Cloudflare: $5 (Pro plan)
- Pages/Workers: $20 (billed usage)
- D1: $20 (provisioned capacity)
- R2: $5 (storage)
- **Total: ~$50/month**

---

## Part 8: Future Enhancements

### Phase 2: Custom Domains (Pro Tier)

Users can point custom domains (e.g., `restaurant.com`) to their LocalGenius site.

**Setup:**
1. User enters custom domain
2. We provide CNAME target: `cname.localgenius.company` (or use Cloudflare for SaaS)
3. User adds CNAME at their registrar
4. We provision SSL certificate for custom domain
5. Site accessible at both `{slug}.localgenius.site` and `restaurant.com`

**Tool:** Cloudflare for SaaS (handles custom domain certificates automatically)

### Phase 2: Geo-Routing

Route traffic to nearest Cloudflare edge for faster responses.

**Setup:**
- Cloudflare automatically does this
- No additional configuration needed
- Add latency monitoring per region

### Phase 3: DDoS Protection

Enable Cloudflare DDoS protection on Pages/Workers.

**Setup:**
1. Enable Cloudflare DDoS Protection (Pro or Business plan)
2. Configure rate limiting rules
3. Monitor attack logs in Cloudflare Dashboard

---

## Appendix: DNS Records Reference

### Complete DNS Record Set

```
localgenius.site
├── @ (root)
│   ├── CNAME → localgenius.company (marketing site)
│   └── MX, SPF, DKIM (email)
│
├── * (wildcard)
│   └── CNAME → localgenius.site (all subdomains)
│
├── api (optional)
│   └── A → Cloudflare IP (for API endpoints)
│
├── static (optional)
│   └── CNAME → r2.cloudflarestorage.com (R2 bucket)
│
└── {slug} (per-site, auto-generated)
    └── CNAME → localgenius.site
```

### DNS Validation via CLI

```bash
# Check all DNS records
dig localgenius.site

# Check wildcard
dig *.test.localgenius.site

# Check DNSSEC
dig +dnssec localgenius.site

# Check propagation at multiple nameservers
dig +trace localgenius.site
```

---

## Appendix: SSL Certificate Details

### Certificate Information

**Issuer**: Cloudflare Inc ECC CA-3
**Key Algorithm**: ECDSA (Elliptic Curve)
**Validity**: 1 year (renewed automatically 30 days before expiry)
**Coverage**: `*.localgenius.site` (wildcard)

### Certificate Chain

```
leaf: *.localgenius.site (your domain)
  ↓
intermediate: Cloudflare Inc ECC CA-3
  ↓
root: Cloudflare Global ECC Certificate Authority
  ↓
Trust Store: macOS, Windows, Linux, mobile OSes
```

All modern browsers and systems trust Cloudflare's root certificate.

---

## Summary

1. **One-time setup**: Register domain, point to Cloudflare, create wildcard CNAME
2. **Per-site setup**: Automated DNS record creation via `createSubdomainRecord()`
3. **SSL/TLS**: Automatic provisioning, no manual management
4. **Monitoring**: Use Cloudflare Analytics and CLI tools
5. **Scaling**: Wildcard DNS means unlimited subdomains with zero additional setup

All sites are secure (HTTPS), fast (Cloudflare edge), and automatically managed.

---

**Questions?** Contact the Engineering team or refer to the Cloudflare documentation:
- https://developers.cloudflare.com/dns/
- https://developers.cloudflare.com/ssl-tls/
- https://developers.cloudflare.com/workers/
