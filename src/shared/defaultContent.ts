import type { SiteContent } from './types';

// Conteúdo inicial. A dona do site altera tudo em /editar, sem tocar no código.
export const DEFAULT_CONTENT: SiteContent = {
  name: 'Camila Gomes Garcia',
  title: 'Psicóloga · Abordagem Gestáltica',
  tagline: 'Escuta presente e cuidado, no aqui e agora.',
  email: 'seuemail@exemplo.com', // placeholder
  whatsapp: '5519999999999', // placeholder: DDI+DDD+número, só dígitos
  photoUrl: '',
  slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'], // exemplo: ajuste no painel
  story:
    'Sou formada em Psicologia pela PUC-Campinas e realizo meus trabalhos sob a orientação da abordagem Gestáltica. Minha formação passou por diferentes campos da Psicologia, da clínica à saúde, da educação ao trabalho, e por projetos de extensão e escrita ligados à comunidade e à universidade.',
  experiences: [
    { area: 'Psicologia Forense', where: 'Grupo de Operações Especiais (GOE)' },
    { area: 'Psicologia Escolar/Educacional', where: 'Escola Estadual Tenista Maria Esther Andion Bueno' },
    { area: 'Psicologia Clínica', where: 'Serviço Escola de Psicologia da PUC-Campinas' },
    { area: 'Psicologia da Saúde', where: 'Centro de Saúde Dr. Pedro Agápio de Aquino Netto' },
    { area: 'Organização, Trabalho e Renda', where: 'Instituto Padre Haroldo' },
  ],
  skills: [
    { title: 'Clínica Gestáltica', description: 'Atendimento orientado pela abordagem Gestáltica.' },
    { title: 'Saúde', description: 'Experiência em estágio em Centro de Saúde.' },
    { title: 'Escola e Educação', description: 'Estágio em escola estadual.' },
    { title: 'Forense', description: 'Estágio junto ao GOE.' },
    { title: 'Trabalho e Renda', description: 'Estágio no Instituto Padre Haroldo.' },
    { title: 'Prevenção e Comunidade', description: 'Voluntária em diálogos comunitários sobre prevenção de suicídio e violências.' },
    { title: 'Escrita', description: 'Editora e escritora do Jornal Refrata.' },
  ],
  projects: [
    {
      title: 'Um girassol em cada janela',
      description:
        'Projeto de extensão: diálogos comunitários sobre prevenção de suicídio e violências durante a pandemia de Covid-19. Voluntária, sob orientação da Prof.ª Dr.ª Tatiana Slonczewski (22/03/2021 a 14/12/2021).',
    },
    {
      title: 'Jornal Refrata',
      description:
        'Editora e escritora do jornal do curso de Psicologia, do Centro Acadêmico 27 de Agosto da PUC-Campinas.',
    },
  ],
  socials: [
    { label: 'Instagram', url: 'https://instagram.com/' },
    { label: 'LinkedIn', url: 'https://linkedin.com/' },
  ],
};
