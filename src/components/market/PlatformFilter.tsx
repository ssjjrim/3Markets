'use client';

import type { Platform } from '@/lib/types';
import { Search, SlidersHorizontal } from 'lucide-react';

interface PlatformFilterProps {
  activePlatform: Platform | 'all';
  onPlatformChange: (platform: Platform | 'all') => void;
  search: string;
  onSearchChange: (search: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const platforms: { id: Platform | 'all'; label: string; color: string }[] = [
  { id: 'all', label: 'All', color: 'bg-text-muted' },
  { id: 'polymarket', label: 'Polymarket', color: 'bg-polymarket' },
  { id: 'kalshi', label: 'Kalshi', color: 'bg-kalshi' },
  { id: 'opinion', label: 'Opinion', color: 'bg-opinion' },
];

const sortOptions = [
  { id: 'volume', label: 'Volume' },
  { id: 'newest', label: 'Newest' },
  { id: 'ending_soon', label: 'Ending Soon' },
];

export default function PlatformFilter({
  activePlatform,
  onPlatformChange,
  search,
  onSearchChange,
  sortBy,
  onSortChange,
}: PlatformFilterProps) {
  return (
    <div className="space-y-3">
      {/* Platform tabs */}
      <div className="flex items-center gap-2 flex-wrap" role="tablist" aria-label="Filter by platform">
        {platforms.map((p) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={activePlatform === p.id}
            onClick={() => onPlatformChange(p.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activePlatform === p.id
                ? 'bg-bg-tertiary text-text-primary border border-border-secondary'
                : 'text-text-muted hover:text-text-secondary hover:bg-bg-card'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${p.color}`} />
            {p.label}
          </button>
        ))}
      </div>

      {/* Search and Sort */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search markets..."
            aria-label="Search markets"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-bg-card border border-border-primary rounded-lg pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-indigo transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Sort markets by">
          <SlidersHorizontal size={14} className="text-text-muted" />
          {sortOptions.map((s) => (
            <button
              key={s.id}
              role="radio"
              aria-checked={sortBy === s.id}
              onClick={() => onSortChange(s.id)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                sortBy === s.id
                  ? 'bg-accent-indigo/15 text-accent-indigo'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
