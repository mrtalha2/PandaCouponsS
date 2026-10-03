# Image Assets & License Documentation

This project utilizes custom, royalty-free, commercially usable food photography and vector artwork created exclusively for the **Panda Express Coupons** independent informational portal. No official corporate restaurant photography, proprietary copyrighted assets, or third-party trademarks are used.

## Core Photographic Assets

| Filename | Dimensions | Description | License / Provenance | Status |
| :--- | :--- | :--- | :--- | :--- |
| `hero-wok.jpg` | 1920×1080 | Steaming stir-fry noodles in a flaming wok over burner flame | Custom royalty-free asset generated for Panda Express Coupons | Active (LCP Preloaded) |
| `orange-chicken.jpg` | 1440×1080 | Crispy citrus-glazed chicken in a modern matte black ceramic bowl with sesame and scallion garnish | Custom royalty-free asset generated for Panda Express Coupons | Active |
| `beijing-beef.jpg` | 1440×1080 | Crispy seared beef with red bell peppers and onions in tangy glaze | Custom royalty-free asset generated for Panda Express Coupons | Active |
| `family-meal.jpg` | 1920×1080 | Overhead view of a celebratory family Chinese-American takeout dinner spread | Custom royalty-free asset generated for Panda Express Coupons | Active |
| `takeout-spread.jpg` | 1920×1080 | Spread of noodle takeout boxes, dumplings, fried rice, and appetizers on dark slate | Custom royalty-free asset generated for Panda Express Coupons | Active |
| `about-kitchen.jpg` | 1920×1080 | Modern commercial wok kitchen and culinary prep counter | Custom royalty-free asset generated for Panda Express Coupons | Active |
| `nutrition-plate.jpg` | 1920×1080 | Balanced nutritional plate with fresh vegetables and lean protein | Custom royalty-free asset generated for Panda Express Coupons | Active |

## Menu & UI Vector Assets

- **Category & Dish Artwork (`public/images/menu/`)**: Optimized responsive WebP assets and vector icons depicting food categories (bowls, plates, bundles, drinks, sides, and appetizers).
- **OpenGraph Social Cards (`public/images/og/`)**: Generated custom social cards matching the site's dark-mode visual theme with verified WCAG contrast.
- **Brand & UI Icons (`public/favicon.svg`, `public/images/logo.svg`)**: Custom independent SVG icons representing the informational coupon savings portal.

All images are self-hosted in `./public/images/` and served locally with responsive `<picture>` tags, explicit `width`/`height` attributes to eliminate Cumulative Layout Shift (CLS), `loading="lazy"` (except LCP hero), and descriptive semantic `alt` attributes.
