import Link from "next/link";
import { ArrowUpRight, Bell, CandlestickChart, Command, GitPullRequest, Github, Grid3x3, HeartHandshake, MailOpen, MessagesSquare, Star } from "lucide-react";
import { MarketDial, MarketStatus } from "@/components/landing/MarketClock";
import ProductPreview from "@/components/landing/ProductPreview";
import SectionHead from "@/components/marketing/SectionHead";
import IconCard from "@/components/marketing/IconCard";
import { getSession } from "@/lib/better-auth/auth";
import { formatCount, getRepoStats } from "@/lib/github";
import { cn } from "@/lib/utils";
import { sidebarSponsors } from "@/lib/sponsors";
import { DISCORD_URL, GOOD_FIRST_ISSUES_URL, REPO_URL } from "@/lib/constants";

const FEATURES = [
    { icon: CandlestickChart, title: 'Gráficos ao vivo', body: 'Candles, análise técnica e dados financeiros do TradingView para qualquer empresa listada, em tela cheia quando precisar de espaço.' },
    { icon: Bell, title: 'Alertas por e-mail', body: 'Com o OpenStock Cloud, defina um alvo acima ou abaixo do preço. Verificamos a cada cinco minutos e avisamos quando ele for cruzado.' },
    { icon: MessagesSquare, title: 'Sentimento num relance', body: 'Buzz e otimismo do Reddit, X.com, notícias e Polymarket, lado a lado para cada ação.' },
    { icon: Grid3x3, title: 'O mercado inteiro', body: 'Mapa de calor por setor, maiores altas e baixas e principais notícias numa só tela, antes da abertura.' },
    { icon: Command, title: 'Encontre tudo com ⌘K', body: 'Busque ações da B3 e de todas as bolsas que o Finnhub cobre, e abra cada ação numa aba, como no navegador.' },
    { icon: MailOpen, title: 'Resumo de segunda-feira', body: 'Um resumo curto, escrito por IA, das notícias da semana sobre as ações que você acompanha.' },
];

const TIERS = [
    {
        name: 'Comunidade', price: 'Grátis', cadence: 'A cada hora', perHour: 1,
        body: 'Este site. As cotações atualizam a cada hora e são compartilhadas por todos. Os gráficos continuam ao vivo.',
        cta: { label: 'Comece agora', href: '/sign-up' },
    },
    {
        name: 'OpenStock Cloud', price: 'US$ 5', per: '/mês', tag: 'Em breve', cadence: 'A cada 15 segundos', perHour: 240,
        body: 'O mesmo app com cotações em tempo real e alertas de preço por e-mail, rodando num conjunto de chaves de dados de mercado. Nada para configurar.',
        cta: { label: 'Receba o aviso no Discord', href: DISCORD_URL },
    },
    {
        name: 'Hospede você mesmo', price: 'Grátis', cadence: 'Você decide', perHour: 240,
        body: 'Rode no seu próprio servidor com suas chaves do Finnhub: cotações em tempo real e alertas para você e sua equipe.',
        cta: { label: 'Guia de instalação', href: '#self-host' },
    },
];

const SUPPORT = [
    {
        icon: HeartHandshake, title: 'Patrocine', primary: true,
        body: 'Planos mensais a partir de US$ 5, uma doação única ou uma parceria sob medida. Os patrocinadores aparecem neste site, no app e no README.',
        cta: { label: 'Ver planos de patrocínio', href: '/sponsor' },
    },
    {
        icon: GitPullRequest, title: 'Contribua',
        body: 'Escolha uma issue para iniciantes, melhore a documentação ou desenhe uma tela. Cada pull request aceito mantém o OpenStock andando.',
        cta: { label: 'Issues para iniciantes', href: GOOD_FIRST_ISSUES_URL },
    },
    {
        icon: Star, title: 'Divulgue',
        body: 'Dê uma estrela no repositório e mostre para alguém que paga por um terminal que quase não usa.',
        cta: { label: 'Dar estrela no GitHub', href: REPO_URL },
    },
];

// 60 minutes of updates drawn as ticks: one line per refresh.
const CadenceRail = ({ perHour }: { perHour: number }) => (
    <div
        className="h-7 rounded-md bg-page shadow-[inset_0_0_0_1px_var(--line)]"
        style={{
            backgroundImage: perHour > 1
                ? `repeating-linear-gradient(90deg, var(--brand) 0 1px, transparent 1px calc(100% / ${perHour}))`
                : 'linear-gradient(90deg, var(--brand) 0 2px, transparent 2px)',
        }}
        aria-hidden
    />
);

