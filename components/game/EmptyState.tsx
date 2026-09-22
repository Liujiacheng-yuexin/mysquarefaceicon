import type { ReactNode } from "react";

type EmptyStateProps = {
  readonly title: string;
  readonly description: string;
  readonly action?: ReactNode;
};

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="game-empty-state">
      <strong>{title}</strong>
      <p>{description}</p>
      {action ? <div className="game-empty-state-action">{action}</div> : null}
    </div>
  );
}
