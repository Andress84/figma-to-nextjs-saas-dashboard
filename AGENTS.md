# Project instructions

- Use `pnpm` for dependency management and project scripts.
- Keep TypeScript in strict mode and avoid `any` unless it is technically unavoidable and documented.
- Prefer React Server Components. Add `"use client"` only when browser interaction or framework error boundaries require it.
- Maintain accessible names, keyboard access, visible focus states, semantic landmarks, and reduced-motion support.
- Maintain responsive behavior across mobile, tablet, and desktop layouts.
- Keep reusable UI in `src/components/ui`, layout concerns in `src/components/layout`, and business-specific code in `src/features`.
- Keep mock data separate from React components and shared types in `src/types`.
- Run `pnpm check` before considering work complete. Use `pnpm check:full` when browser binaries are available.
- Do not add a major dependency without explaining why it is needed.
- Do not change the agreed architecture without documenting the reason in the pull request or README.
- Do not commit generated reports, build output, secrets, or real customer data.
