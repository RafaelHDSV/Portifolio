import type { LinkedInPost } from './types'

/**
 * Posts manuais — opcao que funciona sem RSS nem API.
 *
 * Quando publicar no LinkedIn:
 * 1. Abra o post no navegador
 * 2. Copie a URL (ex.: https://www.linkedin.com/posts/activity-...)
 * 3. Adicione um item abaixo (mais recente primeiro)
 * 4. Commit + deploy (ou edite LINKEDIN_MANUAL_POSTS na Vercel)
 *
 * Deixe o array vazio [] para tentar RSS/API; com itens, estes posts tem prioridade.
 */
export const MANUAL_LINKEDIN_POSTS: LinkedInPost[] = [
  {
    id: '7463166740848455680',
    title: 'Web Frontend Completo: HTML, CSS, JS, TS, React e Next',
    excerpt:
      'Finalizei o curso da Udemy com Jamilton Damasceno e Jorge Sant\'Ana — mais de 75 horas, 411 aulas e 10 projetos práticos, do HTML5 ao Next.js e Tailwind.',
    url: 'https://www.linkedin.com/posts/activity-7463166740848455680-vKsY',
    publishedAt: '2026-05-21T12:00:00.000Z'
  },
  {
    id: '7460755058133975040',
    title: 'Deprecated Finder — extensão open source para VS Code e Cursor',
    excerpt:
      'Lancei o Deprecated Finder: varre o workspace, lista usos de APIs deprecadas e aplica a troca sugerida no JSDoc — por ocorrência ou em massa. Código aberto (MIT).',
    url: 'https://www.linkedin.com/posts/activity-7460755058133975040-JDqF',
    publishedAt: '2026-05-17T12:00:00.000Z'
  },
  {
    id: '7458093338206949379',
    title: 'Repo-Workspace — yarn install e dev em vários repositórios',
    excerpt:
      'Ferramenta leve em Node para quem mantém microserviços ou front + API como pastas irmãs: descobre projetos, roda yarn install/dev em paralelo e seleção interativa ou CLI.',
    url: 'https://www.linkedin.com/posts/activity-7458093338206949379-bQti',
    publishedAt: '2026-05-10T12:00:00.000Z'
  },
  {
    id: '7416640602953515008',
    title: 'Certificado: Automação com n8n e Agentes de IA',
    excerpt:
      'Concluí o curso de n8n — automações complexas, integração entre APIs e bancos, agentes de IA nos fluxos e workflows reutilizáveis e escaláveis.',
    url: 'https://www.linkedin.com/posts/activity-7416640602953515008-9SAz',
    publishedAt: '2026-01-24T12:00:00.000Z'
  },
  {
    id: '7390833855034855424',
    title: 'Oracle Cloud Infrastructure 2025 Certified Foundations Associate',
    excerpt:
      'Concluí o exame 1Z0-1085-25 (OCI Foundations) pela Anhembi Morumbi | Campus Athon Sorocaba — IaaS, armazenamento, rede, segurança e conceitos da OCI.',
    url: 'https://www.linkedin.com/posts/activity-7390833855034855424-y-8P',
    publishedAt: '2025-11-24T12:00:00.000Z'
  }
]

export function parseManualPostsFromEnv (): LinkedInPost[] {
  const raw = process.env.LINKEDIN_MANUAL_POSTS
  if (!raw?.trim()) return []

  try {
    const parsed = JSON.parse(raw) as LinkedInPost[]
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((p) => p?.url && p?.title)
      .slice(0, 5)
  } catch {
    console.error('LINKEDIN_MANUAL_POSTS: JSON invalido')
    return []
  }
}

export function loadManualPosts (): LinkedInPost[] {
  const fromEnv = parseManualPostsFromEnv()
  if (fromEnv.length > 0) return fromEnv
  return MANUAL_LINKEDIN_POSTS.slice(0, 5)
}
