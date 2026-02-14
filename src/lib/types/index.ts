export type Platform = 'polymarket' | 'kalshi' | 'opinion';

export interface Market {
  id: string;
  slug: string;
  platform: Platform;
  question: string;
  description: string;
  category: string;
  image?: string;
  outcomes: Outcome[];
  volume: number;
  volumeFormatted: string;
  liquidity: number;
  endDate: string;
  status: 'active' | 'closed' | 'resolved';
  resolution?: string;
  createdAt: string;
  url: string;
  tags?: string[];
}

export interface Outcome {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
}

export interface Position {
  marketId: string;
  market: Market;
  outcome: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}

export interface TradeOrder {
  platform: Platform;
  marketId: string;
  outcomeId: string;
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  type: 'market' | 'limit';
}

export interface PlatformConfig {
  name: string;
  platform: Platform;
  description: string;
  logo: string;
  color: string;
  apiBase: string;
  features: string[];
  builderCode?: string;
}

export interface BuilderStats {
  totalVolume: number;
  totalReferrals: number;
  weeklyRewards: number;
  monthlyRewards: number;
}

export interface MarketFilter {
  platform?: Platform | 'all';
  category?: string;
  status?: 'active' | 'closed' | 'all';
  search?: string;
  sortBy?: 'volume' | 'newest' | 'ending_soon' | 'price';
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

// Polymarket specific
export interface PolymarketEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  image: string;
  markets: PolymarketMarket[];
  volume: number;
  liquidity: number;
  endDate: string;
  active: boolean;
  closed: boolean;
  tags: { label: string }[];
}

export interface PolymarketMarket {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  outcomes: string;
  outcomePrices: string;
  volume: number;
  active: boolean;
  closed: boolean;
  image?: string;
}

// Kalshi specific
export interface KalshiMarket {
  ticker: string;
  event_ticker: string;
  title: string;
  subtitle: string;
  category: string;
  yes_bid: number;
  yes_ask: number;
  no_bid: number;
  no_ask: number;
  volume: number;
  open_interest: number;
  status: string;
  close_time: string;
  result?: string;
}

export interface KalshiEvent {
  event_ticker: string;
  title: string;
  category: string;
  markets: KalshiMarket[];
  mutually_exclusive: boolean;
}

// Opinion specific (from proxy.opinion.trade /api/bsc/api/v2/topic)
export interface OpinionTopic {
  topicId: number;
  title: string;
  titleShort: string;
  abstract: string;
  status: number; // 2=active, 4=resolved
  yesBuyPrice: string;
  noBuyPrice: string;
  yesLabel: string;
  noLabel: string;
  yesMarketPrice: string;
  volume: string;
  volume24h: string;
  volume7d: string;
  totalPrice: string;
  thumbnailUrl: string;
  cutoffTime: number;
  createTime: number;
  resolvedTime: number;
  labelName: string[];
  labelId: number[];
  chainId: string;
  rules: string;
  currencyAddress: string;
  questionId: string;
}

// Keep legacy alias
export type OpinionMarket = OpinionTopic;
