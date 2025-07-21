'use client';

import { useEffect } from 'react';

// Tentukan tipe untuk props komponen
type AdSlotProps = {
  client: string;
  slot: string;
  className?: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal' | 'fluid';
  responsive?: boolean;
  layout?: string;
};

const AdSlot = ({ client, slot, className, format = 'auto', responsive = true, layout }: AdSlotProps) => {
  useEffect(() => {
    try {
      // Mendorong iklan ke slot yang tersedia
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error('Gagal menjalankan skrip AdSense:', err);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: layout ? 'center' : undefined }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
        {...(layout ? { 'data-ad-layout': layout } : {})}
      ></ins>
    </div>
  );
};

export default AdSlot;