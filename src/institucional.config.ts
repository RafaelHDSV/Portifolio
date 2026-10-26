import { defineInstitucionalConfig } from '@vieira/institucional'

/** Host de produção atual. Não trocar por getvieira.com. */
const PUBLIC_URL = 'https://rafaelhdsv.vercel.app'

export const institucionalConfig = defineInstitucionalConfig({
  appName: 'Portfólio',
  appSlug: 'portifolio',
  publicUrl: PUBLIC_URL,
  hasAccount: false,
  legalPages: true,
  legalVersion: '2026-10-25',
  description:
    'o portfólio público de Rafael Vieira, com experiência, projetos e um formulário de contato',
  dataInventory: [
    {
      group: 'Contato',
      items: ['nome', 'e-mail', 'mensagem enviada pelo formulário'],
      purpose: 'receber a mensagem e responder quem escreveu',
      basis: 'legitimo_interesse'
    }
  ],
  processors: [
    { name: 'Vercel', purpose: 'hospedagem do site' },
    { name: 'EmailJS', purpose: 'entrega do formulário de contato ao mantenedor' },
    { name: 'Vieira Analytics', purpose: 'contagem anônima de visitas' },
    {
      name: 'Sentry',
      purpose: 'registro de erros técnicos do site, sem e-mail, IP ou conteúdo da mensagem'
    },
    {
      name: 'GitHub',
      purpose: 'o navegador consulta a API pública para listar repositórios e o perfil'
    },
    { name: 'Google Fonts', purpose: 'arquivos de fonte carregados na página' },
    {
      name: 'Buy Me a Coffee',
      purpose: 'widget de apoio carregado na página'
    }
  ],
  extraPrivacyNotes: [
    'Não há conta. O que fica no navegador (tema, idioma, modo recrutador e descobertas locais) não vai para um servidor deste site.',
    'O formulário só envia nome, e-mail e mensagem quando a pessoa clica em enviar. Não há newsletter.'
  ]
})
