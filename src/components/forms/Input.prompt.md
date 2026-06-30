**Input** — text field, textarea or select with one calm shared style. Sand ground, terracotta focus ring.

```jsx
<Input placeholder="Seu nome completo" />
<Input as="textarea" rows={5} placeholder="Conte um pouco sobre o que você busca…" />
<Input as="select" options={[{ value: '', label: 'Assunto — por onde começar?' }, { value: 'ansiedade', label: 'Ansiedade ou estresse' }]} />
<Input label="E-mail" error="E-mail inválido" placeholder="Seu e-mail" />
```

- **as**: `input` (default) · `textarea` (vertical resize) · `select` (pass `options` or `<option>` children).
- `error` reddens the border and prints the message beneath. `label` renders an uppercase tracked label above.
