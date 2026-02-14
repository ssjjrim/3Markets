'use client';

import { Wallet, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';

export default function PortfolioPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">Portfolio</h1>
        <p className="text-text-secondary text-sm">
          Track your positions across all prediction markets
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-bg-card border border-border-primary rounded-xl p-4">
          <div className="text-xs text-text-muted mb-1">Total Value</div>
          <div className="text-xl font-bold">$0.00</div>
        </div>
        <div className="bg-bg-card border border-border-primary rounded-xl p-4">
          <div className="text-xs text-text-muted mb-1">Total P&L</div>
          <div className="text-xl font-bold text-text-muted">$0.00</div>
        </div>
        <div className="bg-bg-card border border-border-primary rounded-xl p-4">
          <div className="text-xs text-text-muted mb-1">Open Positions</div>
          <div className="text-xl font-bold">0</div>
        </div>
        <div className="bg-bg-card border border-border-primary rounded-xl p-4">
          <div className="text-xs text-text-muted mb-1">Win Rate</div>
          <div className="text-xl font-bold text-text-muted">-</div>
        </div>
      </div>

      {/* Platform Accounts */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Connected Accounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: 'Polymarket', desc: 'Connect wallet to view positions', color: 'accent-indigo', url: 'https://polymarket.com' },
            { name: 'Kalshi', desc: 'Login to sync your portfolio', color: 'accent-cyan', url: 'https://kalshi.com' },
            { name: 'Opinion', desc: 'Connect wallet to view positions', color: 'accent-orange', url: 'https://opinion.xyz' },
          ].map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-bg-card border border-border-primary rounded-xl p-4 hover:bg-bg-card-hover hover:border-border-secondary transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-semibold text-${p.color}`}>{p.name}</span>
                <ExternalLink size={14} className="text-text-muted group-hover:text-text-secondary" />
              </div>
              <p className="text-xs text-text-muted">{p.desc}</p>
              <button className="mt-3 w-full py-1.5 bg-bg-tertiary border border-border-primary rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary transition-colors">
                Connect
              </button>
            </a>
          ))}
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-bg-card border border-border-primary rounded-xl p-12 text-center">
        <Wallet size={40} className="mx-auto text-text-muted mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Positions Yet</h3>
        <p className="text-sm text-text-muted max-w-md mx-auto mb-4">
          Connect your wallet or trading accounts to track positions across Polymarket, Kalshi, and Opinion.
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-text-muted">
          <div className="flex items-center gap-1">
            <TrendingUp size={12} className="text-pm-green" />
            Track profits
          </div>
          <div className="flex items-center gap-1">
            <TrendingDown size={12} className="text-pm-red" />
            Monitor risks
          </div>
        </div>
      </div>
    </div>
  );
}
