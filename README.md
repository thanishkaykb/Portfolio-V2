# Thanishka Yogesh - Immersive 3D Portfolio

A black-and-golden-yellow personal portfolio built with React, Vite, TypeScript, Tailwind CSS v4,
Three.js / React Three Fiber, GSAP ScrollTrigger, Framer Motion and Lenis.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # typecheck + production build
npm run preview
```

Node 20+ recommended. The lockfile (`package-lock.json`) is committed - restore with `npm ci`.

## What is actually interactive

| Feature | Where | How it works |
| --- | --- | --- |
| 3D door corridor | `#skills` | Five procedural Three.js doors (frames, hinged panels, gold seams, doorway lights, floor pools) on a wall you travel along. Pointer parallax, hover lift, click-to-open with a real 180°-style hinge animation and lit doorway, then a content docket per discipline. Swipe on touch, arrow buttons and keyboard-focusable labels. |
| 3D ability card | `#ability` | CSS-3D card with preserved-3D children at different Z depths, pointer-driven rotateX/rotateY, moving gold foil glare, front/back flip with real back-face content. No invented proficiency scores. |
| Hero scene | `#home` | R3F golden dust + concentric rings with pointer parallax, behind a golden portrait aperture. |
| Timeline | `#story` | GSAP ScrollTrigger reveals, per-entry active index, scrubbed progress line and digit rain. |
| Project case studies | `#projects` | Full-screen animated overlays with problem, features, stack, contribution and honest links. |
| Frames gallery | `#frames` | Asymmetric grid + full-screen lightbox with arrow-key navigation. |
| Contact form | `#contact` | Client-side validation with per-field errors, loading / success / error states and a working `mailto:` fallback. |
| Cursor, preloader, nav | global | Custom gold cursor (desktop only), counter preloader, scroll progress, active section tracking, mobile drawer. |

Reduced-motion preferences disable smooth scroll, the cursor, the preloader animation, the marquee and
GSAP motion. Devices without WebGL get a plain, usable door grid instead of the canvas.

## Content and where it came from

Everything on the site comes from:

- the details you supplied (name, degree, department, college, location, email, phone, links);
- your public GitHub repositories and READMEs (read October 2026), including live URLs;
- your résumé (`Thanishka_Yogesh_Resume.pdf`) for the CGPA, internships, project bullets and
  certifications;
- your LinkedIn profile PDF (`Profile (1).pdf`) for leadership roles, ambassadorships, honours and
  community involvement.

No clients, metrics, certifications, job titles or awards were invented. Every prize names its
event, and participation is never described as a win.

## Résumé

`public/resume/Thanishka-Yogesh-Resume.pdf` is live - the nav button now opens and downloads it.
Because the PDF itself could not be read from the workspace (only its extracted text was available),
it was regenerated as a clean two-page, on-brand document from that content with
`scripts/generate-resume.py` (needs `reportlab`). If you want your exact original file served,
replace the PDF at the same path - nothing in the code needs to change.

## Still needed from you

1. **Photograph** - save it as `public/images/portrait.jpg` (square or portrait crop, 800–1400px).
   It drops straight into the hero and about apertures with the gold rim treatment. Until then an
   original monogram/light study is shown instead of a stock face.
2. **Verify the résumé** - the PDF currently served is regenerated from your résumé text. Open it, and
   replace it with your original PDF if you prefer the exact file.
3. **Real screenshots (optional)** - project previews are original code-drawn artwork. Replace any
   `<ProjectArtwork />` usage in `src/components/sections/Projects.tsx`, `WebCraft.tsx` or
   `Frames.tsx` with an `<img>` when you have real screenshots, or drop photographs into
   `public/frames/` and add entries in `src/lib/data.ts`.
4. **Custom domain** - update the canonical/OG URLs in `index.html`, `public/robots.txt` and
   `public/sitemap.xml`.

## Contact form

Without configuration, submitting opens the visitor's mail client with the message pre-filled
(a functioning fallback, not a fake success). To send in-page:

```bash
cp .env.example .env
# set VITE_CONTACT_ENDPOINT to a form endpoint that accepts JSON
# { name, email, subject, message }
```

Then rebuild. Providers such as Formspree, Basin or your own serverless function work; no secret key
belongs in a `VITE_` variable, so use the provider's public form ID.

## Project structure

```
src/
  components/
    layout/    Nav, Footer, Cursor, Preloader
    sections/  Hero, DoorWorld, AbilitySection/AbilityCard, About, Story,
               Projects, CaseStudy, WebCraft, Experience, Frames, Contact
    three/     DoorScene, HeroScene, GoldenDust
    ui/        SectionHeading, PortraitAperture, ProjectArtwork, ResumeDialog, Marquee
  lib/         data.ts (all content), hooks.ts, useSmoothScroll.ts
  styles/      index.css (Tailwind v4 theme + base + components)
scripts/       generate-og.py (regenerates public/og-image.png)
```

## Social preview

`public/og-image.png` is generated by `python3 scripts/generate-og.py` (requires Pillow). Delete and
regenerate after changing the name, role or tagline.

## Accessibility notes

- Skip link, landmark elements, one `h1`, labelled form fields and `aria-live` feedback.
- All interactive 3D labels are real buttons (focusable, Enter/Space works).
- Focus-visible outlines use the gold accent; overlays trap scroll and close on `Escape`.
- Colour contrast targets WCAG AA against `#080808` for body copy.
