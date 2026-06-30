# Landing UI kit — Ilê

An interactive, high-fidelity recreation of the Ilê single-page site (`cmoro-rayanne/lie` → `landing-page-psicologa/`), composing the design-system primitives.

**Open `index.html`.** It loads `styles.css`, React + Babel, the compiled `_ds_bundle.js`, then the section files.

Sections (each a `window`-exported component):
- `Navbar.jsx` — fixed nav, transparent over hero → blurred sand on scroll; inline `Logo`; mobile menu.
- `Hero.jsx` — dark gradient + grain + parallax `Logo` mark; stroked-italic quote headline; dual CTA.
- `About.jsx` — photo frame + `SectionHeading` + `Divider` + bio.
- `Atuacao.jsx` — three specialty `Card`s with serif glyphs.
- `Quote.jsx` — dark inspirational pull-quote with concentric rings.
- `Testimonials.jsx` — `IconButton` carousel + `Avatar` + `StatCard` column.
- `Contact.jsx` — olive CTA banner + `Input`/`Button` form with fake submit success state.
- `Footer.jsx` — dark, closing quote, stacked `Logo`, links, social, `WhatsAppFab`.

Shared: `helpers.jsx` (`useInView` reveal hook), `icons.jsx` (lucide-style inline SVGs on `window.Icons`).

Images use the same Unsplash URLs as the source. These are cosmetic recreations — not production logic.
