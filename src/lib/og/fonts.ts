type OgFont = { name: string; data: ArrayBuffer; weight: 400 | 600 | 800; style: "normal" };

const FONT_FACE_PATTERN =
  /font-weight:\s*(\d+);\s*src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype)'\)/g;

/**
 * Subsets Inter to `text` via Google Fonts' `text=` param, keeping each weight to a few KB.
 * next/og only bundles Geist Regular, so without this the card ignores the site font and weights.
 * Returns [] on failure so the card still renders with the bundled font.
 */
export async function loadInterSubset(text: string): Promise<OgFont[]> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(cssUrl)).text();
    const faces = [...css.matchAll(FONT_FACE_PATTERN)];
    return await Promise.all(
      faces.map(async ([, weight, url]) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`font ${weight} ${res.status}`);
        return {
          name: "Inter",
          data: await res.arrayBuffer(),
          weight: Number(weight) as OgFont["weight"],
          style: "normal" as const,
        };
      }),
    );
  } catch (err) {
    console.warn("og: font load failed", err);
    return [];
  }
}
