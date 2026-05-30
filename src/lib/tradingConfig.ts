import { POLYMARKET_COLLATERAL_ASSET } from '@/lib/polymarketConfig';

export const REAL_TRADING_ENV_KEY = 'REAL_TRADING_ENABLED';
export const REAL_TRADING_DEFAULT_ENABLED = false;
export const TRADING_MODE = 'read-only-noop';
export const DEFAULT_BUILDER_CODE: string | null = null;

export type TradingSide = 'BUY' | 'SELL';

export interface NoopTradeRequest {
  tokenId: string;
  side: TradingSide;
  amountPusd: number;
  price: number;
  builderCode?: string | null;
  idempotencyKey?: string;
}

export interface BuilderOrderPayload {
  tokenID: string;
  side: TradingSide;
  price: number;
  size: number;
  builderCode?: string;
}

export class RealTradingDisabledError extends Error {
  readonly code = 'real_trading_disabled';

  constructor() {
    super('Real trading is disabled. REAL_TRADING_ENABLED defaults to false and this app only exposes a no-op order path.');
    this.name = 'RealTradingDisabledError';
  }
}

export function parseRealTradingFlag(value: string | undefined | null): boolean {
  if (value == null) return REAL_TRADING_DEFAULT_ENABLED;
  return value.trim().toLowerCase() === 'true';
}

export function getTradingRuntimeConfig(env: Record<string, string | undefined> = process.env) {
  return {
    realTradingEnabled: parseRealTradingFlag(env[REAL_TRADING_ENV_KEY]),
    mode: TRADING_MODE,
    collateralAsset: POLYMARKET_COLLATERAL_ASSET,
    builderCode: DEFAULT_BUILDER_CODE,
  };
}

export function createBuilderOrderPayload(request: NoopTradeRequest): BuilderOrderPayload {
  const payload: BuilderOrderPayload = {
    tokenID: request.tokenId,
    side: request.side,
    price: request.price,
    size: request.amountPusd,
  };

  if (request.builderCode) {
    payload.builderCode = request.builderCode;
  }

  return payload;
}

export async function postRealOrderNoop(_request: NoopTradeRequest): Promise<never> {
  void _request;
  throw new RealTradingDisabledError();
}
