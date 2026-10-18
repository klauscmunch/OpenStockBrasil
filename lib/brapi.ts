// brapi.dev prices B3 (Brazil) listings, which Finnhub's free plan refuses with a 403.
// Without a token brapi serves full quotes for a few test tickers (PETR4, VALE3, ITUB4, MGLU3) and its
// list endpoint for every ticker; a free token (https://brapi.dev/dashboard) unlocks full quotes for all.
const BRAPI_BASE_URL = 'https://brapi.dev/api';
const BRAPI_TOKEN = process.env.BRAPI_TOKEN?.trim();
const FETCH_TIMEOUT_MS = 5000;
const FAILURE_TTL_MS = 60_000;
const MAX_CACHE_ENTRIES = 500;

type BrapiQuote = {
    symbol: string;
    longName?: string;
    shortName?: string;
    currency?: string;
    regularMarketPrice?: number;
    regularMarketChange?: number;
    regularMarketChangePercent?: number;
    regularMarketDayHigh?: number;
    regularMarketDayLow?: number;
    regularMarketOpen?: number;
    regularMarketPreviousClose?: number;
    regularMarketTime?: string;
    marketCap?: number;
    logourl?: string;
};

type BrapiListItem = {
    stock: string;
    name?: string;
    close?: number;
    change?: number; // percent
    market_cap?: number;
    logo?: string;
    sector?: string;
    type?: string;
};

// Same shapes the Finnhub actions return, so callers don't care which provider priced a symbol
export type B3Quote = { c?: number; d?: number; dp?: number; h?: number; l?: number; o?: number; pc?: number; t?: number };
export type B3Profile = { currency: string; exchange: string; logo?: string; marketCapitalization?: number; name?: string; ticker: string; finnhubIndustry?: string };
export type B3Listing = { symbol: string; name: string };

// IBOV is how B3 and TradingView name the Ibovespa; brapi calls it ^BVSP
const toTicker = (symbol: string) => {
    const ticker = symbol.toUpperCase().replace(/\.SA$/, '');
    return ticker === 'IBOV' ? '^BVSP' : ticker;
};

const cache = new Map<string, { value: unknown; freshUntil: number }>();
const inFlight = new Map<string, Promise<unknown>>();

async function get<T>(path: string, ttlSeconds: number, withToken = true): Promise<T | null> {
    const key = `${path}|${withToken}`;
    const hit = cache.get(key);
    if (hit && hit.freshUntil > Date.now()) return hit.value as T | null;

    let pending = inFlight.get(key) as Promise<T | null> | undefined;
    if (!pending) {
        pending = (async () => {
            try {
                const res = await fetch(`${BRAPI_BASE_URL}${path}`, {
                    headers: withToken && BRAPI_TOKEN ? { Authorization: `Bearer ${BRAPI_TOKEN}` } : undefined,
                    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
                    cache: 'no-store',
                });
                // A rate limit (429) or outage keeps serving the last good value instead of blanking the price
                const value = res.ok ? ((await res.json()) as T) : ((hit?.value as T | undefined) ?? null);
                // 401/402 mean "needs a token or a higher plan": remember for a while instead of retrying every view
                if (!res.ok && res.status !== 401 && res.status !== 402) console.error(`brapi ${path.split('?')[0]} failed: ${res.status}`);
                store(key, value, value ? ttlSeconds * 1000 : FAILURE_TTL_MS);
                return value;
            } catch (e) {
                console.error(`brapi ${path.split('?')[0]} failed`, e);
                store(key, hit?.value ?? null, FAILURE_TTL_MS);
                return (hit?.value as T) ?? null;
            } finally {
                inFlight.delete(key);
            }
        })();
        inFlight.set(key, pending);
    }
    return pending;
}

function store(key: string, value: unknown, ttlMs: number) {
    if (cache.size >= MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value!);
    cache.set(key, { value, freshUntil: Date.now() + ttlMs });
}

async function getFullQuote(symbol: string, ttlSeconds: number) {
    const data = await get<{ results?: BrapiQuote[] }>(`/quote/${encodeURIComponent(toTicker(symbol))}`, ttlSeconds);
    return data?.results?.[0] ?? null;
}

