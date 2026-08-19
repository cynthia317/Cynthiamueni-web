import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#ffffff",
            fontSize: 78,
            fontWeight: 700,
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          CM
        </div>
        <div
          style={{
            display: "flex",
            width: 56,
            height: 8,
            marginTop: 16,
            borderRadius: 4,
            background: "#f59e0b",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
