# LinkHub Deployment Guide

This guide will help you deploy your Amazon Affiliate Link-in-Bio platform to various hosting providers and configure all the necessary services.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Deployment Options](#deployment-options)
  - [Option 1: Vercel (Recommended)](#option-1-vercel-recommended)
  - [Option 2: Netlify](#option-2-netlify)
  - [Option 3: Self-hosted (AWS/DigitalOcean)](#option-3-self-hosted-awsdigitalocean)
- [Custom Domain Setup](#custom-domain-setup)
- [Google Analytics Setup](#google-analytics-setup)
- [Google AdSense Setup](#google-adsense-setup)
- [Amazon Associates Setup](#amazon-associates-setup)
- [Performance Checklist](#performance-checklist)
- [Pre-Launch Checklist](#pre-launch-checklist)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- A GitHub account (for Vercel/Netlify deployment)
- A Google account (for Analytics and AdSense)
- An Amazon Associates account
- A custom domain (optional but recommended)
- Node.js installed locally (for self-hosted deployment)

---

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the easiest deployment experience with automatic builds, SSL certificates, and global CDN.

#### Step 1: Connect Your GitHub Repository

1. Create a new repository on GitHub
2. Push your LinkHub code to the repository
3. Sign up for [Vercel](https://vercel.com/) (free account)
4. Click "Add New" → "Project"

#### Step 2: Import Your Repository

1. Select your LinkHub repository from the list
2. Vercel will automatically detect the framework (Vite)
3. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### Step 3: Add Environment Variables (Optional)

1. Scroll to "Environment Variables"
2. Add your Google Analytics ID:
   - Key: `VITE_GOOGLE_ANALYTICS_ID`
   - Value: `G-XXXXXXXXXX` (your GA tracking ID)
3. Click "Add"
4. Click "Deploy"

#### Step 4: Wait for Deployment

Vercel will:
- Install dependencies
- Build the production bundle
- Deploy to their global CDN
- Provide a `.vercel.app` URL

Your site will be live at: `https://your-project-name.vercel.app`

#### Step 5: Configure Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Enter your custom domain (e.g., `links.yourdomain.com`)
4. Follow the DNS configuration instructions provided by Vercel
5. Vercel will automatically provision SSL certificates

#### Vercel Features

- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments on push
- ✅ Preview URLs for pull requests
- ✅ Custom domain support
- ✅ Edge functions
- ✅ Analytics dashboard

---

### Option 2: Netlify

Netlify is another excellent option with similar features to Vercel.

#### Step 1: Connect Your GitHub Repository

1. Create a new repository on GitHub
2. Push your LinkHub code to the repository
3. Sign up for [Netlify](https://netlify.com/) (free account)
4. Click "Add new site" → "Import an existing project"

#### Step 2: Import Your Repository

1. Select your LinkHub repository
2. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

#### Step 3: Add Environment Variables (Optional)

1. Scroll to "Environment variables"
2. Click "Add variable"
3. Add your Google Analytics ID:
   - Key: `VITE_GOOGLE_ANALYTICS_ID`
   - Value: `G-XXXXXXXXXX`
4. Click "Deploy site"

#### Step 4: Wait for Deployment

Netlify will build and deploy your site. You'll receive a `.netlify.app` URL.

#### Step 5: Configure Custom Domain (Optional)

1. Go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain (e.g., `links.yourdomain.com`)
4. Configure DNS according to Netlify's instructions
5. Netlify will automatically handle SSL certificates

#### Netlify Features

- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Continuous deployment
- ✅ Form handling
- ✅ Functions support
- ✅ Domain management
- ✅ Password protection (optional)

---

### Option 3: Self-hosted (AWS/DigitalOcean)

For more control, you can self-host on your own server.

#### Step 1: Build the Project Locally

```bash
npm install
npm run build
```

This creates a `dist` folder with all your static files.

#### Step 2: Upload to Server

**Using SCP:**
```bash
scp -r dist/* user@your-server:/var/www/linkhub/
```

**Using FTP/SFTP:**
- Use FileZilla or similar tool
- Upload the `dist` folder contents to your web server directory

#### Step 3: Configure Nginx (Example)

Create a new Nginx configuration file:

```nginx
server {
    listen 80;
    server_name links.yourdomain.com;

    root /var/www/linkhub;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/linkhub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Step 4: Set Up SSL with Let's Encrypt

```bash
sudo certbot --nginx -d links.yourdomain.com
```

#### Step 5: Configure Apache (Alternative)

```apache
<VirtualHost *:80>
    ServerName links.yourdomain.com
    DocumentRoot /var/www/linkhub

    <Directory /var/www/linkhub>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

#### Step 6: Set Up Auto-Deployment with Git Hooks

Create a post-receive hook on your server:

```bash
#!/bin/bash
cd /var/www/linkhub
git --work-tree=/var/www/linkhub --git-dir=/var/www/linkhub.git checkout -f
npm install
npm run build
```

---

## Custom Domain Setup

### Purchasing a Domain

Recommended registrars:
- [Namecheap](https://namecheap.com)
- [GoDaddy](https://godaddy.com)
- [Cloudflare](https://cloudflare.com/products/registrar)
- [Route 53](https://aws.amazon.com/route53/) (if using AWS)

### DNS Configuration

#### Option A: Using Your Registrar's Nameservers (Vercel/Netlify)

1. Log in to your domain registrar
2. Find the DNS settings for your domain
3. Add a CNAME record:
   - **Type**: CNAME
   - **Name**: `links` (or whatever subdomain you want)
   - **Value**: `your-project.vercel.app` (or your Netlify URL)

#### Option B: Using Vercel's Nameservers

1. In Vercel, go to domain settings
2. Choose "Use Vercel's Nameservers"
3. Update your domain's nameservers at your registrar:
   - NS1: `cname.vercel-dns.com`
   - NS2: `cname2.vercel-dns.com`

#### DNS Propagation

DNS changes typically take 24-48 hours to propagate worldwide. You can check propagation at:
- [DNS Checker](https://dnschecker.org/)
- [What's My DNS](https://www.whatsmydns.net/)

---

## Google Analytics Setup

### Step 1: Create a Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring"
3. Create an account with your email
4. Accept the terms of service

### Step 2: Set Up a Property (GA4)

1. Click "Create a property"
2. Enter:
   - **Property name**: "LinkHub" (or your brand name)
   - **Reporting time zone**: Your timezone
   - **Currency**: Your currency
3. Click "Next"
4. Select your industry and business size
5. Click "Create"

### Step 3: Get Your Tracking ID

1. Click "Data Streams"
2. Click "Web" → "Add stream"
3. Enter your website URL
4. Enter the stream name
5. Click "Create stream"

Your Measurement ID will be in the format: `G-XXXXXXXXXX`

### Step 4: Add to Your Application

#### Option A: Via Environment Variable (Recommended)

1. In your deployment platform, add environment variable:
   - Key: `VITE_GOOGLE_ANALYTICS_ID`
   - Value: `G-XXXXXXXXXX`

2. Your app will automatically detect and use this ID

#### Option B: Via Admin Panel

1. Log in to your admin panel at `/admin`
2. Go to the "Analytics" tab
3. Enter your Google Analytics ID
4. Toggle "Enable Analytics" to ON
5. Click save

### Step 5: Verify Tracking

1. Open your website
2. Open Google Analytics → Realtime
3. You should see your visit appear
4. Navigate around your site and see events being tracked

### Events Being Tracked

LinkHub automatically tracks:
- `page_view` - Every page visit
- `view_item` - When a product is viewed
- `select_content` - When affiliate links are clicked
- `search` - When search is performed
- `select_content` (category) - When filtering by category
- `view_promotion` - When ads are viewed
- `select_content` (social_link) - When social links are clicked

---

## Google AdSense Setup

### Step 1: Apply for AdSense Account

1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Click "Sign up now"
3. Sign in with your Google account
4. Enter your website URL
5. Fill in your information
6. Submit your application

**Note:** Approval takes 1-2 weeks. Your site needs:
- Original, high-quality content
- Sufficient traffic (50+ visitors/day recommended)
- Compliant with AdSense policies

### Step 2: Create Ad Units

Once approved:

1. Log in to AdSense
2. Click "Ads" → "By ad unit"
3. Click "Create ad unit"
4. Choose ad type:
   - **Display ads** - Best for desktop/tablet
   - **In-article ads** - Best for content sections
   - **Matched content** - Recommended at bottom

5. Configure:
   - **Size**: Responsive or fixed
   - **Style**: Custom colors to match your theme
6. Copy the ad code

### Step 3: Add Ad Code to Your Admin Panel

1. Log in to your LinkHub admin panel (`/admin`)
2. Go to the "Ads" tab
3. For each ad position (Top, Middle, Bottom):
   - Toggle "Enable" to ON
   - Paste your AdSense code in the "Ad Code" textarea
   - Click "Save"

### Step 4: Monitor Performance

1. Go to AdSense dashboard
2. View reports:
   - **Revenue**: Earnings over time
   - **RPM**: Revenue per 1,000 impressions
   - **CTR**: Click-through rate
   - **Page views**: Number of ad impressions

### AdSense Best Practices

- Place ads above the fold for better visibility
- Don't overload with too many ads
- Test different ad positions
- Ensure ads don't block important content
- Monitor your CTR and adjust placement accordingly

---

## Amazon Associates Setup

### Step 1: Sign Up for Amazon Associates

1. Go to [Amazon Associates](https://affiliate-program.amazon.com/)
2. Click "Join Now for Free"
3. Sign in with your Amazon account
4. Enter your website information
5. Select your preferred payment method
6. Read and agree to the Operating Agreement
7. Submit your application

**Note:** You'll need to generate at least 3 qualified sales within 180 days to stay in the program.

### Step 2: Get Your Associate ID

1. After approval, log in to your Associates Central
2. Your Associate ID will be displayed in the top right corner
3. Format: `yourname-20`

### Step 3: Generate Affiliate Links

#### Method A: Product Page Links

1. Find a product on Amazon you want to promote
2. Look for the "Amazon Associates Site Stripe" at the top
3. Click "Text"
4. Copy the affiliate link
5. Paste it into your LinkHub admin panel

#### Method B: Product Search Tool

1. In your LinkHub admin panel, go to "Products" tab
2. Paste any Amazon product URL
3. Click "Fetch" - it will automatically extract the ASIN
4. Add your Associate ID if needed (often auto-detected)

### Step 4: Add Products to LinkHub

1. Log in to your admin panel
2. Go to "Products" tab
3. Either:
   - Paste an Amazon URL and click "Fetch"
   - Or manually enter product details
4. Fill in:
   - Title
   - Description
   - Image URL
   - Price
   - Category
   - Featured status
5. Click "Add Product"

### Step 5: Track Your Earnings

1. Go to Amazon Associates Central
2. View "Earnings" report
3. See:
   - Orders
   - Items shipped
   - Earnings
   - Conversion rate

### Affiliate Link Best Practices

- Use product images for better conversion
- Write compelling descriptions
- Feature your best products
- Group related products by category
- Test different placements
- Disclose affiliate links (required by FTC)

---

## Performance Checklist

Use this checklist to ensure your site is optimized for performance.

### Build Optimization

- [ ] Run `npm run build` - Build size should be < 1MB
- [ ] Check for unused dependencies
- [ ] Enable gzip compression on your server
- [ ] Use production build only

### Images

- [ ] All product images are optimized (WebP format preferred)
- [ ] Images have `loading="lazy"` attribute
- [ ] Responsive images with `srcset`
- [ ] Alt text for all images

### Code Splitting

- [ ] Vendor chunks are separate
- [ ] Route-based code splitting
- [ ] Dynamic imports for heavy components

### Caching

- [ ] Static assets have long cache headers (1 year)
- [ ] HTML has no-cache or short cache
- [ ] Service worker for offline support (optional)

### Core Web Vitals

- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1

### Test Your Performance

Run these tools and aim for scores > 90:

- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [GTmetrix](https://gtmetrix.com/)
- Lighthouse in Chrome DevTools

---

## Pre-Launch Checklist

Complete these tasks before launching your site.

### Content & Configuration

- [ ] Admin password is set and secure
- [ ] Sample/test products are removed or hidden
- [ ] Profile information is complete (name, bio, avatar)
- [ ] Categories are set up and organized
- [ ] All links are working
- [ ] Product descriptions are engaging
- [ ] Product images are high quality
- [ ] Announcement bar is configured (or disabled)
- [ ] Featured products are selected
- [ ] Top Finds section is populated

### Analytics & Tracking

- [ ] Google Analytics ID is configured
- [ ] GA tracking is verified (check Realtime report)
- [ ] AdSense account is approved (if using ads)
- [ ] Ad units are configured and tested
- [ ] Amazon Associates ID is set
- [ ] Affiliate links are tested
- [ ] Click tracking is working

### Domain & Hosting

- [ ] Domain is purchased
- [ ] DNS records are configured
- [ ] DNS has propagated (check with dnschecker.org)
- [ ] SSL certificate is active
- [ ] Custom domain is connected to host
- [ ] Both www and non-www work (or redirect properly)

### SEO & Meta Tags

- [ ] Page title is set
- [ ] Meta description is set
- [ ] OG tags are configured
- [ ] Product pages have proper meta tags
- [ ] Robots.txt is configured
- [ ] Sitemap.xml is created (optional for SPA)

### Mobile & Accessibility

- [ ] Tested on mobile (320px, 375px, 768px)
- [ ] Touch targets are at least 48px
- [ ] Text is readable on mobile
- [ ] Forms work on mobile
- [ ] Keyboard navigation works
- [ ] ARIA labels are present
- [ ] Color contrast is sufficient

### Testing

- [ ] All product links open Amazon
- [ ] Affiliate tracking works
- [ ] Social links work
- [ ] Search functionality works
- [ ] Category filters work
- [ ] Ad units display correctly
- [ ] No console errors
- [ ] No broken images
- [ ] Analytics events fire correctly

### Legal & Compliance

- [ ] Privacy policy page (required for GDPR/CCPA)
- [ ] Terms of service (recommended)
- [ ] Affiliate disclosure on site (FTC requirement)
- [ ] Cookie consent banner (if using cookies)
- [ ] Contact information is accessible

---

## Troubleshooting

### Build Errors

**Error: `Module not found`**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for missing dependencies in package.json

**Error: Port already in use**
- Kill the process: `lsof -ti:5173 | xargs kill -9`
- Or use a different port: `npm run dev -- --port 3000`

### Deployment Issues

**Site not loading after deployment**
- Check build logs for errors
- Verify build settings (output directory should be `dist`)
- Ensure index.html exists in dist folder

**404 errors on routes**
- This is expected with client-side routing
- Configure your server to fallback to index.html

**Environment variables not working**
- Restart the build after adding variables
- Variables must start with `VITE_` for Vite
- Check the exact variable name (case-sensitive)

### Analytics Issues

**No data in Google Analytics**
- Verify the tracking ID is correct (starts with `G-`)
- Check if Realtime report shows visits
- Ensure `enabled` is toggled ON in admin panel
- Clear browser cache and test again

**Events not tracking**
- Open browser DevTools → Console
- Check for `gtag is not defined` errors
- Verify GA is initialized before tracking events

### AdSense Issues

**Ads not displaying**
- AdSense account might not be approved yet
- Check if ad code is properly pasted
- Verify ad units are enabled in admin panel
- Ad blockers might be blocking ads

**Low earnings**
- Takes time to build traffic
- Test different ad placements
- Optimize content for better CTR
- Increase site traffic

### Amazon Associates Issues

**Links not tracking**
- Verify your Associate ID is correct
- Check if affiliate links have proper format
- Test links in incognito mode (logged-in Amazon purchases don't count)

**Application rejected**
- Ensure your site has quality content
- Add original content, not just product listings
- Wait and reapply after improving your site
- Build up traffic before reapplying

### Performance Issues

**Site loading slowly**
- Optimize images (use WebP, compress)
- Enable gzip compression
- Use CDN for static assets
- Check bundle size and code split

**Lighthouse score low**
- Remove unused dependencies
- Implement lazy loading
- Optimize critical rendering path
- Minimize JavaScript

### Browser Compatibility Issues

**Site broken in old browsers**
- Check polyfills (should work with modern browsers)
- Test in Chrome, Firefox, Safari, Edge
- Consider adding older browser support if needed

---

## Support & Resources

### Official Documentation
- [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)
- [Google Analytics](https://support.google.com/analytics/)
- [Amazon Associates](https://affiliate-program.amazon.com/help/)
- [Google AdSense](https://support.google.com/adsense/)

### Helpful Tools
- [PageSpeed Insights](https://pagespeed.web.dev/) - Performance testing
- [DNS Checker](https://dnschecker.org/) - DNS propagation check
- [SSL Labs](https://www.ssllabs.com/) - SSL certificate test
- [Can I Use](https://caniuse.com/) - Browser compatibility

### Community
- [GitHub Issues](https://github.com/) - Report bugs
- [Stack Overflow](https://stackoverflow.com/) - Get help
- [Reddit r/webdev](https://reddit.com/r/webdev) - Web development community

---

Congratulations on deploying your Amazon Affiliate Link-in-Bio platform! 🎉

If you encounter any issues not covered in this guide, please refer to the official documentation or community forums.
