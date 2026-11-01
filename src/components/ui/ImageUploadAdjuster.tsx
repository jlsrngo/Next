import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, RotateCw, ZoomIn, ZoomOut, Check, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';

interface ImageUploadAdjusterProps {
  value: string;
  onChange: (value: string) => void;
  aspectRatio?: 'square' | 'video' | 'wide';
  label?: string;
}

export default function ImageUploadAdjuster({
  value,
  onChange,
  aspectRatio = 'square',
  label = 'AVATAR FOTO PROFIL',
}: ImageUploadAdjusterProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(value || null);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [isAdjusting, setIsAdjusting] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>(value?.startsWith('http') ? value : '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (value && !rawImageSrc) {
      setRawImageSrc(value);
      if (value.startsWith('http')) {
        setUrlInput(value);
      }
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar (JPEG, PNG, WebP) yang diizinkan.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setRawImageSrc(result);
      setZoom(1);
      setRotation(0);
      setIsAdjusting(true);
      applyAdjustment(result, 1, 0);
    };
    reader.readAsDataURL(file);
  };

  const applyAdjustment = (imageSrc: string, zoomLevel: number, rotationDegree: number) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      const targetSize = aspectRatio === 'square' ? 512 : 800;
      const targetHeight = aspectRatio === 'square' ? 512 : aspectRatio === 'video' ? 450 : 400;

      canvas.width = targetSize;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      // Pindahkan origin ke tengah canvas untuk rotasi dan zoom
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotationDegree * Math.PI) / 180);
      ctx.scale(zoomLevel, zoomLevel);

      // Hitung cover drawing
      const imgRatio = img.width / img.height;
      const canvasRatio = canvas.width / canvas.height;
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;

      if (imgRatio > canvasRatio) {
        drawHeight = canvas.height;
        drawWidth = drawHeight * imgRatio;
      } else {
        drawWidth = canvas.width;
        drawHeight = drawWidth / imgRatio;
      }

      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();

      // Kompresi hasil ke webp atau jpeg berkualitas tinggi dengan ukuran ringan
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
      onChange(compressedDataUrl);
    };
    img.src = imageSrc;
  };

  const handleZoomChange = (newZoom: number) => {
    const clamped = Math.max(1, Math.min(3, newZoom));
    setZoom(clamped);
    if (rawImageSrc) {
      applyAdjustment(rawImageSrc, clamped, rotation);
    }
  };

  const handleRotate = () => {
    const newRot = (rotation + 90) % 360;
    setRotation(newRot);
    if (rawImageSrc) {
      applyAdjustment(rawImageSrc, zoom, newRot);
    }
  };

  const handleRemove = () => {
    setRawImageSrc(null);
    setUrlInput('');
    setIsAdjusting(false);
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    setRawImageSrc(urlInput.trim());
    onChange(urlInput.trim());
    setIsAdjusting(false);
  };

  const frameClasses =
    aspectRatio === 'square'
      ? 'w-36 h-36 sm:w-44 sm:h-44'
      : aspectRatio === 'video'
      ? 'w-full max-w-md aspect-video'
      : 'w-full max-w-md h-40';

  return (
    <div className="border border-line bg-bg p-5 relative space-y-4">
      <CornerCrosses />
      <canvas ref={canvasRef} className="hidden" />

      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-faint block">
            [ MEDIA ADJUSTER ]
          </span>
          <span className="font-mono text-xs font-bold text-ink uppercase">{label}</span>
        </div>

        <div className="flex border border-line bg-bg-raised font-mono text-[11px]">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1 flex items-center gap-1.5 transition-all ${
              activeTab === 'upload' ? 'bg-invert-bg text-invert-fg font-bold' : 'text-faint hover:text-ink'
            }`}
          >
            <Upload size={12} />
            <span>UPLOAD FILE</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-3 py-1 flex items-center gap-1.5 transition-all border-l border-line ${
              activeTab === 'url' ? 'bg-invert-bg text-invert-fg font-bold' : 'text-faint hover:text-ink'
            }`}
          >
            <LinkIcon size={12} />
            <span>EXTERNAL URL</span>
          </button>
        </div>
      </div>

      {/* Visual Workspace & Adjuster */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Left: Image Canvas Frame */}
        <div className="shrink-0 flex flex-col items-center gap-2">
          <div
            className={`relative border-2 border-dashed border-line bg-bg-raised overflow-hidden flex items-center justify-center ${frameClasses}`}
          >
            {value ? (
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover transition-transform duration-100"
              />
            ) : (
              <div className="text-center p-4">
                <ImageIcon size={32} className="mx-auto text-faint mb-2" />
                <span className="font-mono text-[10px] uppercase text-faint block">NO IMAGE SELECTED</span>
              </div>
            )}
          </div>

          {value && (
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1 text-[10px] font-mono uppercase text-red-500 hover:text-red-600 transition-colors"
            >
              <X size={12} />
              <span>REMOVE IMAGE</span>
            </button>
          )}
        </div>

        {/* Right: Controls & Adjuster Sliders */}
        <div className="flex-1 w-full space-y-4 font-mono text-xs">
          {activeTab === 'upload' ? (
            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  id="imageFileInput"
                />
                <label
                  htmlFor="imageFileInput"
                  className="inline-flex items-center gap-2 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-4 py-2 font-mono text-xs uppercase font-bold cursor-pointer transition-all shadow-xs"
                >
                  <Upload size={14} />
                  <span>{value ? 'PILIH FOTO LAIN / GANTI GAMBAR' : 'PILIH FOTO DARI KOMPUTER'}</span>
                </label>
                <span className="text-[10px] text-faint block mt-1.5">
                  Mendukung PNG, JPEG, WebP. Gambar otomatis disesuaikan dan dioptimasi.
                </span>
              </div>

              {rawImageSrc && (
                <div className="border border-line bg-bg-raised p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-line pb-2">
                    <span className="text-[10px] uppercase font-bold text-faint">
                      [ PENYESUAIAN & CROP GAMBAR ]
                    </span>
                    <button
                      type="button"
                      onClick={handleRotate}
                      className="flex items-center gap-1 border border-line bg-bg hover:bg-bg-sunken px-2 py-0.5 text-[10px] text-ink uppercase"
                    >
                      <RotateCw size={11} />
                      <span>ROTATE 90° ({rotation}°)</span>
                    </button>
                  </div>

                  {/* Zoom Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-faint">
                      <span className="flex items-center gap-1">
                        <ZoomIn size={12} /> SKALA / ZOOM:
                      </span>
                      <span className="font-bold text-ink">{zoom.toFixed(1)}x</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleZoomChange(zoom - 0.2)}
                        disabled={zoom <= 1}
                        className="p-1 border border-line bg-bg text-ink disabled:opacity-30"
                      >
                        <ZoomOut size={12} />
                      </button>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.05"
                        value={zoom}
                        onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                        className="flex-1 accent-ink cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => handleZoomChange(zoom + 0.2)}
                        disabled={zoom >= 3}
                        className="p-1 border border-line bg-bg text-ink disabled:opacity-30"
                      >
                        <ZoomIn size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-faint uppercase font-bold text-[10px]">
                PASTE DIRECT IMAGE URL (HTTPS):
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/... or /avatar.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 border border-line bg-bg p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                />
                <button
                  type="button"
                  onClick={handleUrlSubmit}
                  className="border border-line bg-invert-bg text-invert-fg px-4 py-2 font-bold uppercase"
                >
                  APPLY
                </button>
              </div>
              <span className="text-[10px] text-faint block">
                Jika memiliki URL Cloudinary atau CDN publik, tempelkan di atas.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

