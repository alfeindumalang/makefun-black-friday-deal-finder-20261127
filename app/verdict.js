// Verdicts and formatting. One job: turn a deal's two prices into the
// numbers and the honest signal the site shows for it.
//
// The signal is deliberately strict. A discount only counts as a true low
// when it clears half off; a small cut is called a small cut, even on a
// product that almost never discounts. The "was" price a store shows is
// taken at face value, except where the deal itself flags it as a
// comparable value — Best Buy shows a "comp. value", not a past selling
// price, and the card says so.

export const money = (n) =>
  '$' +
  n.toLocaleString('en-US', {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  });

export const pctOff = (d) => Math.round((1 - d.price / d.was) * 100);

export const saved = (d) => Math.round((d.was - d.price) * 100) / 100;

// Four tiers, most honest first. The tier is a function of the discount
// alone, so two deals with the same cut always get the same signal.
export function verdictFor(d) {
  const pct = pctOff(d);
  if (pct >= 50) return { key: 'true-low', label: 'TRUE LOW', rank: 0 };
  if (pct >= 30) return { key: 'strong', label: 'STRONG PRICE', rank: 1 };
  if (pct >= 15) return { key: 'routine', label: 'ROUTINE SALE', rank: 2 };
  return { key: 'small', label: 'SMALL CUT', rank: 3 };
}

// "27 Nov 2026, 08:00 UTC" — the check time as the site shows it.
export function checkedLabel(iso) {
  const date = new Date(iso);
  const day = date.getUTCDate();
  const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  const year = date.getUTCFullYear();
  const hh = String(date.getUTCHours()).padStart(2, '0');
  const mm = String(date.getUTCMinutes()).padStart(2, '0');
  return `${day} ${month} ${year}, ${hh}:${mm} UTC`;
}

export const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
