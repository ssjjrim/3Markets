import type { Market, OpinionTopic } from '@/lib/types';

const API_BASE = '/api/opinion';

export async function fetchOpinionTopics(params?: {
  limit?: number;
  page?: number;
  status?: number; // 2=active, 4=resolved
  labelId?: number;
  sortBy?: string;
}): Promise<OpinionTopic[]> {
  const searchParams = new URLSearchParams();
  searchParams.set('endpoint', 'topic');
  searchParams.set('limit', String(params?.limit ?? 20));
  searchParams.set('page', String(params?.page ?? 1));
  searchParams.set('chainId', '56');
  if (params?.status) searchParams.set('status', String(params.status));
  if (params?.labelId) searchParams.set('labelId', String(params.labelId));

  try {
    const res = await fetch(`${API_BASE}?${searchParams.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (data.errno !== 0) return [];
    return data.result?.list || [];
  } catch {
    return [];
  }
}

// Keep backward-compatible alias
export const fetchOpinionMarkets = fetchOpinionTopics;

export async function fetchOpinionTopic(topicId: string): Promise<OpinionTopic | null> {
  const searchParams = new URLSearchParams();
  searchParams.set('endpoint', `topic/${topicId}`);
  searchParams.set('chainId', '56');

  try {
    const res = await fetch(`${API_BASE}?${searchParams.toString()}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.errno !== 0) return null;
    return data.result || null;
  } catch {
    return null;
  }
}

// Keep backward-compatible alias
export const fetchOpinionMarket = fetchOpinionTopic;

export function normalizeOpinionTopic(topic: OpinionTopic): Market {
  const yesPrice = parseFloat(topic.yesBuyPrice) || 0.5;
  const noPrice = parseFloat(topic.noBuyPrice) || 0.5;
  const volume = parseFloat(topic.volume) || 0;

  // Determine status: 2=active, 4=resolved
  const status = topic.status === 2 ? 'active' : topic.status === 4 ? 'resolved' : 'closed';

  return {
    id: String(topic.topicId),
    slug: String(topic.topicId),
    platform: 'opinion',
    question: topic.title,
    description: topic.abstract || topic.rules || '',
    category: topic.labelName?.[0] || 'General',
    image: topic.thumbnailUrl || undefined,
    outcomes: [
      {
        id: `${topic.topicId}-yes`,
        name: topic.yesLabel || 'Yes',
        price: yesPrice,
        priceFormatted: `${(yesPrice * 100).toFixed(1)}¢`,
      },
      {
        id: `${topic.topicId}-no`,
        name: topic.noLabel || 'No',
        price: noPrice,
        priceFormatted: `${(noPrice * 100).toFixed(1)}¢`,
      },
    ],
    volume,
    volumeFormatted: formatVol(volume),
    liquidity: 0,
    endDate: topic.cutoffTime ? new Date(topic.cutoffTime * 1000).toISOString() : '',
    status,
    createdAt: topic.createTime ? new Date(topic.createTime * 1000).toISOString() : '',
    url: `https://app.opinion.trade/topic/${topic.topicId}`,
    tags: topic.labelName || [],
  };
}

// Keep backward-compatible alias
export const normalizeOpinionMarket = normalizeOpinionTopic;

function formatVol(v: number): string {
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}
