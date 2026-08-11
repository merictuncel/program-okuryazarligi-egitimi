"use client";

import { useCallback, useRef, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { createPortal } from "react-dom";

async function getCroppedFile(
  imageSrc: string,
  crop: Area,
  fileName: string,
): Promise<File> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  const size = 800;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas desteklenmiyor.");

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    size,
    size,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else reject(new Error("Kırpma başarısız."));
      },
      "image/jpeg",
      0.9,
    );
  });

  const base = fileName.replace(/\.[^.]+$/, "") || "egitmen";
  return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
}

export function PhotoCropField({
  name = "photo",
  label = "Fotoğraf",
  hint = "Kare kırpma sonrası 800×800 olarak kaydedilir.",
}: {
  name?: string;
  label?: string;
  hint?: string;
}) {
  const pickRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [fileName, setFileName] = useState("egitmen.jpg");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  const onCropComplete = useCallback((_: Area, cropped: Area) => {
    setCroppedArea(cropped);
  }, []);

  function clearOutput() {
    if (outputRef.current) {
      outputRef.current.value = "";
    }
    setPreview(null);
  }

  function onPick(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setSource(url);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }

  async function applyCrop() {
    if (!source || !croppedArea || !outputRef.current) return;
    setBusy(true);
    try {
      const file = await getCroppedFile(source, croppedArea, fileName);
      const transfer = new DataTransfer();
      transfer.items.add(file);
      outputRef.current.files = transfer.files;
      setPreview(URL.createObjectURL(file));
      URL.revokeObjectURL(source);
      setSource(null);
    } catch {
      clearOutput();
    } finally {
      setBusy(false);
    }
  }

  function cancelCrop() {
    if (source) URL.revokeObjectURL(source);
    setSource(null);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => pickRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-white hover:shadow-sm"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-xs text-white">
            +
          </span>
          Fotoğraf seç
        </button>
        {preview ? (
          <button
            type="button"
            onClick={clearOutput}
            className="text-sm text-red-600 hover:underline"
          >
            Fotoğrafı kaldır
          </button>
        ) : null}
      </div>

      <p className="text-xs text-slate-500">{hint}</p>

      <input
        ref={pickRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={onPick}
      />
      <input
        ref={outputRef}
        type="file"
        name={name}
        accept="image/jpeg"
        className="sr-only"
        tabIndex={-1}
      />

      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Kırpılmış önizleme"
          className="h-28 w-28 rounded-xl object-cover ring-1 ring-slate-200"
        />
      ) : null}

      {source
        ? createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/70 p-4">
              <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h3 className="font-semibold text-slate-900">
                    Fotoğrafı kırp
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Kare alan yüzü ortalayacak şekilde ayarlayın.
                  </p>
                </div>
                <div className="relative h-72 bg-slate-900 sm:h-80">
                  <Cropper
                    image={source}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
                <div className="space-y-4 px-5 py-4">
                  <label className="block text-sm text-slate-700">
                    Yakınlaştırma
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.05}
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="mt-2 w-full"
                    />
                  </label>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={cancelCrop}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
                    >
                      İptal
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={applyCrop}
                      className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                    >
                      {busy ? "İşleniyor..." : "Kırp ve kullan"}
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
