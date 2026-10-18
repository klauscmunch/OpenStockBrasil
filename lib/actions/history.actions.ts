'use server';

import { getSession } from '@/lib/better-auth/auth';
import { CHART_RANGES, type ChartRange } from '@/lib/constants';
import { getPriceHistory, type PriceHistory } from '@/lib/price-history';

const SYMBOL_PATTERN = /^[A-Z0-9.:\-^=]{1,24}$/;

// Called by the watchlist cards when a period is picked. Signed-in only, like the other quote endpoints.
export async function getWatchlistHistory(symbol: string, range: ChartRange): Promise<PriceHistory | null> {
    if (!(await getSession())?.user) return null;
    const upper = String(symbol).toUpperCase();
    if (!SYMBOL_PATTERN.test(upper) || !CHART_RANGES.some((r) => r.value === range)) return null;
    return getPriceHistory(upper, range);
}
