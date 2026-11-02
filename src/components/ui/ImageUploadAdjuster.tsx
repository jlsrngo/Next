import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  X,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Image as ImageIcon,
  Link as LinkIcon,
  Move,
  RotateCcw,
} from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { useLocale } from '@/context/I18nContext';

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
  label = 'FOTO PROFIL / AVATAR',
}: ImageUploadAdjusterProps) {
  const locale = useLocale();
  const isId = locale === 'id';

  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(value || null);
  const [imgNaturalSize, setImgNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [urlInput, setUrlInput] = useState<string>(value?.startsWith('http') ? value : '');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const currentPanRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    currentPanRef.current = pan;
  }, [pan]);

  useEffect(() => {
    if (value && !rawImageSrc) {
      setRawImageSrc(value);
      if (value.startsWith('http')) {
        setUrlInput(value);
      }
    }
  }, [value, rawImageSrc]);

  // Load natural dimensions whenever raw image source changes
  useEffect(() => {
    if (!rawImageSrc) {
      setImgNaturalSize(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImgNaturalSize({
        width: img.naturalWidth || img.width || 500,
        height: img.naturalHeight || img.height || 500,
      });
    };
    img.src = rawImageSrc;
  }, [rawImageSrc]);

  // Calculate pan clamp boundary so image always 100% covers the container with ZERO blank margin
  const getClampedPan = useCallback(
    (
      targetPan: { x: number; y: number },
      currentZoom: number = zoom,
      currentRot: number = rotation
    ) => {
      if (!frameRef.current || !imgNaturalSize) return targetPan;

      const frameW = frameRef.current.clientWidth || 320;
      const frameH = frameRef.current.clientHeight || 320;

      // Handle 90° and 270° aspect rotation
      const isRotated90 = currentRot % 180 !== 0;
      const naturalW = isRotated90 ? imgNaturalSize.height : imgNaturalSize.width;
      const naturalH = isRotated90 ? imgNaturalSize.width : imgNaturalSize.height;

      // Object cover calculation
      const coverScale = Math.max(frameW / naturalW, frameH / naturalH) * currentZoom;
      const renderedW = naturalW * coverScale;
      const renderedH = naturalH * coverScale;

      const maxPanX = Math.max(0, (renderedW - frameW) / 2);
      const maxPanY = Math.max(0, (renderedH - frameH) / 2);

      return {
        x: Math.max(-maxPanX, Math.min(maxPanX, targetPan.x)),
        y: Math.max(-maxPanY, Math.min(maxPanY, targetPan.y)),
      };
    },
    [zoom, rotation, imgNaturalSize]
  );

  const applyAdjustment = (
    imageSrc: string,
    zoomLevel: number,
    rotationDegree: number,
    panOffset: { x: number; y: number } = currentPanRef.current
  ) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      const targetSize = aspectRatio === 'square' ? 600 : 800;
      const targetHeight = aspectRatio === 'square' ? 600 : aspectRatio === 'video' ? 450 : 400;

      canvas.width = targetSize;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      const frameWidth = frameRef.current ? frameRef.current.clientWidth : 320;
      const scaleRatio = canvas.width / (frameWidth || 1);

      ctx.translate(
        canvas.width / 2 + panOffset.x * scaleRatio,
        canvas.height / 2 + panOffset.y * scaleRatio
      );
      ctx.rotate((rotationDegree * Math.PI) / 180);
      ctx.scale(zoomLevel, zoomLevel);

      const isRotated90 = rotationDegree % 180 !== 0;
      const naturalW = isRotated90 ? img.height : img.width;
      const naturalH = isRotated90 ? img.width : img.height;

      const coverScale = Math.max(canvas.width / naturalW, canvas.height / naturalH);
      const drawWidth = img.width * coverScale;
      const drawHeight = img.height * coverScale;

      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();

      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      onChange(compressedDataUrl);
    };
    img.src = imageSrc;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(isId ? 'Hanya file gambar (JPEG, PNG, WebP) yang diizinkan.' : 'Only image files (JPEG, PNG, WebP) are permitted.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setRawImageSrc(result);
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
      applyAdjustment(result, 1, 0, { x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const handleZoomChange = (newZoom: number) => {
    const clamped = Math.max(1, Math.min(4, +newZoom.toFixed(2)));
    setZoom(clamped);
    const boundedPan = getClampedPan(pan, clamped, rotation);
    setPan(boundedPan);
    if (rawImageSrc) {
      applyAdjustment(rawImageSrc, clamped, rotation, boundedPan);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!rawImageSrc) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    handleZoomChange(zoom + delta);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!rawImageSrc) return;
    isDraggingRef.current = true;
    startPosRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !rawImageSrc) return;
    const rawX = e.clientX - startPosRef.current.x;
    const rawY = e.clientY - startPosRef.current.y;
    const boundedPan = getClampedPan({ x: rawX, y: rawY }, zoom, rotation);
    setPan(boundedPan);
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current && rawImageSrc) {
      isDraggingRef.current = false;
      const boundedPan = getClampedPan(pan, zoom, rotation);
      setPan(boundedPan);
      applyAdjustment(rawImageSrc, zoom, rotation, boundedPan);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!rawImageSrc || e.touches.length === 0) return;
    isDraggingRef.current = true;
    const touch = e.touches[0];
    startPosRef.current = { x: touch.clientX - pan.x, y: touch.clientY - pan.y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !rawImageSrc || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rawX = touch.clientX - startPosRef.current.x;
    const rawY = touch.clientY - startPosRef.current.y;
    const boundedPan = getClampedPan({ x: rawX, y: rawY }, zoom, rotation);
    setPan(boundedPan);
  };

  const handleTouchEnd = () => {
    if (isDraggingRef.current && rawImageSrc) {
      isDraggingRef.current = false;
      const boundedPan = getClampedPan(pan, zoom, rotation);
      setPan(boundedPan);
      applyAdjustment(rawImageSrc, zoom, rotation, boundedPan);
    }
  };

  const handleRotate = () => {
    const newRot = (rotation + 90) % 360;
    setRotation(newRot);
    const boundedPan = getClampedPan(pan, zoom, newRot);
    setPan(boundedPan);
    if (rawImageSrc) {
      applyAdjustment(rawImageSrc, zoom, newRot, boundedPan);
    }
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
    if (rawImageSrc) {
      applyAdjustment(rawImageSrc, 1, 0, { x: 0, y: 0 });
    }
  };

  const handleRemove = () => {
    setRawImageSrc(null);
    setUrlInput('');
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    setRawImageSrc(urlInput.trim());
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
    onChange(urlInput.trim());
  };

  // Enlarge preview box size (half-screen width on desktop / balanced)
  const frameClasses =
    aspectRatio === 'square'
      ? 'w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96'
      : aspectRatio === 'video'
      ? 'w-full max-w-xl aspect-video'
      : 'w-full max-w-xl h-48 sm:h-64';

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
            <span>{isId ? 'UNGGAH FILE' : 'UPLOAD FILE'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-3 py-1 flex items-center gap-1.5 transition-all border-l border-line ${
              activeTab === 'url' ? 'bg-invert-bg text-invert-fg font-bold' : 'text-faint hover:text-ink'
            }`}
          >
            <LinkIcon size={12} />
            <span>URL EXTERNAL</span>
          </button>
        </div>
      </div>

      {/* Visual Workspace & Adjuster */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
        {/* Left: Enlarged Image Canvas Frame */}
        <div className="shrink-0 flex flex-col items-center gap-2">
          <div
            ref={frameRef}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`relative border-2 border-dashed border-line bg-bg-raised overflow-hidden flex items-center justify-center select-none shadow-xs ${
              rawImageSrc ? 'cursor-grab active:cursor-grabbing' : ''
            } ${frameClasses}`}
            title={rawImageSrc ? (isId ? 'Scroll untuk zoom · Drag untuk geser posisi' : 'Scroll to zoom · Drag to pan') : undefined}
          >
            {rawImageSrc ? (
              <div className="w-full h-full relative overflow-hidden flex items-center justify-center pointer-events-none">
                <img
                  src={rawImageSrc}
                  alt="Preview"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
                    transformOrigin: 'center center',
                  }}
                  className="w-full h-full object-cover transition-transform duration-75"
                  draggable={false}
                />
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-mono px-2 py-0.5 tracking-wider uppercase pointer-events-none flex items-center gap-1 border border-white/20">
                  <Move size={9} />
                  <span>{zoom.toFixed(1)}x · {isId ? 'GESER / ZOOM' : 'PAN / ZOOM'}</span>
                </div>
              </div>
            ) : (
              <div className="text-center p-6">
                <ImageIcon size={36} className="mx-auto text-faint mb-2" />
                <span className="font-mono text-xs uppercase text-faint block">
                  {isId ? 'BELUM ADA GAMBAR' : 'NO IMAGE SELECTED'}
                </span>
              </div>
            )}
          </div>

          {rawImageSrc && (
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1 text-[10px] font-mono uppercase text-red-500 hover:text-red-600 transition-colors mt-1"
            >
              <X size={12} />
              <span>{isId ? 'HAPUS GAMBAR' : 'REMOVE IMAGE'}</span>
            </button>
          )}
        </div>

        {/* Right: Compact Controls (width constrained, not stretched across whole screen) */}
        <div className="w-full lg:max-w-md xl:max-w-lg space-y-4 font-mono text-xs">
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
                  <span>{rawImageSrc ? (isId ? 'PILIH FOTO LAIN / GANTI GAMBAR' : 'CHOOSE OTHER IMAGE') : (isId ? 'PILIH FOTO DARI KOMPUTER' : 'CHOOSE IMAGE FROM COMPUTER')}</span>
                </label>
                <span className="text-[10px] text-faint block mt-1.5 leading-relaxed">
                  {isId
                    ? 'Mendukung PNG, JPEG, WebP. Scroll mouse di dalam foto untuk zoom in/out, drag/seret untuk mengatur posisi tanpa celah kosong.'
                    : 'Supports PNG, JPEG, WebP. Mouse scroll to zoom, drag to pan within frame boundaries.'}
                </span>
              </div>

              {rawImageSrc && (
                <div className="border border-line bg-bg-raised p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-line pb-2 flex-wrap gap-2">
                    <span className="text-[10px] uppercase font-bold text-faint">
                      {isId ? '[ PENYESUAIAN & CROP GAMBAR ]' : '[ IMAGE CROP & ADJUSTMENT ]'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="flex items-center gap-1 border border-line bg-bg hover:bg-bg-sunken px-2.5 py-1 text-[10px] text-ink uppercase"
                        title={isId ? 'Reset zoom & posisi' : 'Reset zoom & position'}
                      >
                        <RotateCcw size={11} />
                        <span>RESET</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleRotate}
                        className="flex items-center gap-1 border border-line bg-bg hover:bg-bg-sunken px-2.5 py-1 text-[10px] text-ink uppercase"
                      >
                        <RotateCw size={11} />
                        <span>PUTAR 90° ({rotation}°)</span>
                      </button>
                    </div>
                  </div>

                  {/* Zoom Slider (Compact width, clean brutalist UI) */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[10px] text-faint">
                      <span className="flex items-center gap-1">
                        <ZoomIn size={12} /> {isId ? 'SKALA / ZOOM:' : 'SCALE / ZOOM:'}
                      </span>
                      <span className="font-bold text-ink">{zoom.toFixed(1)}x</span>
                    </div>
                    <div className="flex items-center gap-2 max-w-sm">
                      <button
                        type="button"
                        onClick={() => handleZoomChange(zoom - 0.2)}
                        disabled={zoom <= 1}
                        className="p-1 border border-line bg-bg text-ink disabled:opacity-30 hover:bg-bg-sunken"
                      >
                        <ZoomOut size={12} />
                      </button>
                      <input
                        type="range"
                        min="1"
                        max="4"
                        step="0.05"
                        value={zoom}
                        onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                        className="flex-1 accent-ink cursor-pointer h-1.5"
                      />
                      <button
                        type="button"
                        onClick={() => handleZoomChange(zoom + 0.2)}
                        disabled={zoom >= 4}
                        className="p-1 border border-line bg-bg text-ink disabled:opacity-30 hover:bg-bg-sunken"
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
              <label className="text-[10px] uppercase font-bold text-faint block">
                {isId ? 'TEMPEL URL GAMBAR LANGSUNG:' : 'PASTE DIRECT IMAGE URL:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 border border-line bg-bg px-3 py-2 text-xs font-mono text-ink placeholder:text-faint focus:outline-hidden focus:border-line-strong"
                />
                <button
                  type="button"
                  onClick={handleUrlSubmit}
                  className="border border-line bg-invert-bg text-invert-fg px-4 py-2 font-mono text-xs uppercase font-bold hover:opacity-90 transition-all shrink-0"
                >
                  LOAD URL
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
