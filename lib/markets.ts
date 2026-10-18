// Markets OpenStock can show for free. Coverage was tested against the free data sources:
//   - Finnhub free: US stocks and crypto only (every other exchange returns 403).
//   - TradingView embeds: US, crypto, forex live; TSX + ASX delayed; BSE + XETRA end-of-day.
//     NSE and TVC indices (NIFTY, FTSE, DAX, N225, HSI) are blocked in embeds; LSE, Tokyo, Hong Kong and
//     others block only the candle chart (see CHART_BLOCKED_EXCHANGES in lib/utils.ts).
// Adding a market = adding an entry here with symbols from an exchange that renders in embeds.

import { isInternationalSymbol } from "@/lib/utils";

export type MarketId = 'us' | 'br' | 'in' | 'de' | 'ca' | 'au' | 'crypto' | 'fx';

type Hours = { open: number; close: number }; // minutes of the local day

export type Market = {
    id: MarketId;
    name: string;
    short: string;
    timeZone: string;
    hours: Hours | '24/7' | '24/5';
    feed: 'Live' | 'Delayed' | 'End of day';
    // Tiles on the dashboard. `finnhub` set = native tile with our own cached quote (Finnhub, or brapi for .SA);
    // otherwise a TradingView quote.
    pulse: { symbol: string; label: string; finnhub?: string }[];
    groups: { title: string; symbols: [symbol: string, name: string][] }[];
    heatmap?: 'stocks' | 'crypto';
    news: 'stock' | 'crypto' | 'forex';
};

const hm = (h: number, m = 0) => h * 60 + m;

