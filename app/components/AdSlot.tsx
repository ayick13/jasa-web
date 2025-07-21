'use client';

import { useEffect } from 'react';

// Tentukan tipe untuk props komponen
type AdSlotProps = {
  client: string;
  slot: string;
  className?: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
};

const AdSlot = ({ client, slot, className, format = 'auto', responsive = true }: AdSlotProps) => {
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
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      ></ins>
    </div>
  );
};

export default AdSlot;