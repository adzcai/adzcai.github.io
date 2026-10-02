# adzc.ai (al-folio-style draft)

Static recreation of the look of [al-folio](https://github.com/alshedivat/al-folio)
(Jekyll theme), written as plain HTML/CSS with a little vanilla JS. No build step:
GitHub Pages serves the files as-is. The theme color is the favicon's teal.

## Files

- `index.html` - about page: bio, photo, recent news, selected publications, social icons
- `publications.html`, `news.html`, `talks.html`, `teaching.html`, `cv.html`
- `assets/style.css` - all styles; colors are CSS variables at the top (light and dark)
- `assets/site.js` - light/dark toggle (follows the OS setting until clicked; choice saved
  in localStorage), mobile menu, and the runtime-assembled mailto link
- `profile.jpg`, favicons, `site.webmanifest`, `CNAME`

## Editing

Edit the HTML directly. The navbar and footer are repeated in every page, so change
them in all six files. To add a publication, copy an `<li>` inside an
`<ol class="bibliography">`; venue badge colors are the `.badge.<venue>` rules in
`assets/style.css`. Preview locally with `python3 -m http.server` and open
http://localhost:8000.
