import { NextRequest, NextResponse } from 'next/server';

const GAMMA_API = 'https://gamma-api.polymarket.com';

export async function GET(request: NextRequest) {
  const searchParams = new URLSearchParams(request.nextUrl.searchParams);
  const endpoint = searchParams.get('endpoint') || 'events';
  searchParams.delete('endpoint');

  try {
    const url = `${GAMMA_API}/${endpoint}?${searchParams.toString()}`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': '3Markets/1.0',
      },
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
    console.error('Polymarket proxy error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch from Polymarket' },
      { status: 500 }
    );
  }
}
