import type { Market, PolymarketEvent } from '@/lib/types';
import { POLYMARKET_COLLATERAL_ASSET } from '@/lib/polymarketConfig';
import { formatCollateralAmount } from '@/lib/utils';

const API_BASE = '/api/polymarket';

export async function fetchPolymarketEvents(params?: {
  limit?: number;
  offset?: number;
  active?: boolean;
  closed?: boolean;
  tag?: string;
  slug?: string;
  order?: string;
  ascending?: boolean;
}): Promise<PolymarketEvent[]> {
  const searchParams = new URLSearchParams();
  searchParams.set('endpoint', 'events');
  searchParams.set('limit', String(params?.limit ?? 20));
  searchParams.set('offset', String(params?.offset ?? 0));
  // Sort by volume descending by default for trending markets
  searchParams.set('order', params?.order ?? 'volume');
  searchParams.set('ascending', String(params?.ascending ?? false));
  if (params?.active !== undefined) searchParams.set('active', String(params.active));
  if (params?.closed !== undefined) searchParams.set('closed', String(params.closed));
  if (params?.tag) searchParams.set('tag', params.tag);
  if (params?.slug) searchParams.set('slug', params.slug);

  const res = await fetch(`${API_BASE}?${searchParams.toString()}`);
  if (!res.ok) throw new Error(`Polymarket API error: ${res.status}`);
  return res.json();
}

export async function fetchPolymarketEvent(slug: string): Promise<PolymarketEvent | null> {
  const events = await fetchPolymarketEvents({ slug, limit: 1 });
  return events?.[0] ?? null;
}

export async function fetchPolymarketMarketById(conditionId: string) {
  const res = await fetch(`${API_BASE}?endpoint=markets/${conditionId}`);
  if (!res.ok) throw new Error(`Polymarket market error: ${res.status}`);
  return res.json();
}

export function normalizePolymarketEvent(event: PolymarketEvent): Market {
  const market = event.markets?.[0];
  let outcomes: { id: string; name: string; price: number; priceFormatted: string }[] = [];

  if (market) {
    try {
      const names = JSON.parse(market.outcomes || '[]');
      const prices = JSON.parse(market.outcomePrices || '[]');
      outcomes = names.map((name: string, i: number) => ({
        id: `${market.id}-${i}`,
        name,
        price: parseFloat(prices[i] || '0'),
        priceFormatted: `${(parseFloat(prices[i] || '0') * 100).toFixed(1)}¢`,
      }));
    } catch {
      outcomes = [];
    }
  }

  return {
    id: event.id,
    slug: event.slug,
    platform: 'polymarket',
    collateralAsset: POLYMARKET_COLLATERAL_ASSET,
    question: event.title,
    description: event.description || '',
    category: event.category || 'General',
    image: event.image,
    outcomes,
    volume: event.volume || 0,
    volumeFormatted: formatCollateralAmount(event.volume || 0, POLYMARKET_COLLATERAL_ASSET),
    liquidity: event.liquidity || 0,
    endDate: event.endDate || '',
    status: event.closed ? 'closed' : event.active ? 'active' : 'closed',
    createdAt: event.createdAt || '',
    url: `https://polymarket.com/event/${event.slug}`,
    tags: event.tags?.map(t => t.label) || [],
  };
}
