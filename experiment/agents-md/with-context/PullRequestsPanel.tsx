import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FilterBar, FilterChip } from "@/components/ui/filter-bar";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { PullRequestList, PullRequestsSkeleton } from "@/components/ui/pull-request-list";
import { Icon } from "@/components/ui/icon";
import { fetchPullRequests, type PullRequest, type PullRequestState } from "@/data";

const PER_PAGE = 10;

const STATES: { id: PullRequestState; label: string }[] = [
  { id: "aberto", label: "aberto" },
  { id: "review", label: "em review" },
  { id: "mergeado", label: "mergeado" },
];

/**
 * Aba de pull requests: busca, filtro por estado e a lista ordenada do mais parado
 * para o mais recente. Os quatro estados: carregando, vazio, vazio-por-filtro, erro.
 */
export function PullRequestsPanel({ simulate }: { simulate: "ok" | "empty" | "error" }) {
  const [data, setData] = useState<PullRequest[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [search, setSearch] = useState("");
  const [state, setState] = useState<PullRequestState | null>(null);
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
    const term = search.toLowerCase();
    return data
      .filter(
        (pr) =>
          (!state || pr.state === state) &&
          (pr.title.toLowerCase().includes(term) ||
            pr.repo.toLowerCase().includes(term) ||
            pr.author.toLowerCase().includes(term) ||
            `#${pr.number}`.includes(term)),
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
        placeholder="Buscar por título, repositório ou autor…"
        onSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        chips={
          state && (
            <FilterChip
              label={`estado: ${STATES.find((s) => s.id === state)?.label}`}
              onRemove={() => setState(null)}
            />
          )
        }
      >
        {STATES.map((s) => (
          <Button
            key={s.id}
            size="sm"
            variant={state === s.id ? "primary" : "secondary"}
            onClick={() => {
              setState(state === s.id ? null : s.id);
              setPage(1);
            }}
          >
            {s.label}
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
            description="Quando alguém abrir o primeiro pull request nestes repositórios, ele aparece aqui."
            action={
              <Button>
                <Icon name="plus" />
                Novo pull request
              </Button>
            }
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
