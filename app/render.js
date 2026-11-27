// HTML for the deal finder. Every value that comes from the data is
// escaped before it goes into the page, so a stray character in a title
// can never break the markup.
//
// A card shows everything a shopper needs to judge a deal at a glance:
// the product, the store, the sale price against the usual price, the
// discount and the dollars saved, the verdict signal with its evidence,
// the store link, and when and where the price was checked.

import { checkedLabel, escapeHtml, money, pctOff, saved, verdictFor } from './verdict.js';

function storeBadge(store) {
  return `<span class="store">${escapeHtml(store)}</span>`;
}

function verdictBadge(d) {
  const v = verdictFor(d);
  return `<span class="verdict ${v.key}">${v.label}</span>`;
}

function alsoLine(d) {
  if (!d.also || d.also.length === 0) return '';
  const parts = d.also.map(
    (a) => `also ${money(a.price)} at ${escapeHtml(a.store)}`,
  );
  return `<p class="also">${parts.join(' · ')}</p>`;
}

function wasLine(d) {
  const kind = d.wasKind === 'comp' ? ' <span class="comp">(comp. value)</span>' : '';
  return `<s class="was">${money(d.was)}</s>${kind}`;
}

export function card(d) {
  const v = verdictFor(d);
  return `<article class="card ${v.key}" data-id="${escapeHtml(d.id)}">
  <header class="card-top">
    ${storeBadge(d.store)}
    <span class="cat">${escapeHtml(d.category)}</span>
  </header>
  <h3><a href="#/deal/${encodeURIComponent(d.id)}">${escapeHtml(d.title)}</a></h3>
  <p class="prices"><span class="price">${money(d.price)}</span> ${wasLine(d)}</p>
  <p class="saving"><strong>−${pctOff(d)}%</strong> · save ${money(saved(d))}</p>
  <p class="verdict-line">${verdictBadge(d)}</p>
  <p class="why">${escapeHtml(d.why)}</p>
  ${alsoLine(d)}
  <p class="card-foot">
    <a class="store-link" href="${escapeHtml(d.url)}" target="_blank" rel="noopener">View at ${escapeHtml(d.store)} ↗</a>
    <span class="checked">Checked ${checkedLabel(d.checked)}</span>
  </p>
</article>`;
}

export function dealGrid(shown) {
  if (shown.length === 0) {
    return `<p class="empty">No deal matches those filters. <a href="#/">Clear the filters</a> and try again.</p>`;
  }
  return `<div class="grid">${shown.map(card).join('')}</div>`;
}

export function statsBar(shown, total) {
  const avg =
    shown.length === 0
      ? 0
      : Math.round(shown.reduce((sum, d) => sum + pctOff(d), 0) / shown.length);
  const totalSaved = shown.reduce((sum, d) => sum + saved(d), 0);
  const best =
    shown.length === 0
      ? null
      : shown.reduce((a, b) => (pctOff(b) > pctOff(a) ? b : a));
  return `<p class="stats">
  <span><strong>${shown.length}</strong> of ${total} deals</span>
  <span>avg discount <strong>${avg}%</strong></span>
  <span>total saving <strong>${money(Math.round(totalSaved))}</strong></span>
  ${best ? `<span>best cut: <strong>${escapeHtml(best.title)}</strong> −${pctOff(best)}%</span>` : ''}
</p>`;
}

export function detail(d) {
  const v = verdictFor(d);
  return `<p class="back"><a href="#/">&larr; All deals</a></p>
<article class="detail ${v.key}">
  <header class="card-top">
    ${storeBadge(d.store)}
    <span class="cat">${escapeHtml(d.category)}</span>
  </header>
  <h1>${escapeHtml(d.title)}</h1>
  <p class="prices big"><span class="price">${money(d.price)}</span> ${wasLine(d)}</p>
  <p class="saving big"><strong>−${pctOff(d)}%</strong> · you save ${money(saved(d))}</p>
  <p class="verdict-line">${verdictBadge(d)}</p>
  <p class="why big">${escapeHtml(d.why)}</p>
  ${alsoLine(d)}
  <dl class="facts">
    <dt>Store</dt><dd>${escapeHtml(d.store)}</dd>
    <dt>Category</dt><dd>${escapeHtml(d.category)}</dd>
    <dt>Sale price</dt><dd>${money(d.price)}</dd>
    <dt>Usual price</dt><dd>${money(d.was)}${d.wasKind === 'comp' ? ' (Best Buy comparable value, not a past selling price)' : ''}</dd>
    <dt>Price checked</dt><dd>${checkedLabel(d.checked)}</dd>
    <dt>Read in</dt><dd>${escapeHtml(d.source)}</dd>
  </dl>
  <p><a class="store-link big" href="${escapeHtml(d.url)}" target="_blank" rel="noopener">View this deal at ${escapeHtml(d.store)} ↗</a></p>
  <p class="fineprint">Prices move fast on Black Friday — check the listing before you pay. DealSleuth takes no cut from the stores.</p>
</article>`;
}

export function notFound() {
  return `<h1>Not found</h1>
<p>There is no deal at that address. <a href="#/">See all deals</a>.</p>`;
}
