// Price history for the watchlist charts, from Yahoo Finance's public chart endpoint (no key needed).
// It covers B3 and US listings for every range the cards offer; brapi's free plan stops at three months
// and Finnhub's free plan has no candles. Unofficial endpoint: if it changes, the cards show "—" instead of failing.
import type { ChartRange } from '@/lib/constants';

const CHART_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';
const FETCH_TIMEOUT_MS = 6000;
const FAILURE_TTL_MS = 60_000;
const MAX_CACHE_ENTRIES = 500;

const RANGES: Record<ChartRange, { range: string; interval: string; ttl: number }> = {
    '1D': { range: '1d', interval: '5m', ttl: 5 * 60 },
    '1M': { range: '1mo', interval: '1d', ttl: 60 * 60 },
    '6M': { range: '6mo', interval: '1d', ttl: 60 * 60 },
    '12M': { range: '1y', interval: '1d', ttl: 60 * 60 },
};

export type PriceHistory = {
    points: { t: number; c: number }[]; // unix seconds, close
    base: number;                       // close before the period started
    last: number;
    changePercent: number;              // return over the period
    currency?: string;
};

// Our symbols to Yahoo's: B3 and most exchange suffixes already match
export function toYahooSymbol(symbol: string): string {
    const upper = symbol.toUpperCase();
    if (upper === 'IBOV.SA') return '^BVSP';
    const binance = upper.match(/^BINANCE:([A-Z0-9]+?)(USDT|USD)$/);
    if (binance) return `${binance[1]}-USD`;
    const fx = upper.match(/^FX:([A-Z]{6})$/);
    if (fx) return `${fx[1]}=X`;
    return upper.includes(':') ? upper.split(':')[1] : upper;
}

const cache = new Map<string, { value: PriceHistory | null; freshUntil: number }>();
const inFlight = new Map<string, Promise<PriceHistory | null>>();

type YahooChart = {
    chart?: {
        result?: {
            meta?: { chartPreviousClose?: number; previousClose?: number; regularMarketPrice?: number; currency?: string };
            timestamp?: number[];
            indicators?: { quote?: { close?: (number | null)[] }[] };
        }[];
    };
};

async function load(symbol: string, range: ChartRange): Promise<PriceHistory | null> {
    const { range: r, interval } = RANGES[range];
    const url = `${CHART_URL}/${encodeURIComponent(toYahooSymbol(symbol))}?range=${r}&interval=${interval}`;
    const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (OpenStock)' },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Yahoo chart ${res.status}`);
    const result = ((await res.json()) as YahooChart).chart?.result?.[0];
    const closes = result?.indicators?.quote?.[0]?.close ?? [];
    const points = (result?.timestamp ?? []).flatMap((t, i) => (closes[i] ? [{ t, c: closes[i] as number }] : []));
    if (points.length < 2) return null;

    const last = result?.meta?.regularMarketPrice ?? points[points.length - 1].c;
    // For 1D the reference is yesterday's close; for longer ranges, the close just before the range began
    const base = result?.meta?.chartPreviousClose ?? result?.meta?.previousClose ?? points[0].c;
    return { points, base, last, changePercent: (last / base - 1) * 100, currency: result?.meta?.currency };
}

export async function getPriceHistory(symbol: string, range: ChartRange): Promise<PriceHistory | null> {
    const key = `${symbol.toUpperCase()}|${range}`;
    const hit = cache.get(key);
    if (hit && hit.freshUntil > Date.now()) return hit.value;

    let pending = inFlight.get(key);
    if (!pending) {
        pending = load(symbol, range)
            .then((value) => {
                store(key, value, value ? RANGES[range].ttl * 1000 : FAILURE_TTL_MS);
                return value;
            })
            .catch((e) => {
                console.error('Price history failed for', symbol, range, e);
                // Keep showing the last good chart through an outage
                store(key, hit?.value ?? null, FAILURE_TTL_MS);
                return hit?.value ?? null;
            })
            .finally(() => inFlight.delete(key));
        inFlight.set(key, pending);
    }
    return pending;
}

function store(key: string, value: PriceHistory | null, ttlMs: number) {
    if (cache.size >= MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value!);
    cache.set(key, { value, freshUntil: Date.now() + ttlMs });
}
