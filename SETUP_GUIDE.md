# SmartResumeTool - Setup & Deployment Guide

## 📦 Complete Installation Guide

### Prerequisites Checklist
- [ ] Node.js 18 or higher installed
- [ ] npm or yarn package manager
- [ ] Git installed
- [ ] Anthropic API account created
- [ ] API key obtained from https://console.anthropic.com/

### Step-by-Step Setup

#### 1. Environment Setup

**Get Your Anthropic API Key:**
1. Visit https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (it starts with `sk-ant-`)

**Configure Environment:**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your API key
# Use any text editor (nano, vim, VS Code, etc.)
nano .env

# Add this line with your actual key:
VITE_CLAUDE_API_KEY=sk-ant-your-actual-key-here
```

#### 2. Install Dependencies

```bash
# Install all required packages
npm install

# If you encounter any issues, try:
npm install --legacy-peer-deps

# Or clear cache first:
npm cache clean --force
npm install
```

#### 3. Development Server

```bash
# Start the development server
npm run dev

# The app will open at http://localhost:3000
# Changes will hot-reload automatically
```

#### 4. Verify Setup

**Checklist:**
- [ ] Dev server starts without errors
- [ ] Application loads in browser
- [ ] Can upload a test resume file
- [ ] Can enter job description
- [ ] Analysis button appears enabled
- [ ] No console errors

## 🚀 Production Build

### Build Process

```bash
# Create optimized production build
npm run build

# The output will be in the 'dist/' directory
# You can preview the production build:
npm run preview
```

### Build Optimization

The build process automatically:
- Minifies JavaScript and CSS
- Optimizes images
- Code splits for faster loading
- Generates source maps for debugging
- Tree-shakes unused code

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel:**
- Zero configuration needed
- Automatic HTTPS
- Global CDN
- Preview deployments
- Environment variable management

**Steps:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

**Set Environment Variables in Vercel:**
1. Go to your project dashboard
2. Settings → Environment Variables
3. Add `VITE_CLAUDE_API_KEY` with your API key
4. Redeploy to apply changes

### Option 2: Netlify

**Steps:**
1. Build the project: `npm run build`
2. Create account at netlify.com
3. Drag and drop the `dist/` folder
4. Or use Netlify CLI:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

**Set Environment Variables:**
1. Site settings → Build & deploy → Environment
2. Add `VITE_CLAUDE_API_KEY`

### Option 3: GitHub Pages

**Steps:**
1. Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
});
```

2. Build and deploy:
```bash
npm run build
npm run deploy  # Add this script to package.json
```

3. Add to `package.json`:
```json
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

### Option 4: Self-Hosted (VPS/Server)

**Requirements:**
- Server with Node.js installed
- Nginx or Apache for reverse proxy
- SSL certificate (Let's Encrypt recommended)

**Basic Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    root /var/www/smart-resume-tool/dist;
    index index.html;
    
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

## 🔐 Security Best Practices

### Environment Variables
- **NEVER** commit `.env` file to Git
- Use different API keys for dev/prod
- Rotate API keys periodically
- Set appropriate rate limits

### API Key Protection
```javascript
// ✅ Good - API key in environment
const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;

// ❌ Bad - API key in code
const apiKey = "sk-ant-hardcoded-key";
```

### Content Security Policy
Add to your hosting platform:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com;
```

## 📊 Monitoring & Analytics

### Add Google Analytics (Optional)

1. Get tracking ID from Google Analytics
2. Add to `.env`:
```env
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

3. Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Error Tracking with Sentry

```bash
npm install @sentry/react
```

```javascript
// src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE,
});
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Issue: "Module not found" errors
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Issue: API key not working
```bash
# Solution: Verify environment variable
echo $VITE_CLAUDE_API_KEY  # Should show your key
# If empty, check .env file location and format
```

#### Issue: Build fails on Vercel/Netlify
- Check Node.js version matches local (18+)
- Verify all dependencies are in `package.json`
- Check build logs for specific errors
- Ensure environment variables are set

#### Issue: File upload not working
- Check file size limits (default 5MB)
- Verify supported formats (.pdf, .docx, .doc, .txt)
- Check console for specific parsing errors

#### Issue: Slow AI analysis
- This is normal (Claude API takes 5-15 seconds)
- Traditional analysis is instant fallback
- Consider adding timeout warning UI

## 📈 Performance Optimization

### Lighthouse Score Goals
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

### Optimization Checklist
- [ ] Enable Gzip/Brotli compression
- [ ] Set up CDN for static assets
- [ ] Optimize images (use WebP)
- [ ] Enable browser caching
- [ ] Lazy load non-critical components
- [ ] Code split large dependencies

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx vite-bundle-visualizer
```

## 🔄 Updates and Maintenance

### Keeping Dependencies Updated
```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm install package-name@latest
```

### Version Control Best Practices
```bash
# Create feature branch
git checkout -b feature/improvement-name

# Commit changes
git add .
git commit -m "feat: descriptive message"

# Push to remote
git push origin feature/improvement-name
```

## 📞 Support and Resources

### Getting Help
- GitHub Issues: Report bugs and request features
- Email: davidmadison95@yahoo.com
- LinkedIn: linkedin.com/in/davidmadison95

### Useful Links
- React Documentation: https://react.dev/
- Vite Documentation: https://vitejs.dev/
- Anthropic API Docs: https://docs.anthropic.com/
- Tailwind CSS Docs: https://tailwindcss.com/

### Community Resources
- Stack Overflow: Tag questions with `react`, `vite`, `claude-ai`
- Reddit: r/reactjs, r/webdev
- Discord: React and Vite communities

## 📝 Changelog

### Tracking Changes
Keep a CHANGELOG.md file:
```markdown
# Changelog

## [2.0.0] - 2024-01-XX
### Added
- Real Claude AI integration
- Modular component architecture
- Comprehensive error handling

### Changed
- Complete rebuild from single-file to professional structure
- Improved UI/UX with modern design patterns

### Fixed
- File parsing issues
- Cross-browser compatibility
```

## 🎓 Learning Resources

### Understanding the Codebase
- `src/services/` - Business logic and API integration
- `src/components/` - React UI components
- `src/hooks/` - Custom React hooks
- `src/utils/` - Helper functions
- `src/config/` - Configuration and constants

### Key Concepts Used
- React Hooks (useState, useCallback, custom hooks)
- Service architecture pattern
- Component composition
- Error boundaries
- Environment variables
- Build optimization

---

**Built by David Madison** | [Portfolio](#) | [LinkedIn](https://linkedin.com/in/davidmadison95)
