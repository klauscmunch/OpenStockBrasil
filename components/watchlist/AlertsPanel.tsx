"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BellRing, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteAlert } from "@/lib/actions/alert.actions";
import { alertsEnabled } from "@/lib/market-data";
import { formatPrice } from "@/lib/utils";

type AlertRow = {
    _id: string;
    symbol: string;
    targetPrice: number;
    condition: 'ABOVE' | 'BELOW';
    triggered?: boolean;
    active?: boolean;
    expiresAt?: string;
};

const statusOf = (alert: AlertRow) => {
    if (alert.triggered) return { label: 'Disparado', className: 'pill is-brand' };
    if (!alertsEnabled) return { label: 'Pausado', className: 'pill' };
    if (alert.expiresAt && new Date(alert.expiresAt) < new Date()) return { label: 'Expirado', className: 'pill' };
    if (alert.active === false) return { label: 'Pausado', className: 'pill' };
    return { label: 'Ativo', className: 'pill is-up' };
};

export default function AlertsPanel({ alerts }: { alerts: AlertRow[] }) {
    const router = useRouter();
    const [pendingId, setPendingId] = useState<string | null>(null);

    const handleDelete = async (alert: AlertRow) => {
        setPendingId(alert._id);
        try {
            await deleteAlert(alert._id);
            toast.success(`Alerta de ${alert.symbol} removido`);
            router.refresh();
        } catch {
            toast.error("Não foi possível remover o alerta");
        } finally {
            setPendingId(null);
        }
    };

    if (alerts.length === 0 && !alertsEnabled) {
        return (
            <div className="empty-state py-10">
                <span className="empty-icon"><BellRing className="size-5" /></span>
                <h3>Alertas fazem parte do Cloud</h3>
                <p className="max-w-64 text-[13px]">Alertas de preço por e-mail fazem parte do OpenStock Cloud, US$ 5 por mês, em breve.</p>
                <Link href="/#data" className="btn btn-ghost mt-2">Conhecer o OpenStock Cloud</Link>
            </div>
        );
    }

    if (alerts.length === 0) {
        return (
            <div className="empty-state py-10">
                <span className="empty-icon"><BellRing className="size-5" /></span>
                <h3>Nenhum alerta ainda</h3>
                <p className="max-w-60 text-[13px]">Use o sino em qualquer linha, ou “Criar alerta” na página de uma ação. Avisamos por e-mail quando ele disparar.</p>
            </div>
        );
    }

    return (
        <>
            {!alertsEnabled && (
                <p className="px-3 pt-3 pb-1 text-[12.5px] text-faint">
                    Os alertas passaram para o <Link href="/#data" className="text-brand-ink hover:underline">OpenStock Cloud</Link>, por isso estes estão pausados.
                </p>
            )}
            <ul className="row-list">
                {alerts.map((alert) => {
                    const status = statusOf(alert);
                    return (
                        <li key={alert._id} className="flex items-center gap-3 px-3 py-2.5">
                            <div className="min-w-0 flex-1">
                                <p className="mono font-semibold text-foreground">{alert.symbol}</p>
                                <p className="num truncate text-[12.5px] text-faint">
                                    {alert.condition === 'ABOVE' ? 'Acima de' : 'Abaixo de'} {formatPrice(alert.targetPrice)}
                                    {alert.expiresAt && !alert.triggered && ` · até ${new Date(alert.expiresAt).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}`}
                                </p>
                            </div>
                            <span className={status.className}>{status.label}</span>
                            <button
                                type="button"
                                onClick={() => handleDelete(alert)}
                                disabled={pendingId === alert._id}
                                className="icon-btn is-danger"
                                title="Remover alerta"
                                aria-label={`Remover alerta de ${alert.symbol}`}
                            >
                                <Trash2 />
                            </button>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}
