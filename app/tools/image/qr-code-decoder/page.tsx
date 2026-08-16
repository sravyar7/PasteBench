'use client';

import { useState, useRef } from 'react';
import jsQR from 'jsqr';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';

export default function QrCodeDecoder() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);

  const decode = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('That file is not an image.');
      return;
    }

    setError('');
    setResult('');

    const url = URL.createObjectURL(file);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });

    const img = new Image();
    img.onload = () => {
      // jsQR reads raw RGBA, so the image has to go through a canvas first.
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        setError('Canvas is unavailable in this browser.');
        return;
      }
      ctx.drawImage(img, 0, 0);

      const { data, width, height } = ctx.getImageData(0, 0, img.width, img.height);
      const found = jsQR(data, width, height);

      if (found?.data) setResult(found.data);
      else setError('No QR code found in that image. A tighter crop usually helps.');
    };
    img.onerror = () => setError('That image could not be read.');
    img.src = url;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUrl = /^https?:\/\//i.test(result.trim());

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Image Tools', href: '/tools/image' }, { label: 'QR Code Decoder' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">QR Code Reader</h1>
        <p className="text-ink-muted max-w-2xl">
          Upload a QR image and read the text back out of it.
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
          decode(e.dataTransfer.files[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`border border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
          dragging
            ? 'border-accent bg-accent-soft'
            : 'border-line-strong hover:border-ink-subtle'
        }`}
      >
        <p className="text-[14px] mb-1">Drop a QR image, or click to choose one</p>
        <p className="text-[12.5px] text-ink-subtle">
          Decoding happens in this tab — the image is never uploaded
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => decode(e.target.files?.[0])}
          className="hidden"
        />
      </div>

      {preview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="panel p-4 space-y-3">
            <span className="eyebrow">Image</span>
            <div className="panel-sunken aspect-square grid place-items-center overflow-hidden">
              <img
                src={preview}
                alt="Uploaded QR code"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          <div className="panel p-4 space-y-3">
            <div className="flex items-center justify-between h-[30px]">
              <span className="eyebrow">Decoded</span>
              {result && (
                <button onClick={handleCopy} className="btn btn-secondary btn-sm">
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>
            <div className="panel-sunken p-4 min-h-[8rem] font-mono text-[13px] leading-relaxed break-all">
              {result ? (
                <span className="text-ink">{result}</span>
              ) : (
                <span className="text-ink-subtle">
                  {error ? 'Nothing decoded' : 'Waiting for an image'}
                </span>
              )}
            </div>
            {isUrl && (
              <a
                href={result}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="btn btn-secondary btn-sm"
              >
                Open link
              </a>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="panel p-4 text-[13px] text-red-700 dark:text-red-300 border-red-300 dark:border-red-900">
          {error}
        </div>
      )}

      {isUrl && (
        <p className="text-[13px] text-ink-muted">
          This code contains a link. Check where it points before opening it —
          QR codes are a common way to disguise a destination.
        </p>
      )}

      <AdContainer slot="1717171719" format="horizontal" />
    </div>
  );
}
