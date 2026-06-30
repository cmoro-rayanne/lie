**Divider** — the thin terracotta gradient rule that separates a heading from body copy.

```jsx
<Divider />                       {/* 48px, left-anchored fade */}
<Divider variant="center" width={48} />
<Divider variant="line" className="animate-line-grow" />  {/* grows in on scroll */}
```

- **variant**: `line` (left-anchored) · `center` (centered fade) · `ornament` (full-width).
- Add `className="animate-line-grow"` to grow it from the left as it enters view.
- **tone="dark"** switches to the soft gold rule on dark sections.
