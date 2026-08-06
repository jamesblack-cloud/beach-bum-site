
# Beach Bum Cannabis — Deployable Static Site

This is a deployable static website package for Beach Bum Cannabis.

## Highlights
- Stay On Island Time hero and product-first UX
- No pricing, no cart, no checkout
- Alberta available now; Saskatchewan and Manitoba coming soon
- 12 live pre-roll SKUs plus hemp/blunt feature formats
- Age gate, mobile menu, filters and dynamic product page
- Supports an optional hero video

## Hero video
To enable the approved current-site hero video, drop either or both of these files into `assets/video/`:
- `hero-video.mp4`
- `hero-video.webm`

If no video is present, the site automatically falls back to the static hero image.

## GitHub Pages deployment
1. Create a new GitHub repository.
2. Upload all files in this folder to the repository root.
3. Enable GitHub Pages from the main branch / root folder.
4. Point your custom domain to the Pages site if desired.

## Local preview
Run a simple server from this folder, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Notes before launch
- Replace placeholder legal copy in Privacy and Terms pages.
- Confirm live retailer destinations and contact addresses.
- Add the approved woman-on-the-beach hero video to `assets/video/`.
