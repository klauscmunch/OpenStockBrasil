// Community links, used across the app, landing page and emails
export const REPO_URL = 'https://github.com/Open-Dev-Society/OpenStock';
// GitHub account that receives sponsorships. Switch to 'Open-Dev-Society' once the org's
// GitHub Sponsors listing is live (github.com/sponsors/Open-Dev-Society); every link follows.
export const SPONSOR_GITHUB_ACCOUNT = 'ravixalgorithm';
export const SPONSOR_URL = `https://github.com/sponsors/${SPONSOR_GITHUB_ACCOUNT}`;
// Opens GitHub's checkout with the amount and frequency already picked
export const sponsorCheckoutUrl = (amount?: number, frequency: 'recurring' | 'one-time' = 'recurring') =>
    `${SPONSOR_URL}/sponsorships?frequency=${frequency}${amount ? `&amount=${amount}` : ''}`;
export const DISCORD_URL = 'https://discord.gg/JkJ8kfxgxB';
export const GOOD_FIRST_ISSUES_URL = `${REPO_URL}/issues?q=is%3Aopen+label%3A%22good+first+issue%22`;

// Sign-up form select options
export const INVESTMENT_GOALS = [
    { value: 'Growth', label: 'Crescimento' },
    { value: 'Income', label: 'Renda' },
    { value: 'Balanced', label: 'Equilibrado' },
    { value: 'Conservative', label: 'Conservador' },
];

export const RISK_TOLERANCE_OPTIONS = [
    { value: 'Low', label: 'Baixa' },
    { value: 'Medium', label: 'Média' },
    { value: 'High', label: 'Alta' },
];

export const PREFERRED_INDUSTRIES = [
    { value: 'Technology', label: 'Tecnologia' },
    { value: 'Healthcare', label: 'Saúde' },
    { value: 'Finance', label: 'Finanças' },
    { value: 'Energy', label: 'Energia' },
    { value: 'Consumer Goods', label: 'Bens de consumo' },
];

export const ALERT_TYPE_OPTIONS = [
    { value: 'upper', label: 'Acima' },
    { value: 'lower', label: 'Abaixo' },
];

export const CONDITION_OPTIONS = [
    { value: 'greater', label: 'Maior que (>)' },
    { value: 'less', label: 'Menor que (<)' },
];

// TradingView widgets, built per market from lib/markets.ts groups
type SymbolGroup = { title: string; symbols: [symbol: string, name: string][] };

export const marketOverviewConfig = (groups: SymbolGroup[]) => ({
    colorTheme: 'dark',
    dateRange: '12M',
    locale: 'br',
    largeChartUrl: '',
    isTransparent: true,
    showFloatingTooltip: true,
    plotLineColorGrowing: '#47d9bb', // brand teal (oklch 0.80 0.13 176)
    plotLineColorFalling: '#47d9bb',
    gridLineColor: 'rgba(240, 243, 250, 0)',
    scaleFontColor: '#adaba3', // --muted
    belowLineFillColorGrowing: 'rgba(71, 217, 187, 0.12)',
    belowLineFillColorFalling: 'rgba(71, 217, 187, 0.12)',
    belowLineFillColorGrowingBottom: 'rgba(71, 217, 187, 0)',
    belowLineFillColorFallingBottom: 'rgba(71, 217, 187, 0)',
    symbolActiveColor: 'rgba(71, 217, 187, 0.08)',
    tabs: groups.map(({ title, symbols }) => ({ title, symbols: symbols.map(([s, d]) => ({ s, d })) })),
    support_host: 'https://www.tradingview.com',
    showSymbolLogo: true,
    showChart: true,
});

export const marketQuotesConfig = (groups: SymbolGroup[]) => ({
    locale: 'br',
    showSymbolLogo: true,
    colorTheme: 'dark',
    isTransparent: true,
    symbolsGroups: groups.map(({ title, symbols }) => ({ name: title, symbols: symbols.map(([name, displayName]) => ({ name, displayName })) })),
});

export const STOCK_HEATMAP_CONFIG = {
    dataSource: 'SPX500',
    blockSize: 'market_cap_basic',
    blockColor: 'change',
    grouping: 'sector',
    isTransparent: true,
    locale: 'br',
    symbolUrl: '',
    colorTheme: 'dark',
    exchanges: [],
    hasTopBar: false,
    isDataSetEnabled: false,
    isZoomEnabled: true,
    hasSymbolTooltip: true,
    isMonoSize: false,
};

export const CRYPTO_HEATMAP_CONFIG = {
    dataSource: 'Crypto',
    blockSize: 'market_cap_calc',
    blockColor: 'change',
    locale: 'br',
    symbolUrl: '',
    colorTheme: 'dark',
    hasTopBar: false,
    isDataSetEnabled: false,
    isZoomEnabled: true,
    hasSymbolTooltip: true,
    isMonoSize: false,
    isTransparent: true,
};

export const timelineConfig = (market: 'stock' | 'crypto' | 'forex') => ({
    displayMode: 'regular',
    feedMode: 'market',
    colorTheme: 'dark',
    isTransparent: true,
    locale: 'br',
    market,
});

