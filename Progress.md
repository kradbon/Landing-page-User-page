# Progress

Context
- Project: Next.js app with landing builder + admin panel.
- Goal: Admin UI matches landing theme (light/dark), fixed profile dropup, cleaner shadows, better translations (EN/RU/TJ), and editor fully usable.
- Current focus: admin styling parity + translation fixes + layout width/spacing.

What is already done
- Added language + admin theme state in editor store (lang: en/ru/tj, adminTheme: light/dark).
- Persisted language + theme in localStorage.
- Added per-language landing draft/published storage keys and lang-aware repo calls.
- Public pages read lang from query and render the correct version.
- Admin editor supports preview per selected section only (hides editor controls in preview).
- Added custom section block (fully editable: title/body/image/layout/CTA) and Add Section creates custom block.
- Added Settings and Integrations admin pages.
- Added admin-theme CSS vars + utility classes (admin-bg/admin-surface/admin-card/admin-muted/admin-shadow).
- Rewrote AdminShell to use admin CSS vars, apply landing theme colors, and create profile dropup.
- Reduced heavy shadows globally via admin-shadow.
- Updated Admin Editor, Leads, History, Pages to use admin-theme classes (partial; still more to do).
- Updated translations in Admin Editor + Admin Shell + Leads + History + Pages (fixing mojibake in those files).

Known issues seen in screenshots (needs work)
- Dark mode still shows light inputs/buttons inside editor cards (white fields and remove buttons on dark background).
- Light mode toggle does not switch the admin theme fully (some areas stay dark).
- Admin profile section UI does not match the reference (spacing, dropdown, alignment).
- Sidebar + content width too narrow vs reference; nav should be slightly more left and overall page wider.
- Translation is still broken (mojibake) in more files (Settings, Integrations, Theme, Block Editors, maybe others).
- Some editor controls use raw slate colors and ignore admin theme variables.

Files already touched (recent)
- apps/web/src/widgets/admin-shell/index.tsx
- apps/web/src/app/styles/globals.css
- apps/web/src/app/admin/editor/page.tsx
- apps/web/src/app/admin/leads/page.tsx
- apps/web/src/app/admin/history/page.tsx
- apps/web/src/app/admin/pages/page.tsx
- apps/web/src/shared/ui/input.tsx
- apps/web/src/shared/ui/button.tsx
- apps/web/src/app/admin/settings/page.tsx
- apps/web/src/app/admin/integrations/page.tsx
- apps/web/src/app/admin/theme/page.tsx
- apps/web/src/features/landing-editor/model/editor-store.ts
- apps/web/src/shared/api/landing-repo.ts
- apps/web/src/shared/api/landing-storage.ts
- apps/web/src/widgets/landing-renderer/blocks.tsx
- apps/web/src/features/landing-editor/ui/block-editors.tsx
- apps/web/src/entities/landing/model/block-registry.tsx

Next steps (tomorrow)
1) Fix translations (RU/TJ mojibake) across remaining admin pages and editors.
   - Targets: apps/web/src/app/admin/settings/page.tsx
             apps/web/src/app/admin/integrations/page.tsx
             apps/web/src/app/admin/theme/page.tsx
             apps/web/src/features/landing-editor/ui/block-editors.tsx
             any other admin page still showing ???? in UI.
2) Apply admin theme classes to all editor controls and inputs.
   - Update Field labels and cards in block-editors to use admin-muted/admin-card/admin-border.
   - Ensure inputs/selects use admin-card + admin-text in dark mode.
   - Update Button ghost variant to respect admin theme (admin-border/admin-muted).
3) Make light/dark toggle fully switch UI.
   - Confirm AdminShell root toggles class and uses CSS vars for all colors.
   - Replace remaining hardcoded bg-white/bg-slate-* in admin pages.
4) Fix profile dropup visuals and alignment.
   - Match reference: compact layout, right caret, clean border, no heavy shadow.
5) Layout width/spacing.
   - Increase container width (max-w) and reduce left padding.
   - Sidebar width + left margin to match reference proportions.
6) Replace any remaining white editor cards in dark mode.
   - Scan for bg-white, border-slate in admin editor + block editors.

Notes
- Current UI still uses some slate colors in block editors; these cause white fields in dark mode.
- Update Input/TextArea components to accept an "admin" variant or detect admin theme and use admin vars.

Commands
- Dev server: npm run dev:web
- Lint/test not run recently.
