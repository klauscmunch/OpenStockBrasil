import { Check, Cloud, HandCoins, MessageCircle, Minus, Users } from "lucide-react";
import IconCard from "@/components/marketing/IconCard";
import { getRepoStats, formatCount } from "@/lib/github";
import { DISCORD_URL, sponsorCheckoutUrl } from "@/lib/constants";
import { ACTIVE_SPONSORS, FUNDING_USES, REGISTERED_USERS, SPONSOR_CONTACT_EMAIL, SPONSOR_GOAL, SPONSOR_RECIPIENT, SPONSOR_TIERS, tierBorder, type SponsorTierId } from "@/lib/sponsors";
import { cn } from "@/lib/utils";

export const metadata = {
    title: 'Patrocine o OpenStock',
    description: 'Apoie dados de mercado gratuitos e open source. Planos mensais, doações únicas ou uma conversa sobre parceria.',
};

const MAILTO = `mailto:${SPONSOR_CONTACT_EMAIL}?subject=Sponsoring%20OpenStock`;

// Where each tier shows up. Mirrors the perks in lib/sponsors.ts.
const PLACEMENTS: { label: string; from: SponsorTierId }[] = [
    { label: 'Nome na lista de patrocinadores do README', from: 'backer' },
    { label: 'Nome e avatar no mural de patrocinadores', from: 'supporter' },
    { label: 'Logo no rodapé de todas as páginas públicas', from: 'company' },
    { label: 'Logo no README', from: 'company' },
    { label: 'Logo na página inicial', from: 'partner' },
    { label: 'Vaga de patrocínio no menu lateral do app', from: 'partner' },
];
const TIER_ORDER: SponsorTierId[] = ['backer', 'supporter', 'company', 'partner'];

const FAQ = [
    ['Como eu pago?', 'Pelo GitHub Sponsors, com cartão ou PayPal. Escolha um valor mensal ou doe uma vez.'],
    ['Posso cancelar?', 'Sim, a qualquer momento nas configurações do GitHub Sponsors.'],
    ['Podemos patrocinar como empresa?', 'Sim. Patrocine pela conta da sua organização no GitHub e depois nos envie seu logo e link. Para notas fiscais ou um acordo sob medida, fale com a gente.'],
];