// Line chart with the price and the change over the range; used by the watchlist cards and the landing preview
export const MINI_CHART_SCRIPT = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
export type ChartRange = '1D' | '1M' | '6M' | '12M';
export const CHART_RANGES: { value: ChartRange; label: string }[] = [
    { value: '1D', label: '1D' }, { value: '1M', label: '1M' }, { value: '6M', label: '6M' }, { value: '12M', label: '12M' },
];
export const miniChartConfig = (symbol: string, dateRange: ChartRange = '1M') => ({
    symbol, locale: 'br', dateRange, colorTheme: 'dark', isTransparent: true, autosize: true,
    trendLineColor: '#47d9bb', underLineColor: 'rgba(71, 217, 187, 0.14)', underLineBottomColor: 'rgba(71, 217, 187, 0)',
});

export const symbolInfoConfig = (symbol: string) => ({
    symbol,
    colorTheme: 'dark',
    isTransparent: true,
    locale: 'br',
    width: '100%',
});

export const singleQuoteConfig = (symbol: string) => ({
    symbol,
    colorTheme: 'dark',
    isTransparent: true,
    locale: 'br',
});

export const CANDLE_CHART_WIDGET_CONFIG = (symbol: string) => ({
    allow_symbol_change: false,
    calendar: false,
    details: true,
    hide_side_toolbar: false, // drawing tools (trend lines, Fibonacci, text); drawings last until reload
    hide_top_toolbar: false,
    hide_legend: false,
    hide_volume: false,
    hotlist: false,
    interval: 'D',
    locale: 'br',
    save_image: false,
    style: 1,
    symbol: symbol.toUpperCase(),
    theme: 'dark',
    timezone: 'exchange',
    backgroundColor: '#1f1e1a', // --card
    gridColor: 'rgba(255, 255, 255, 0.04)',
    watchlist: [],
    withdateranges: false,
    compareSymbols: [],
    studies: [],
    width: '100%',
    height: 600,
});

export const TECHNICAL_ANALYSIS_WIDGET_CONFIG = (symbol: string) => ({
    symbol: symbol.toUpperCase(),
    colorTheme: 'dark',
    isTransparent: true,
    locale: 'br',
    width: '100%',
    height: 400,
    interval: '1h',
    largeChartUrl: '',
});

// embed-widget-company-profile.js was retired by TradingView (403); symbol-profile.js takes the same config
export const COMPANY_PROFILE_WIDGET_CONFIG = (symbol: string) => ({
    symbol: symbol.toUpperCase(),
    colorTheme: 'dark',
    isTransparent: true,
    locale: 'br',
    width: '100%',
    height: 440,
});

export const COMPANY_FINANCIALS_WIDGET_CONFIG = (symbol: string) => ({
    symbol: symbol.toUpperCase(),
    colorTheme: 'dark',
    isTransparent: true,
    locale: 'br',
    width: '100%',
    height: 464,
    displayMode: 'regular',
    largeChartUrl: '',
});

// Default list in the search palette (static on purpose, see searchStocks)
// Shown in the search palette before typing: B3 leaders, since this instance is set up for Brazil
export const POPULAR_STOCKS = [
    { symbol: 'PETR4.SA', name: 'Petrobras', exchange: 'B3' },
    { symbol: 'VALE3.SA', name: 'Vale', exchange: 'B3' },
    { symbol: 'ITUB4.SA', name: 'Itaú Unibanco', exchange: 'B3' },
    { symbol: 'BBAS3.SA', name: 'Banco do Brasil', exchange: 'B3' },
    { symbol: 'BBDC4.SA', name: 'Bradesco', exchange: 'B3' },
    { symbol: 'ABEV3.SA', name: 'Ambev', exchange: 'B3' },
    { symbol: 'WEGE3.SA', name: 'WEG', exchange: 'B3' },
    { symbol: 'B3SA3.SA', name: 'B3', exchange: 'B3' },
    { symbol: 'PRIO3.SA', name: 'PRIO', exchange: 'B3' },
    { symbol: 'MGLU3.SA', name: 'Magazine Luiza', exchange: 'B3' },
];

export const NO_MARKET_NEWS =
    '<p class="mobile-text" style="margin:0 0 20px 0;font-size:16px;line-height:1.6;color:#4b5563;">Nenhuma notícia do mercado hoje. Volte amanhã.</p>';

export const WATCHLIST_TABLE_HEADER = [
    'Empresa',
    'Ticker',
    'Preço',
    'Variação',
    'Valor de mercado',
    'P/L',
    'Alerta',
    'Ação',
];

export const PASSWORD_RULES = [
    { label: 'Pelo menos 8 caracteres', test: (pw: string) => pw.length >= 8 },
    { label: 'Pelo menos 1 letra maiúscula', test: (pw: string) => /[A-Z]/.test(pw) },
    { label: 'Pelo menos 1 letra minúscula', test: (pw: string) => /[a-z]/.test(pw) },
    { label: 'Pelo menos 1 número', test: (pw: string) => /[0-9]/.test(pw) },
] as const;

export const PASSWORD_VALIDATION = {
    required: 'Informe a senha',
    minLength: { value: 8, message: 'A senha precisa ter pelo menos 8 caracteres' },
    pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        message: 'A senha precisa ter letra maiúscula, letra minúscula e número',
    },
};
