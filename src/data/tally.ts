// Tally form IDs used across the site.
// Edit URL pattern: https://tally.so/forms/<id>/edit
// Public response URL: https://tally.so/r/<id>
// Embed URL: https://tally.so/embed/<id>?<options>

export const TALLY_NICHT_NUR_DEIN_JOB_STORY = "q4Y2Ok";

// Recommended embed query params: title hidden (our page has its own h1),
// transparent background (our brand shows through), dynamic height (Tally's
// embed.js resizes the iframe as the form's content grows), left-aligned.
export const TALLY_EMBED_PARAMS = "alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1";

export function tallyEmbedSrc(formId: string): string {
  return `https://tally.so/embed/${formId}?${TALLY_EMBED_PARAMS}`;
}
