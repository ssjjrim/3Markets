'use client';

import type { Market } from '@/lib/types';
import MarketCard from './MarketCard';
import LoadingCard from '@/components/common/LoadingCard';

interface MarketListProps {
  markets: Market[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function MarketList({ markets, isLoading, emptyMessage }: MarketListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    );
  }

  if (!markets.length) {
    return (
      <div className="text-center py-16 text-text-muted">
        <p className="text-lg font-medium mb-1">{emptyMessage || 'No markets found'}</p>
        <p className="text-sm">Try adjusting your filters or check back later</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {markets.map((market) => (
        <MarketCard key={`${market.platform}-${market.id}`} market={market} />
      ))}
    </div>
  );
}
