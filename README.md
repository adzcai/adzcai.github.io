# adzc.ai

Alex Cai's academic website, built with the [al-folio](https://github.com/alshedivat/al-folio) Jekyll
theme (v1.x starter, upstream commit `40c0600`, theme gem `al_folio_core` 1.0.15). Upstream docs:
<https://github.com/alshedivat/al-folio/tree/main/docs>.

## Build and serve locally

Needs Homebrew Ruby (4.0 works with the pinned `Gemfile.lock`) and ImageMagick (`brew install imagemagick`,
used for responsive `.webp` images).

```sh
export PATH=/opt/homebrew/opt/ruby/bin:$PATH
export LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8   # bibtex parsing fails under a non-UTF-8 locale
bundle config set --local path vendor/bundle
bundle install
bundle exec jekyll serve --port 4001          # http://localhost:4001
bundle exec jekyll build                      # writes _site/
```

## Deployment

`.github/workflows/deploy.yml` (al-folio's workflow) builds the site on every push to `main` and pushes
`_site/` to the `gh-pages` branch. In the repository's **Settings -> Pages**, set the source to
**Deploy from a branch**, branch **`gh-pages`**, folder `/ (root)`. The workflow needs
**Settings -> Actions -> General -> Workflow permissions: Read and write**. `CNAME` (`adzc.ai`) is copied
into the build, and `url`/`baseurl` in `_config.yml` are set for that custom domain.

## Where to edit

| Content | File |
| --- | --- |
| Name, description, footer, feature toggles | `_config.yml` |
| Bio, photo, tagline, Chinese name | `_pages/about.md` (photo: `assets/img/profile.jpg`) |
| Publications | `_bibliography/papers.bib` (`selected={true}` puts one on the home page; `abbr` is the badge) |
| News | one file per item in `_news/` (`date_label` overrides the shown date) |
| Talks | `_pages/talks.md` |
| Teaching | `_pages/teaching.md` |
| CV | `_data/cv.yml` (RenderCV format), page settings in `_pages/cv.md` |
| Social icons | `_data/socials.yml` (no email icon, so the address is never published unobfuscated) |
| Theme colors (favicon teal) | `_sass/_themes.scss` (`--global-theme-color`) |
| Favicons, web manifest | `assets/icons/` (PNGs, kept out of `assets/img/` so ImageMagick skips them), `assets/img/favicon.ico`, `site.webmanifest`, `_includes/head.liquid` |

`_includes/head.liquid`, `_includes/news.liquid`, `_layouts/about.liquid` and `_sass/_themes.scss` are
local copies of the theme gem's files with small, commented changes (extra favicon links; month-year news
dates; Chinese name and photo alt text; teal theme color). When upgrading `al_folio_core`, re-copy them from
the new gem and reapply those changes.
