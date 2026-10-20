# Hero logo animation

Approved for publication on 20 October 2026.

The supplied original SVG is integrated at the top of the left hero column, above the name and existing headline. Symbol and letter paths, proportions and reveal geometry are unchanged. The visible left edge aligns with the heading. Desktop width is clamp(320px,34vw,440px), capped by the column; mobile maximum is 280px. The portrait, text, navigation and CTA remain intact. No orange outline or replay control.

The mountain slides in from the right, reveals the stationary wordmark and settles into CZ over 2150ms. It runs once per tab session using sessionStorage key cz.hero-logo.v2. Opening in the background does not consume the intro. Switching away pauses elapsed time; returning resumes it. Completion records the session. Reduced-motion preferences show the complete static logo, including when changed mid-animation. Unmount cleans up RAF, the observer and listeners.

Prerendered HTML contains the complete SVG. A small head bootstrap prevents a static flash before React prepares frame zero; a five-second fail-open timer restores visibility if application initialization fails. Without JavaScript the static logo is visible. If storage is blocked, the in-memory guard prevents replay during client navigation, but cannot persist across full reloads.

Validation: production build, prerender/release checks and 13 geometry/lifecycle checks covering original path equality, timing, session/remount, reduced motion, storage failure, background start, pause/resume and cleanup. Browser verification covered initial animation, static return/reload, desktop and 390/320px with no horizontal overflow or observed console errors. Mobile checks use viewport emulation; reduced motion uses the lifecycle harness; no-JS fallback was verified in generated HTML.
