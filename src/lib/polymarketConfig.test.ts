import { describe, expect, it } from 'vitest';

import { normalizePolymarketEvent } from '@/lib/api/polymarket';
import {
  isAllowedPolymarketReadEndpoint,
  normalizePolymarketQuery,
  POLYMARKET_CLOB_HOST,
  POLYMARKET_COLLATERAL_ASSET,
  POLYMARKET_DATA_HOST,
  POLYMARKET_GAMMA_HOST,
  resolvePolymarketHost,
} from '@/lib/polymarketConfig';
import { formatMarketCurrency, getPlatformCollateralAsset } from '@/lib/utils';
import type { PolymarketEvent } from '@/lib/types';

describe('Polymarket v2 config', () => {
  it('routes read-only endpoints to current public hosts', () => {
    expect(resolvePolymarketHost('events')).toBe(POLYMARKET_GAMMA_HOST);
    expect(resolvePolymarketHost('trades')).toBe(POLYMARKET_DATA_HOST);
    expect(resolvePolymarketHost('price')).toBe(POLYMARKET_CLOB_HOST);
    expect(resolvePolymarketHost('book')).toBe(POLYMARKET_CLOB_HOST);
  });

  it('blocks trading, auth, and traversal endpoints', () => {
    expect(isAllowedPolymarketReadEndpoint('markets/123')).toBe(true);
    expect(isAllowedPolymarketReadEndpoint('prices-history')).toBe(true);
    expect(isAllowedPolymarketReadEndpoint('order')).toBe(false);
    expect(isAllowedPolymarketReadEndpoint('auth/api-key')).toBe(false);
    expect(isAllowedPolymarketReadEndpoint('../order')).toBe(false);
  });

  it('normalizes prices-history token_id to market', () => {
    const params = normalizePolymarketQuery('prices-history', new URLSearchParams({ token_id: 'token-1' }));

    expect(params.get('market')).toBe('token-1');
    expect(params.has('token_id')).toBe(false);
  });

  it('uses pUSD for Polymarket market display', () => {
    expect(POLYMARKET_COLLATERAL_ASSET).toBe('pUSD');
    expect(getPlatformCollateralAsset('polymarket')).toBe('pUSD');
    expect(formatMarketCurrency(1_200, { platform: 'polymarket' })).toBe('1.2K pUSD');
  });

  it('marks normalized Polymarket events with pUSD collateral', () => {
    const event: PolymarketEvent = {
      id: 'event-1',
      slug: 'event-1',
      title: 'Will it rain?',
      description: 'Weather market',
      category: 'Weather',
      image: '',
      markets: [{
        id: 'market-1',
        question: 'Will it rain?',
        conditionId: 'condition-1',
        slug: 'market-1',
        outcomes: '["Yes","No"]',
        outcomePrices: '["0.42","0.58"]',
        volume: 1200,
        active: true,
        closed: false,
      }],
      volume: 1200,
      liquidity: 300,
      endDate: '2026-12-31T00:00:00Z',
      active: true,
      closed: false,
      tags: [{ label: 'weather' }],
    };

    const market = normalizePolymarketEvent(event);

    expect(market.collateralAsset).toBe('pUSD');
    expect(market.volumeFormatted).toBe('1.2K pUSD');
  });
});