// Floats in the empty gutter beside the 1200px column, so it only shows on screens wide enough to have one.
const SponsorBanner = () => {
    const [sponsor] = sidebarSponsors();
    if (!sponsor) return null;
    return (
        <aside aria-label="Patrocinador" className="fixed top-[130px] z-30 hidden w-[200px] right-[calc((100vw-1200px)/4-100px)] min-[1680px]:block">
            <a href={sponsor.url} target="_blank" rel="noreferrer" className="hatch group">
                <div className="card flex flex-col gap-4 p-5">
                    <p className="kicker flex items-center gap-1.5 text-brand-ink"><span className="live-dot" /> Patrocinador</p>
                    {sponsor.logo && <img src={sponsor.logo} alt={sponsor.iconOnly ? '' : sponsor.name} className="h-14 w-auto self-start" />}
                    <div>
                        <p className="text-[17px] font-bold tracking-[-0.02em]">{sponsor.name}</p>
                        {sponsor.blurb && <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{sponsor.blurb}</p>}
                    </div>
                    <span className="btn btn-ghost h-9 text-[13px] group-hover:bg-[var(--hover)] group-hover:text-foreground">Visitar {sponsor.name} <ArrowUpRight /></span>
                </div>
            </a>
        </aside>
    );
};

export default async function LandingPage() {
    const [session, repo] = await Promise.all([getSession(), getRepoStats()]);
    const start = session?.user ? { href: '/dashboard', label: 'Abrir painel' } : { href: '/sign-up', label: 'Comece grátis' };

    return (
        <>
            <SponsorBanner />
            <section className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 pt-14 md:pt-20 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div>
                    <MarketStatus />
                    <h1 className="mt-6 text-[44px] font-bold leading-[1.02] tracking-[-0.05em] md:text-[68px]">
                        O mercado,<br />sem paywall.
                    </h1>
                    <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
                        O OpenStock é uma alternativa open source às plataformas de mercado caras. Acompanhe preços, veja o mercado inteiro e
                        mergulhe nos dados das empresas, feito de forma aberta, para todos.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-2">
                        <Link href={start.href} className="btn btn-primary h-11 px-5 text-[15px]">{start.label}</Link>
                        <a href={REPO_URL} target="_blank" rel="noreferrer" className="btn btn-ghost h-11 px-5 text-[15px]">
                            <Github /> Hospede você mesmo
                            {repo && <span className="num text-faint">{formatCount(repo.stars)} estrelas</span>}
                        </a>
                    </div>
                </div>
                <div className="hatch">
                    <div className="card px-6 pb-5 pt-6"><MarketDial /></div>
                </div>
            </section>

            <section className="mx-auto mt-16 max-w-[1200px] px-5">
                <ProductPreview />
            </section>

            <section id="inside" className="mx-auto mt-28 max-w-[1200px] scroll-mt-24 px-5">
                <SectionHead kicker="O que tem dentro" title="Um terminal para quem não trabalha em banco." sub="Tudo o que você precisa para acompanhar o mercado, num só lugar, sem assinatura." />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map(({ icon, title, body }) => (
                        <IconCard key={title} icon={icon} title={title}>{body}</IconCard>
                    ))}
                </div>
            </section>

            <section id="data" className="mx-auto mt-28 max-w-[1200px] scroll-mt-24 px-5">
                <SectionHead
                    kicker="Dados"
                    title="Escolha o quão atualizados são seus números."
                    sub="Os gráficos vêm sempre ao vivo do TradingView. Cotações, watchlists e alertas vêm do Finnhub e da brapi.dev, e esta é a frequência de atualização."
                />
                <div className="grid gap-3 lg:grid-cols-3">
                    {TIERS.map((tier) => (
                        <div key={tier.name} className="hatch">
                            <div className="card flex h-full flex-col gap-4 p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="text-[18px] font-bold tracking-[-0.02em]">{tier.name}</h3>
                                    {tier.tag && <span className="pill is-brand">{tier.tag}</span>}
                                </div>
                                <p className="bento-value text-[30px]">{tier.price}{tier.per && <small className="text-faint"> {tier.per}</small>}</p>
                                <p className="text-[14px] leading-relaxed text-muted-foreground">{tier.body}</p>
                                <div className="mt-auto flex flex-col gap-2">
                                    <CadenceRail perHour={tier.perHour} />
                                    <p className="num flex justify-between text-[12px] text-faint">
                                        <span>{tier.cadence}</span>
                                        <span>{tier.perHour} {tier.perHour === 1 ? 'atualização' : 'atualizações'} por hora</span>
                                    </p>
                                </div>
                                <Link
                                    href={tier.cta.href}
                                    className={cn('btn', tier.name === 'Comunidade' ? 'btn-primary' : 'btn-ghost')}
                                    {...(tier.cta.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                                >
                                    {tier.cta.label}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section id="self-host" className="mx-auto mt-28 grid max-w-[1200px] scroll-mt-24 items-start gap-10 px-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
                <div>
                    <SectionHead
                        kicker="Hospede você mesmo"
                        title="Seu servidor, suas chaves, cotações ao vivo."
                        sub="Adicione quantas chaves gratuitas do Finnhub quiser: cada uma soma 60 requisições por minuto. Mude o modo de dados para realtime e os preços atualizam a cada 15 segundos."
                    />
                    <a href={`${REPO_URL}#docker-setup`} target="_blank" rel="noreferrer" className="btn btn-ghost">Instalação completa no README</a>
                </div>
                <div className="hatch">
                    <pre className="card mono overflow-x-auto p-5 text-[13px] leading-7 text-muted-foreground">
                        <span className="text-faint">$ </span><span className="text-foreground">git clone {REPO_URL}.git</span>{'\n'}
                        <span className="text-faint">$ </span><span className="text-foreground">cd OpenStock</span>{'\n\n'}
                        <span className="text-faint"># .env (todas as variáveis estão no README)</span>{'\n'}
                        <span className="text-brand-ink">FINNHUB_API_KEYS</span>=key_one,key_two,key_three{'\n'}
                        <span className="text-brand-ink">NEXT_PUBLIC_OPENSTOCK_DATA_MODE</span>=realtime{'\n\n'}
                        <span className="text-faint">$ </span><span className="text-foreground">docker compose up -d --build</span>
                    </pre>
                </div>
            </section>

            <section id="sponsor" className="mx-auto mt-28 max-w-[1200px] scroll-mt-24 px-5">
                <SectionHead
                    kicker="Apoie"
                    title="O OpenStock está aberto a patrocinadores."
                    sub="Ele continua gratuito porque pessoas e empresas o apoiam. Contribua com o que puder, ou doe seu tempo."
                />
                <div className="grid gap-3 lg:grid-cols-3">
                    {SUPPORT.map(({ icon, title, body, cta, primary }) => (
                        <IconCard
                            key={title}
                            icon={icon}
                            title={title}
                            footer={
                                <a href={cta.href} {...(cta.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})} className={cn('btn w-full', primary ? 'btn-primary' : 'btn-ghost')}>
                                    {cta.label}
                                </a>
                            }
                        >
                            {body}
                        </IconCard>
                    ))}
                </div>
            </section>

            <section className="mx-auto mt-28 max-w-[1200px] px-5">
                <div className="hatch">
                    <div className="card grid gap-10 p-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:p-12">
                        <div>
                            <p className="kicker text-brand-ink">Open Dev Society</p>
                            <blockquote className="mt-4 text-[26px] font-semibold leading-snug tracking-[-0.03em] md:text-[30px]">
                                A tecnologia deve pertencer a todos. O conhecimento deve ser aberto, gratuito e acessível.
                            </blockquote>
                            <div className="mt-8 flex flex-wrap gap-2">
                                <Link href={start.href} className="btn btn-primary h-11 px-5 text-[15px]">{start.label}</Link>
                                <Link href="/about" className="btn btn-ghost h-11 px-5 text-[15px]">Leia o manifesto</Link>
                            </div>
                        </div>
                        {repo && (
                            <dl className="grid grid-cols-2 content-end gap-3">
                                {[
                                    ['Estrelas', formatCount(repo.stars)],
                                    ['Forks', formatCount(repo.forks)],
                                    ['Licença', repo.license ?? 'AGPL-3.0'],
                                    ['Escrito em', 'TypeScript'],
                                ].map(([label, value]) => (
                                    <div key={label} className="bento-tile col-span-1 bg-page">
                                        <dt className="kicker">{label}</dt>
                                        <dd className="bento-value text-[26px]">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
