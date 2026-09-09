export type Priority = 'alta' | 'média' | 'baixa'
export type Scope = 'interna' | 'externa'
export type Context = 'conta' | 'menção' | 'contrato'

export interface Task {
  id: string
  group: string
  title: string
  priority: Priority
  scope: Scope
  comments: number
  context: Context
  /** Dias a partir de hoje. Negativo = atrasada. */
  dueInDays: number
  assignee: string
  done: boolean
  /** Quando existe, a linha aponta para cá em vez da rota interna. */
  url?: string
}

export interface Record {
  title: string
  description: string
  type: string
  status: string
  assignee: string | null
  priority: Priority
  followers: string[]
  account: string
  tags: string[]
}

export const record: Record = {
  title: 'Open source — o que está aberto nos nossos repositórios',
  description: '',
  type: 'Manutenção',
  status: 'Em andamento',
  assignee: null,
  priority: 'alta',
  followers: ['Luis Novo', 'Gyovana Prado'],
  account: 'Supernova Labs',
  tags: ['Open source', 'Comunidade'],
}

const gh = (repo: string, n: number) => `https://github.com/lfnovo/${repo}/issues/${n}`

/**
 * Issues abertas de verdade, nos repositórios públicos.
 * Nada aqui é interno: tudo já está visível no GitHub.
 */
const raw: Omit<Task, 'id'>[] = [
  { group: 'Open Notebook', title: '#1327 · O SSE do chat não tem keepalive, e cancelar não faz nada', priority: 'alta', scope: 'interna', comments: 0, context: 'conta', dueInDays: -1, assignee: 'Luis Novo', done: false, url: gh('open-notebook', 1327) },
  { group: 'Open Notebook', title: '#1264 · A aba de insights desiste depois de 4 minutos e nunca mostra o resultado', priority: 'alta', scope: 'externa', comments: 1, context: 'menção', dueInDays: 0, assignee: 'Luis Novo', done: false, url: gh('open-notebook', 1264) },
  { group: 'Open Notebook', title: '#1312 · O parent_id do insight muda entre a busca textual e a vetorial', priority: 'alta', scope: 'externa', comments: 1, context: 'menção', dueInDays: 1, assignee: 'Gyovana Prado', done: false, url: gh('open-notebook', 1312) },
  { group: 'Open Notebook', title: '#1317 · Endurecer a derivação da chave de cifra (PBKDF2, com versão no ciphertext)', priority: 'média', scope: 'interna', comments: 0, context: 'conta', dueInDays: 4, assignee: 'Renato Ames', done: false, url: gh('open-notebook', 1317) },
  { group: 'Open Notebook', title: '#1290 · Senha com caractere fora de latin-1 nunca autentica na API', priority: 'baixa', scope: 'externa', comments: 0, context: 'menção', dueInDays: 8, assignee: 'Luis Novo', done: true, url: gh('open-notebook', 1290) },
  { group: 'Open Notebook', title: '#1325 · As retentativas do worker ficam escondidas em log de debug', priority: 'baixa', scope: 'interna', comments: 0, context: 'conta', dueInDays: 12, assignee: 'Gyovana Prado', done: false, url: gh('open-notebook', 1325) },

  { group: 'Esperanto', title: '#262 · Azure exige api-version e não suporta a API v1 GA', priority: 'alta', scope: 'externa', comments: 2, context: 'menção', dueInDays: 2, assignee: 'Gyovana Prado', done: false, url: gh('esperanto', 262) },
  { group: 'Esperanto', title: '#277 · Modalidade de geração de imagem (texto→imagem)', priority: 'média', scope: 'interna', comments: 1, context: 'contrato', dueInDays: 5, assignee: 'Luis Novo', done: false, url: gh('esperanto', 277) },
  { group: 'Esperanto', title: '#264 · Adicionar a Eden AI como provedor compatível com OpenAI', priority: 'baixa', scope: 'externa', comments: 0, context: 'menção', dueInDays: 9, assignee: 'Gyovana Prado', done: false, url: gh('esperanto', 264) },
  { group: 'Esperanto', title: '#281 · CI: pular as checagens caras em PR que só mexe em documentação', priority: 'baixa', scope: 'interna', comments: 0, context: 'conta', dueInDays: 14, assignee: 'Renato Ames', done: true, url: gh('esperanto', 281) },

  { group: 'Content Core', title: '#60 · Parar de engolir falha de extração: ou levanta erro, ou degrada', priority: 'alta', scope: 'interna', comments: 3, context: 'contrato', dueInDays: 3, assignee: 'Luis Novo', done: false, url: gh('content-core', 60) },
  { group: 'Content Core', title: '#61 · YouTube sem legenda: baixar o áudio pelo yt-dlp como alternativa', priority: 'média', scope: 'externa', comments: 1, context: 'menção', dueInDays: 6, assignee: 'Gyovana Prado', done: false, url: gh('content-core', 61) },
  { group: 'Content Core', title: '#43 · Suportar os formatos OpenDocument (.odt, .ods, .odp)', priority: 'baixa', scope: 'externa', comments: 0, context: 'menção', dueInDays: 11, assignee: 'Luis Novo', done: false, url: gh('content-core', 43) },

  { group: 'surreal-basics', title: '#33 · Migrations em vários namespaces caem todas no primeiro, em silêncio', priority: 'alta', scope: 'interna', comments: 0, context: 'conta', dueInDays: 1, assignee: 'Renato Ames', done: false, url: gh('surreal-basics', 33) },
  { group: 'surreal-basics', title: '#34 · Sessão por requisição: namespace, banco e credencial como argumento', priority: 'alta', scope: 'interna', comments: 0, context: 'contrato', dueInDays: 7, assignee: 'Renato Ames', done: false, url: gh('surreal-basics', 34) },
]

