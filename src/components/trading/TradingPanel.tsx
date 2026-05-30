'use client';

import { useState } from 'react';
import type { Market, Platform } from '@/lib/types';
import { formatCollateralAmount, getPlatformCollateralAsset } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Info, ExternalLink } from 'lucide-react';

interface TradingPanelProps {
  market: Market;
}

export default function TradingPanel({ market }: TradingPanelProps) {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [outcomeIdx, setOutcomeIdx] = useState(0);
  const [amount, setAmount] = useState('');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState('');

  const outcome = market.outcomes[outcomeIdx];
  const price = outcome?.price ?? 0;
  const shares = amount && price > 0 ? parseFloat(amount) / price : 0;
  const potentialProfit = shares * (1 - price);
  const collateralAsset = market.collateralAsset ?? getPlatformCollateralAsset(market.platform);

  const platformGuide = getPlatformGuide(market.platform);

  return (
    <div className="bg-bg-card border border-border-primary rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border-primary">
        <h3 className="text-sm font-semibold">Trade</h3>
      </div>

      <div className="flex border-b border-border-primary" role="tablist" aria-label="Trade direction">
        <button
          role="tab"
          aria-selected={side === 'buy'}
          onClick={() => setSide('buy')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold transition-colors ${
            side === 'buy'
              ? 'bg-pm-green/10 text-pm-green border-b-2 border-pm-green'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <ArrowUpRight size={16} /> Buy
        </button>
        <button
          role="tab"
          aria-selected={side === 'sell'}
          onClick={() => setSide('sell')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold transition-colors ${
            side === 'sell'
              ? 'bg-pm-red/10 text-pm-red border-b-2 border-pm-red'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <ArrowDownRight size={16} /> Sell
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Outcome Selector */}
        <fieldset>
          <legend className="text-xs text-text-muted mb-1.5 block">Outcome</legend>
          <div className="flex gap-2">
            {market.outcomes.slice(0, 4).map((o, i) => (
              <button
                key={o.id}
                onClick={() => setOutcomeIdx(i)}
                aria-pressed={outcomeIdx === i}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                  outcomeIdx === i
                    ? i === 0
                      ? 'border-pm-green bg-pm-green/10 text-pm-green'
                      : 'border-pm-red bg-pm-red/10 text-pm-red'
                    : 'border-border-primary text-text-muted hover:border-border-secondary'
                }`}
              >
                <div className="truncate">{o.name}</div>
                <div className="text-xs mt-0.5">{Math.round(o.price * 100)}¢</div>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Order Type */}
        <fieldset>
          <legend className="text-xs text-text-muted mb-1.5 block">Order Type</legend>
          <div className="flex gap-2">
            {(['market', 'limit'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                aria-pressed={orderType === type}
                className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors capitalize ${
                  orderType === type
                    ? 'border-accent-indigo bg-accent-indigo/10 text-accent-indigo'
                    : 'border-border-primary text-text-muted hover:border-border-secondary'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Amount */}
        <div>
          <label htmlFor="trade-amount" className="text-xs text-text-muted mb-1.5 block">Amount ({collateralAsset})</label>
          <input
            id="trade-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-bg-tertiary border border-border-primary rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-indigo"
          />
          <div className="flex gap-1.5 mt-2">
            {['10', '25', '50', '100'].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(v)}
                className="px-3 py-1.5 text-xs rounded-md bg-bg-tertiary text-text-muted hover:text-text-secondary hover:bg-bg-card-hover border border-border-primary transition-colors"
              >
                {collateralAsset === 'USD' ? `$${v}` : `${v} ${collateralAsset}`}
              </button>
            ))}
          </div>
        </div>

        {/* Limit Price */}
        {orderType === 'limit' && (
          <div>
            <label htmlFor="limit-price" className="text-xs text-text-muted mb-1.5 block">Limit Price (¢)</label>
            <input
              id="limit-price"
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              placeholder={`${Math.round(price * 100)}`}
              min="1"
              max="99"
              className="w-full bg-bg-tertiary border border-border-primary rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-indigo"
            />
          </div>
        )}

        {/* Summary */}
        {amount && parseFloat(amount) > 0 && (
          <dl className="bg-bg-tertiary rounded-lg p-3 space-y-1.5 text-xs" aria-label="Trade summary">
            <div className="flex justify-between text-text-secondary">
              <dt>Shares</dt>
              <dd className="text-text-primary font-medium">{shares.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between text-text-secondary">
              <dt>Avg Price</dt>
              <dd className="text-text-primary font-medium">{Math.round(price * 100)}¢</dd>
            </div>
            <div className="flex justify-between text-text-secondary">
              <dt>Potential Return</dt>
              <dd className="text-pm-green font-medium">
                {formatCollateralAmount(potentialProfit, collateralAsset)}
              </dd>
            </div>
          </dl>
        )}

        {/* Submit */}
        <button
          className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${
            side === 'buy'
              ? 'bg-pm-green hover:bg-pm-green/90 text-white'
              : 'bg-pm-red hover:bg-pm-red/90 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={!amount || parseFloat(amount) <= 0}
          onClick={() => window.open(market.url, '_blank')}
        >
          {side === 'buy' ? 'Buy' : 'Sell'} {outcome?.name} on {market.platform === 'polymarket' ? 'Polymarket' : market.platform === 'kalshi' ? 'Kalshi' : 'Opinion'}
          <ExternalLink size={14} className="inline ml-1.5" />
        </button>

        {/* Platform Guide */}
        <div className="bg-accent-indigo/5 border border-accent-indigo/20 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs text-accent-indigo font-medium mb-1">
            <Info size={12} />
            {platformGuide.title}
          </div>
          <p className="text-xs text-text-muted leading-relaxed">{platformGuide.description}</p>
        </div>
      </div>
    </div>
  );
}

function getPlatformGuide(platform: Platform) {
  switch (platform) {
    case 'polymarket':
      return {
        title: 'Trade on Polymarket',
        description: 'Connect your wallet and trade with pUSD on Polygon. Shares settle at 1 pUSD if correct, 0 if wrong.',
      };
    case 'kalshi':
      return {
        title: 'Trade on Kalshi',
        description: 'CFTC-regulated event contracts. Fund with USD. Contracts pay $1 if outcome occurs.',
      };
    case 'opinion':
      return {
        title: 'Trade on Opinion',
        description: 'On-chain prediction market on BNB Chain. Connect wallet to trade with USDT. Resolved by Chainlink oracle.',
      };
  }
}
