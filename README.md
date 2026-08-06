
# Beach Bum Cannabis — Static Site v5

Deployable static website built with semantic HTML, responsive CSS and vanilla JavaScript.

## Included
- Real HTML homepage and product catalogue
- Province-based one-time age gate
- Alberta available now; Saskatchewan and Manitoba coming soon
- Corrected hemp-paper and wood-tipped product data
- No pricing, cart, checkout or direct cannabis sales
- Quality-85 progressive JPEG photography; transparent logos remain PNG
- Product filtering and dynamic product detail page
- Find-a-Retailer contact form

## Local preview
```bash
python3 -m http.server 8000
```
Open `http://localhost:8000`.

## Before publishing
- Replace placeholder Privacy and Terms copy with approved legal language.
- Replace `mailto:` form actions with the chosen form endpoint or CRM integration.
- Confirm final retailer-contact routing.

## Custom domain
The root `CNAME` file is configured for `beachbumcannabis.ca`. Keep it in the repository root with `.nojekyll`.
