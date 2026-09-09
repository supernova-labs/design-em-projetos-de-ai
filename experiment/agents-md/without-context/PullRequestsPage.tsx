import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FilterBar, FilterChip } from "@/components/ui/filter-bar";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { PullRequestList } from "@/components/ui/pull-request-list";
import { fetchPullRequests, type PrState, type PullRequest } from "@/data";

const PER_PAGE = 10;
const STATES: PrState[] = ["aberto", "em review", "mergeado"];

/** Esqueleto da lista. Skeleton, nunca spinner: o layout não pula. */
function PullRequestsSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-lg border border-border bg-surface shadow-card"
      role="status"
      aria-label="Carregando pull requests"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 border-b border-border px-3 py-3 last:border-0">
          <div className="size-[18px] animate-pulse rounded-full bg-border" />
          <div
            className="h-3.5 flex-1 animate-pulse rounded bg-border"
            style={{ animationDelay: `${i * 60}ms` }}
          />
          <div className="hidden h-3.5 w-20 animate-pulse rounded bg-border sm:block" />
          <div className="hidden h-3.5 w-24 animate-pulse rounded bg-border lg:block" />
          <div className="size-6 animate-pulse rounded-full bg-border" />
        </div>
      ))}
    </div>
  );
}

/**
 * Lista de pull requests: busca por título, autor ou repositório, filtro por estado,
 * e a idade do PR como coluna própria — o que espera há mais tempo aparece primeiro.
 * Quatro estados: carregando, vazio, vazio-por-filtro, erro.
 */
export function PullRequestsPage({ simulate }: { simulate: "ok" | "empty" | "error" }) {
  const [data, setData] = useState<PullRequest[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [search, setSearch] = useState("");
  const [state, setState] = useState<PrState | null>(null);
  const [page, setPage] = useState(1);

  const load = () => {
    setData(null);
    setFailed(false);
    fetchPullRequests(simulate === "error")
      .then((rows) => setData(simulate === "empty" ? [] : rows))
      .catch(() => setFailed(true));
  };

  useEffect(load, [simulate]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data
      .filter(
        (pr) =>
          (!state || pr.state === state) &&
          (q === "" ||
            pr.title.toLowerCase().includes(q) ||
            pr.author.toLowerCase().includes(q) ||
            pr.repo.toLowerCase().includes(q) ||
            String(pr.number).includes(q)),
      )
      .sort((a, b) => b.openedDaysAgo - a.openedDaysAgo);
  }, [data, search, state]);

  const pageCount = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const hasFilter = search !== "" || state !== null;

  if (failed) return <ErrorState onRetry={load} />;
  if (data === null) return <PullRequestsSkeleton />;

  return (
    <div className="space-y-4">
      <FilterBar
        search={search}
        placeholder="Buscar por título, autor ou repositório…"
        onSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        chips={
          state && (
            <FilterChip label={`estado: ${state}`} onRemove={() => setState(null)} />
          )
        }
      >
        {STATES.map((s) => (
          <Button
            key={s}
            size="sm"
            variant={state === s ? "primary" : "secondary"}
            aria-pressed={state === s}
            onClick={() => {
              setState(state === s ? null : s);
              setPage(1);
            }}
          >
            {s}
          </Button>
        ))}
      </FilterBar>

      {visible.length === 0 ? (
        hasFilter ? (
          <EmptyState
            title="Nenhum pull request bate com o filtro"
            description="Tente outro termo ou remova os filtros ativos."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setSearch("");
                  setState(null);
                  setPage(1);
                }}
              >
                Limpar filtros
              </Button>
            }
          />
        ) : (
          <EmptyState
            title="Nenhum pull request ainda"
            description="Quando alguém abrir o primeiro PR nos repositórios deste registro, ele aparece aqui."
          />
        )
      ) : (
        <>
          <PullRequestList items={visible} />
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
  );
}
