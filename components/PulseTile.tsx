'use client';

import Link from "next/link";
import { LineChart } from "lucide-react";
import ChangePill from "@/components/ChangePill";
import PriceFlash from "@/components/PriceFlash";
import { useLiveQuotes, type LiveQuote } from "@/hooks/useLiveQuotes";

const formatAmount = (value: number) =>
    value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: value < 1 ? 4 : 2 });

// A pulse tile priced from our own quote cache. In realtime mode it refreshes on screen,
// so the "Live · 15s" label is true; in cached mode it shows the server-rendered quote.
export default function PulseTile({ symbol, label, initial }: { symbol: string; label: string; initial: LiveQuote | null }) {
    const live = useLiveQuotes([symbol]);
    const quote = live[symbol] ?? initial;
    const isCrypto = symbol.startsWith('BINANCE:');
    // Ibovespa is quoted in points, B3 stocks in reais
    const currencySign = /^IBOV\.SA$/i.test(symbol) ? '' : symbol.toUpperCase().endsWith('.SA') ? 'R$' : 'US$';

    return (
        <Link href={`/stocks/${encodeURIComponent(symbol)}`} className="bento-tile transition-colors hover:bg-hover/60">
            <div className="bento-head">
                <span className="bento-ico"><LineChart /></span>
                <span className="truncate">{label}</span>
                <span className="mono ml-auto text-xs text-faint">{symbol.replace('BINANCE:', '').replace(/\.SA$/i, '')}</span>
            </div>
            <PriceFlash value={quote?.c} className="bento-value self-start">
                {quote?.c ? (
                    isCrypto ? <>{formatAmount(quote.c)}<small> USDT</small></> : <><small>{currencySign}</small>{formatAmount(quote.c)}</>
                ) : '—'}
            </PriceFlash>
            <div className="bento-foot">
                {quote?.c ? (
                    <>
                        <ChangePill value={quote.dp} />
                        <span className="num truncate">{(quote.d ?? 0) > 0 ? '+' : ''}{(quote.d ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} vs. fechamento anterior</span>
                    </>
                ) : (
                    <span>Cotação indisponível</span>
                )}
            </div>
        </Link>
    );
}
