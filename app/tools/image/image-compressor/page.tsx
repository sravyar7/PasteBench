'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';

type Result = {
  url: string;
  bytes: number;
  width: number;
  height: number;
};

const FORMATS = [
  { value: 'image/webp', label: 'WebP' },
  { value: 'image/jpeg', label: 'JPEG' },
  { value: 'image/png', label: 'PNG' },
];

/**
 * Pick the output format from what was dropped in.
 *
 * Defaulting everything to JPEG inflates the common case: screenshots and
 * graphics are PNGs, and JPEG handles their flat colour and hard edges
 * badly enough to come out *larger* than the source. WebP beats both on
 * that material, so PNG input starts there; photographs already in JPEG
 * stay JPEG, where re-encoding is a straightforward win.
 */
function defaultFormatFor(type: string): string {
  if (type === 'image/jpeg') return 'image/jpeg';
  if (type === 'image/webp') return 'image/webp';
  return 'image/webp';
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageCompressor() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState<Result | null>(null);
  const [output, setOutput] = useState<Result | null>(null);
  const [quality, setQuality] = useState(0.75);
  const [format, setFormat] = useState('image/webp');
  const [formatTouched, setFormatTouched] = useState(false);
  const [maxWidth, setMaxWidth] = useState(0); // 0 = keep original
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  const accept = (picked: File | undefined) => {
    if (!picked) return;
    if (!picked.type.startsWith('image/')) {
      setError('That file is not an image.');
      return;
    }
    setError('');
    setFile(picked);
    // Only until the user picks for themselves — after that, respect it.
    if (!formatTouched) setFormat(defaultFormatFor(picked.type));
  };

  // Read the original once per file so the comparison has a baseline.
  useEffect(() => {
    if (!file) {
      setSource(null);
      setOutput(null);
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () =>
      setSource({ url, bytes: file.size, width: img.width, height: img.height });
    img.onerror = () => {
      setError('That image could not be read.');
      URL.revokeObjectURL(url);
    };
    img.src = url;

    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Re-encode through a canvas. Everything stays in this tab; the bytes
  // never touch a server.
  const compress = useCallback(() => {
    if (!file || !source) return;
    setBusy(true);

    const img = new Image();
    img.onload = () => {
      const scale =
        maxWidth > 0 && img.width > maxWidth ? maxWidth / img.width : 1;
      const width = Math.round(img.width * scale);
      const height = Math.round(img.height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Canvas is unavailable in this browser.');
        setBusy(false);
        return;
      }

      // JPEG has no alpha channel — without a white ground, transparent
      // PNGs re-encode with black fringing.
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError('Re-encoding failed.');
            setBusy(false);
            return;
          }
          setOutput((prev) => {
            if (prev) URL.revokeObjectURL(prev.url);
            return {
              url: URL.createObjectURL(blob),
              bytes: blob.size,
              width,
              height,
            };
          });
          setBusy(false);
        },
        format,
        // PNG ignores the quality argument; it is lossless by definition.
        format === 'image/png' ? undefined : quality
      );
    };
    img.onerror = () => {
      setError('That image could not be read.');
      setBusy(false);
    };
    img.src = source.url;
  }, [file, source, quality, format, maxWidth]);

  useEffect(() => {
    if (source) compress();
  }, [source, compress]);

  const download = () => {
    if (!output || !file) return;
    const ext = format.split('/')[1].replace('jpeg', 'jpg');
    const base = file.name.replace(/\.[^.]+$/, '');
    const link = document.createElement('a');
    link.href = output.url;
    link.download = `${base}-compressed.${ext}`;
    link.click();
  };

  const saved =
    source && output ? Math.round((1 - output.bytes / source.bytes) * 100) : 0;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Image Tools', href: '/tools/image' }, { label: 'Image Compressor' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">Image Compressor</h1>
        <p className="text-ink-muted max-w-2xl">
          Shrink JPG and PNG files before you ship them. Nothing is uploaded.
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          accept(e.dataTransfer.files[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`border border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
          dragging
            ? 'border-accent bg-accent-soft'
            : 'border-line-strong hover:border-ink-subtle'
        }`}
      >
        <p className="text-[14px] mb-1">
          {file ? file.name : 'Drop an image, or click to choose one'}
        </p>
        <p className="text-[12.5px] text-ink-subtle">
          JPG, PNG, WebP, GIF — it stays on your machine
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => accept(e.target.files?.[0])}
          className="hidden"
        />
      </div>

      {error && (
        <div className="panel p-4 text-[13px] text-red-700 dark:text-red-300 border-red-300 dark:border-red-900">
          {error}
        </div>
      )}

      {source && (
        <>
          <div className="panel p-5 space-y-5">
            <label className="flex items-center justify-between gap-3">
              <span className="text-[13px] font-medium">Format</span>
              <select
                value={format}
                onChange={(e) => {
                  setFormat(e.target.value);
                  setFormatTouched(true);
                }}
                className="select"
              >
                {FORMATS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </label>

            {format !== 'image/png' && (
              <div className="hairline pt-5">
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="q" className="text-[13px] font-medium">
                    Quality
                  </label>
                  <span className="font-mono text-[13px] tabular-nums">
                    {Math.round(quality * 100)}%
                  </span>
                </div>
                <input
                  id="q"
                  type="range"
                  min={10}
                  max={100}
                  value={Math.round(quality * 100)}
                  onChange={(e) => setQuality(Number(e.target.value) / 100)}
                  className="w-full accent-[var(--ink)]"
                />
              </div>
            )}

            <label className="hairline pt-5 flex items-center justify-between gap-3">
              <span className="text-[13px] font-medium">Max width</span>
              <select
                value={maxWidth}
                onChange={(e) => setMaxWidth(Number(e.target.value))}
                className="select"
              >
                <option value={0}>Keep original</option>
                {[2048, 1600, 1200, 800, 400].map((w) => (
                  <option key={w} value={w}>{w} px</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Original', data: source },
              { label: busy ? 'Compressing' : 'Compressed', data: output },
            ].map(({ label, data }) => (
              <div key={label} className="panel p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="eyebrow">{label}</span>
                  {data && (
                    <span className="font-mono text-[11px] text-ink-subtle tabular-nums">
                      {data.width} × {data.height}
                    </span>
                  )}
                </div>
                <div className="panel-sunken aspect-video grid place-items-center overflow-hidden">
                  {data ? (
                    <img
                      src={data.url}
                      alt={label}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <span className="text-ink-subtle text-[13px]">…</span>
                  )}
                </div>
                <p className="font-mono text-[13px] tabular-nums">
                  {data ? formatBytes(data.bytes) : '—'}
                </p>
              </div>
            ))}
          </div>

          {output && (
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={download} className="btn btn-primary">
                Download
              </button>
              <span className="font-mono text-[12.5px] text-ink-muted tabular-nums">
                {saved > 0
                  ? `${saved}% smaller — ${formatBytes(source.bytes - output.bytes)} saved`
                  : saved === 0
                  ? 'Same size as the original'
                  : `${Math.abs(saved)}% larger at these settings`}
              </span>
            </div>
          )}

          {output && saved <= 0 && (
            <p className="text-[13px] text-ink-muted">
              This encoding is not helping. WebP usually wins on screenshots
              and flat graphics; JPEG on photographs. Lowering the quality or
              capping the width will also bring it down.
            </p>
          )}
        </>
      )}

      <AdContainer slot="1717171718" format="horizontal" />
    </div>
  );
}
