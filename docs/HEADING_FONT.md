# Cinek Zielu Abstract — headings

Local integration of the user-selected **Subtelna abstrakcja**, version 0.5,
from `Cinek-Zielu-Abstract-Naglowki-v05.zip`.

- Only the supplied 8,224-byte WOFF2 is shipped. SHA-256:
  `94d940ef4e5dd2f780b98e71f63ab2f93545e1ee6b5ba8f8c18bc1ba6e24a78d`.
- `headingTypography.css` defines the single shared heading family. H1–H6 and
  non-semantic overview/next-gallery titles use Regular 400, normal style,
  native kerning and no synthetic bold or italic. Explicit heading priorities
  override older component weights, including lazy-loaded map styles.
- The font is preloaded with crossorigin, bundled under a hashed filename and
  uses font-display: swap. Arial/sans-serif remains the fallback for unsupported
  characters. No TTF, generated font, external font service or library is added.
- Body text, navigation, logo, buttons, inputs, photo captions, map labels,
  colours and section order retain their existing presentation. Heading sizes
  and line heights were preserved; long headings may wrap to avoid overflow.

Validation: build, release and prerender checks; all 123 source characters and
complete Polish alphabet verified in the packaged matching TTF, and the actual
WOFF2 rendered successfully in a local browser proof. Checked “Cinek Zielu”,
“Fotografie i filmy”, “Zażółć gęślą jaźń”, “ĄĆĘŁŃÓŚŹŻ ąćęłńóśźż” and
“4 dni w drodze”. Homepage, long trip title, gallery, film library, summits and
routes were checked in desktop and/or 390/320 px emulation, without observed
horizontal heading overflow. Phone testing was emulated, not a physical device.

This step remains local. The preceding menu/loading package is preserved and
accepted visually by the user; neither package has been published in this step.

17 October refinement: heading tracking is now consistently `0.01em`, overriding
the negative tracking inherited from the previous typeface. Native kerning stays
enabled. Body, navigation, controls and Caption typography remain unchanged.

At widths up to 360px, expedition H1 scales to 36px at 320px to keep long Polish
summit names intact. Rebuilt and checked homepage desktop plus the long
Mięguszowiecki trip heading at 320px without horizontal overflow.
