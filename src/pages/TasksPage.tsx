import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { FilterBar, FilterChip } from '@/components/ui/filter-bar'
import { Pagination } from '@/components/ui/pagination'
import { EmptyState, ErrorState } from '@/components/ui/states'
import { RecordHeader } from '@/components/record-header'
import { TaskGroup } from '@/components/task-list'
import { Tabs } from '@/components/ui/tabs'
import { Icon } from '@/components/ui/icon'
import { UpdateList, UpdateListSkeleton } from '@/components/update-list'
import {
  fetchTasks,
  fetchUpdates,
  record,
  type Priority,
  type Task,
  type Update,
} from '@/data'

const PER_PAGE = 10

const TABS = [
  { id: 'tasks', label: 'Tarefas', icon: 'checkCircle' },
  { id: 'fields', label: 'Campos', icon: 'fields' },
  { id: 'notes', label: 'Notas', icon: 'notes' },
  { id: 'updates', label: 'Atualizações', icon: 'updates' },
] as const

/** Esqueleto da lista. Skeleton, nunca spinner: o layout não pula. */
function TasksSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-lg border border-border bg-surface shadow-card"
      role="status"
      aria-label="Carregando tarefas"
    >
      <div className="h-11 border-b border-border" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 border-b border-border px-3 py-3 last:border-0">
          <div className="size-[18px] animate-pulse rounded-[5px] bg-border" />
          <div
            className="h-3.5 flex-1 animate-pulse rounded bg-border"
            style={{ animationDelay: `${i * 60}ms` }}
          />
          <div className="h-3.5 w-14 animate-pulse rounded bg-border" />
          <div className="size-6 animate-pulse rounded-full bg-border" />
        </div>
      ))}
    </div>
  )
}

/**
 * Detalhe do registro com a lista de tarefas — a tela de referência do padrão `page-tasks`.
 * Anatomia: RecordHeader → Tabs → FilterBar → grupos de tarefas → Pagination.
 * Quatro estados: carregando, vazio, vazio-por-filtro, erro.
 */
export function TasksPage({ simulate }: { simulate: 'ok' | 'empty' | 'error' }) {
  const [data, setData] = useState<Task[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [updates, setUpdates] = useState<Update[] | null>(null)
  const [updatesFailed, setUpdatesFailed] = useState(false)
  const [tab, setTab] = useState<string>('tasks')
  const [search, setSearch] = useState('')
  const [priority, setPriority] = useState<Priority | null>(null)
  const [page, setPage] = useState(1)

  const load = () => {
    setData(null)
    setFailed(false)
    fetchTasks(simulate === 'error')
      .then((rows) => setData(simulate === 'empty' ? [] : rows))
      .catch(() => setFailed(true))
  }

  const loadUpdates = () => {
    setUpdates(null)
    setUpdatesFailed(false)
    fetchUpdates(simulate === 'error')
      .then((rows) => setUpdates(simulate === 'empty' ? [] : rows))
      .catch(() => setUpdatesFailed(true))
  }

  useEffect(load, [simulate])
  useEffect(loadUpdates, [simulate])

  const filtered = useMemo(() => {
    if (!data) return []
    return data.filter(
      (t) =>
        (!priority || t.priority === priority) &&
        t.title.toLowerCase().includes(search.toLowerCase()),
    )
  }, [data, search, priority])

  const pageCount = Math.ceil(filtered.length / PER_PAGE)
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const hasFilter = search !== '' || priority !== null

  // Os grupos são derivados das tarefas visíveis: grupo sem tarefa na página não aparece.
  const groups = useMemo(() => {
    const map = new globalThis.Map<string, Task[]>()
    for (const t of visible) map.set(t.group, [...(map.get(t.group) ?? []), t])
    return [...map.entries()]
  }, [visible])

  const toggle = (id: string, done: boolean) =>
    setData((prev) => prev?.map((t) => (t.id === id ? { ...t, done } : t)) ?? prev)

  const add = (group: string, title: string) =>
    setData((prev) =>
      prev
        ? [
            ...prev,
            {
              id: `T-${Math.random().toString(36).slice(2, 7)}`,
              group,
              title,
              priority: 'média',
              scope: 'interna',
              comments: 0,
              context: 'conta',
              dueInDays: 7,
              assignee: 'Você',
              done: false,
            },
          ]
        : prev,
    )

  return (
    <div className="space-y-gutter">
      <RecordHeader record={record} />

      <Tabs tabs={[...TABS]} active={tab} onChange={setTab} />

      {tab === 'updates' ? (
        updatesFailed ? (
          <ErrorState onRetry={loadUpdates} />
        ) : updates === null ? (
          <UpdateListSkeleton />
        ) : updates.length === 0 ? (
          <EmptyState
            title="Nenhuma atualização ainda"
            description="Quando algo mudar neste registro, o histórico aparece aqui."
          />
        ) : (
          <UpdateList updates={updates} />
        )
      ) : tab !== 'tasks' ? (
        <EmptyState
          title="Nada por aqui ainda"
          description="Quando esta seção receber conteúdo, ele aparece aqui."
        />
      ) : failed ? (
        <ErrorState onRetry={load} />
      ) : data === null ? (
        <TasksSkeleton />
      ) : (
        <div className="space-y-4">
          <FilterBar
            search={search}
            placeholder="Buscar tarefa…"
            onSearch={(v) => {
              setSearch(v)
              setPage(1)
            }}
            chips={
              priority && (
                <FilterChip
                  label={`prioridade: ${priority}`}
                  onRemove={() => setPriority(null)}
                />
              )
            }
          >
            {(['alta', 'média', 'baixa'] as const).map((p) => (
              <Button
                key={p}
                size="sm"
                variant={priority === p ? 'primary' : 'secondary'}
                onClick={() => {
                  setPriority(priority === p ? null : p)
                  setPage(1)
                }}
              >
                {p}
              </Button>
            ))}
          </FilterBar>

          {visible.length === 0 ? (
            hasFilter ? (
              <EmptyState
                title="Nenhuma tarefa bate com o filtro"
                description="Tente outro termo ou remova os filtros ativos."
                action={
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSearch('')
                      setPriority(null)
                    }}
                  >
                    Limpar filtros
                  </Button>
                }
              />
            ) : (
              <EmptyState
                title="Nenhuma tarefa ainda"
                description="Quando alguém criar a primeira tarefa deste registro, ela aparece aqui."
                action={
                  <Button>
                    <Icon name="plus" />
                    Nova tarefa
                  </Button>
                }
              />
            )
          ) : (
            <>
              {groups.map(([name, items]) => (
                <TaskGroup
                  key={name}
                  name={name}
                  tasks={items}
                  onToggle={toggle}
                  onAdd={add}
                />
              ))}
              <Pagination
                page={page}
                pageCount={pageCount}
                total={filtered.length}
                perPage={PER_PAGE}
                onChange={setPage}
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}
