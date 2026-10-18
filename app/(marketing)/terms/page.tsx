import { Metadata } from 'next';
import { AlertTriangle, Check, X } from 'lucide-react';
import PageHero from '@/components/marketing/PageHero';
import SectionHead from '@/components/marketing/SectionHead';

export const metadata: Metadata = {
    title: 'Termos de Uso | OpenStock',
    description: 'Termos justos, transparentes e abertos para a nossa comunidade.',
};

const PROMISES = [
    'Os recursos essenciais continuarão gratuitos para sempre.',
    'Nunca venderemos seus dados pessoais.',
    'Mudanças nos termos serão discutidas abertamente.',
    'Suas watchlists e análises são suas.',
];

const RULES = {
    do: ['Compartilhe conhecimento livremente', 'Use a API em projetos pessoais', 'Respeite os outros membros'],
    dont: ['Fazer scraping excessivo dos dados', 'Compartilhar chaves de API', 'Usar o OpenStock para operações de alta frequência'],
};

export default function TermsPage() {
    return (
        <>
            <PageHero
                kicker="Termos · Atualizado em outubro de 2025"
                title="Termos de Uso"
                sub="Baseados em confiança, transparência e valores da comunidade. Sem pegadinhas, só regras claras."
            />

            <section className="mx-auto mt-14 max-w-[1200px] px-5">
                <div className="hatch">
                    <div className="card flex gap-4 p-6 shadow-[inset_0_0_0_1px_oklch(0.76_0.119_70/0.35)]">
                        <AlertTriangle className="mt-0.5 size-5 flex-none text-warn" />
                        <div>
                            <h2 className="font-bold text-warn">Aviso sobre investimentos</h2>
                            <p className="mt-2 max-w-3xl leading-relaxed text-muted-foreground">
                                <strong className="text-foreground">O OpenStock é uma ferramenta educacional e de análise, não um consultor financeiro.</strong>{' '}
                                Os dados são fornecidos no estado em que se encontram, apenas para informação. Nunca invista dinheiro que você não
                                pode perder. Faça sempre sua própria pesquisa ou consulte um profissional certificado antes de tomar decisões financeiras.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-20 max-w-[1200px] px-5">
                <SectionHead kicker="Nosso compromisso" title="Com o que você pode contar." />
                <div className="grid gap-3 sm:grid-cols-2">
                    {PROMISES.map((promise) => (
                        <div key={promise} className="hatch">
                            <div className="card flex h-full items-center gap-3 p-5">
                                <span className="bento-ico bg-brand-soft text-brand-ink"><Check /></span>
                                <span className="font-semibold">{promise}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto mt-20 max-w-[1200px] px-5">
                <SectionHead kicker="Regras da comunidade" title="O que fazer e o que não fazer." />
                <div className="grid gap-3 md:grid-cols-2">
                    {([['Faça', RULES.do, Check, 'text-up'], ['Não faça', RULES.dont, X, 'text-down']] as const).map(([title, items, Icon, tone]) => (
                        <div key={title} className="hatch">
                            <div className="card h-full p-5">
                                <h3 className="kicker">{title}</h3>
                                <ul className="mt-3 flex flex-col gap-2.5">
                                    {items.map((item) => (
                                        <li key={item} className="flex items-center gap-2.5">
                                            <Icon className={`size-4 flex-none ${tone}`} />
                                            <span className="text-muted-foreground">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="mt-8 text-muted-foreground">
                    Dúvidas sobre estes termos? Escreva para <a href="mailto:opendevsociety@gmail.com" className="font-semibold text-brand-ink hover:underline">opendevsociety@gmail.com</a>.
                </p>
            </section>
        </>
    );
}
