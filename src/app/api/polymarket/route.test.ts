import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { GET } from './route';

describe('Polymarket proxy route', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('rejects trading endpoints before fetch', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const response = await GET(new NextRequest('http://localhost/api/polymarket?endpoint=order'));

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns 504 when the read-only upstream request times out', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new DOMException('timed out', 'TimeoutError');
    }));

    const response = await GET(new NextRequest('http://localhost/api/polymarket?endpoint=price&token_id=token-1'));
    const body = await response.json();

    expect(response.status).toBe(504);
    expect(body.error).toBe('Polymarket API timeout');
  });
});
