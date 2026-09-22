import type { PlayerStatus } from "@/lib/games/game-player-model";

export type AdapterStatusHandler = (status: PlayerStatus) => void;
