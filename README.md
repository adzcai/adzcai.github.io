# adzc.ai

Alex Cai's academic website, built with the [al-folio](https://github.com/alshedivat/al-folio) Jekyll
theme (v1.x starter, upstream commit `40c0600`, theme gem `al_folio_core` 1.0.15). Upstream docs:
<https://github.com/alshedivat/al-folio/tree/main/docs>.

## Build and serve locally

Needs Homebrew Ruby (4.0 works with the pinned `Gemfile.lock`) and ImageMagick (`brew install imagemagick`,
used for responsive `.webp` images).

```sh
npm run setup   # once: installs gems into vendor/bundle
npm run serve   # http://127.0.0.1:4001, rebuilds on save (restart after editing _config.yml)
npm run build   # writes _site/
npm run cv      # rebuilds assets/pdf/cv.pdf from the resume in the vault (needs latexmk)
```

The scripts put Homebrew Ruby first on `PATH` (the system Ruby 2.6 is too old) and set a UTF-8 locale
(bibtex parsing fails without one); see `package.json`.

## Deployment

`.github/workflows/deploy.yml` (al-folio's workflow) builds the site on every push to `main` and pushes
`_site/` to the `gh-pages` branch. In the repository's **Settings -> Pages**, set the source to
**Deploy from a branch**, branch **`gh-pages`**, folder `/ (root)`. The workflow needs
**Settings -> Actions -> General -> Workflow permissions: Read and write**. `CNAME` (`adzc.ai`) is copied
into the build, and `url`/`baseurl` in `_config.yml` are set for that custom domain.

## One-page layout

Unlike stock al-folio, everything is on the homepage (`_pages/about.md`), one `<section id="...">` per
topic, and the navbar scrolls to them instead of opening separate pages. The menu is built from
`_data/home_sections.yml`; to add or reorder a section, change both that file and `_pages/about.md`.
`assets/js/one-page.js` highlights the menu item for the section in view and closes the mobile menu after a
click; `assets/css/one-page.css` handles smooth scrolling and spacing. The publication search box is off
(`bib_search: false`) because it filters papers by the URL's `#...`, which the menu links now use, and news
items don't get their own pages (`collections.news.output: false`).

## Where to edit

| Content | File |
| --- | --- |
| Name, description, footer, feature toggles | `_config.yml` |
| Bio, photo, tagline, Chinese name | `_pages/about.md` (photo: `assets/img/profile.jpg`) |
| Publications | `_bibliography/papers.bib` (all are listed; `abbr` is the badge) |
| News | one file per item in `_news/` (`date_label` overrides the shown date) |
| Talks, teaching | their sections in `_pages/about.md` |
| CV | `assets/pdf/cv.pdf`, built by `npm run cv` from `~/Vault/personal/resume/resume.tex` with the phone number removed (`bin/build-cv-pdf`). Commit the new PDF after rebuilding. |
| Leadership and service | its section in `_pages/about.md` |
| Menu | `_data/home_sections.yml` |
| Social icons | `_data/socials.yml` (no email icon, so the address is never published unobfuscated) |
| Theme colors (favicon teal) | `_sass/_themes.scss` (`--global-theme-color`) |
| Favicons, web manifest | `assets/icons/` (PNGs, kept out of `assets/img/` so ImageMagick skips them), `assets/img/favicon.ico`, `site.webmanifest`, `_includes/head.liquid` |

`_includes/head.liquid`, `_includes/header.liquid`, `_includes/news.liquid`, `_layouts/about.liquid` and
`_sass/_themes.scss` are local copies of the theme gem's files with small, commented changes (extra favicon
links and the one-page CSS/JS; menu built from section anchors; month-year news dates; Chinese name, photo alt
text and #about/#contact sections; teal theme color). When upgrading `al_folio_core`, re-copy them from
the new gem and reapply those changes.
