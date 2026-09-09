import { Icon, type IconName } from "./icon";
import { Badge } from "./badge";
import { Avatar } from "./avatar";
import { formatAge, type PullRequest, type PullRequestState } from "@/data";

const stateTone = { aberto: "success", review: "warning", mergeado: "accent" } as const;
const stateLabel: Record<PullRequestState, string> = {
  aberto: "aberto",
  review: "em review",
  mergeado: "mergeado",
};
const stateIcon: Record<PullRequestState, IconName> = {
  aberto: "gitPullRequest",
  review: "eye",
  mergeado: "gitMerge",
};
const stateIconClass = {
  aberto: "text-success",
  review: "text-warning",
  mergeado: "text-accent",
} as const;
const ageClass = { danger: "text-danger", warning: "text-warning", muted: "text-muted" } as const;

/** Uma linha de pull request. O estado aparece duas vezes: no ícone e no texto do badge. */
function PullRequestRow({ pr }: { pr: PullRequest }) {
  const age = formatAge(pr.openedDaysAgo);

  return (
    <li className="flex items-center gap-3 border-b border-border px-3 py-2.5 transition-colors duration-100 last:border-0 hover:bg-accent-soft/40">
      <span title={stateLabel[pr.state]} className={`flex shrink-0 ${stateIconClass[pr.state]}`}>
        <Icon name={stateIcon[pr.state]} className="size-[18px]" />
        <span className="sr-only">{stateLabel[pr.state]}</span>
      </span>

      <a
        href={pr.url}
        target="_blank"
        rel="noreferrer"
        className="min-w-0 flex-1 cursor-pointer truncate underline-offset-2 hover:underline"
      >
        <span className="text-muted tabular-nums">#{pr.number}</span> {pr.title}
        <Icon name="external" className="ml-1 inline size-3.5 align-[-1px] text-muted" />
      </a>

      <div className="hidden shrink-0 items-center gap-2 md:flex">
        <Badge>{pr.repo}</Badge>
      </div>

      <div className="hidden shrink-0 items-center gap-2 sm:flex">
        <Badge tone={stateTone[pr.state]} dot>
          {stateLabel[pr.state]}
        </Badge>
      </div>

      <span className={`hidden w-36 shrink-0 text-right lg:block ${ageClass[age.tone]}`}>
        {age.label}
      </span>

      <Avatar name={pr.author} />
    </li>
  );
}

/** A lista inteira, num painel só — pull request não se agrupa, se ordena por idade. */
export function PullRequestList({ items }: { items: PullRequest[] }) {
  return (
    <ul className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
      {items.map((pr) => (
        <PullRequestRow key={pr.id} pr={pr} />
      ))}
    </ul>
  );
}

/** Esqueleto da lista. Skeleton, nunca spinner: o layout não pula. */
export function PullRequestsSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-lg border border-border bg-surface shadow-card"
      role="status"
      aria-label="Carregando pull requests"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 border-b border-border px-3 py-3 last:border-0"
        >
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
