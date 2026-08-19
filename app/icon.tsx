import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "50%",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#ffffff",
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: -1,
            lineHeight: 1,
          }}
        >
          CM
        </div>
        <div
          style={{
            display: "flex",
            width: 11,
            height: 2,
            marginTop: 3,
            borderRadius: 2,
            background: "#f59e0b",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