// The list endpoint needs no token: last close, % change, market cap and logo for any ticker
async function getListing(symbol: string, ttlSeconds: number) {
    const ticker = toTicker(symbol);
    const data = await get<{ stocks?: BrapiListItem[] }>(`/quote/list?search=${encodeURIComponent(ticker)}&limit=10`, ttlSeconds, false);
    return data?.stocks?.find((s) => s.stock.toUpperCase() === ticker) ?? null;
}

export async function getB3Quote(symbol: string, ttlSeconds: number): Promise<B3Quote | null> {
    const full = await getFullQuote(symbol, ttlSeconds);
    if (full?.regularMarketPrice) {
        return {
            c: full.regularMarketPrice,
            d: full.regularMarketChange,
            dp: full.regularMarketChangePercent,
            h: full.regularMarketDayHigh,
            l: full.regularMarketDayLow,
            o: full.regularMarketOpen,
            pc: full.regularMarketPreviousClose,
            t: full.regularMarketTime ? Math.floor(Date.parse(full.regularMarketTime) / 1000) : undefined,
        };
    }
    const listing = await getListing(symbol, ttlSeconds);
    if (!listing?.close) return null;
    const dp = listing.change ?? 0;
    const pc = listing.close / (1 + dp / 100);
    return { c: listing.close, dp, d: listing.close - pc, pc };
}

// brapi reports sectors with TradingView's English names
const SECTOR_LABEL: Record<string, string> = {
    'Energy Minerals': 'Minerais energéticos', 'Non-Energy Minerals': 'Mineração', 'Finance': 'Finanças',
    'Utilities': 'Utilidade pública', 'Consumer Non-Durables': 'Bens de consumo não duráveis',
    'Consumer Durables': 'Bens de consumo duráveis', 'Retail Trade': 'Varejo', 'Transportation': 'Transporte',
    'Health Services': 'Serviços de saúde', 'Health Technology': 'Tecnologia em saúde',
    'Technology Services': 'Serviços de tecnologia', 'Electronic Technology': 'Tecnologia eletrônica',
    'Industrial Services': 'Serviços industriais', 'Producer Manufacturing': 'Indústria de transformação',
    'Process Industries': 'Indústria de base', 'Communications': 'Comunicações', 'Commercial Services': 'Serviços comerciais',
    'Consumer Services': 'Serviços ao consumidor', 'Distribution Services': 'Distribuição', 'Miscellaneous': 'Diversos',
    'Government': 'Governo',
};

export async function getB3Profile(symbol: string): Promise<B3Profile | null> {
    const [full, listing] = await Promise.all([getFullQuote(symbol, 3600), getListing(symbol, 86400)]);
    if (!full && !listing) return null;
    const marketCap = full?.marketCap ?? listing?.market_cap;
    return {
        ticker: toTicker(symbol),
        name: full?.longName || listing?.name || toTicker(symbol),
        currency: full?.currency || 'BRL',
        exchange: 'B3',
        // brapi's icon URL for indices (^BVSP) is a dead link
        logo: toTicker(symbol).startsWith('^') ? undefined : full?.logourl || listing?.logo,
        // Finnhub reports market cap in millions; keep the same unit for formatNumber
        marketCapitalization: marketCap ? marketCap / 1e6 : undefined,
        finnhubIndustry: listing?.sector ? SECTOR_LABEL[listing.sector] ?? listing.sector : undefined,
    };
}

export async function searchB3(query: string): Promise<B3Listing[]> {
    const data = await get<{ stocks?: BrapiListItem[] }>(`/quote/list?search=${encodeURIComponent(query)}&limit=10`, 1800, false);
    return (data?.stocks ?? [])
        // Fractional-lot tickers (PETR4F) duplicate the main listing
        .filter((s) => !/^[A-Z]{4}\d{1,2}F$/i.test(s.stock))
        .map((s) => ({ symbol: `${s.stock.toUpperCase()}.SA`, name: s.name || s.stock }));
}
