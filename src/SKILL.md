---
name: ile-design
description: Use this skill to generate well-branded interfaces and assets for Ilê — Psicologia e Consciência (the clinical-psychology practice of Eliana Lino), for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, the Ilê logo, and UI kit components for prototyping. Warm minimal-luxury, earthy palette, Brazilian Portuguese.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Key starting points:
- `styles.css` — the single global stylesheet to link; it pulls in all tokens and fonts (Cormorant Garamond + Inter from Google Fonts).
- `tokens/` — colors, typography, spacing/radii/shadows/motion as CSS custom properties.
- `components/` — React primitives (Button, IconButton, Logo, Card, StatCard, Tag, Avatar, Input, SectionHeading, Divider).
- `ui_kits/landing/` — a full, interactive recreation of the Ilê landing page to copy patterns from.
- `assets/logo-ile-full.png` — the original logo; or use the `Logo` component for a scalable version.
