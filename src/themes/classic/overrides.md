## Theme-level overrides checklist (classic)

These selectors are stable hooks provided by shared components. Add overrides here
or in `ResumeLayout.module.css` if the classic theme needs to diverge.

### SectionTitle
- `[data-ui='section-title']`
- `[data-ui='section-title'] [data-slot='title']`
- `[data-ui='section-title'] [data-slot='subtitle']`
- `[data-ui='section-title'] [data-slot='line']`

### InfoItem
- `[data-ui='info-item']`
- `[data-ui='info-item'] [data-slot='label']`
- `[data-ui='info-item'] [data-slot='value']`
