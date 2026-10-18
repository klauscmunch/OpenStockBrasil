import { Metadata } from 'next';
import { BookOpen, ChevronDown, Github, MessageCircle } from 'lucide-react';
import PageHero from '@/components/marketing/PageHero';
import SectionHead from '@/components/marketing/SectionHead';
import IconCard from '@/components/marketing/IconCard';
import { DISCORD_URL, REPO_URL } from '@/lib/constants';

export const metadata: Metadata = {
    title: 'Ajuda | OpenStock',
    description: 'Suporte feito pela comunidade do OpenStock. Sem paywalls, só ajuda.',
};

const FAQS = [
    {
        question: 'O OpenStock é mesmo gratuito?',
        answer: 'Sim. Vivemos de patrocínios e contribuições da comunidade. Gráficos, watchlists e pesquisa continuam gratuitos. O OpenStock Cloud, em breve, adiciona cotações em tempo real e alertas de preço por e-mail por US$ 5 por mês. Hospedando por conta própria você tem os dois.',
    },
    {
        question: 'Como adiciono uma ação à minha watchlist?',
        answer: 'Aperte ⌘K (ou Buscar ações no menu lateral), abra a empresa e clique em Acompanhar. Ela aparece na sua watchlist e no menu lateral.',
    },
    {
        question: 'De onde vêm os dados de mercado?',
        answer: 'Os gráficos vêm ao vivo do TradingView. As cotações da B3 vêm da brapi.dev; as dos EUA e de cripto, do Finnhub. As notícias das ações brasileiras vêm do Google Notícias. Cada preço mostra o horário do último negócio.',
    },
    {
        question: 'Quais mercados são suportados?',
        answer: 'Brasil (B3), com cotações pela brapi.dev; ações dos EUA, cripto e forex em tempo real; Canadá e Austrália com atraso; Índia (pela BSE) e Alemanha com dados de fim do dia. Os alertas funcionam para ações dos EUA e cripto.',
    },
    {
        question: 'Meu alerta não disparou.',
        answer: 'Os alertas de preço fazem parte do OpenStock Cloud (ou de uma instalação própria no modo realtime). Lá eles são verificados a cada cinco minutos e enviados para o e-mail da sua conta quando o preço cruza o seu alvo. Confira o status do alerta na página da watchlist.',
    },
    {
        question: 'Posso contribuir com código ou design?',
        answer: 'Com certeza. As issues marcadas como “good first issue” são um bom começo. Designers, desenvolvedores e redatores são todos bem-vindos.',
    },
];

export default function HelpPage() {
    return (
        <>
            <PageHero kicker="Ajuda" title="Como podemos ajudar?" sub="Suporte feito pela comunidade, para todos." />

            <section className="mx-auto mt-14 grid max-w-[1200px] gap-3 px-5 md:grid-cols-3">
                <IconCard icon={BookOpen} title="Como funciona" footer={<a href="/api-docs" className="btn btn-ghost w-full">Ler sobre a arquitetura</a>}>
                    Fontes de dados, tarefas em segundo plano e a IA por trás dos e-mails.
                </IconCard>
                <IconCard icon={MessageCircle} title="Chat da comunidade" footer={<a href={DISCORD_URL} target="_blank" rel="noreferrer" className="btn btn-ghost w-full">Entrar no Discord</a>}>
                    Tire dúvidas com outros usuários e com os mantenedores.
                </IconCard>
                <IconCard icon={Github} title="Reportar um bug" footer={<a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer" className="btn btn-ghost w-full">Abrir uma issue</a>}>
                    Encontrou algo quebrado? Conte para a gente no GitHub.
                </IconCard>
            </section>

            <section className="mx-auto mt-24 max-w-[1200px] px-5">
                <SectionHead kicker="Perguntas frequentes" title="Dúvidas comuns." />
                <div className="hatch">
                    <div className="card row-list overflow-hidden">
                        {FAQS.map(({ question, answer }) => (
                            <details key={question} className="group">
                                {/* Padding lives on the summary so the whole row is the click target, in every browser */}
                                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-foreground transition-colors hover:bg-hover/40 [&::-webkit-details-marker]:hidden">
                                    {question}
                                    <ChevronDown className="size-4 flex-none text-faint transition-transform duration-200 group-open:rotate-180" />
                                </summary>
                                <p className="max-w-3xl px-5 pb-5 text-[15px] leading-relaxed text-muted-foreground">{answer}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-24 max-w-[1200px] px-5">
                <div className="hatch">
                    <div className="card flex flex-col items-start justify-between gap-5 p-8 md:flex-row md:items-center">
                        <div>
                            <h2 className="text-[22px] font-bold tracking-[-0.03em]">Ainda com dúvida?</h2>
                            <p className="mt-1 text-muted-foreground">Nossa equipe e a comunidade respondem e-mails, de graça.</p>
                        </div>
                        <a href="mailto:opendevsociety@gmail.com" className="btn btn-primary h-11 px-5 text-[15px]">Suporte por e-mail</a>
                    </div>
                </div>
            </section>
        </>
    );
}
