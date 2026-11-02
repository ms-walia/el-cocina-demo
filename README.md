# El Cocina — demo website

A demo website for El Cocina, a restaurant and cocktail bar on GT Road, Amritsar. Built by Mehtab Singh Ahluwalia as a pitch.

Static site, no build step: `index.html` (home), `order.html` (takeaway), `reserve.html` (table booking), with `css/`, `js/` and `assets/`. Deploy the repo root on Vercel or GitHub Pages.

## What it does
- Home page with scroll animations (GSAP, Lenis), signature dishes and the bar card
- **Takeaway ordering**: pick dishes, a pickup day and time slot; the order opens as a pre-filled WhatsApp message
- **Table reservations**: date, time and party size, sent the same way
- Opening hours, slots and contact details live in `js/config.js`; the menu lives in `js/menu-data.js`

## Before going live
- Confirm the settings marked ASSUMED in `js/config.js` (WhatsApp number, last seating, prep time, max online guests)
- Replace the menu items marked `placeholder: true` in `js/menu-data.js` with the real menu and prices
- Photos are Unsplash placeholders

Look and scroll animation adapted from the free 8B restaurant template (MIT).
