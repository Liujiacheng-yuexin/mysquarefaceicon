import { ChevronDown } from "lucide-react";
import type { GameFaq as GameFaqItem } from "../../lib/games/game-schema";

type GameFaqProps = {
  readonly gameId: string;
  readonly items: readonly GameFaqItem[];
};

export default function GameFaq({ gameId, items }: GameFaqProps) {
  if (items.length === 0) return null;

  const headingId = `game-faq-${gameId}`;

  return (
    <section className="game-detail-section game-detail-faq" aria-labelledby={headingId}>
      <h2 id={headingId}>Frequently asked questions</h2>
      <div className="game-detail-faq-list">
        {items.map((item, index) => (
          <details key={item.question} open={index === 0}>
            <summary>
              <span>{item.question}</span>
              <ChevronDown aria-hidden="true" size={22} strokeWidth={2.1} />
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
