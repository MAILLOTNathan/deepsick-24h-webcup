/** Colony clock used across the UI ("SOL 0418 · 19:42 MTC"). */

const COLONY_EPOCH = Date.UTC(2025, 8, 1);
const SOL_OFFSET = 418;

export function colonySol(date: Date = new Date()): number {
  const days = Math.floor((date.getTime() - COLONY_EPOCH) / 86_400_000);
  return SOL_OFFSET + days;
}

export function colonyTime(date: Date = new Date()): string {
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm} MTC`;
}

export function colonyClock(date: Date = new Date()): string {
  return `SOL ${String(colonySol(date)).padStart(4, "0")} · ${colonyTime(date)}`;
}

export const COLONY_STATUS = "COLONY NOMINAL";
export const COLONY_ARC = "ARC-01 · UTOPIA PLANITIA";
export const COLONY_POPULATION = "12 480";
