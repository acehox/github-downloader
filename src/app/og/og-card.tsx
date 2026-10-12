import type { Repo } from "@/lib/github/schemas";

// Hex equivalents of the site's dark theme tokens (globals.css) and the brand gradient
// (fuchsia-700 → red-400); satori can't read CSS variables.
const COLORS = {
  background: "#0a0a0a",
  foreground: "#fafafa",
  muted: "#a1a1a1",
  border: "rgba(255, 255, 255, 0.1)",
};
const BRAND_GRADIENT = "linear-gradient(90deg, #a800b7, #ff6467)";

const SLOGAN = "The easiest way to download GitHub apps";

const LOGO_SVG = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><mask id="m"><rect width="200" height="200" fill="white"/><circle cx="66" cy="55" r="16" fill="black"/><circle cx="134" cy="55" r="16" fill="black"/><path d="M66 67 C66 91 100 83 100 91" stroke="black" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M134 67 C134 91 100 83 100 91" stroke="black" stroke-width="14" fill="none" stroke-linecap="round"/><circle cx="100" cy="102" r="16" fill="black"/><path d="M94 114 L94 139 L76 139 L100 164 L124 139 L106 139 L106 114 Z" fill="black"/></mask></defs><circle cx="100" cy="100" r="92" fill="${COLORS.foreground}" mask="url(#m)"/></svg>`,
)}`;

function GradientText({ children }: { children: string }) {
  return (
    <span
      style={{
        backgroundImage: BRAND_GRADIENT,
        backgroundClip: "text",
        color: "transparent",
        fontWeight: 800,
      }}
    >
      {children}
    </span>
  );
}

function Brand() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_SVG} alt="" width={52} height={52} />
      <div style={{ display: "flex", fontSize: 40, color: COLORS.foreground }}>
        github
        <GradientText>dl</GradientText>
        .com
      </div>
    </div>
  );
}

function Slogan() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: "0.25em",
        fontSize: 64,
        fontWeight: 600,
        letterSpacing: "-0.02em",
        lineHeight: 1.15,
        color: COLORS.foreground,
      }}
    >
      {SLOGAN.split(" ").map((word) =>
        word === "easiest" ? (
          <GradientText key={word}>{word}</GradientText>
        ) : (
          <span key={word}>{word}</span>
        ),
      )}
    </div>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "56px 72px",
        background: COLORS.background,
        color: COLORS.foreground,
        fontFamily: "Inter",
      }}
    >
      {children}
    </div>
  );
}

function repoNameFontSize(name: string) {
  if (name.length <= 16) return 96;
  if (name.length <= 24) return 80;
  return 64;
}

export function RepoOgCard({ repo }: { repo: Repo }) {
  return (
    <Frame>
      <Brand />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={repo.owner.avatar_url}
            alt=""
            width={168}
            height={168}
            style={{ borderRadius: 168, border: `2px solid ${COLORS.border}` }}
          />
          <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "block",
                fontSize: repoNameFontSize(repo.name),
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                lineClamp: 1,
              }}
            >
              {repo.name}
            </div>
            <div style={{ display: "block", fontSize: 44, color: COLORS.muted, lineClamp: 1 }}>
              {`by ${repo.owner.login}`}
            </div>
          </div>
        </div>
        {repo.description ? (
          <div
            style={{
              display: "block",
              marginTop: 36,
              fontSize: 36,
              lineHeight: 1.35,
              color: COLORS.muted,
              lineClamp: 2,
            }}
          >
            {repo.description.slice(0, 300)}
          </div>
        ) : null}
      </div>
    </Frame>
  );
}

export function BrandOgCard() {
  return (
    <Frame>
      <Brand />
      <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
        <Slogan />
      </div>
    </Frame>
  );
}

export function ogCardText(repo?: Repo) {
  const repoText = repo
    ? `${repo.name}by ${repo.owner.login}${repo.description?.slice(0, 300) ?? ""}`
    : "";
  return `githubdl.com${SLOGAN}…${repoText}`;
}
