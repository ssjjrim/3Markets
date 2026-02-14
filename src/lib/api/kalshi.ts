import type { Market, KalshiMarket, KalshiEvent } from '@/lib/types';

const API_BASE = '/api/kalshi';

export async function fetchKalshiEvents(params?: {
  limit?: number;
  cursor?: string;
  status?: string;
  with_nested_markets?: boolean;
}): Promise<{ events: KalshiEvent[]; cursor: string }> {
  const searchParams = new URLSearchParams();
  searchParams.set('endpoint', 'events');
  searchParams.set('limit', String(params?.limit ?? 20));
  searchParams.set('with_nested_markets', String(params?.with_nested_markets ?? true));
  if (params?.cursor) searchParams.set('cursor', params.cursor);
  if (params?.status) searchParams.set('status', params.status);

  const res = await fetch(`${API_BASE}?${searchParams.toString()}`);
  if (!res.ok) throw new Error(`Kalshi API error: ${res.status}`);
  return res.json();
}

export async function fetchKalshiMarkets(params?: {
  limit?: number;
  cursor?: string;
  event_ticker?: string;
  status?: string;
}): Promise<{ markets: KalshiMarket[]; cursor: string }> {
  const searchParams = new URLSearchParams();
  searchParams.set('endpoint', 'markets');
  searchParams.set('limit', String(params?.limit ?? 20));
  if (params?.cursor) searchParams.set('cursor', params.cursor);
  if (params?.event_ticker) searchParams.set('event_ticker', params.event_ticker);
  if (params?.status) searchParams.set('status', params.status);

  const res = await fetch(`${API_BASE}?${searchParams.toString()}`);
  if (!res.ok) throw new Error(`Kalshi API error: ${res.status}`);
  return res.json();
}

export async function fetchKalshiMarket(ticker: string): Promise<{ market: KalshiMarket }> {
  const res = await fetch(`${API_BASE}?endpoint=markets/${ticker}`);
  if (!res.ok) throw new Error(`Kalshi market error: ${res.status}`);
  return res.json();
}

export function normalizeKalshiEvent(event: KalshiEvent): Market {
  const market = event.markets?.[0];
  const totalVolume = event.markets?.reduce((sum, m) => sum + (m.volume || 0), 0) || 0;

  let outcomes: { id: string; name: string; price: number; priceFormatted: string }[] = [];

  if (market) {
    const yesPrice = ((market.yes_bid || 0) + (market.yes_ask || 0)) / 2 / 100 || 0.5;
    const noPrice = ((market.no_bid || 0) + (market.no_ask || 0)) / 2 / 100 || 0.5;
    outcomes = [
      { id: `${market.ticker}-yes`, name: 'Yes', price: yesPrice, priceFormatted: `${(yesPrice * 100).toFixed(1)}¢` },
      { id: `${market.ticker}-no`, name: 'No', price: noPrice, priceFormatted: `${(noPrice * 100).toFixed(1)}¢` },
    ];
  }

  // For multi-market events, show each market as an outcome
  if (event.markets && event.markets.length > 1 && event.mutually_exclusive) {
    outcomes = event.markets.slice(0, 8).map((m) => {
      const price = ((m.yes_bid || 0) + (m.yes_ask || 0)) / 2 / 100 || 0;
      return {
        id: m.ticker,
        name: m.title?.replace(event.title, '').trim() || m.subtitle || m.ticker,
        price,
        priceFormatted: `${(price * 100).toFixed(1)}¢`,
      };
    });
  }

  return {
    id: event.event_ticker,
    slug: event.event_ticker.toLowerCase(),
    platform: 'kalshi',
    question: event.title,
    description: '',
    category: event.category || 'General',
    outcomes,
    volume: totalVolume,
    volumeFormatted: formatVol(totalVolume),
    liquidity: 0,
    endDate: market?.close_time || '',
    status: (market?.status === 'open' || market?.status === 'active') ? 'active' : 'closed',
    createdAt: '',
    url: `https://kalshi.com/markets/${event.event_ticker.toLowerCase()}`,
  };
}

export function normalizeKalshiMarket(market: KalshiMarket): Market {
  const yesPrice = ((market.yes_bid || 0) + (market.yes_ask || 0)) / 2 / 100 || 0.5;
  const noPrice = ((market.no_bid || 0) + (market.no_ask || 0)) / 2 / 100 || 0.5;

  return {
    id: market.ticker,
    slug: market.ticker.toLowerCase(),
    platform: 'kalshi',
    question: market.title,
    description: market.subtitle || '',
    category: market.category || 'General',
    outcomes: [
      { id: `${market.ticker}-yes`, name: 'Yes', price: yesPrice, priceFormatted: `${(yesPrice * 100).toFixed(1)}¢` },
      { id: `${market.ticker}-no`, name: 'No', price: noPrice, priceFormatted: `${(noPrice * 100).toFixed(1)}¢` },
    ],
    volume: market.volume || 0,
    volumeFormatted: formatVol(market.volume || 0),
    liquidity: market.open_interest || 0,
    endDate: market.close_time || '',
    status: (market.status === 'open' || market.status === 'active') ? 'active' : market.result ? 'resolved' : 'closed',
    resolution: market.result || undefined,
    createdAt: '',
    url: `https://kalshi.com/markets/${market.ticker.toLowerCase()}`,
  };
}

function formatVol(v: number): string {
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}
