import type { Market, Platform, MarketFilter } from '@/lib/types';
import { fetchPolymarketEvents, normalizePolymarketEvent } from './polymarket';
import { fetchKalshiEvents, normalizeKalshiEvent } from './kalshi';
import { fetchOpinionTopics, normalizeOpinionTopic, fetchOpinionMarkets, normalizeOpinionMarket } from './opinion';

export async function fetchAllMarkets(filter?: MarketFilter): Promise<Market[]> {
  const platforms: Platform[] =
    filter?.platform && filter.platform !== 'all'
      ? [filter.platform]
      : ['polymarket', 'kalshi', 'opinion'];

  const promises = platforms.map(async (platform) => {
    try {
      switch (platform) {
        case 'polymarket': {
          const events = await fetchPolymarketEvents({
            limit: 50,
            active: true,
            closed: false,
          });
          return events.map(normalizePolymarketEvent);
        }
        case 'kalshi': {
          const { events } = await fetchKalshiEvents({
            limit: 50,
            status: 'open',
            with_nested_markets: true,
          });
          return events.map(normalizeKalshiEvent);
        }
        case 'opinion': {
          const topics = await fetchOpinionTopics({ limit: 50, status: 2 });
          return topics.map(normalizeOpinionTopic);
        }
        default:
          return [];
      }
    } catch (err) {
      console.error(`Failed to fetch ${platform} markets:`, err);
      return [];
    }
  });

  const results = await Promise.all(promises);
  let markets = results.flat();

  // Only show active/live markets by default
  markets = markets.filter((m) => m.status === 'active');

  // Apply search filter
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    markets = markets.filter(
      (m) =>
        m.question.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
    );
  }

  // Sort
  switch (filter?.sortBy) {
    case 'volume':
      markets.sort((a, b) => b.volume - a.volume);
      break;
    case 'newest':
      markets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'ending_soon':
      markets.sort((a, b) => {
        const aEnd = a.endDate ? new Date(a.endDate).getTime() : Infinity;
        const bEnd = b.endDate ? new Date(b.endDate).getTime() : Infinity;
        return aEnd - bEnd;
      });
      break;
    default:
      markets.sort((a, b) => b.volume - a.volume);
  }

  return markets;
}

export { fetchPolymarketEvents, fetchPolymarketEvent, normalizePolymarketEvent } from './polymarket';
export { fetchKalshiEvents, fetchKalshiMarkets, fetchKalshiMarket, normalizeKalshiEvent, normalizeKalshiMarket } from './kalshi';
export { fetchOpinionTopics, fetchOpinionTopic, normalizeOpinionTopic, fetchOpinionMarkets, fetchOpinionMarket, normalizeOpinionMarket } from './opinion';
