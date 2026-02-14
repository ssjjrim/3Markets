'use client';

import useSWR from 'swr';
import type { Market, MarketFilter } from '@/lib/types';
import { fetchAllMarkets } from '@/lib/api';

const REFRESH_INTERVAL = 15_000; // 15 seconds - keep data fresh

export function useMarkets(filter?: MarketFilter) {
  const key = filter ? `markets-${JSON.stringify(filter)}` : 'markets-all';

  const { data, error, isLoading, mutate } = useSWR<Market[]>(
    key,
    () => fetchAllMarkets(filter),
    {
      refreshInterval: REFRESH_INTERVAL,
      revalidateOnFocus: true,
      dedupingInterval: 5_000,
    }
  );

  return {
    markets: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}

export function useMarketsByPlatform(platform: 'polymarket' | 'kalshi' | 'opinion') {
  return useMarkets({ platform, status: 'active', sortBy: 'volume' });
}
