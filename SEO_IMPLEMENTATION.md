# SEO Implementation Guide

## ✅ What's Been Implemented

### 1. **Structured Data (JSON-LD)**
- ✅ JobPosting schema on every job page
- ✅ Google Jobs rich results support
- ✅ Automatic schema generation from job data

### 2. **Meta Tags**
- ✅ Dynamic title tags
- ✅ Meta descriptions
- ✅ Keywords
- ✅ Canonical URLs
- ✅ OpenGraph tags (Facebook, LinkedIn)
- ✅ Twitter Card tags

### 3. **Technical SEO**
- ✅ `robots.txt` - Guides search engine crawlers
- ✅ Dynamic `sitemap.xml` - Auto-generates from database
- ✅ Server-side rendering (Next.js App Router)
- ✅ Crawlable HTML content

### 4. **SEO-Friendly URLs**
- ✅ Clean, readable URLs: `/company-name/careers/job-title`
- ✅ Automatic slug generation
- ✅ No query parameters

---

## 🚀 How It Works

### Job Posting Schema
Every job page includes structured data that tells search engines:
- Job title, description
- Company information
- Location and salary
- Employment type (Full Time, Part Time, etc.)
- Work policy (Remote, On-site, Hybrid)
- Date posted and validity period

**Example in HTML:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Senior Software Engineer",
  "description": "Job description here...",
  "employmentType": "FULL_TIME",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Company Name",
    "logo": "https://..."
  }
}
</script>
```

### Sitemap Generation
The sitemap automatically includes:
- All company careers pages
- All open job listings
- Proper last modified dates
- Priority scores for better crawling

**Access:** `https://yoursite.com/sitemap.xml`

### OpenGraph Tags
When shared on social media, job pages display:
- Company logo as preview image
- Job title
- Employment details
- Proper formatting

---

## ⚙️ Configuration Required

### 1. Set Environment Variable
Add to your `.env.local`:
```bash
NEXT_PUBLIC_BASE_URL=https://yoursite.com
```

**Important:** Update this when deploying to production!

### 2. Update robots.txt
Edit `/public/robots.txt` and replace:
```txt
Sitemap: https://yoursite.com/sitemap.xml
```
with your actual domain.

---

## 📊 SEO Checklist Before Launch

- [ ] Set `NEXT_PUBLIC_BASE_URL` in production environment
- [ ] Update `robots.txt` with your domain
- [ ] Test job page in [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Verify sitemap at `/sitemap.xml`
- [ ] Check OpenGraph preview using [OpenGraph Debugger](https://www.opengraph.xyz/)
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools

---

## 🔍 Testing SEO

### Test Structured Data
1. Visit any job page (e.g., `/company-one/careers/senior-engineer`)
2. View page source (Ctrl/Cmd + U)
3. Search for `"@type": "JobPosting"`
4. Copy the entire JSON-LD block
5. Test at: https://search.google.com/test/rich-results

### Test Meta Tags
1. Go to: https://www.opengraph.xyz/
2. Enter your job page URL
3. Verify title, description, and image appear correctly

### Test Sitemap
1. Visit: `https://yoursite.com/sitemap.xml`
2. Verify all jobs appear
3. Check that URLs are correct

---

## 📈 Expected SEO Benefits

1. **Google Jobs Integration**
   - Jobs appear in Google Search
   - Rich results with salary, location, etc.
   - Higher visibility in job searches

2. **Better Social Sharing**
   - Professional previews on LinkedIn, Twitter, Facebook
   - Increased click-through rates
   - Brand consistency

3. **Improved Indexing**
   - Faster discovery by search engines
   - Better understanding of content
   - Higher search rankings

4. **User Experience**
   - Clear, descriptive URLs
   - Accurate page titles
   - Proper meta descriptions in search results

---

## 🛠️ Maintenance

### When Adding Jobs
- No action needed! SEO updates automatically
- Sitemap regenerates on each request
- Structured data generated from job details

### When Changing Domain
1. Update `.env.local` or `.env.production`
2. Update `robots.txt`
3. Redeploy application

### Monitoring
- Use Google Search Console to track performance
- Monitor "Job Postings" in Search Console
- Check for any structured data errors

---

## 📚 Resources

- [Google Jobs Guidelines](https://developers.google.com/search/docs/appearance/structured-data/job-posting)
- [Schema.org JobPosting](https://schema.org/JobPosting)
- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [OpenGraph Protocol](https://ogp.me/)