export const tasks: Task[] = raw.map((t, i) => ({ ...t, id: `T-${1042 + i}` }))

/** Simula a API: 600ms de espera, e falha se `fail` for pedido. */
export function fetchTasks(fail = false): Promise<Task[]> {
  return new Promise((resolve, reject) =>
    setTimeout(() => (fail ? reject(new Error('500')) : resolve(tasks)), 600),
  )
}

export function formatDue(days: number): { label: string; tone: 'danger' | 'success' | 'warning' | 'muted' } {
  if (days < 0) return { label: days === -1 ? 'Atrasada 1 dia' : `Atrasada ${-days} dias`, tone: 'danger' }
  if (days === 0) return { label: 'Vence hoje', tone: 'success' }
  if (days === 1) return { label: 'Vence amanhã', tone: 'warning' }
  const d = new Date()
  d.setDate(d.getDate() + days)
  return {
    label: d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', ''),
    tone: 'muted',
  }
}

export type UpdateKind = 'release' | 'correção' | 'decisão' | 'comentário'

export interface Update {
  id: string
  /** ISO (YYYY-MM-DD). */
  date: string
  author: string
  summary: string
  kind: UpdateKind
}

/** Atualizações do registro, da mais recente para a mais antiga. */
const rawUpdates: Omit<Update, 'id'>[] = [
  { date: '2026-09-09', author: 'Luis Novo', kind: 'release', summary: 'Open Notebook 1.3 saiu: o chat passou a mandar keepalive no SSE, então a conexão para de cair sozinha atrás de proxy, e cancelar agora corta a resposta de verdade em vez de só esconder o texto na tela. A aba de insights também deixou de desistir aos quatro minutos e o worker registra as retentativas fora do log de debug.' },
  { date: '2026-09-08', author: 'Gyovana Prado', kind: 'correção', summary: 'O parent_id do insight ficou igual na busca textual e na vetorial — a divergência era um join que só existia em um dos caminhos.' },
  { date: '2026-09-05', author: 'Renato Ames', kind: 'decisão', summary: 'A cifra passa a derivar chave com PBKDF2 e a gravar a versão dentro do ciphertext, para conseguirmos girar o algoritmo sem migração.' },
  { date: '2026-09-03', author: 'Gyovana Prado', kind: 'comentário', summary: 'O Azure só responde com api-version na query; a API v1 GA não atende esse provedor e ficou fora do escopo da 1.3.' },
  { date: '2026-08-28', author: 'Luis Novo', kind: 'correção', summary: 'Senha com caractere fora de latin-1 voltou a autenticar na API: o header agora vai em UTF-8.' },
  { date: '2026-08-21', author: 'Renato Ames', kind: 'decisão', summary: 'CI passa a pular as checagens caras em PR que só mexe em documentação — corta uns oito minutos de espera por PR.' },
]

export const updates: Update[] = rawUpdates.map((u, i) => ({ ...u, id: `U-${210 + i}` }))

/** Simula a API das atualizações, no mesmo contrato de `fetchTasks`. */
export function fetchUpdates(fail = false): Promise<Update[]> {
  return new Promise((resolve, reject) =>
    setTimeout(() => (fail ? reject(new Error('500')) : resolve(updates)), 600),
  )
}

/** Data absoluta curta, com o dia relativo quando é recente. */
export function formatUpdateDate(iso: string): { label: string; title: string } {
  const d = new Date(`${iso}T12:00:00`)
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  const days = Math.round((today.getTime() - d.getTime()) / 86_400_000)
  const title = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  if (days === 0) return { label: 'Hoje', title }
  if (days === 1) return { label: 'Ontem', title }
  return {
    label: d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', ''),
    title,
  }
}
