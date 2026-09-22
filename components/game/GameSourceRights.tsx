import {
  Ban,
  ClipboardCheck,
  ExternalLink,
  FileSearch,
  FolderOpen,
  LockKeyhole,
  Route,
  TriangleAlert
} from "lucide-react";
import type {
  GameDeliveryType,
  GameRecord,
  LicenseStatus,
  ReleaseDecision
} from "../../lib/games/game-schema";

const LICENSE_LABELS = {
  VERIFIED: "Verified",
  RESTRICTED: "Restricted",
  UNKNOWN: "Unknown",
  NOT_APPLICABLE: "Not applicable"
} as const satisfies Record<LicenseStatus, string>;

const RELEASE_LABELS = {
  APPROVED: "Approved",
  REVIEW_REQUIRED: "Review required",
  DIRECT_LINK_ONLY: "Direct link only",
  BLOCKED: "Blocked"
} as const satisfies Record<ReleaseDecision, string>;

const DELIVERY_LABELS = {
  RUFFLE_SWF: "Ruffle SWF",
  HTML5: "Local HTML5",
  LOCAL_IFRAME: "Local iframe",
  OFFICIAL_IFRAME: "Permission-backed official iframe",
  EXTERNAL_LINK: "Original-site direct link"
} as const satisfies Record<GameDeliveryType, string>;

type GameSourceRightsProps = {
  readonly game: GameRecord;
};

function getDeliveryBoundary(game: GameRecord) {
  if (game.license.releaseDecision === "DIRECT_LINK_ONLY") {
    return "Original-site direct link only";
  }
  if (game.license.allowedDeliveryTypes.length === 0) {
    return "No approved delivery type recorded";
  }
  return game.license.allowedDeliveryTypes.map((type) => DELIVERY_LABELS[type]).join(", ");
}

export default function GameSourceRights({ game }: GameSourceRightsProps) {
  const headingId = `game-rights-${game.id}`;
  const isUnknown = game.license.status === "UNKNOWN";
  const isDirectLinkOnly = game.license.releaseDecision === "DIRECT_LINK_ONLY";

  return (
    <section className="game-detail-section game-source-rights" aria-labelledby={headingId}>
      <h2 id={headingId}>Source &amp; Rights</h2>
      <div className="game-rights-panel">
        <div className="game-rights-mark" aria-hidden="true">
          <FileSearch size={72} strokeWidth={1.65} />
        </div>
        <div className="game-rights-content">
          <dl>
            <div>
              <dt><FolderOpen aria-hidden="true" size={20} />Source</dt>
              <dd>{game.source.providerName}</dd>
            </div>
            <div>
              <dt><LockKeyhole aria-hidden="true" size={20} />License status</dt>
              <dd>{LICENSE_LABELS[game.license.status]}</dd>
            </div>
            <div>
              <dt><ClipboardCheck aria-hidden="true" size={20} />Release decision</dt>
              <dd>{RELEASE_LABELS[game.license.releaseDecision]}</dd>
            </div>
            <div>
              <dt><Ban aria-hidden="true" size={20} />New publication</dt>
              <dd>{game.license.newPublicationAllowed ? "Allowed within the recorded boundary" : "Not allowed"}</dd>
            </div>
            <div>
              <dt><Route aria-hidden="true" size={20} />Delivery boundary</dt>
              <dd>{getDeliveryBoundary(game)}</dd>
            </div>
          </dl>

          {isUnknown ? (
            <p className="game-rights-warning">
              <TriangleAlert aria-hidden="true" size={20} />
              <span>UNKNOWN does not mean permission. Repository presence is not proof of authorization.</span>
            </p>
          ) : null}
          {isDirectLinkOnly ? (
            <p className="game-rights-warning">
              <TriangleAlert aria-hidden="true" size={20} />
              <span>Direct-link only. This site does not host or embed the external tool.</span>
            </p>
          ) : null}

          {game.source.attribution ? <p className="game-rights-note">{game.source.attribution}</p> : null}
          {game.source.originalUrl ? (
            <a
              className="game-rights-source-link"
              href={game.source.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open the recorded source
              <ExternalLink aria-hidden="true" size={17} />
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
