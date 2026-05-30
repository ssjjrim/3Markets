'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Market, Platform } from '@/lib/types';
import { fetchPolymarketEvent, normalizePolymarketEvent } from '@/lib/api/polymarket';
import { fetchKalshiEvent, normalizeKalshiEvent } from '@/lib/api/kalshi';
import { fetchOpinionTopic, normalizeOpinionTopic } from '@/lib/api/opinion';
import TradingPanel from '@/components/trading/TradingPanel';
import PlatformBadge from '@/components/common/PlatformBadge';
import { ExternalLink, Clock, TrendingUp, BarChart3, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { timeUntil, formatMarketCurrency } from '@/lib/utils';

export default function MarketDetailPage() {
  const params = useParams();
  const platform = params.platform as Platform;
  const slug = params.slug as string;
  const [market, setMarket] = useState<Market | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        switch (platform) {
          case 'polymarket': {
            const event = await fetchPolymarketEvent(slug);
            if (event) setMarket(normalizePolymarketEvent(event));
            else setError('Market not found');
            break;
          }
          case 'kalshi': {
            const { event } = await fetchKalshiEvent(slug.toUpperCase());
            setMarket(normalizeKalshiEvent(event));
            break;
          }
          case 'opinion': {
            const om = await fetchOpinionTopic(slug);
            if (om) setMarket(normalizeOpinionTopic(om));
            else setError('Market not found');
            break;
          }
        }
      } catch (err) {
        setError('Failed to load market data');
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, [platform, slug]);

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-4 w-96" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 skeleton h-64 rounded-xl" />
          <div className="skeleton h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !market) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-text-muted mb-4">{error || 'Market not found'}</p>
        <Link href="/" className="text-accent-indigo hover:underline text-sm">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const yes = market.outcomes[0];
  const no = market.outcomes[1];
  const yesPercent = yes ? Math.round(yes.price * 100) : 50;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={16} /> Back to Markets
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 md:items-start">
        {market.image && (
          <Image
            src={market.image}
            alt=""
            width={64}
            height={64}
            unoptimized
            className="w-16 h-16 rounded-xl object-cover bg-bg-tertiary shrink-0"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <PlatformBadge platform={market.platform} />
            <span className="text-xs text-text-muted">{market.category}</span>
          </div>
          <h1 className="text-xl font-bold mb-2">{market.question}</h1>
          {market.description && (
            <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">{market.description}</p>
          )}
        </div>
        <a
          href={market.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-card border border-border-primary rounded-lg text-sm text-text-secondary hover:text-text-primary hover:border-border-secondary transition-colors shrink-0"
        >
          Trade on {market.platform === 'polymarket' ? 'Polymarket' : market.platform === 'kalshi' ? 'Kalshi' : 'Opinion'}
          <ExternalLink size={14} />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Probability Display */}
          <div className="bg-bg-card border border-border-primary rounded-xl p-6">
            <h3 className="text-sm font-semibold mb-4">Current Probability</h3>
            {/* Large prob display */}
            <div className="flex items-center gap-6 mb-6">
              {yes && (
                <div className="text-center">
                  <div className="text-4xl font-bold text-pm-green">{yesPercent}%</div>
                  <div className="text-xs text-text-muted mt-1">{yes.name}</div>
                </div>
              )}
              {no && (
                <div className="text-center">
                  <div className="text-4xl font-bold text-pm-red">{Math.round(no.price * 100)}%</div>
                  <div className="text-xs text-text-muted mt-1">{no.name}</div>
                </div>
              )}
            </div>
            {/* Bar */}
            <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden mb-4">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pm-green to-pm-green/70 transition-all duration-700"
                style={{ width: `${yesPercent}%` }}
              />
            </div>
            {/* Outcomes list */}
            {market.outcomes.length > 2 && (
              <div className="space-y-2 mt-4">
                {market.outcomes.map((o) => (
                  <div key={o.id} className="flex items-center justify-between py-2 border-b border-border-primary last:border-0">
                    <span className="text-sm">{o.name}</span>
                    <span className="text-sm font-semibold">{Math.round(o.price * 100)}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Market Info */}
          <div className="bg-bg-card border border-border-primary rounded-xl p-6">
            <h3 className="text-sm font-semibold mb-4">Market Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-text-muted text-xs mb-1">
                  <TrendingUp size={12} /> Volume
                </div>
                <div className="text-sm font-semibold">{market.volumeFormatted}</div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-text-muted text-xs mb-1">
                  <BarChart3 size={12} /> Liquidity
                </div>
                <div className="text-sm font-semibold">{formatMarketCurrency(market.liquidity, market)}</div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-text-muted text-xs mb-1">
                  <Clock size={12} /> Ends In
                </div>
                <div className="text-sm font-semibold">{market.endDate ? timeUntil(market.endDate) : 'N/A'}</div>
              </div>
              <div>
                <div className="text-text-muted text-xs mb-1">Status</div>
                <div className={`text-sm font-semibold ${
                  market.status === 'active' ? 'text-pm-green' : 'text-text-muted'
                }`}>
                  {market.status === 'active' ? 'Active' : 'Closed'}
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {market.tags && market.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {market.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-bg-card border border-border-primary rounded-lg text-xs text-text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Trading Panel */}
        <div>
          <TradingPanel market={market} />
        </div>
      </div>
    </div>
  );
}
