import { NextRequest, NextResponse } from 'next/server';

const OPINION_API = 'https://proxy.opinion.trade:8443/api/bsc/api/v2';

export async function GET(request: NextRequest) {
  const searchParams = new URLSearchParams(request.nextUrl.searchParams);
  const endpoint = searchParams.get('endpoint') || 'topic';
  searchParams.delete('endpoint');

  try {
    const url = `${OPINION_API}/${endpoint}?${searchParams.toString()}`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': '3Markets/1.0',
      },
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return NextResponse.json({ errno: -1, errmsg: `Opinion API: ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ errno: -1, errmsg: 'Failed to fetch from Opinion' }, { status: 500 });
  }
}
