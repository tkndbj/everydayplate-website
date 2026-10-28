import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — recipes by ${site.author}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social-share image used when a page has no photo of its own. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 96,
          background: "linear-gradient(135deg, #fbf6ee 0%, #f2e8d9 100%)",
          color: "#2b211c",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 88, height: 88, borderRadius: 999, background: "#b5532f", display: "flex" }} />
          <div style={{ fontSize: 30, letterSpacing: 6, textTransform: "uppercase", color: "#b5532f" }}>
            Cypriot home cooking
          </div>
        </div>
        <div style={{ fontSize: 120, fontWeight: 700, marginTop: 40, letterSpacing: -3 }}>{site.name}</div>
        <div style={{ fontSize: 40, marginTop: 16, color: "#75675d" }}>{`Recipes, videos & stories by ${site.author}`}</div>
      </div>
    ),
    size,
  );
}