export const MARKETS: Market[] = [
    {
        id: 'br', name: 'Brasil', short: 'BR', timeZone: 'America/Sao_Paulo', hours: { open: hm(10), close: hm(17) }, feed: 'Delayed',
        // Native tiles are priced by brapi.dev (the Ibovespa tile needs a BRAPI_TOKEN)
        pulse: [
            { symbol: 'BMFBOVESPA:IBOV', label: 'Ibovespa', finnhub: 'IBOV.SA' },
            { symbol: 'BMFBOVESPA:PETR4', label: 'Petrobras', finnhub: 'PETR4.SA' },
            { symbol: 'BMFBOVESPA:VALE3', label: 'Vale', finnhub: 'VALE3.SA' },
            { symbol: 'BMFBOVESPA:ITUB4', label: 'Itaú Unibanco', finnhub: 'ITUB4.SA' },
        ],
        groups: [
            { title: 'Bancos', symbols: [['BMFBOVESPA:ITUB4', 'Itaú Unibanco'], ['BMFBOVESPA:BBDC4', 'Bradesco'], ['BMFBOVESPA:BBAS3', 'Banco do Brasil'], ['BMFBOVESPA:SANB11', 'Santander Brasil'], ['BMFBOVESPA:BPAC11', 'BTG Pactual']] },
            { title: 'Commodities', symbols: [['BMFBOVESPA:PETR4', 'Petrobras'], ['BMFBOVESPA:VALE3', 'Vale'], ['BMFBOVESPA:SUZB3', 'Suzano'], ['BMFBOVESPA:GGBR4', 'Gerdau'], ['BMFBOVESPA:PRIO3', 'PRIO']] },
            { title: 'Consumo e indústria', symbols: [['BMFBOVESPA:ABEV3', 'Ambev'], ['BMFBOVESPA:WEGE3', 'WEG'], ['BMFBOVESPA:RENT3', 'Localiza'], ['BMFBOVESPA:MGLU3', 'Magazine Luiza'], ['BMFBOVESPA:LREN3', 'Lojas Renner']] },
        ],
        news: 'stock',
    },
    {
        id: 'us', name: 'Estados Unidos', short: 'US', timeZone: 'America/New_York', hours: { open: hm(9, 30), close: hm(16) }, feed: 'Live',
        pulse: [
            { symbol: 'AMEX:SPY', label: 'S&P 500', finnhub: 'SPY' },
            { symbol: 'NASDAQ:QQQ', label: 'Nasdaq 100', finnhub: 'QQQ' },
            { symbol: 'AMEX:DIA', label: 'Dow 30', finnhub: 'DIA' },
            { symbol: 'AMEX:IWM', label: 'Russell 2000', finnhub: 'IWM' },
        ],
        groups: [
            { title: 'Financeiro', symbols: [['NYSE:JPM', 'JPMorgan Chase'], ['NYSE:BAC', 'Bank of America'], ['NYSE:WFC', 'Wells Fargo'], ['NYSE:GS', 'Goldman Sachs'], ['NYSE:MA', 'Mastercard'], ['NYSE:V', 'Visa']] },
            { title: 'Tecnologia', symbols: [['NASDAQ:AAPL', 'Apple'], ['NASDAQ:MSFT', 'Microsoft'], ['NASDAQ:NVDA', 'NVIDIA'], ['NASDAQ:GOOGL', 'Alphabet'], ['NASDAQ:META', 'Meta'], ['NASDAQ:AMD', 'AMD']] },
            { title: 'Consumo', symbols: [['NASDAQ:AMZN', 'Amazon'], ['NASDAQ:TSLA', 'Tesla'], ['NYSE:WMT', 'Walmart'], ['NASDAQ:COST', 'Costco'], ['NYSE:KO', 'Coca-Cola'], ['NASDAQ:NFLX', 'Netflix']] },
        ],
        heatmap: 'stocks', news: 'stock',
    },
    {
        id: 'in', name: 'Índia', short: 'IN', timeZone: 'Asia/Kolkata', hours: { open: hm(9, 15), close: hm(15, 30) }, feed: 'End of day',
        pulse: [
            { symbol: 'BSE:SENSEX', label: 'Sensex' },
            { symbol: 'BSE:RELIANCE', label: 'Reliance' },
            { symbol: 'BSE:TCS', label: 'TCS' },
            { symbol: 'BSE:HDFCBANK', label: 'HDFC Bank' },
        ],
        groups: [
            { title: 'Bancos', symbols: [['BSE:HDFCBANK', 'HDFC Bank'], ['BSE:ICICIBANK', 'ICICI Bank'], ['BSE:SBIN', 'State Bank of India'], ['BSE:KOTAKBANK', 'Kotak Mahindra'], ['BSE:AXISBANK', 'Axis Bank']] },
            { title: 'Tecnologia', symbols: [['BSE:TCS', 'TCS'], ['BSE:INFY', 'Infosys'], ['BSE:WIPRO', 'Wipro'], ['BSE:HCLTECH', 'HCLTech'], ['BSE:TECHM', 'Tech Mahindra']] },
            { title: 'Indústria', symbols: [['BSE:RELIANCE', 'Reliance'], ['BSE:LT', 'Larsen & Toubro'], ['BSE:ONGC', 'ONGC'], ['BSE:NTPC', 'NTPC'], ['BSE:TATASTEEL', 'Tata Steel']] },
        ],
        news: 'stock',
    },
    {
        id: 'de', name: 'Alemanha', short: 'DE', timeZone: 'Europe/Berlin', hours: { open: hm(9), close: hm(17, 30) }, feed: 'End of day',
        pulse: [
            { symbol: 'XETR:SAP', label: 'SAP' },
            { symbol: 'XETR:SIE', label: 'Siemens' },
            { symbol: 'XETR:ALV', label: 'Allianz' },
            { symbol: 'XETR:DTE', label: 'Deutsche Telekom' },
        ],
        groups: [
            { title: 'Indústria', symbols: [['XETR:SIE', 'Siemens'], ['XETR:BAS', 'BASF'], ['XETR:BMW', 'BMW'], ['XETR:MBG', 'Mercedes-Benz'], ['XETR:VOW3', 'Volkswagen']] },
            { title: 'Finanças', symbols: [['XETR:ALV', 'Allianz'], ['XETR:MUV2', 'Munich Re'], ['XETR:DBK', 'Deutsche Bank'], ['XETR:CBK', 'Commerzbank']] },
            { title: 'Tecnologia', symbols: [['XETR:SAP', 'SAP'], ['XETR:IFX', 'Infineon'], ['XETR:DTE', 'Deutsche Telekom'], ['XETR:ADS', 'Adidas']] },
        ],
        news: 'stock',
    },
    {
        id: 'ca', name: 'Canadá', short: 'CA', timeZone: 'America/Toronto', hours: { open: hm(9, 30), close: hm(16) }, feed: 'Delayed',
        pulse: [
            { symbol: 'TSX:RY', label: 'Royal Bank' },
            { symbol: 'TSX:SHOP', label: 'Shopify' },
            { symbol: 'TSX:ENB', label: 'Enbridge' },
            { symbol: 'TSX:TD', label: 'TD Bank' },
        ],
        groups: [
            { title: 'Bancos', symbols: [['TSX:RY', 'Royal Bank'], ['TSX:TD', 'TD Bank'], ['TSX:BNS', 'Scotiabank'], ['TSX:BMO', 'Bank of Montreal']] },
            { title: 'Energia', symbols: [['TSX:ENB', 'Enbridge'], ['TSX:CNQ', 'Canadian Natural'], ['TSX:SU', 'Suncor']] },
            { title: 'Crescimento', symbols: [['TSX:SHOP', 'Shopify'], ['TSX:CNR', 'CN Rail'], ['TSX:CP', 'CPKC']] },
        ],
        news: 'stock',
    },
    {
        id: 'au', name: 'Austrália', short: 'AU', timeZone: 'Australia/Sydney', hours: { open: hm(10), close: hm(16) }, feed: 'Delayed',
        pulse: [
            { symbol: 'ASX:CBA', label: 'CommBank' },
            { symbol: 'ASX:BHP', label: 'BHP' },
            { symbol: 'ASX:CSL', label: 'CSL' },
            { symbol: 'ASX:NAB', label: 'NAB' },
        ],
        groups: [
            { title: 'Bancos', symbols: [['ASX:CBA', 'CommBank'], ['ASX:NAB', 'NAB'], ['ASX:WBC', 'Westpac'], ['ASX:ANZ', 'ANZ'], ['ASX:MQG', 'Macquarie']] },
            { title: 'Recursos naturais', symbols: [['ASX:BHP', 'BHP'], ['ASX:FMG', 'Fortescue'], ['ASX:RIO', 'Rio Tinto']] },
            { title: 'Consumo e saúde', symbols: [['ASX:CSL', 'CSL'], ['ASX:WES', 'Wesfarmers'], ['ASX:WOW', 'Woolworths']] },
        ],
        news: 'stock',
    },
    {
        id: 'crypto', name: 'Cripto', short: 'Crypto', timeZone: 'UTC', hours: '24/7', feed: 'Live',
        pulse: [
            { symbol: 'BINANCE:BTCUSDT', label: 'Bitcoin', finnhub: 'BINANCE:BTCUSDT' },
            { symbol: 'BINANCE:ETHUSDT', label: 'Ethereum', finnhub: 'BINANCE:ETHUSDT' },
            { symbol: 'BINANCE:SOLUSDT', label: 'Solana', finnhub: 'BINANCE:SOLUSDT' },
            { symbol: 'BINANCE:BNBUSDT', label: 'BNB', finnhub: 'BINANCE:BNBUSDT' },
        ],
        groups: [
            { title: 'Principais', symbols: [['BINANCE:BTCUSDT', 'Bitcoin'], ['BINANCE:ETHUSDT', 'Ethereum'], ['BINANCE:SOLUSDT', 'Solana'], ['BINANCE:BNBUSDT', 'BNB'], ['BINANCE:XRPUSDT', 'XRP']] },
            { title: 'Outras', symbols: [['BINANCE:ADAUSDT', 'Cardano'], ['BINANCE:DOGEUSDT', 'Dogecoin'], ['BINANCE:AVAXUSDT', 'Avalanche'], ['BINANCE:LINKUSDT', 'Chainlink'], ['BINANCE:DOTUSDT', 'Polkadot']] },
        ],
        heatmap: 'crypto', news: 'crypto',
    },
    {
        id: 'fx', name: 'Forex', short: 'FX', timeZone: 'America/New_York', hours: '24/5', feed: 'Live',
        pulse: [
            { symbol: 'FX:EURUSD', label: 'EUR / USD' },
            { symbol: 'FX:GBPUSD', label: 'GBP / USD' },
            { symbol: 'FX:USDJPY', label: 'USD / JPY' },
            { symbol: 'FX:AUDUSD', label: 'AUD / USD' },
        ],
        groups: [
            { title: 'Principais', symbols: [['FX:EURUSD', 'EUR / USD'], ['FX:GBPUSD', 'GBP / USD'], ['FX:USDJPY', 'USD / JPY'], ['FX:USDCHF', 'USD / CHF']] },
            { title: 'Moedas de commodities', symbols: [['FX:AUDUSD', 'AUD / USD'], ['FX:USDCAD', 'USD / CAD'], ['FX:NZDUSD', 'NZD / USD']] },
        ],
        news: 'forex',
    },
];

