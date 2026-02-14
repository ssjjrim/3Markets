'use client';

import { useState } from 'react';
import { useMarkets } from '@/lib/hooks/useMarkets';
import MarketList from '@/components/market/MarketList';
import PlatformFilter from '@/components/market/PlatformFilter';
import type { Platform, MarketFilter } from '@/lib/types';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

export default function Dashboard() {
  const [filter, setFilter] = useState<MarketFilter>({
    platform: 'all',
    status: 'active',
    sortBy: 'volume',
    search: '',
  });

  const { markets, isLoading } = useMarkets(filter);

  const stats = {
    totalMarkets: markets.length,
    polymarketCount: markets.filter((m) => m.platform === 'polymarket').length,
    kalshiCount: markets.filter((m) => m.platform === 'kalshi').length,
    opinionCount: markets.filter((m) => m.platform === 'opinion').length,
    totalVolume: markets.reduce((sum, m) => sum + m.volume, 0),
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div>
        <h1 className="text-2xl font-bold mb-1">Prediction Markets</h1>
        <p className="text-text-secondary text-sm">
          Aggregated markets from Polymarket, Kalshi, and Opinion
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-bg-card border border-border-primary rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={14} className="text-accent-indigo" />
            <span className="text-xs text-text-muted">Total Markets</span>
          </div>
          <div className="text-xl font-bold">{isLoading ? '-' : stats.totalMarkets}</div>
        </div>
        <div className="bg-bg-card border border-border-primary rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-pm-green" />
            <span className="text-xs text-text-muted">Total Volume</span>
          </div>
          <div className="text-xl font-bold">
            {isLoading ? '-' : stats.totalVolume >= 1e6 ? `$${(stats.totalVolume / 1e6).toFixed(1)}M` : `$${(stats.totalVolume / 1e3).toFixed(0)}K`}
          </div>
        </div>
        <div className="bg-bg-card border border-border-primary rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={14} className="text-accent-cyan" />
            <span className="text-xs text-text-muted">Platforms</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 text-xs rounded bg-polymarket/15 text-[#818cf8]">{stats.polymarketCount}</span>
            <span className="px-2 py-0.5 text-xs rounded bg-kalshi/15 text-[#22d3ee]">{stats.kalshiCount}</span>
            <span className="px-2 py-0.5 text-xs rounded bg-opinion/15 text-[#fb923c]">{stats.opinionCount}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <PlatformFilter
        activePlatform={filter.platform || 'all'}
        onPlatformChange={(platform: Platform | 'all') => setFilter((f) => ({ ...f, platform }))}
        search={filter.search || ''}
        onSearchChange={(search: string) => setFilter((f) => ({ ...f, search }))}
        sortBy={filter.sortBy || 'volume'}
        onSortChange={(sortBy: string) => setFilter((f) => ({ ...f, sortBy: sortBy as MarketFilter['sortBy'] }))}
      />

      {/* Market List */}
      <MarketList markets={markets} isLoading={isLoading} />
    </div>
  );
}
