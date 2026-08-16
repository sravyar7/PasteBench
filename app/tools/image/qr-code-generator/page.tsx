'use client';

import { useState, useEffect, useRef } from 'react';
import { useQueryParams } from '@/lib/useQueryParams';
import QRCode from 'qrcode';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdContainer from '@/components/shared/AdContainer';

const SIZES = [256, 512, 1024];

export default function QrCodeGenerator() {
  const searchParams = useQueryParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState('');
  const [size, setSize] = useState(512);
  const [margin, setMargin] = useState(2);
  const [error, setError] = useState('');

  useEffect(() => {
    const inputParam = searchParams.get('input');
    if (inputParam) {
      try {
        setText(decodeURIComponent(inputParam));
      } catch {
        // Ignore malformed encoding
      }
    }
  }, [searchParams]);

  // Redraw whenever the input or options change. Encoding happens in this
  // tab — no request leaves the browser.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!text.trim()) {
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      setError('');
      return;
    }

    QRCode.toCanvas(
      canvas,
      text,
      {
        width: size,
        margin,
        errorCorrectionLevel: 'M',
        color: { dark: '#000000', light: '#ffffff' },
      },
      (err) => setError(err ? 'That input is too long to encode as a QR code.' : '')
    );
  }, [text, size, margin]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas || !text.trim()) return;
    const link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Image Tools', href: '/tools/image' }, { label: 'QR Code Generator' }]} />

      <div>
        <h1 className="headline text-[2rem] mb-2.5">QR Code Generator</h1>
        <p className="text-ink-muted max-w-2xl">
          Encode a link or a note into a QR code you can download and print.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-[13px] font-medium mb-2 block">Content</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="A URL, a note, a wifi string — anything"
              className="field h-40"
            />
          </div>

          <div className="panel p-4 space-y-4">
            <label className="flex items-center justify-between gap-3">
              <span className="text-[13px] font-medium">Size</span>
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="select"
              >
                {SIZES.map((s) => (
                  <option key={s} value={s}>{s} × {s}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center justify-between gap-3">
              <span className="text-[13px] font-medium">Quiet zone</span>
              <select
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="select"
              >
                <option value={0}>None</option>
                <option value={2}>Normal</option>
                <option value={4}>Wide</option>
              </select>
            </label>
          </div>

          <button onClick={download} disabled={!text.trim()} className="btn btn-primary">
            Download PNG
          </button>
        </div>

        <div className="space-y-3">
          <span className="text-[13px] font-medium">Preview</span>
          <div className="panel-sunken aspect-square grid place-items-center p-6">
            {text.trim() ? (
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full rounded-lg"
              />
            ) : (
              <p className="text-ink-subtle text-[13px]">
                The code appears here as you type
              </p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="panel p-4 text-[13px] text-red-700 dark:text-red-300 border-red-300 dark:border-red-900">
          {error}
        </div>
      )}

      <AdContainer slot="1515151515" format="horizontal" />
    </div>
  );
}