// Brazil first: this instance is set up for B3; the other markets are a click away
// Feed labels as shown on screen
export const FEED_LABEL: Record<Market['feed'], string> = { 'Live': 'tempo real', 'Delayed': 'com atraso', 'End of day': 'fim do dia' };

export const DEFAULT_MARKET: MarketId = 'br';
export const MARKET_COOKIE = 'openstock-market';

export const getMarket = (id?: string | null) => MARKETS.find((m) => m.id === id) ?? MARKETS.find((m) => m.id === DEFAULT_MARKET)!;

const COUNTRY_MARKET: Record<string, MarketId> = { BR: 'br', IN: 'in', DE: 'de', CA: 'ca', AU: 'au' };
export const marketForCountry = (country?: string | null): MarketId => COUNTRY_MARKET[country ?? ''] ?? DEFAULT_MARKET;

// Finnhub free can price (and so alert on) US listings and Binance pairs only.
export const hasFinnhubQuotes = (symbol: string) => {
    const upper = symbol.toUpperCase();
    if (upper.startsWith('BINANCE:')) return true;
    return !upper.includes(':') && !isInternationalSymbol(upper);
};

// B3 (Brazil) listings, priced through brapi.dev instead of Finnhub
export const isB3Symbol = (symbol: string) => /^[A-Z0-9]+\.SA$/i.test(symbol);

// Symbols we can show our own quote for: Finnhub's free coverage plus B3 through brapi.
// Alerts stay on hasFinnhubQuotes, since the alert checker only runs against Finnhub.
export const hasLiveQuotes = (symbol: string) => hasFinnhubQuotes(symbol) || isB3Symbol(symbol);

// Is the market trading right now, in its own time zone? Holidays aren't modelled.
export function isMarketOpen(market: Market, date = new Date()) {
    if (market.hours === '24/7') return true;
    const parts = Object.fromEntries(
        new Intl.DateTimeFormat('en-US', { timeZone: market.timeZone, weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
            .formatToParts(date).map((p) => [p.type, p.value]),
    );
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday);
    const minutes = Number(parts.hour) * 60 + Number(parts.minute);
    if (market.hours === '24/5') {
        // FX: Sunday 17:00 to Friday 17:00, New York time
        if (day === 6) return false;
        if (day === 0) return minutes >= hm(17);
        if (day === 5) return minutes < hm(17);
        return true;
    }
    return day >= 1 && day <= 5 && minutes >= market.hours.open && minutes < market.hours.close;
}
