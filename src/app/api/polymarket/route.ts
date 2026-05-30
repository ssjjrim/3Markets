import { NextRequest, NextResponse } from 'next/server';
import {
  isAllowedPolymarketReadEndpoint,
  isPolymarketTimeoutError,
  normalizePolymarketEndpoint,
  normalizePolymarketQuery,
  POLYMARKET_REQUEST_TIMEOUT_MS,
  resolvePolymarketHost,
} from '@/lib/polymarketConfig';

export async function GET(request: NextRequest) {
  const searchParams = new URLSearchParams(request.nextUrl.searchParams);
  const endpoint = normalizePolymarketEndpoint(searchParams.get('endpoint') || 'events');
  searchParams.delete('endpoint');

  if (!isAllowedPolymarketReadEndpoint(endpoint)) {
    return NextResponse.json(
      { error: 'Unsupported Polymarket read endpoint' },
      { status: 400 }
    );
  }

  try {
    const host = resolvePolymarketHost(endpoint);
    const normalizedParams = normalizePolymarketQuery(endpoint, searchParams);
    const query = normalizedParams.toString();
    const url = `${host}/${endpoint}${query ? `?${query}` : ''}`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': '3Markets/1.0',
      },
      signal: AbortSignal.timeout(POLYMARKET_REQUEST_TIMEOUT_MS),
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Polymarket API: ${res.status}`, detail: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (err) {
    if (isPolymarketTimeoutError(err)) {
      return NextResponse.json(
        { error: 'Polymarket API timeout' },
        { status: 504 }
      );
    }

    console.error('Polymarket proxy error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch from Polymarket' },
      { status: 500 }
    );
  }
}
