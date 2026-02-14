'use client';

import type { Platform } from '@/lib/types';

const config: Record<Platform, { label: string; className: string }> = {
  polymarket: {
    label: 'Polymarket',
    className: 'bg-polymarket/15 text-[#818cf8] border border-polymarket/30',
  },
  kalshi: {
    label: 'Kalshi',
    className: 'bg-kalshi/15 text-[#22d3ee] border border-kalshi/30',
  },
  opinion: {
    label: 'Opinion',
    className: 'bg-opinion/15 text-[#fb923c] border border-opinion/30',
  },
};

export default function PlatformBadge({ platform }: { platform: Platform }) {
  const c = config[platform];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md ${c.className}`}>
      {c.label}
    </span>
  );
}
