import { Suspense } from "react";
import { cookies } from "next/headers";
import TradingViewWidget from "@/components/TradingViewWidget";
import Panel from "@/components/Panel";
import IndexPulse, { PulseSkeleton } from "@/components/IndexPulse";
import DataFreshness from "@/components/DataFreshness";
import MarketSwitcher from "@/components/MarketSwitcher";
import {
    CRYPTO_HEATMAP_CONFIG,
    STOCK_HEATMAP_CONFIG,
    marketOverviewConfig,
    marketQuotesConfig,
    timelineConfig,
} from "@/lib/constants";
import { FEED_LABEL, MARKETS, MARKET_COOKIE, getMarket, isMarketOpen, marketForCountry } from "@/lib/markets";
import { getSession } from "@/lib/better-auth/auth";
import { getBrazilMarketNews } from "@/lib/br-news";
import NewsList from "@/components/watchlist/NewsList";

const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

// Widgets come from TradingView (live, no Finnhub quota) and render immediately; the tiles stream in.
export default async function Dashboard({ searchParams }: { searchParams: Promise<{ market?: string }> }) {
    const { market: requested } = await searchParams;
    // Explicit choice, then the remembered one, then the market of the user's country
    const saved = (await cookies()).get(MARKET_COOKIE)?.value;
    const market = getMarket(requested ?? saved ?? marketForCountry((await getSession())?.user.country));
    const open = isMarketOpen(market);
    const native = market.pulse.some((p) => p.finnhub);
    const heatmap = market.heatmap === 'stocks'
        ? { script: 'stock-heatmap.js', config: STOCK_HEATMAP_CONFIG, title: 'Mapa de calor do S&P 500' }
        : market.heatmap === 'crypto'
            ? { script: 'crypto-coins-heatmap.js', config: CRYPTO_HEATMAP_CONFIG, title: 'Mapa de calor de cripto' }
            : null;

    return (
        <>
            <header className="page-head">
                <div>
                    <h1 className="page-title">Mercados</h1>
                    <p className="page-sub">{market.name} · {open ? 'aberto agora' : 'fechado agora'} · dados {FEED_LABEL[market.feed]}</p>
                </div>
            </header>

            <MarketSwitcher active={market.id} openIds={MARKETS.filter((m) => isMarketOpen(m)).map((m) => m.id)} />

            <section className="hatch">
                <div className="section-head">
                    <div>
                        <h2 className="section-title">Destaques</h2>
                        <p className="section-sub">{native ? `Cotações via ${market.id === 'br' ? 'brapi.dev' : 'Finnhub'}` : `Cotações ${FEED_LABEL[market.feed]} via TradingView`}</p>
                    </div>
                    {native && <DataFreshness />}
                </div>
                {/* Keyed so switching markets swaps the tiles instead of reusing old widgets */}
                <Suspense key={market.id} fallback={<PulseSkeleton />}>
                    <IndexPulse market={market} />
                </Suspense>
            </section>

            <div key={market.id} className="flex flex-col gap-3">
                <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                    <Panel title="Líderes" sub="Tendência de 12 meses por grupo">
                        <TradingViewWidget scriptUrl={`${scriptUrl}market-overview.js`} config={marketOverviewConfig(market.groups)} height={560} />
                    </Panel>
                    {heatmap ? (
                        <Panel title={heatmap.title} sub="Tamanho pelo valor de mercado, cor pela variação de hoje">
                            <TradingViewWidget scriptUrl={`${scriptUrl}${heatmap.script}`} config={heatmap.config} height={560} allowExpand />
                        </Panel>
                    ) : (
                        <Panel title="Cotações" sub={`Líderes por grupo · ${market.name}`}>
                            <TradingViewWidget scriptUrl={`${scriptUrl}market-quotes.js`} config={marketQuotesConfig(market.groups)} height={560} />
                        </Panel>
                    )}
                </div>

                <div className="grid gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    {heatmap && (
                        <Panel title="Cotações" sub={`Líderes por grupo · ${market.name}`}>
                            <TradingViewWidget scriptUrl={`${scriptUrl}market-quotes.js`} config={marketQuotesConfig(market.groups)} height={560} />
                        </Panel>
                    )}
                    <Panel title="Principais notícias" sub="Mais recentes primeiro" className={heatmap ? '' : 'xl:col-span-2'}>
                        {/* TradingView's feed is English-only; Brazil gets Portuguese headlines from Google News */}
                        {market.id === 'br' ? (
                            <div className="max-h-[560px] overflow-y-auto"><NewsList news={await getBrazilMarketNews()} /></div>
                        ) : (
                            <TradingViewWidget scriptUrl={`${scriptUrl}timeline.js`} config={timelineConfig(market.news)} height={560} />
                        )}
                    </Panel>
                </div>
            </div>
        </>
    );
}
