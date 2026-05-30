'use client';

import { useState } from 'react';
import type { Market } from '@/lib/types';
import PlatformBadge from '@/components/common/PlatformBadge';
import { timeUntil } from '@/lib/utils';
import { Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function MarketCard({ market }: { market: Market }) {
  const [imgFailed, setImgFailed] = useState(false);
  const isBinary = market.outcomes.length === 2 &&
    (market.outcomes[0].name === 'Yes' || market.outcomes[0].name === 'No');
  const topOutcome = market.outcomes[0];
  const yesPercent = topOutcome ? Math.round(topOutcome.price * 100) : 50;

  return (
    <Link
      href={`/${market.platform}/${market.slug}`}
      className="block bg-bg-card border border-border-primary rounded-xl p-4 hover:bg-bg-card-hover hover:border-border-secondary transition-all group"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {market.image && !imgFailed ? (
          <Image
            src={market.image}
            alt=""
            width={40}
            height={40}
            unoptimized
            className="w-10 h-10 rounded-lg object-cover shrink-0 bg-bg-tertiary"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-bg-tertiary flex items-center justify-center shrink-0">
            <TrendingUp size={16} className="text-text-muted" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <PlatformBadge platform={market.platform} />
            {market.category && (
              <span className="text-xs text-text-muted truncate">{market.category}</span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-text-primary leading-snug group-hover:text-white line-clamp-2">
            {market.question}
          </h3>
        </div>
      </div>

      {/* Probability Bar */}
      <div className="mb-3">
        <div
          className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={yesPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${topOutcome?.name ?? 'Yes'} probability ${yesPercent}%`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-pm-green to-pm-green/70 transition-all duration-500"
            style={{ width: `${Math.min(yesPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Outcomes */}
      {isBinary ? (
        <div className="flex gap-2 mb-3">
          <div className="flex-1 flex items-center justify-between bg-pm-green/15 rounded-lg px-3 py-1.5">
            <span className="text-xs text-pm-green font-medium">Yes</span>
            <span className="text-sm text-pm-green font-bold">{yesPercent}¢</span>
          </div>
          <div className="flex-1 flex items-center justify-between bg-pm-red/15 rounded-lg px-3 py-1.5">
            <span className="text-xs text-pm-red font-medium">No</span>
            <span className="text-sm text-pm-red font-bold">{100 - yesPercent}¢</span>
          </div>
        </div>
      ) : (
        <div className="space-y-1.5 mb-3">
          {market.outcomes.slice(0, 3).map((o) => {
            const pct = Math.round(o.price * 100);
            return (
              <div key={o.id} className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="text-text-secondary truncate mr-2">{o.name}</span>
                    <span className="text-text-primary font-semibold shrink-0">{pct}¢</span>
                  </div>
                  <div
                    className="h-1 bg-bg-tertiary rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${o.name} probability ${pct}%`}
                  >
                    <div
                      className="h-full rounded-full bg-accent-indigo/60 transition-all duration-500"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          {market.outcomes.length > 3 && (
            <div className="text-xs text-text-muted">
              +{market.outcomes.length - 3} more
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-text-muted">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <TrendingUp size={12} />
            {market.volumeFormatted} vol
          </span>
          {market.endDate && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {timeUntil(market.endDate)}
            </span>
          )}
        </div>
        <span className={`font-medium ${
          market.status === 'active' ? 'text-pm-green' : 'text-text-muted'
        }`}>
          {market.status === 'active' ? 'Active' : market.status === 'resolved' ? 'Resolved' : 'Closed'}
        </span>
      </div>
    </Link>
  );
}
