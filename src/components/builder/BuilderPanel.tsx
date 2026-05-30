'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink, Code, Gift, TrendingUp, Users } from 'lucide-react';
import { POLYMARKET_CLOB_HOST } from '@/lib/polymarketConfig';

export default function BuilderPanel() {
  const [builderCode, setBuilderCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'setup' | 'analytics'>('overview');

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const builderCodeExample = buildBuilderCodeExample(builderCode);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-accent-indigo/20 to-accent-blue/20 border border-accent-indigo/30 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-2">Builders Program</h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">
          Build trading apps and tools that integrate with prediction markets. Earn weekly rewards based on activity through Builder Codes.
        </p>
        <div className="flex flex-wrap gap-6 mt-4">
          <div className="flex items-center gap-2">
            <Gift size={18} className="text-pm-yellow" />
            <div>
              <div className="text-sm font-semibold">$50K/month</div>
              <div className="text-xs text-text-muted">Weekly rewards pool</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Code size={18} className="text-accent-indigo" />
            <div>
              <div className="text-sm font-semibold">Permissionless</div>
              <div className="text-xs text-text-muted">No approval needed</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-pm-green" />
            <div>
              <div className="text-sm font-semibold">Activity-based</div>
              <div className="text-xs text-text-muted">Volume & engagement</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border-primary" role="tablist" aria-label="Builder program sections">
        {(['overview', 'setup', 'analytics'] as const).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 ${
              activeTab === tab
                ? 'text-text-primary border-accent-indigo'
                : 'text-text-muted border-transparent hover:text-text-secondary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Grants */}
          <div className="bg-bg-card border border-border-primary rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-accent-indigo/15 flex items-center justify-center">
                <Code size={16} className="text-accent-indigo" />
              </div>
              <h3 className="font-semibold text-sm">Grants</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed mb-3">
              For non-trading projects: data, analytics, or tools. Applications reviewed on a continuous basis by the team.
            </p>
            <ul className="space-y-1.5 text-xs text-text-muted">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-accent-indigo" />
                Data & analytics dashboards
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-accent-indigo" />
                Developer tools & SDKs
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-accent-indigo" />
                Market research & insights
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-accent-indigo" />
                Community & education
              </li>
            </ul>
          </div>

          {/* Weekly Rewards */}
          <div className="bg-bg-card border border-border-primary rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-pm-green/15 flex items-center justify-center">
                <Gift size={16} className="text-pm-green" />
              </div>
              <h3 className="font-semibold text-sm">Weekly Rewards</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed mb-3">
              For trading apps integrating via Builder Codes. $50,000 distributed monthly based on activity. Set up permissionlessly.
            </p>
            <ul className="space-y-1.5 text-xs text-text-muted">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-pm-green" />
                Trading bots & interfaces
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-pm-green" />
                Portfolio management tools
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-pm-green" />
                Market aggregators
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-pm-green" />
                Social trading platforms
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'setup' && (
        <div className="space-y-5">
          {/* Builder Code Input */}
          <div className="bg-bg-card border border-border-primary rounded-xl p-5">
            <label htmlFor="builder-code" className="font-semibold text-sm mb-3 block">Your Builder Code</label>
            <div className="flex gap-2">
              <input
                id="builder-code"
                type="text"
                value={builderCode}
                onChange={(e) => setBuilderCode(e.target.value)}
                placeholder="Enter your builder code..."
                className="flex-1 bg-bg-tertiary border border-border-primary rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-indigo"
              />
              <button
                onClick={() => copyCode(builderCode)}
                className="px-3 py-2 bg-accent-indigo rounded-lg text-white text-sm font-medium hover:bg-accent-indigo/90 transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-text-muted mt-2">
              Get your Builder Code from the Polymarket Builders dashboard
            </p>
          </div>

          {/* Integration Guide */}
          <div className="bg-bg-card border border-border-primary rounded-xl p-5">
            <h3 className="font-semibold text-sm mb-3">Integration Steps</h3>
            <div className="space-y-3">
              {[
                { step: '1', title: 'Get Builder Code', desc: 'Apply at polymarket.com/builders to receive your unique code' },
                { step: '2', title: 'Integrate API', desc: 'Send builderCode as a field on the CLOB order payload' },
                { step: '3', title: 'Track Activity', desc: 'Volume from your app is tracked automatically via your code' },
                { step: '4', title: 'Earn Rewards', desc: 'Weekly rewards distributed based on your app\'s trading activity' },
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-indigo/15 text-accent-indigo flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{item.title}</div>
                    <div className="text-xs text-text-muted">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code Example */}
          <div className="bg-bg-card border border-border-primary rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">API Integration Example</h3>
              <button
                onClick={() => copyCode(builderCodeExample)}
                className="text-xs text-accent-indigo hover:underline flex items-center gap-1"
              >
                <Copy size={12} /> Copy
              </button>
            </div>
            <pre className="bg-bg-primary rounded-lg p-4 text-xs text-text-secondary overflow-x-auto">
              <code>{builderCodeExample}</code>
            </pre>
          </div>

          {/* Platform Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { name: 'Polymarket Builders', url: 'https://polymarket.com/builders', color: 'accent-indigo' },
              { name: 'Kalshi API Docs', url: 'https://trading-api.kalshi.com/trade-api/v2', color: 'accent-cyan' },
              { name: 'Opinion Dev Hub', url: 'https://opinion.xyz', color: 'accent-orange' },
            ].map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-bg-card border border-border-primary rounded-lg px-4 py-3 hover:bg-bg-card-hover hover:border-border-secondary transition-all group"
              >
                <span className="text-sm font-medium">{link.name}</span>
                <ExternalLink size={14} className="text-text-muted group-hover:text-text-secondary" />
              </a>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Volume', value: '$0', icon: TrendingUp, color: 'text-accent-indigo' },
              { label: 'Referrals', value: '0', icon: Users, color: 'text-accent-cyan' },
              { label: 'Weekly Rewards', value: '$0', icon: Gift, color: 'text-pm-green' },
              { label: 'Monthly Rewards', value: '$0', icon: Gift, color: 'text-pm-yellow' },
            ].map((stat) => (
              <div key={stat.label} className="bg-bg-card border border-border-primary rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon size={14} className={stat.color} />
                  <span className="text-xs text-text-muted">{stat.label}</span>
                </div>
                <div className="text-lg font-bold">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-bg-card border border-border-primary rounded-xl p-8 text-center">
            <Users size={32} className="mx-auto text-text-muted mb-3" />
            <p className="text-sm text-text-muted">Connect your wallet or enter Builder Code to view analytics</p>
          </div>
        </div>
      )}
    </div>
  );
}

function buildBuilderCodeExample(builderCode: string): string {
  return `// REAL_TRADING_ENABLED defaults to false in 3Markets.
// Replace the no-op order path only after wallet, signing, and idempotency checks are ready.
const order = {
  tokenID: 'TOKEN_ID',
  price: 0.55,
  size: 100,
  side: 'BUY',
  builderCode: '${builderCode || 'YOUR_BUILDER_CODE'}'
};

const response = await fetch('${POLYMARKET_CLOB_HOST}/order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify(order)
});`;
}
