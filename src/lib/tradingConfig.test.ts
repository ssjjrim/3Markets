import { describe, expect, it } from 'vitest';

import {
  createBuilderOrderPayload,
  getTradingRuntimeConfig,
  parseRealTradingFlag,
  postRealOrderNoop,
  RealTradingDisabledError,
} from '@/lib/tradingConfig';

describe('trading guard', () => {
  it('defaults real trading to disabled', () => {
    expect(parseRealTradingFlag(undefined)).toBe(false);
    expect(getTradingRuntimeConfig({})).toMatchObject({
      realTradingEnabled: false,
      mode: 'read-only-noop',
      collateralAsset: 'pUSD',
      builderCode: null,
    });
  });

  it('keeps the order path as a no-op even when a request is supplied', async () => {
    await expect(postRealOrderNoop({
      tokenId: 'token-1',
      side: 'BUY',
      amountPusd: 10,
      price: 0.42,
      builderCode: 'builder-1',
      idempotencyKey: 'intent-1',
    })).rejects.toBeInstanceOf(RealTradingDisabledError);
  });

  it('puts builderCode on the v2 order payload instead of headers', () => {
    const payload = createBuilderOrderPayload({
      tokenId: 'token-1',
      side: 'BUY',
      amountPusd: 10,
      price: 0.42,
      builderCode: 'builder-1',
    });

    expect(payload).toEqual({
      tokenID: 'token-1',
      side: 'BUY',
      price: 0.42,
      size: 10,
      builderCode: 'builder-1',
    });
    expect(JSON.stringify(payload)).not.toContain('X-Builder-Code');
    expect(JSON.stringify(payload)).not.toContain('POLY_BUILDER');
  });
});
