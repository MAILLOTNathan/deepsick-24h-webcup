import type fr from "./dictionaries/fr";

/** Shape of every dictionary — enforced on `en` and `es` so keys can't drift. */
export type Dictionary = typeof fr;
