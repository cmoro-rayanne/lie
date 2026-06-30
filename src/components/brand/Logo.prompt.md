**Logo** — the Ilê brand mark: three nested rings (terracotta / olive / sand-gold) over the "Ilê" serif wordmark + "Psicologia e Consciência" tagline. Recreated as crisp, recolorable vector.

```jsx
<Logo variant="full" size={140} />              {/* vertical lockup — splash, footer */}
<Logo variant="inline" size={44} />             {/* nav bar */}
<Logo variant="mark" size={64} />               {/* favicon / avatar */}
<Logo variant="full" tone="dark" size={140} />  {/* on dark sections */}
```

- **variant**: `full` (rings + wordmark + tagline + divider) · `stacked` (rings + wordmark) · `mark` (rings only) · `wordmark` (text only) · `inline` (horizontal, for nav).
- **tone="dark"** tints the rings gold and switches the wordmark to cream — use on hero/footer.
- **mono="#fff"** forces a single-color (reversed) mark. `showTagline={false}` drops the tagline.
- The original raster lockup lives at `assets/logo-ile-full.png`.
