const DAY_MS = 24 * 60 * 60 * 1000;

const longDate = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

const shortDate = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

const yearOnly = new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone: 'UTC' });

/** @param {Date | string | null | undefined} date */
export function formatDate(date) {
  return date ? longDate.format(new Date(date)) : '';
}

/** @param {Date | string | null | undefined} date */
export function formatDateShort(date) {
  return date ? shortDate.format(new Date(date)) : '';
}

/** @param {Date | string | null | undefined} date */
export function formatYear(date) {
  return date ? yearOnly.format(new Date(date)) : '';
}

/** Date as `YYYY-MM-DD` (UTC) for `<input type="date">` and `<time dateTime>`. */
export function toDateInputValue(date) {
  return date ? new Date(date).toISOString().slice(0, 10) : '';
}

/**
 * Round a score to one decimal place (SQLite stores it as a Float).
 * @param {number | string} score
 */
export function roundScore(score) {
  return Math.round(Number(score) * 10) / 10;
}

/** @param {number | string} score */
export function formatScore(score) {
  return roundScore(score).toFixed(1);
}

/**
 * Score range used for badge colour and a short verdict label.
 * @param {number} score
 * @returns {{ tier: 'great' | 'good' | 'mixed' | 'bad', label: string }}
 */
export function scoreTier(score) {
  const s = roundScore(score);
  if (s >= 8.5) return { tier: 'great', label: 'Still rules' };
  if (s >= 7) return { tier: 'good', label: 'Holds up' };
  if (s >= 5) return { tier: 'mixed', label: 'Aged awkwardly' };
  return { tier: 'bad', label: 'Leave it in the past' };
}

/**
 * "Updated on" is only worth showing if the edit happened more than a day
 * after publishing (fixing a typo five minutes later doesn't count).
 */
export function wasMeaningfullyUpdated(datePosted, dateUpdated) {
  if (!datePosted || !dateUpdated) return false;
  return new Date(dateUpdated).getTime() - new Date(datePosted).getTime() > DAY_MS;
}

/** Reviews posted in the last 14 days get a "NEW!" badge. */
export function isNew(datePosted, now = Date.now()) {
  if (!datePosted) return false;
  return now - new Date(datePosted).getTime() < 14 * DAY_MS;
}

/** @param {string} text */
export function slugify(text) {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
