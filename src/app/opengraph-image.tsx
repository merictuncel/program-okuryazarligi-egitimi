import { ImageResponse } from "next/og";

export const alt = "Program Okuryazarlığı Eğitimi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
/** Build sırasında sharp/vips hatasını önlemek için runtime üret */
export const dynamic = "force-dynamic";

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
          background: "#0a2540",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 22, color: "#c5ced8", marginBottom: 24 }}>
          TÜBİTAK 2237-A
        </div>
        <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.2 }}>
          Program Okuryazarlığı Eğitimi
        </div>
        <div style={{ marginTop: 28, fontSize: 24, color: "#c5ced8" }}>
          Örgün pedagojik formasyon öğrencileri için proje önerisi
        </div>
      </div>
    ),
    { ...size },
  );
}
