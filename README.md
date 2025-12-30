# LinkHub - Amazon Affiliate Link-in-Bio Platform

A complete, production-ready Amazon affiliate link-in-bio platform with password-protected admin panel, Google Analytics integration, individual product pages, social sharing, and comprehensive monetization features.

## ✨ Key Features

### 🔐 Password Protection & Authentication
- **Secure Admin Panel**: Password-protected access with bcrypt hashing
- **Session Management**: 30-minute auto-expiring sessions with extend option
- **Password Change**: Secure password updates from admin panel
- **Session Warnings**: Reminders before session expiration

### 🛍️ Amazon Affiliate Products
- **Product Management**: Full CRUD for Amazon affiliate products
- **ASIN Extraction**: Automatic product data extraction from URLs
- **Category System**: Organize products by category
- **Featured Products**: Highlight special products
- **Click Tracking**: Built-in analytics for product clicks
- **Individual Product Pages**: Dedicated pages for each product with SEO meta tags

### 🔍 Categories & Organization
- **Custom Categories**: Create unlimited categories
- **Color Coding**: Visual organization with custom colors
- **Top Finds**: Highlight your most important links/products
- **Link Management**: Organize links into categories
- **Visibility Controls**: Toggle category/link visibility

### 📊 Analytics & Tracking
- **Google Analytics 4**: Full GA4 integration with custom events
- **Event Tracking**: Product views, link clicks, searches, category filters
- **Local Analytics**: Click counts stored in localStorage
- **Performance Dashboard**: View product and link performance in admin

### 🔗 Social Media Integration
- **Multiple Platforms**: Instagram, Twitter, YouTube, LinkedIn, Facebook
- **Social Links Display**: Branded icons on public page
- **Easy Management**: Add/remove social links from admin panel

### 💰 Monetization
- **Ad Network Support**: Three independent ad unit placements (top/middle/bottom)
- **Google AdSense Ready**: Easy AdSense integration
- **Affiliate Links**: Amazon Associates tracking built-in
- **Flexible Ad Control**: Enable/disable ads per position

### 📱 Shareable Product Pages
- **Dedicated Pages**: `/product/:productId` for each product
- **Social Sharing**: Share buttons for Twitter, Facebook, WhatsApp, Email
- **Copy Link**: One-click link copying to clipboard
- **SEO Optimized**: Open Graph meta tags for social previews

### 🎨 Customization
- **Profile Management**: Name, bio, avatar with Dicebear integration
- **Appearance**: Gradient/solid color/image backgrounds
- **Announcement Bar**: Customizable notification bar
- **Responsive Design**: Optimized for mobile, tablet, and desktop

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Kashif869/LinkHub.git
cd LinkHub

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm run dev
```

### Build for Production

```bash
npm run build
# or
pnpm build
```

### Access the Application

- **Public Page**: `http://localhost:5173/`
- **Admin Panel**: `http://localhost:5173/admin` (requires password setup)

## 📖 Documentation

- **Deployment Guide**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for comprehensive deployment instructions
- **Environment Variables**: Copy `.env.example` to `.env` and configure as needed

## 🌐 Deployment Options

### Recommended Platforms

1. **Vercel** (Recommended)
   - Automatic deployments from GitHub
   - Global CDN
   - Custom domain support
   - Free SSL certificates

2. **Netlify**
   - Continuous deployment
   - Form handling
   - Drag-and-drop deployment
   - DNS management

3. **Self-Hosted**
   - Full control
   - Custom server configuration
   - Nginx/Apache support
   - VPS/Cloud hosting

For detailed instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

## 💰 Monetization Guide

### Amazon Associates

1. Sign up at [Amazon Associates](https://affiliate-program.amazon.com/)
2. Get your tracking ID
3. Add products using Amazon URLs (ASIN auto-extraction)
4. Track earnings in Amazon dashboard

### Google AdSense

1. Apply at [Google AdSense](https://www.google.com/adsense/)
2. Create ad units in AdSense dashboard
3. Copy ad code to admin panel (Ads tab)
4. Enable ad positions as needed

### Google Analytics

1. Create property at [Google Analytics](https://analytics.google.com/)
2. Get your GA4 tracking ID (G-XXXXXXXXXX)
3. Add to admin panel (Analytics tab) or `.env` file
4. View events and performance in GA dashboard

## 🛠️ Technology Stack

- **Frontend**: React 19 with hooks
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Build Tool**: Vite 6
- **Routing**: React Router 7
- **Icons**: Lucide React
- **Security**: bcryptjs for password hashing
- **Analytics**: Google Analytics 4
- **Data Storage**: Browser localStorage (no backend needed)

## 📦 Core Dependencies

- React & React Router
- Radix UI primitives
- Framer Motion (animations)
- Recharts (charts)
- Sonner (toast notifications)
- bcryptjs (password hashing)
- qrcode.react (QR code generation)

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── AdminPanelEnhanced.jsx   # Main admin interface
│   ├── ProductPage.jsx          # Individual product pages
│   ├── SocialLinks.jsx          # Social media links display
│   ├── Avatar.jsx              # Avatar component
│   ├── ProductCard.jsx         # Product card component
│   ├── SearchBar.jsx          # Search & filter
│   └── ...
├── utils/
│   ├── authUtils.js           # Authentication utilities
│   ├── gaUtils.js            # Google Analytics
│   ├── shareUtils.js          # Social sharing
│   ├── metaTags.js           # SEO meta tags
│   └── productFetcher.js      # Amazon product utilities
└── App.jsx                 # Main app component
```

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **Session Tokens**: Time-limited auth tokens
- **Auto Logout**: Automatic session expiration
- **Input Validation**: Form validation for all inputs
- **XSS Prevention**: Proper sanitization of user input

## 📱 Responsive Design

- **Mobile First**: Optimized for 320px - 1440px+ screens
- **Touch Friendly**: 48px+ tap targets
- **Flexible Grids**: Responsive product grids (2-4 columns)
- **Mobile Navigation**: Collapsible admin tabs

## 🎯 Use Cases

Perfect for:
- Amazon affiliate marketers
- Content creators with product recommendations
- Influencers sharing favorite items
- Small businesses with affiliate links
- Anyone wanting a monetizable link-in-bio page

## 🚀 Deployment Checklist

Before deploying, ensure you:

- [ ] Set admin password (first visit to /admin)
- [ ] Add your products/links
- [ ] Configure Google Analytics (optional)
- [ ] Set up AdSense if using ads
- [ ] Customize profile and appearance
- [ ] Test all links work
- [ ] Verify mobile responsiveness

## 📞 Support

For deployment help, see the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

---

**Built with ❤️ using React, Tailwind CSS, and modern web technologies.**

## 📄 License

This project is open source and available for personal and commercial use.
