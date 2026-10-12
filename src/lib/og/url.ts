// Bump when the card design changes: Discord and browsers cache the image by URL, so a new
// `v` is the only way to replace already-cached previews.
const OG_IMAGE_VERSION = 2;

export function ogImageUrl(owner: string, repo: string) {
  return `/og?owner=${owner}&repo=${repo}&v=${OG_IMAGE_VERSION}`;
}
