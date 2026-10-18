import { Suspense } from "react";
import { CandlestickChart } from "lucide-react";
import TradingViewWidget from "@/components/TradingViewWidget";
import StockHeader, { StockHeaderSkeleton } from "@/components/stocks/StockHeader";
import StockSentimentCard from "@/components/stocks/StockSentimentCard";
import StockChart from "@/components/stocks/StockChart";
import Panel from "@/components/Panel";
import {
    TECHNICAL_ANALYSIS_WIDGET_CONFIG,
    COMPANY_PROFILE_WIDGET_CONFIG,
    COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";
import { getStockSentimentInsights } from '@/lib/actions/adanos.actions';
import { formatSymbolForTradingView, isChartEmbeddable, tradingViewSymbolUrl } from '@/lib/utils';

const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

async function Sentiment({ symbol }: { symbol: string }) {
    const insight = await getStockSentimentInsights(symbol);
    if (!insight) return null;
    return (
        <Panel title="Sentimento" sub="Reddit, X.com, notícias e Polymarket">
            <StockSentimentCard insight={insight} />
        </Panel>
    );
}

// Charts come straight from TradingView (live, no quota); only the header waits on Finnhub, and it streams.
export default async function StockDetails({ params }: StockDetailsPageProps) {
    const { symbol: rawSymbol } = await params;
    const symbol = decodeURIComponent(rawSymbol).toUpperCase();
    const tvSymbol = formatSymbolForTradingView(symbol);

    return (
        <>
            <Suspense fallback={<StockHeaderSkeleton />}>
                <StockHeader symbol={symbol} />
            </Suspense>

            <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
                <div className="flex min-w-0 flex-col gap-3">
                    {isChartEmbeddable(tvSymbol) ? (
                        <StockChart tvSymbol={tvSymbol} scriptUrl={`${scriptUrl}advanced-chart.js`} />
                    ) : (
                        // TradingView refuses this exchange's chart in embeds; say so instead of showing its error
                        <Panel title="Gráfico" sub="Disponível só no TradingView para esta bolsa">
                            <div className="empty-state py-14">
                                <span className="empty-icon"><CandlestickChart className="size-5" /></span>
                                <h3>Gráfico indisponível aqui</h3>
                                <p className="max-w-80 text-[13px]">
                                    O TradingView não libera gráficos da {tvSymbol.split(':')[0]} para outros sites. Os dados financeiros, a análise técnica e o perfil abaixo continuam funcionando.
                                </p>
                                <a href={tradingViewSymbolUrl(tvSymbol)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-2">
                                    Abrir gráfico no TradingView
                                </a>
                            </div>
                        </Panel>
                    )}
                    <Panel title="Dados financeiros" sub="DRE, balanço patrimonial e indicadores">
                        <TradingViewWidget
                            scriptUrl={`${scriptUrl}financials.js`}
                            config={COMPANY_FINANCIALS_WIDGET_CONFIG(tvSymbol)}
                            height={500}
                        />
                    </Panel>
                </div>

                <div className="flex min-w-0 flex-col gap-3">
                    <Panel title="Análise técnica" sub="Osciladores e médias móveis, 1h">
                        <TradingViewWidget
                            scriptUrl={`${scriptUrl}technical-analysis.js`}
                            config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(tvSymbol)}
                            height={400}
                        />
                    </Panel>
                    <Suspense fallback={null}>
                        <Sentiment symbol={symbol} />
                    </Suspense>
                    <Panel title="Perfil" sub="O que a empresa faz">
                        <TradingViewWidget
                            scriptUrl={`${scriptUrl}symbol-profile.js`}
                            config={COMPANY_PROFILE_WIDGET_CONFIG(tvSymbol)}
                            height={440}
                        />
                    </Panel>
                </div>
            </div>
        </>
    );
}