export default async function SponsorPage() {
    const repo = await getRepoStats();
    const goalPercent = Math.min(100, (SPONSOR_GOAL.current / SPONSOR_GOAL.target) * 100);
    const fundingTotal = FUNDING_USES.reduce((sum, use) => sum + (use.monthly ?? 0), 0);

    return (
        <div className="mx-auto max-w-[1200px] px-5">
            <section className="grid items-end gap-10 pt-14 md:pt-20 lg:grid-cols-[minmax(0,1fr)_380px]">
                <div>
                    <p className="kicker flex items-center gap-2 text-brand-ink"><span className="live-dot" /> Aberto a patrocinadores</p>
                    <h1 className="mt-4 text-[44px] font-bold leading-[1.02] tracking-[-0.05em] md:text-[64px]">Apoie dados de<br />mercado gratuitos.</h1>
                    <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
                        O OpenStock é um terminal de mercado open source usado por {REGISTERED_USERS} pessoas cadastradas{repo ? `, com ${formatCount(repo.stars)} estrelas no GitHub` : ''}.
                        Os patrocinadores o mantêm gratuito e independente para todos que não podem pagar por um terminal.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-2">
                        <a href="#tiers" className="btn btn-primary h-11 px-5 text-[15px]">Ver planos</a>
                        <a href={MAILTO} className="btn btn-ghost h-11 px-5 text-[15px]">Fale com a gente</a>
                    </div>
                </div>

                <div className="hatch">
                    <div className="card flex flex-col gap-4 p-5">
                        <div className="flex items-baseline justify-between gap-3">
                            <p className="kicker">Meta</p>
                            <p className="num text-[13px] text-faint">{SPONSOR_GOAL.current} de {SPONSOR_GOAL.target.toLocaleString('pt-BR')}</p>
                        </div>
                        <p className="text-[20px] font-bold tracking-[-0.02em]">{SPONSOR_GOAL.target.toLocaleString('pt-BR')} {SPONSOR_GOAL.label}</p>
                        <div className="h-2.5 overflow-hidden rounded-full bg-page shadow-[inset_0_0_0_1px_var(--line)]" role="progressbar" aria-valuenow={SPONSOR_GOAL.current} aria-valuemax={SPONSOR_GOAL.target}>
                            <div className="h-full rounded-full bg-brand" style={{ width: `max(${goalPercent}%, 6px)` }} />
                        </div>
                        {repo && (
                            <dl className="grid grid-cols-3 gap-2">
                                {[['Usuários', REGISTERED_USERS.replace(',000', ' mil')], ['Estrelas', formatCount(repo.stars)], ['Forks', formatCount(repo.forks)]].map(([label, value]) => (
                                    <div key={label} className="rounded-[12px] bg-page px-3.5 py-3 shadow-[inset_0_0_0_1px_var(--line)]">
                                        <dt className="kicker">{label}</dt>
                                        <dd className="bento-value mt-1 text-[22px]">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        )}
                    </div>
                </div>
            </section>

            <section id="tiers" className="mt-24 scroll-mt-24">
                <p className="kicker text-brand-ink">Mensal</p>
                <h2 className="mt-2 text-[32px] font-bold tracking-[-0.04em] md:text-[40px]">Escolha um plano.</h2>

                <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {SPONSOR_TIERS.map((tier) => {
                        const filled = ACTIVE_SPONSORS.filter((s) => s.tier === tier.id).length;
                        const taken = tier.slots ? filled >= tier.slots : false;
                        return (
                            <div
                                key={tier.id}
                                className={cn('hatch', tier.featured && 'shadow-[0_6px_18px_oklch(0_0_0/0.22)]')}
                                style={{ outline: `1px solid ${tierBorder(tier.id)}` }}
                            >
                                <div className="card flex h-full flex-col gap-4 p-5">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="text-[17px] font-bold tracking-[-0.02em]">{tier.name}</h3>
                                        {tier.featured && <span className="pill is-brand">Ideal para equipes</span>}
                                        {tier.slots && <span className={cn('pill', !taken && 'is-up')}>{taken ? 'Esgotado' : `${tier.slots - filled} de ${tier.slots} vagas`}</span>}
                                    </div>
                                    <p className="bento-value text-[36px]"><small>US$ </small>{tier.monthly}<small className="text-faint"> /mês</small></p>
                                    <p className="text-[14px] leading-relaxed text-muted-foreground">{tier.blurb}</p>
                                    <ul className="flex flex-col gap-2 text-[13.5px]">
                                        {tier.perks.map((perk) => (
                                            <li key={perk} className="flex gap-2">
                                                <Check className="mt-0.5 size-4 flex-none text-brand-ink" />
                                                <span>{perk}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <a
                                        href={taken ? MAILTO : sponsorCheckoutUrl(tier.monthly)}
                                        target={taken ? undefined : '_blank'}
                                        rel="noreferrer"
                                        className={cn('btn mt-auto', tier.featured ? 'btn-primary' : 'btn-ghost')}
                                    >
                                        {taken ? 'Entrar na lista de espera' : `Patrocinar US$ ${tier.monthly}/mês`}
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div className="hatch">
                        <div className="card flex h-full flex-col gap-3 p-5 sm:flex-row sm:items-center">
                            <span className="bento-ico size-10 bg-brand-soft text-brand-ink"><HandCoins className="size-5" /></span>
                            <div className="flex-1">
                                <h3 className="text-[16px] font-bold">Doe uma vez</h3>
                                <p className="text-[14px] text-muted-foreground">Qualquer valor, uma única vez, pelo GitHub Sponsors.</p>
                            </div>
                            <a href={sponsorCheckoutUrl(undefined, 'one-time')} target="_blank" rel="noreferrer" className="btn btn-ghost">Doar uma vez</a>
                        </div>
                    </div>
                    <div className="hatch">
                        <div className="card flex h-full flex-col gap-3 p-5 sm:flex-row sm:items-center">
                            <span className="bento-ico size-10 bg-brand-soft text-brand-ink"><MessageCircle className="size-5" /></span>
                            <div className="flex-1">
                                <h3 className="text-[16px] font-bold">Pensou em outra coisa?</h3>
                                <p className="text-[14px] text-muted-foreground">Créditos de dados ou infraestrutura, um espaço sob medida ou uma parceria.</p>
                            </div>
                            <div className="flex gap-2">
                                <a href={MAILTO} className="btn btn-primary">Fale com a gente</a>
                                <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="btn btn-ghost">Discord</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-24">
                <p className="kicker text-brand-ink">Transparência</p>
                <h2 className="mt-2 text-[28px] font-bold tracking-[-0.04em] md:text-[34px]">Para onde vai o seu dinheiro.</h2>
                <p className="mt-3 max-w-2xl text-[16px] text-muted-foreground">
                    Os patrocínios são pagos pelo GitHub Sponsors a {SPONSOR_RECIPIENT.name}{' '}
                    (<a href={`https://github.com/${SPONSOR_RECIPIENT.handle}`} target="_blank" rel="noreferrer" className="font-semibold text-brand-ink hover:underline">@{SPONSOR_RECIPIENT.handle}</a>),{' '}
                    {SPONSOR_RECIPIENT.role}, e pagam para manter o OpenStock gratuito:
                </p>
                <div className="hatch mt-8">
                    <div className="card row-list">
                        {FUNDING_USES.map((use, i) => (
                            <div key={use.label} className="grid gap-1 px-5 py-4 sm:grid-cols-[180px_minmax(0,1fr)_auto] sm:items-center sm:gap-6">
                                <span className="flex items-center gap-3 font-bold">
                                    <span className="mono text-[12px] text-faint">{String(i + 1).padStart(2, '0')}</span>
                                    {use.label}
                                </span>
                                <span className="text-muted-foreground">{use.detail}</span>
                                {fundingTotal > 0 && (
                                    <span className="num text-right font-semibold">
                                        {use.monthly ? `US$ ${use.monthly}/mês · ${Math.round((use.monthly / fundingTotal) * 100)}%` : '—'}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {fundingTotal > 0 && (
                    <p className="num mt-4 text-muted-foreground">
                        {FUNDING_USES.every((use) => use.monthly)
                            ? <>Manter o OpenStock custa cerca de <b className="text-foreground">US$ {fundingTotal} por mês</b>.</>
                            : <>Custos conhecidos até agora: <b className="text-foreground">US$ {fundingTotal} por mês</b>.</>}
                    </p>
                )}

                <div className="mt-10 grid gap-3 md:grid-cols-2">
                    <IconCard icon={Cloud} title="O OpenStock Cloud vai pagar a hospedagem">
                        O Cloud (US$ 5 por mês, em breve) adiciona cotações em tempo real e alertas de preço. Os assinantes vão cobrir servidores,
                        banco de dados e dados de mercado do app hospedado, para o site gratuito continuar no ar sem depender de doações.
                    </IconCard>
                    <IconCard icon={Users} title="Os patrocinadores mantêm a comunidade andando">
                        Os patrocínios pagam o tempo por trás do OpenStock: revisar pull requests da comunidade, corrigir bugs e lançar novidades
                        no ritmo que {REGISTERED_USERS} pessoas esperam, com o essencial gratuito para todos.
                    </IconCard>
                </div>
            </section>

            <section className="mt-24">
                <p className="kicker text-brand-ink">Exposição</p>
                <h2 className="mt-2 text-[28px] font-bold tracking-[-0.04em] md:text-[34px]">Onde o seu nome aparece.</h2>
                <div className="hatch mt-8">
                    <div className="card overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Espaço</th>
                                    {TIER_ORDER.map((id) => <th key={id} className="text-center">{SPONSOR_TIERS.find((t) => t.id === id)!.name}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {PLACEMENTS.map(({ label, from }) => (
                                    <tr key={label}>
                                        <td className="font-semibold text-foreground">{label}</td>
                                        {TIER_ORDER.map((id) => (
                                            <td key={id} className="text-center">
                                                {TIER_ORDER.indexOf(id) >= TIER_ORDER.indexOf(from)
                                                    ? <Check className="mx-auto size-4 text-brand-ink" aria-label="Incluído" />
                                                    : <Minus className="mx-auto size-4 text-line-strong" aria-label="Não incluído" />}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section className="mt-24 grid gap-3 md:grid-cols-3">
                {FAQ.map(([q, a]) => (
                    <div key={q} className="hatch">
                        <div className="card h-full p-5">
                            <h3 className="font-bold">{q}</h3>
                            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{a}</p>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
