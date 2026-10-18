import { BarChart2, Clock, Mail, UserX } from 'lucide-react';
import PageHero from '@/components/marketing/PageHero';
import SectionHead from '@/components/marketing/SectionHead';
import IconCard from '@/components/marketing/IconCard';
import { REPO_URL } from '@/lib/constants';

export const metadata = {
    title: 'Arquitetura | OpenStock',
    description: 'Como o OpenStock funciona: dados de mercado, tarefas em segundo plano e a IA por trás dos e-mails.',
};

const DATA_MODES = [
    { name: 'Em cache', cadence: 'A cada hora', body: 'Padrão do site público. As cotações são buscadas uma vez por hora e compartilhadas por todos os usuários, então o custo cresce com o número de ativos, não de pessoas.' },
    { name: 'Tempo real', cadence: 'A cada 15 segundos', body: 'Para o OpenStock Cloud e instalações próprias. Defina NEXT_PUBLIC_OPENSTOCK_DATA_MODE=realtime e os preços na tela passam a atualizar ao vivo, e os alertas de preço por e-mail são ativados.' },
];

const COVERAGE = [
    ['Brasil (B3)', 'Com atraso', 'Cotações sim (brapi.dev), alertas não'],
    ['Ações dos EUA, cripto', 'Tempo real', 'Sim'],
    ['Forex', 'Tempo real', 'Não'],
    ['Canadá, Austrália', 'Com atraso', 'Não'],
    ['Índia (BSE), Alemanha', 'Fim do dia', 'Não'],
];

const FLOW = ['Um usuário se cadastra, ou um agendamento dispara', 'O Inngest executa a função', 'O Gemini escreve o texto', 'O MiniMax assume se o Gemini falhar', 'O e-mail é enviado'];

const JOBS = [
    { icon: Mail, title: 'E-mail de boas-vindas', trigger: 'No cadastro', body: 'Uma introdução escrita por IA, personalizada pelo país, objetivo, risco e setor escolhidos no cadastro.' },
    { icon: BarChart2, title: 'Notícias da semana', trigger: 'Seg 09:00', body: 'Resume as notícias de mercado da semana e envia como uma transmissão do Kit.' },
    { icon: Clock, title: 'Alertas de preço', trigger: 'A cada 5 min', body: 'Confere cada alerta ativo com as cotações do Finnhub e avisa o dono por e-mail quando um dispara. Só no modo tempo real.' },
    { icon: UserX, title: 'Reengajamento', trigger: 'Diário 10:00', body: 'Encontra contas inativas e manda um lembrete gentil.' },
];

const STACK = [
    ['brapi.dev', 'Cotações, perfis e busca das ações da B3.', 'https://brapi.dev'],
    ['Google Notícias', 'Notícias em português das ações brasileiras.', 'https://news.google.com'],
    ['Finnhub', 'Cotações, perfis de empresas, busca e notícias dos EUA. Um conjunto de chaves, alternadas a cada requisição.', 'https://finnhub.io'],
    ['TradingView', 'Gráficos, mapas de calor, análise técnica e widgets de mercado, embutidos ao vivo.', 'https://www.tradingview.com/widget/'],
    ['Inngest', 'Tarefas em segundo plano e agendamentos, com novas tentativas.', 'https://www.inngest.com'],
    ['Better Auth', 'Login por e-mail, Google e GitHub com sessões no MongoDB.', 'https://www.better-auth.com'],
    ['MongoDB Atlas', 'Usuários, watchlists e alertas.', 'https://www.mongodb.com/atlas'],
    ['Kit', 'Envio da newsletter com o resumo semanal.', 'https://kit.com'],
];

export default function ArchitecturePage() {
    return (
        <>
            <PageHero
                kicker="Arquitetura"
                title="Como o OpenStock funciona."
                sub="Um olhar transparente sobre o sistema orientado a eventos e com vários provedores por trás dos seus dados de mercado e e-mails."
            >
                <span className="pill h-8 px-3">v1.0.0</span>
                <span className="pill h-8 px-3">Gemini com MiniMax de reserva</span>
                <span className="pill h-8 px-3">Open source · AGPL-3.0</span>
            </PageHero>

            <section className="mx-auto mt-20 max-w-[1200px] px-5">
                <SectionHead kicker="Dados de mercado" title="Dois modos de dados, um cache." sub="Os gráficos vêm sempre ao vivo do TradingView. Tudo o que cotamos por conta própria passa por um cache compartilhado com limites de tempo, para que um provedor lento nunca trave a página." />
                <div className="grid gap-3 md:grid-cols-2">
                    {DATA_MODES.map(({ name, cadence, body }) => (
                        <div key={name} className="hatch">
                            <div className="card flex h-full flex-col gap-2 p-5">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[16px] font-bold">{name}</h3>
                                    <span className="pill is-brand">{cadence}</span>
                                </div>
                                <p className="text-[14px] leading-relaxed text-muted-foreground">{body}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="hatch mt-3">
                    <div className="card overflow-x-auto">
                        <table className="data-table">
                            <thead><tr><th>Mercado</th><th>Gráficos</th><th>Nossas cotações e alertas</th></tr></thead>
                            <tbody>
                                {COVERAGE.map(([market, charts, quotes]) => (
                                    <tr key={market}>
                                        <td className="font-semibold text-foreground">{market}</td>
                                        <td className="text-muted-foreground">{charts}</td>
                                        <td><span className={quotes !== 'Não' ? 'pill is-up' : 'pill'}>{quotes}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <a href={`${REPO_URL}/blob/main/MARKET_SUPPORT.md`} target="_blank" rel="noreferrer" className="btn btn-ghost mt-4">Notas completas sobre os mercados</a>
            </section>

            <section className="mx-auto mt-24 grid max-w-[1200px] items-start gap-10 px-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div>
                    <SectionHead kicker="IA" title="E-mails que não caem junto com um provedor." sub="Os e-mails de boas-vindas e os resumos de notícias são escritos pelo Gemini 2.5 Flash-Lite. Se ele falhar, a requisição é refeita no MiniMax-M3, ou em qualquer provedor compatível com a OpenAI que você configurar." />
                </div>
                <div className="hatch">
                    <ol className="card flex flex-col gap-1 p-4">
                        {FLOW.map((step, i) => (
                            <li key={step} className="flex items-center gap-3 rounded-[10px] px-2 py-2.5">
                                <span className="mono grid size-7 flex-none place-items-center rounded-full bg-page text-[12px] text-brand-ink shadow-[inset_0_0_0_1px_var(--line)]">{i + 1}</span>
                                <span className="font-semibold">{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="mx-auto mt-24 max-w-[1200px] px-5">
                <SectionHead kicker="Tarefas em segundo plano" title="Quatro tarefas mantêm tudo funcionando." />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {JOBS.map(({ icon, title, trigger, body }) => (
                        <IconCard key={title} icon={icon} title={title} footer={<span className="pill mono">{trigger}</span>}>{body}</IconCard>
                    ))}
                </div>
            </section>

            <section className="mx-auto mt-24 max-w-[1200px] px-5">
                <SectionHead kicker="Stack" title="Construído sobre serviços que você pode inspecionar." />
                <div className="hatch">
                    <div className="card row-list">
                        {STACK.map(([name, body, url]) => (
                            <a key={name} href={url} target="_blank" rel="noreferrer" className="group flex flex-col gap-1 px-5 py-4 transition-colors hover:bg-hover/40 sm:flex-row sm:items-center sm:gap-6">
                                <span className="w-40 flex-none font-bold text-foreground group-hover:text-brand-ink">{name}</span>
                                <span className="text-muted-foreground">{body}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
