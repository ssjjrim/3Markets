'use client';

import { useState } from 'react';
import { useMarkets } from '@/lib/hooks/useMarkets';
import MarketList from '@/components/market/MarketList';
import PlatformFilter from '@/components/market/PlatformFilter';
import type { Platform, MarketFilter } from '@/lib/types';

export default function MarketsPage() {
  const [filter, setFilter] = useState<MarketFilter>({
    platform: 'all',
    status: 'active',
    sortBy: 'volume',
    search: '',
  });

  const { markets, isLoading } = useMarkets(filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">All Markets</h1>
        <p className="text-text-secondary text-sm">
          Browse prediction markets across all platforms
        </p>
      </div>

      <PlatformFilter
        activePlatform={filter.platform || 'all'}
        onPlatformChange={(p: Platform | 'all') => setFilter((f) => ({ ...f, platform: p }))}
        search={filter.search || ''}
        onSearchChange={(s: string) => setFilter((f) => ({ ...f, search: s }))}
        sortBy={filter.sortBy || 'volume'}
        onSortChange={(s: string) => setFilter((f) => ({ ...f, sortBy: s as MarketFilter['sortBy'] }))}
      />

      <MarketList markets={markets} isLoading={isLoading} />
    </div>
  );
}
