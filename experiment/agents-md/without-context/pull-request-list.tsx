import { Icon, type IconName } from "./icon";
import { Badge } from "./badge";
import { Avatar } from "./avatar";
import { formatAge, type PrState, type PullRequest } from "@/data";

const stateTone = {
  aberto: "success",
  "em review": "warning",
  mergeado: "accent",
} as const;

const stateIcon: Record<PrState, IconName> = {
  aberto: "pullRequest",
  "em review": "eye",
  mergeado: "merge",
};

const ageClass = {
  muted: "text-muted",
  warning: "text-warning",
  danger: "text-danger",
} as const;

/**
 * Uma linha de pull request. A varredura de olho responde, nesta ordem:
 * em que estado está, o que é, de quem é, em qual repositório, e há quanto tempo espera.
 */
function PullRequestRow({ pr }: { pr: PullRequest }) {
  const age = formatAge(pr.openedDaysAgo);

  return (
    <li className="flex items-center gap-3 border-b border-border px-3 py-2.5 transition-colors duration-100 last:border-0 hover:bg-accent-soft/40">
      <span
        title={pr.state}
        className={`flex shrink-0 ${pr.state === "mergeado" ? "text-accent" : pr.state === "em review" ? "text-warning" : "text-success"}`}
      >
        <Icon name={stateIcon[pr.state]} className="size-[18px]" />
        <span className="sr-only">{pr.state}</span>
      </span>

      <div className="min-w-0 flex-1">
        <a
          href={pr.url}
          target="_blank"
          rel="noreferrer"
          className="cursor-pointer truncate underline-offset-2 hover:underline"
        >
          <span className="text-muted tabular-nums">#{pr.number}</span> {pr.title}
          <Icon name="external" className="ml-1 inline size-3.5 align-[-1px] text-muted" />
        </a>

        {/* Em telas estreitas as colunas somem; o essencial volta aqui embaixo. */}
        <div className="mt-0.5 flex items-center gap-2 text-label text-muted lg:hidden">
          <span className="truncate">{pr.repo}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{pr.author}</span>
          <span aria-hidden="true">·</span>
          <span className={ageClass[age.tone]}>{age.label}</span>
        </div>
      </div>

      {pr.draft && (
        <span className="hidden shrink-0 sm:block">
          <Badge>rascunho</Badge>
        </span>
      )}

      <span className="hidden shrink-0 sm:block">
        <Badge tone={stateTone[pr.state]} dot>
          {pr.state}
        </Badge>
      </span>

      <span className="hidden w-40 shrink-0 items-center gap-1.5 text-muted xl:flex" title={pr.repo}>
        <Icon name="repo" className="size-3.5 shrink-0" />
        <span className="truncate">{pr.repo}</span>
      </span>

      <span className="hidden w-14 shrink-0 items-center gap-1.5 text-muted md:flex">
        <Icon name="comment" className="size-3.5" />
        <span className="tabular-nums">{pr.comments}</span>
      </span>

      <span className={`hidden w-28 shrink-0 items-center justify-end gap-1.5 lg:flex ${ageClass[age.tone]}`}>
        <Icon name="clock" className="size-3.5" />
        {age.label}
      </span>

      <span className="hidden shrink-0 items-center gap-2 lg:flex">
        <Avatar name={pr.author} />
        <span className="w-28 truncate text-muted">{pr.author}</span>
      </span>
      <span className="shrink-0 lg:hidden">
        <Avatar name={pr.author} />
      </span>
    </li>
  );
}

export function PullRequestList({ items }: { items: PullRequest[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
      <ul>
        {items.map((pr) => (
          <PullRequestRow key={pr.id} pr={pr} />
        ))}
      </ul>
    </div>
  );
}
