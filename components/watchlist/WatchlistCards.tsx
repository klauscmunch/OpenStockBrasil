"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Search, Star } from "lucide-react";
import CreateAlertModal from "./CreateAlertModal";
import WatchlistButton from "@/components/WatchlistButton";
import ChangePill from "@/components/ChangePill";
import PriceLineChart from "./PriceLineChart";
import { useLiveQuotes } from "@/hooks/useLiveQuotes";
import { SearchButton } from "@/components/SearchCommand";
import { cn, formatNumber, formatPrice } from "@/lib/utils";
import { hasFinnhubQuotes } from "@/lib/markets";
import { CHART_RANGES, type ChartRange } from "@/lib/constants";
import { getWatchlistHistory } from "@/lib/actions/history.actions";
import type { getWatchlistData } from "@/lib/actions/finnhub.actions";
import type { PriceHistory } from "@/lib/price-history";

type Row = Awaited<ReturnType<typeof getWatchlistData>>[number];
const SUGGESTIONS = ['PETR4.SA', 'VALE3.SA', 'ITUB4.SA', 'BBAS3.SA', 'WEGE3.SA'];
const RANGE_KEY = 'openstock-watchlist-range';
const RANGE_LABEL: Record<ChartRange, string> = { '1D': 'hoje', '1M': 'em 1 mês', '6M': 'em 6 meses', '12M': 'em 12 meses' };

// Fetched histories stay for this visit, so flipping between periods is instant
const historyCache = new Map<string, PriceHistory | null>();

function useHistory(symbol: string, range: ChartRange) {
    const key = `${symbol}|${range}`;
    const [state, setState] = useState<{ key: string; data: PriceHistory | null } | null>(
        historyCache.has(key) ? { key, data: historyCache.get(key)! } : null,
    );
    useEffect(() => {
        if (historyCache.has(key)) return setState({ key, data: historyCache.get(key)! });
        let cancelled = false;
        getWatchlistHistory(symbol, range)
            .catch(() => null)
            .then((data) => {
                historyCache.set(key, data);
                if (!cancelled) setState({ key, data });
            });
        return () => { cancelled = true; };
    }, [key, symbol, range]);
    return state?.key === key ? { loading: false, data: state.data } : { loading: true, data: null };
}

// Period chips: one per card, plus the same control above the grid to switch every card at once.
const RangeChips = ({ value, onChange, label }: { value: ChartRange; onChange: (r: ChartRange) => void; label: string }) => (
    <div role="radiogroup" aria-label={label} className="flex gap-1 rounded-[10px] bg-page p-0.5 shadow-[inset_0_0_0_1px_var(--line)]">
        {CHART_RANGES.map((r) => (
            <button
                key={r.value}
                type="button"
                role="radio"
                aria-checked={value === r.value}
                onClick={() => onChange(r.value)}
                className={cn(
                    'mono h-7 min-w-10 rounded-[8px] px-2 text-[12px] font-semibold transition-colors',
                    value === r.value ? 'bg-brand-soft text-brand-ink' : 'text-faint hover:text-foreground',
                )}
            >
                {r.label}
            </button>
        ))}
    </div>
);

