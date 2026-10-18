import Image from 'next/image';
import { Code, Globe, Heart } from 'lucide-react';
import PageHero from '@/components/marketing/PageHero';
import SectionHead from '@/components/marketing/SectionHead';
import IconCard from '@/components/marketing/IconCard';
import { GOOD_FIRST_ISSUES_URL, REPO_URL } from '@/lib/constants';

export const metadata = {
    title: 'Sobre | OpenStock',
    description: 'A história do OpenStock e da Open Dev Society.',
};

const PRINCIPLES = [
    { icon: Globe, title: 'Acesso aberto', body: 'Sem paywall no essencial. Gráficos, watchlists e pesquisa continuam gratuitos para todos, e hospedar por conta própria libera tudo.' },
    { icon: Code, title: 'Open source', body: 'Código totalmente transparente. Audite nossos algoritmos, contribua com recursos e construa com a gente.' },
    { icon: Heart, title: 'Feito pela comunidade', body: 'Mantido por doações e voluntários. Respondemos aos nossos usuários, não a acionistas.' },
];

export default function AboutPage() {
    return (
        <>
            <PageHero
                kicker="Sobre"
                title="Ferramentas para todos."
                sub="Acreditamos que inteligência financeira não deveria ficar trancada atrás de paywalls. O OpenStock é feito pela comunidade, para a comunidade."
            >
                <a href={REPO_URL} target="_blank" rel="noreferrer" className="btn btn-primary h-11 px-5 text-[15px]">Ver o código</a>
                <a href={GOOD_FIRST_ISSUES_URL} target="_blank" rel="noreferrer" className="btn btn-ghost h-11 px-5 text-[15px]">Contribuir</a>
            </PageHero>

            <section className="mx-auto mt-20 max-w-[1200px] px-5">
                <SectionHead kicker="Princípios" title="Aquilo de que não abrimos mão." />
                <div className="grid gap-3 md:grid-cols-3">
                    {PRINCIPLES.map(({ icon, title, body }) => <IconCard key={title} icon={icon} title={title}>{body}</IconCard>)}
                </div>
            </section>

            <section className="mx-auto mt-24 max-w-[1200px] px-5">
                <div className="hatch">
                    <div className="card grid items-center gap-10 p-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:p-12">
                        <div className="flex flex-col gap-4">
                            <p className="kicker text-brand-ink">Open Dev Society</p>
                            <h2 className="text-[30px] font-bold leading-tight tracking-[-0.04em]">Nascido de uma frustração simples.</h2>
                            <p className="text-[16px] leading-relaxed text-muted-foreground">
                                Por que ferramentas financeiras poderosas são tão caras? O OpenStock é a nossa resposta.
                            </p>
                            <p className="text-[16px] leading-relaxed text-muted-foreground">
                                Somos um coletivo de desenvolvedores, designers e entusiastas de finanças que trabalha sob a bandeira da
                                Open Dev Society. Nossa missão é democratizar o software criando alternativas open source de alta qualidade
                                às plataformas proprietárias.
                            </p>
                            <a href="https://github.com/Open-Dev-Society" target="_blank" rel="noreferrer" className="btn btn-ghost mt-2 self-start">
                                Open Dev Society no GitHub
                            </a>
                        </div>
                        <div className="relative grid aspect-square max-h-[340px] place-items-center rounded-[16px] bg-page shadow-[inset_0_0_0_1px_var(--line)]">
                            <Image src="/assets/icons/odsLogo.svg" alt="Open Dev Society" fill className="object-contain p-16 opacity-90" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
