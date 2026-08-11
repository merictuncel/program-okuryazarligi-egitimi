import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px 72px",
          background:
            "linear-gradient(135deg, #061628 0%, #0a2540 50%, #14365c 100%)",
          color: "#ffffff",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#c5ced8",
            marginBottom: 24,
          }}
        >
          TÜBİTAK 2237-A
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 1.2,
            maxWidth: 980,
          }}
        >
          Program Okuryazarlığı Eğitimi
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 24,
            color: "#c5ced8",
            maxWidth: 860,
            lineHeight: 1.4,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Örgün pedagojik formasyon öğrencileri için proje önerisi ·
          Değerlendirme süreci devam etmektedir
        </div>
      </div>
    ),
    { ...size },
  );
}