const StockCard = ({ row, range, onRange, onRemoved }: { row: Row; range: ChartRange; onRange: (r: ChartRange) => void; onRemoved: (symbol: string) => void }) => {
    const { loading, data } = useHistory(row.symbol, range);
    // The Ibovespa is quoted in points, not in a currency
    const money = (value: number) => row.symbol === 'IBOV.SA'
        ? value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
        : formatPrice(value, data?.currency || row.currency);
    const price = data?.last ?? row.price;

    return (
        <article className="flex min-w-0 flex-col gap-2 rounded-[14px] bg-page p-3.5 shadow-[inset_0_0_0_1px_var(--line)]">
            <header className="flex items-center gap-3">
                <Link href={`/stocks/${row.symbol}`} className="group flex min-w-0 flex-1 items-center gap-3">
                    {row.logo ? (
                        <span className="logo-well"><img src={row.logo} alt="" className="size-full object-contain p-1" /></span>
                    ) : (
                        <span className="logo-well is-empty">{row.symbol[0]}</span>
                    )}
                    <span className="min-w-0">
                        <span className="block truncate font-semibold text-foreground transition-colors group-hover:text-brand-ink" title={row.name}>{row.name}</span>
                        <span className="mono block text-[12px] text-faint">{row.symbol}</span>
                    </span>
                </Link>
                <div className="flex items-center gap-1">
                    {hasFinnhubQuotes(row.symbol) ? (
                        <CreateAlertModal symbol={row.symbol} currentPrice={row.price} currency={row.currency}>
                            <button type="button" className="icon-btn" title={`Criar alerta de preço para ${row.symbol}`} aria-label={`Criar alerta de preço para ${row.symbol}`}>
                                <Bell />
                            </button>
                        </CreateAlertModal>
                    ) : (
                        <span className="icon-btn opacity-40" title="Alertas disponíveis só para ações dos EUA e cripto"><Bell /></span>
                    )}
                    <WatchlistButton
                        symbol={row.symbol}
                        company={row.name}
                        isInWatchlist
                        variant="icon"
                        onWatchlistChange={(sym, added) => { if (!added) onRemoved(sym); }}
                    />
                </div>
            </header>

            {/* Price and the return over the chosen period, then the line itself */}
            <div className="flex items-end justify-between gap-3">
                <p className="bento-value text-[26px]">{price ? money(price) : '—'}</p>
                <div className="flex flex-col items-end gap-0.5 pb-0.5">
                    <ChangePill value={data ? data.changePercent : null} />
                    <span className="text-[11.5px] text-faint">{RANGE_LABEL[range]}</span>
                </div>
            </div>

            {loading ? (
                <div className="h-[168px] animate-pulse rounded-lg bg-hover/50" aria-busy="true" />
            ) : data ? (
                <PriceLineChart points={data.points} base={data.base} range={range} positive={data.changePercent >= 0} money={money} />
            ) : (
                <div className="grid h-[168px] place-items-center rounded-lg text-[13px] text-faint shadow-[inset_0_0_0_1px_var(--line)]">
                    Histórico indisponível
                </div>
            )}

            <footer className="flex items-center justify-between gap-2 pt-1">
                <RangeChips value={range} onChange={onRange} label={`Período de ${row.symbol}`} />
                {row.marketCap ? <span className="num truncate text-[12px] text-faint" title="Valor de mercado">{formatNumber(row.marketCap)}</span> : null}
            </footer>
        </article>
    );
};

export default function WatchlistCards({ initialRows }: { initialRows: Row[] }) {
    const [baseRows, setBaseRows] = useState(initialRows);
    const live = useLiveQuotes(baseRows.map((r) => r.symbol));
    const [range, setRange] = useState<ChartRange>('1M');
    // A card's own choice wins until the shared period changes again
    const [overrides, setOverrides] = useState<Record<string, ChartRange>>({});

    // Server re-renders (after add/remove) replace the local copy
    useEffect(() => setBaseRows(initialRows), [initialRows]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(RANGE_KEY);
            if (CHART_RANGES.some((r) => r.value === saved)) setRange(saved as ChartRange);
        } catch { /* storage unavailable */ }
    }, []);

    const setAll = (next: ChartRange) => {
        setRange(next);
        setOverrides({});
        try { localStorage.setItem(RANGE_KEY, next); } catch { /* storage unavailable */ }
    };

    // Live prices keep the price and the alert modal's starting price current between chart loads
    const rows = baseRows.map((r) => {
        const q = live[r.symbol];
        return q?.c ? { ...r, price: q.c, change: q.d ?? r.change, changePercent: q.dp ?? r.changePercent } : r;
    });

    if (rows.length === 0) {
        return (
            <div className="empty-state">
                <span className="empty-icon"><Star className="size-5" /></span>
                <h3>Sua watchlist ainda está vazia</h3>
                <p className="max-w-sm">Busque uma empresa e marque com estrela para acompanhar o preço aqui.</p>
                <SearchButton className="btn btn-primary mt-3"><Search /> Buscar ações</SearchButton>
                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                    {SUGGESTIONS.map((s) => (
                        <Link key={s} href={`/stocks/${s}`} className="pill mono h-7 px-3 hover:bg-hover hover:text-foreground">{s}</Link>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[13px] text-faint">Rentabilidade no período · vale para todos os cards</p>
                <RangeChips value={range} onChange={setAll} label="Período de todos os cards" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                {rows.map((row) => (
                    <StockCard
                        key={row.symbol}
                        row={row}
                        range={overrides[row.symbol] ?? range}
                        onRange={(r) => setOverrides((current) => ({ ...current, [row.symbol]: r }))}
                        onRemoved={(sym) => setBaseRows((current) => current.filter((r) => r.symbol !== sym))}
                    />
                ))}
            </div>
        </div>
    );
}
