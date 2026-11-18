import type { SiteContent } from './schema';

/**
 * Conteúdo de reserva: usado quando o painel não responde na hora do build e como ponto de
 * partida do painel no primeiro acesso. Depois disso, o que vale é o que foi publicado em `/admin/`.
 */
export const embedded: SiteContent = {
  seo: {
    title: 'Eliana Lino — Psicóloga Clínica | Florianópolis',
    description:
      'Psicóloga clínica especializada em processos de autoconhecimento, desenvolvimento pessoal e acolhimento emocional. Atendimento presencial em Florianópolis e online. CRP 9424/12.',
  },
  hero: {
    eyebrow: 'Psicologia Clínica · Autoconhecimento · Consciência',
    title: '“Uma boa escuta pode ressignificar as',
    titleItalic: 'experiências vividas e as relações que construímos.”',
    text: 'Um espaço de escuta, presença e investigação para que você reconheça, compreenda e integre suas dimensões no seu próprio ritmo.',
  },
  about: {
    eyebrow: 'Sobre mim',
    title: 'Uma escuta para a *sua totalidade*',
    subtitle: 'Olhar para a história com presença e acolhimento.',
    paragraphs: [
      'Sou psicóloga clínica e acompanho pessoas em processos de autoconhecimento, desenvolvimento emocional e transformação pessoal. Acredito que cada pessoa possui uma sabedoria interna capaz de orientar seu próprio caminho de crescimento.',
      'Meu papel é oferecer um espaço seguro de escuta, presença e investigação para que todas as suas dimensões sejam reconhecidas, compreendidas e integradas no seu próprio ritmo.',
    ],
  },
  quote: {
    text: 'O autoconhecimento é a viagem mais corajosa que um ser humano pode fazer.',
    author: 'Eliana Lino · Psicóloga Clínica',
  },
  approach: {
    eyebrow: 'Abordagem Terapêutica',
    title: 'O Caminho de *Integração*',
    subtitle: 'Mente, corpo, emoções e espiritualidade caminham juntos.',
    cards: [
      {
        title: 'Olhar Integral',
        text: 'A experiência clínica me ensinou que o ser humano deve ser compreendido em sua totalidade. Cada atendimento respeita a sua história singular, seus recursos atuais e seu ritmo de desenvolvimento.',
      },
      {
        title: 'Bases e Abordagens',
        text: 'Minha prática profissional integra diferentes campos de estudo que sustentam e dão profundidade ao trabalho: a Gestalt-terapia, a Psicologia Corporal, a Psicologia Transpessoal, a Constelação Familiar e o Pathwork.',
      },
      {
        title: 'A Inspiração do Pathwork',
        text: 'Uma das grandes bases deste percurso é a visão de desenvolvimento baseada na integração das diferentes dimensões da personalidade e no encontro com a sua verdade interior.',
      },
    ],
  },
  groups: {
    eyebrow: 'Grupos Terapêuticos',
    title: 'Espaços de *Partilha*',
    subtitle: 'O poder do encontro e da experiência compartilhada.',
    text: 'Além dos atendimentos individuais, facilito grupos de desenvolvimento humano e autoconhecimento. Nesses espaços, a experiência compartilhada possibilita encontros profundos consigo mesmo e com os outros, ampliando a consciência, a autenticidade e a capacidade de construir relações mais verdadeiras.',
  },
  areas: {
    eyebrow: 'Áreas de Atuação',
    title: 'Como posso *caminhar* ao seu lado',
    items: [
      {
        title: 'Jornada Individual',
        subtitle: 'Desenvolvimento e Maturidade',
        lead: 'Acompanhamento individual para adolescentes, jovens e adultos em processos de autoconhecimento, amadurecimento e transformação.',
        body: 'Um espaço para reconhecer padrões, conflitos e bloqueios, fortalecer a relação consigo mesmo e encontrar formas mais autênticas de se expressar e viver.',
      },
      {
        title: 'Pathwork',
        subtitle: 'Grupos de Consciência para Adultos e Jovens',
        lead: 'Grupos de autoconhecimento inspirados nos ensinamentos do Pathwork de Eva Pierrakos.',
        body: 'Um espaço para investigar emoções, padrões, conflitos e resistências, ampliando a consciência e desenvolvendo mais verdade, presença e autorresponsabilidade.',
      },
      {
        title: 'O Despertar do Feminino',
        subtitle: 'Corpo · Ciclos · Linhagem · Essência',
        lead: 'Um espaço para mulheres que desejam se reconectar com seu corpo, seus ciclos, sua força e sua verdade interior.',
        body: 'Uma jornada que integra limpeza do ventre, reconexão com o feminino e constelação familiar, favorecendo um olhar consciente sobre histórias, vínculos e padrões que atravessam a experiência feminina.',
      },
    ],
  },
  projects: {
    eyebrow: 'Projetos Criativos',
    title: 'Expressão e *Criatividade*',
    subtitle: 'Instrumentos que ampliam a reflexão e o autoconhecimento.',
    paragraphs: [
      'A dimensão criativa é parte fundamental da minha forma de trabalhar. Sou autora de um livro que narra o diálogo sensível entre uma menina indígena e seu avô à beira do rio sobre a vida — um convite para reencontrar a criança interior que habita em cada um de nós.',
      'Dessa veia artística nasceram também um livro de poesias e outras ferramentas terapêuticas coletivas, como cartas e um caderno de revisão diária, criados para expandir os processos de expressão e cura.',
    ],
  },
  cta: {
    eyebrow: 'Pronto para começar?',
    title: 'O primeiro passo começa com uma conversa.',
    text: 'Agende uma conversa de acolhimento e descubra como a terapia pode caminhar com você.',
  },
  contact: {
    eyebrow: 'Contato',
    title: 'Vamos conversar?',
    intro:
      'Preencha o formulário ou entre em contato diretamente. Respondo todas as mensagens em até 24 horas.',
    whatsapp: '5548999212332',
    phoneDisplay: '(48) 99921-2332',
    email: 'contato@elianalino.com.br',
    address:
      'Rodovia Dr. Antônio Luiz Moura Gonzaga, 3339 - Rio Tavares, Florianópolis - SC, 88048-301 Sala 102, bloco C',
    instagram: 'https://www.instagram.com/eliana_lino/',
    waGreeting: 'Olá, Eliana! Vim pelo site.',
    subjects: [
      'Ansiedade ou estresse',
      'Autoconhecimento',
      'Transição de vida / carreira',
      'O despertar do feminino',
      'Outro assunto',
    ],
  },
  footer: {
    quote:
      '“Mais do que seguir uma metodologia, meu compromisso é acompanhar você em seu processo singular de crescimento, realização e expansão da própria vida.”',
    tagline:
      'Acompanhando pessoas em processos de autoconhecimento, desenvolvimento emocional e transformação pessoal.',
    copyright: 'Ilê · Eliana Lino · CRP 9424/12. Todos os direitos reservados.',
  },
  images: {
    about: { alt: 'Eliana Lino' },
    groups: { alt: 'Eliana Lino sentada no chão com cartas terapêuticas dispostas à sua frente' },
    projects: { alt: 'Eliana Lino segurando seu livro Sol, Lua, Sol, Lua' },
    cta: { alt: 'Eliana Lino sorrindo durante uma conversa' },
  },
};
