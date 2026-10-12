import { ImageResponse } from "next/og";
import { ownerSchema, repoSchema } from "@/lib/parse-input";
import { fetchRepo } from "@/lib/github/client";
import { fetchCustomSocialPreviewUrl } from "@/lib/github/graphql";
import { loadInterSubset } from "@/lib/og/fonts";
import { BrandOgCard, RepoOgCard, ogCardText } from "./og-card";

const CACHE_CONTROL = "public, max-age=86400, s-maxage=86400";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const owner = url.searchParams.get("owner") ?? "";
  const repo = url.searchParams.get("repo") ?? "";

  if (!ownerSchema.safeParse(owner).success || !repoSchema.safeParse(repo).success) {
    return renderCard(<BrandOgCard />, ogCardText());
  }

  const [r, socialPreview] = await Promise.all([
    fetchRepo(owner, repo),
    fetchCustomSocialPreviewUrl(owner, repo),
  ]);
  if (!r.ok) return renderCard(<BrandOgCard />, ogCardText(), { cacheable: false });

  if (socialPreview.ok && socialPreview.data) {
    const banner = await proxyImage(socialPreview.data);
    if (banner) return banner;
  }

  return renderCard(<RepoOgCard repo={r.data} />, ogCardText(r.data));
}

async function proxyImage(url: string): Promise<Response | null> {
  try {
    const res = await fetch(url);
    const contentType = res.headers.get("content-type") ?? "";
    if (!res.ok || !contentType.startsWith("image/")) return null;
    return new Response(res.body, {
      headers: { "Content-Type": contentType, "Cache-Control": CACHE_CONTROL },
    });
  } catch {
    return null;
  }
}

async function renderCard(card: React.ReactElement, text: string, { cacheable = true } = {}) {
  return new ImageResponse(card, {
    width: 1200,
    height: 630,
    fonts: await loadInterSubset(text),
    headers: cacheable ? { "Cache-Control": CACHE_CONTROL } : {},
  });
}
