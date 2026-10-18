// Everything sponsor-related lives here: edit this file when someone starts or stops sponsoring.
// Perks only name placements the code actually renders (README, sponsor wall, site footer,
// landing page, in-app sidebar), so the page never promises something the site doesn't do.

export type Sponsor = {
    name: string;
    url: string;
    logo?: string;       // white/transparent logo in /public, shown on dark surfaces
    iconOnly?: boolean;  // logo is a mark without the name, so the name is shown beside it
    banner?: string;     // sponsor-supplied banner, shown whole in the sponsor band instead of the logo
    blurb?: string;      // one line for the floating banner on the landing page
    tier?: SponsorTierId;
    period?: string;     // e.g. "2026"
};

export type SponsorTierId = 'backer' | 'supporter' | 'company' | 'partner';

// One border colour per tier, shared by the tier cards on /sponsor and the sponsor band.
export const TIER_COLOR: Record<SponsorTierId, string> = {
    backer: 'oklch(0.72 0.11 50)',
    supporter: 'oklch(0.72 0.12 250)',
    company: 'oklch(0.8 0.13 176)',
    partner: 'oklch(0.72 0.14 300)',
};
export const tierBorder = (tier: SponsorTierId) => `color-mix(in oklch, ${TIER_COLOR[tier]} 55%, transparent)`;

// Registered accounts on the hosted app (13K+ as of September 2026). Update from the user collection count.
export const REGISTERED_USERS = '13,000+';

// Partners share the app sidebar; the Partner tier sells exactly this many slots.
export const SIDEBAR_SPONSOR_SLOTS = 3;

export const SPONSOR_TIERS: {
    id: SponsorTierId;
    name: string;
    monthly: number;
    blurb: string;
    perks: string[];
    slots?: number;
    featured?: boolean;
}[] = [
    {
        id: 'backer', name: 'Backer', monthly: 5,
        blurb: 'Para quem usa o OpenStock e quer que ele continue gratuito.',
        perks: ['Seu nome na lista de patrocinadores do README', 'Nosso agradecimento, todo mês'],
    },
    {
        id: 'supporter', name: 'Supporter', monthly: 25,
        blurb: 'Para usuários frequentes que querem aparecer apoiando o open source.',
        perks: ['Tudo do Backer', 'Nome e avatar no mural de patrocinadores', 'Listado nesta página'],
    },
    {
        id: 'company', name: 'Company', monthly: 100, featured: true,
        blurb: 'Para equipes e produtos que querem alcançar desenvolvedores e investidores.',
        perks: ['Logo no rodapé de todas as páginas públicas', 'Logo no README', 'Logo nesta página, com link para o seu site'],
    },
    {
        id: 'partner', name: 'Partner', monthly: 500, slots: SIDEBAR_SPONSOR_SLOTS,
        blurb: 'Os espaços mais visíveis do OpenStock, limitados a três.',
        perks: ['Tudo do Company', `Uma das três vagas de patrocínio no menu lateral do app, vista por ${REGISTERED_USERS} usuários cadastrados`, 'Logo na página inicial'],
    },
];

export const ACTIVE_SPONSORS: Sponsor[] = [
    { name: 'Orbit', url: 'https://github.com/diip3sh/orbit', logo: '/assets/icons/orbit.png', iconOnly: true, tier: 'partner', blurb: 'Gravador de tela e editor de vídeo gratuito e open source para macOS.' },
    { name: 'RapidProxy', url: 'https://www.rapidproxy.io/?ref=openstock', logo: '/assets/icons/rapidproxy.png', banner: '/assets/images/rapidproxy-banner.png', tier: 'company' },
];

export const PREVIOUS_SPONSORS: Sponsor[] = [
    { name: 'Atlas Cloud', url: 'https://www.atlascloud.ai', logo: '/assets/icons/atlascloud.svg', tier: 'partner' },
    { name: 'Siray.ai', url: 'https://www.siray.ai', logo: '/assets/icons/siray.svg', tier: 'partner', period: '2026' },
];

// People who sponsored publicly on GitHub (private sponsors stay anonymous). Avatars come from GitHub.
export const SUPPORTERS: { name: string; login: string }[] = [
    { name: 'Jonas Gunklach', login: 'jonasgunklach' },
    { name: 'Dan Sellars', login: 'xlab-nyc' },
    { name: 'Mangolito', login: 'Mangolito' },
];

// Counted from GitHub Sponsors; individual sponsors stay anonymous unless they sponsor publicly.
export const SPONSOR_GOAL = { label: 'patrocinadores mensais', target: 1000, current: 1 };

export const SPONSOR_CONTACT_EMAIL = 'opendevsociety@gmail.com';

// Who receives sponsorships today (GitHub Sponsors is on the founder's personal account).
export const SPONSOR_RECIPIENT = { name: 'Ravi Pratap Singh', handle: 'ravixalgorithm', role: 'fundador da Open Dev Society' };

// Where sponsorship money goes. Add `monthly` (USD) to a line once the real bill is known;
// the page then shows amounts and each line's share. Lines without it never show a figure.
export const FUNDING_USES: { label: string; detail: string; monthly?: number }[] = [
    { label: 'Hospedagem', detail: 'A Vercel serve o app e o site. Nosso tráfego já passou do plano gratuito.' },
    { label: 'Dados de mercado', detail: 'Chaves do Finnhub, para as cotações seguirem rápidas para todos e o OpenStock Cloud entrar no ar.' },
    { label: 'Banco de dados', detail: 'MongoDB Atlas para contas, watchlists e alertas.' },
    { label: 'IA e e-mail', detail: 'Gemini para os e-mails de boas-vindas e o resumo semanal, além do envio de e-mails.' },
    { label: 'Manutenção', detail: 'Tempo para revisar pull requests da comunidade, corrigir bugs e lançar novidades.' },
];

export const sidebarSponsors = () => ACTIVE_SPONSORS.filter((s) => s.tier === 'partner').slice(0, SIDEBAR_SPONSOR_SLOTS);
