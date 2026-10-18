import type { StockSentimentInsights } from '@/lib/actions/adanos.helpers';
import { cn } from '@/lib/utils';

interface StockSentimentCardProps {
    insight: StockSentimentInsights | null;
}

function formatScore(value: number | null, suffix: string): string {
    if (value === null) return '—';
    return `${value.toFixed(1)}${suffix}`;
}

function formatCompactNumber(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value);
}

// Display labels; the helpers keep English keys that the tests and colour rules rely on
const ALIGNMENT_LABEL: Record<string, string> = {
    'No sentiment mix': 'Sem mistura de sentimento',
    'Single-source view': 'Visão de uma única fonte',
    'Bullish alignment': 'Alinhamento otimista',
    'Bearish alignment': 'Alinhamento pessimista',
    'Tight alignment': 'Alinhamento próximo',
    'Wide divergence': 'Grande divergência',
    'Mixed': 'Misto',
};
const SOURCE_LABEL: Record<string, string> = { News: 'Notícias' };
const METRIC_LABEL: Record<string, string> = { Mentions: 'menções', Trades: 'negociações' };
const TREND_LABEL: Record<string, string> = { rising: 'em alta', falling: 'em queda', stable: 'estável' };

const TREND_CLASS: Record<string, string> = {
    rising: 'is-up',
    falling: 'is-down',
    stable: '',
};

function getAlignmentClass(alignment: string): string {
    if (alignment === 'Bullish alignment') return 'text-up';
    if (alignment === 'Bearish alignment' || alignment === 'Wide divergence') return 'text-down';
    if (alignment === 'Mixed') return 'text-warn';
    return 'text-muted-foreground';
}

export default function StockSentimentCard({ insight }: StockSentimentCardProps) {
    if (!insight) {
        return null;
    }

    const summary = [
        { label: 'Buzz médio', value: formatScore(insight.averageBuzz, '/100') },
        { label: 'Otimismo médio', value: formatScore(insight.bullishAverage, '%') },
        { label: 'Cobertura', value: `${insight.availableSources}/4 fontes` },
    ];

    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-3 gap-2 p-3">
                {summary.map(({ label, value }) => (
                    <div key={label} className="min-w-0">
                        <p className="kicker">{label}</p>
                        <p className="num mt-1 truncate font-bold text-foreground">{value}</p>
                    </div>
                ))}
            </div>
            <p className="border-t border-line px-3 py-2.5 text-[12.5px] text-faint">
                Alinhamento das fontes: <span className={cn('font-semibold', getAlignmentClass(insight.sourceAlignment))}>{ALIGNMENT_LABEL[insight.sourceAlignment] ?? insight.sourceAlignment}</span>
            </p>

            <ul className="row-list border-t border-line">
                {insight.sources.map((source) => (
                    <li key={source.source} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-3 py-2.5">
                        <div className="min-w-0">
                            <p className="truncate font-semibold text-foreground">{SOURCE_LABEL[source.label] ?? source.label}</p>
                            <p className="num truncate text-[12px] text-faint">
                                {formatCompactNumber(source.metricValue)} {METRIC_LABEL[source.metricLabel] ?? source.metricLabel.toLowerCase()}
                            </p>
                        </div>
                        <div className="num text-right text-[12.5px]">
                            <p className="font-semibold text-foreground">{formatScore(source.buzzScore, '')}</p>
                            <p className="text-faint">buzz</p>
                        </div>
                        <span className={cn('pill w-[74px] justify-center capitalize', TREND_CLASS[source.trend ?? ''])}>
                            {source.bullishPct !== null ? `${source.bullishPct.toFixed(0)}% otimista` : (source.trend ? TREND_LABEL[source.trend] ?? source.trend : 'Sem tendência')}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
