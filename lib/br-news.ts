// Company news for B3 (Brazil) listings. Finnhub's company-news has nothing for .SA symbols, so these come from
// the Google News RSS search in Portuguese (no key needed). Google allows the feed for personal, non-commercial
// use only, which fits a self-hosted instance.
const FEED_URL = 'https://news.google.com/rss/search';
const FETCH_TIMEOUT_MS = 5000;
const TTL_MS = 15 * 60_000;
const FAILURE_TTL_MS = 60_000;

const cache = new Map<string, { items: RawNewsArticle[]; freshUntil: number }>();

const decode = (text: string) =>
    text
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
        .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
        .replace(/&amp;/g, '&')
        .trim();

const tag = (xml: string, name: string) => {
    const match = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
    return match ? decode(match[1]) : '';
};

function parseFeed(xml: string): RawNewsArticle[] {
    return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].flatMap(([, item], i) => {
        const source = tag(item, 'source');
        // Google appends " - Source" to every title
        const title = tag(item, 'title');
        const headline = source && title.endsWith(` - ${source}`) ? title.slice(0, -(source.length + 3)) : title;
        const url = tag(item, 'link');
        const datetime = Math.floor(Date.parse(tag(item, 'pubDate')) / 1000);
        if (!headline || !url || !Number.isFinite(datetime)) return [];
        // Spam pages title themselves with long runs of tickers ("PETR4 CEBR6 TASA4 CXSE3 ...")
        if ((headline.match(/\b[A-Z]{4}\d{1,2}\b/g) ?? []).length >= 6) return [];
        return [{ id: datetime + i, headline, summary: headline, source: source || 'Google Notícias', url, datetime }];
    });
}

async function search(q: string, period = '7d') {
    const params = new URLSearchParams({ q: `${q} when:${period}`, hl: 'pt-BR', gl: 'BR', ceid: 'BR:pt-419' });
    const res = await fetch(`${FEED_URL}?${params}`, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS), cache: 'no-store' });
    if (!res.ok) throw new Error(`Google News RSS ${res.status}`);
    return parseFeed(await res.text());
}

export async function getB3News(symbol: string): Promise<RawNewsArticle[]> {
    const ticker = symbol.toUpperCase().replace(/\.SA$/, '');
    const hit = cache.get(ticker);
    if (hit && hit.freshUntil > Date.now()) return hit.items;

    try {
        // Ticker in the headline keeps out pages that only show it in a quotes sidebar;
        // thinly covered tickers fall back to a mention anywhere
        let items = await search(`intitle:${ticker}`);
        if (items.length < 3) items = await search(ticker);
        items.sort((a, b) => (b.datetime ?? 0) - (a.datetime ?? 0));
        cache.set(ticker, { items, freshUntil: Date.now() + TTL_MS });
        return items;
    } catch (e) {
        console.error('Error fetching B3 news for', ticker, e);
        cache.set(ticker, { items: hit?.items ?? [], freshUntil: Date.now() + FAILURE_TTL_MS });
        return hit?.items ?? [];
    }
}

// General Brazilian market headlines, for the Brazil dashboard and a watchlist with no company news
export async function getBrazilMarketNews(): Promise<MarketNewsArticle[]> {
    const key = '__market__';
    const hit = cache.get(key);
    let items = hit && hit.freshUntil > Date.now() ? hit.items : null;
    if (!items) {
        try {
            items = (await search('Ibovespa OR "bolsa brasileira" OR "ações da B3"', '2d'))
                .sort((a, b) => (b.datetime ?? 0) - (a.datetime ?? 0));
            cache.set(key, { items, freshUntil: Date.now() + TTL_MS });
        } catch (e) {
            console.error('Error fetching Brazilian market news', e);
            items = hit?.items ?? [];
            cache.set(key, { items, freshUntil: Date.now() + FAILURE_TTL_MS });
        }
    }
    return items.slice(0, 12).map((a) => ({
        id: a.id, headline: a.headline!, summary: a.summary!, source: a.source!, url: a.url!, datetime: a.datetime!,
        category: 'general', related: 'B3',
    }));
}
