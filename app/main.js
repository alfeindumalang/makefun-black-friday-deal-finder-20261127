// DealSleuth, the finder itself: state, hash routes, search, filters and
// sorting. The deals live in data.js, so the site needs no network to
// show them; each deal links out to its store.
//
//   #/              all deals, with search and filters
//   #/best          the same list sorted by biggest discount first
//   #/q/<term>      the list with a search term already typed in
//   #/deal/<id>     one deal, with every fact about it
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { CATEGORIES, STORES, deals } from './data.js';
import { pctOff, saved } from './verdict.js';
import { dealGrid, detail, notFound, statsBar } from './render.js';

const app = document.getElementById('app');
const toolbar = document.getElementById('toolbar');
const stats = document.getElementById('stats');

const state = {
  query: '',
  category: 'All',
  store: 'All',
  minOff: 0,
  sort: 'discount',
  bestOnly: false,
};

const SORTS = {
  discount: (a, b) => pctOff(b) - pctOff(a) || saved(b) - saved(a),
  saving: (a, b) => saved(b) - saved(a) || pctOff(b) - pctOff(a),
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
  name: (a, b) => a.title.localeCompare(b.title),
};

function matches(d) {
  const q = state.query.trim().toLowerCase();
  if (q !== '' && `${d.title} ${d.store} ${d.category}`.toLowerCase().indexOf(q) === -1) {
    return false;
  }
  if (state.category !== 'All' && d.category !== state.category) return false;
  if (state.store !== 'All' && d.store !== state.store) return false;
  if (pctOff(d) < state.minOff) return false;
  return true;
}

function visible() {
  const shown = deals.filter(matches);
  shown.sort(SORTS[state.sort] || SORTS.discount);
  return shown;
}

function options(values, current) {
  return values
    .map((v) => `<option value="${v}"${v === current ? ' selected' : ''}>${v}</option>`)
    .join('');
}

function renderToolbar() {
  toolbar.innerHTML = `
  <label class="search">Search
    <input id="q" type="search" placeholder="Try “headphones” or “Dyson”" value="${state.query.replace(/"/g, '&quot;')}">
  </label>
  <label>Category
    <select id="cat">${options(['All', ...CATEGORIES], state.category)}</select>
  </label>
  <label>Store
    <select id="store">${options(['All', ...STORES], state.store)}</select>
  </label>
  <label>Min. discount
    <select id="minoff">
      <option value="0"${state.minOff === 0 ? ' selected' : ''}>Any</option>
      <option value="25"${state.minOff === 25 ? ' selected' : ''}>25% or more</option>
      <option value="40"${state.minOff === 40 ? ' selected' : ''}>40% or more</option>
      <option value="50"${state.minOff === 50 ? ' selected' : ''}>50% or more</option>
    </select>
  </label>
  <label>Sort by
    <select id="sort">
      <option value="discount"${state.sort === 'discount' ? ' selected' : ''}>Biggest discount</option>
      <option value="saving"${state.sort === 'saving' ? ' selected' : ''}>Biggest saving ($)</option>
      <option value="low"${state.sort === 'low' ? ' selected' : ''}>Lowest price</option>
      <option value="high"${state.sort === 'high' ? ' selected' : ''}>Highest price</option>
      <option value="name"${state.sort === 'name' ? ' selected' : ''}>Name A–Z</option>
    </select>
  </label>`;
  toolbar.querySelector('#q').addEventListener('input', (e) => {
    state.query = e.target.value;
    renderList();
  });
  toolbar.querySelector('#cat').addEventListener('change', (e) => {
    state.category = e.target.value;
    renderList();
  });
  toolbar.querySelector('#store').addEventListener('change', (e) => {
    state.store = e.target.value;
    renderList();
  });
  toolbar.querySelector('#minoff').addEventListener('change', (e) => {
    state.minOff = Number(e.target.value);
    renderList();
  });
  toolbar.querySelector('#sort').addEventListener('change', (e) => {
    state.sort = e.target.value;
    renderList();
  });
}

function renderList() {
  const shown = visible();
  stats.innerHTML = statsBar(shown, deals.length);
  app.innerHTML = dealGrid(shown);
  window.__shotReady = true;
}

function render() {
  window.__shotReady = false;
  const hash = location.hash || '#/';
  const dealMatch = hash.match(/^#\/deal\/([^/?]+)/);
  const queryMatch = hash.match(/^#\/q\/([^/?]+)/);
  if (dealMatch) {
    toolbar.innerHTML = '';
    stats.innerHTML = '';
    const found = deals.find((d) => d.id === decodeURIComponent(dealMatch[1]));
    document.title = `${found ? found.title : 'Not found'} | DealSleuth`;
    app.innerHTML = found ? detail(found) : notFound();
    window.scrollTo(0, 0);
    window.__shotReady = true;
    return;
  }
  if (queryMatch) {
    // A search route carries only its term; every other filter returns
    // to its default, so a filter set on #/best never leaks into a search.
    state.query = decodeURIComponent(queryMatch[1]);
    state.category = 'All';
    state.store = 'All';
    state.minOff = 0;
    state.sort = 'discount';
    state.bestOnly = false;
  } else if (hash === '#/best') {
    state.query = '';
    state.category = 'All';
    state.store = 'All';
    state.sort = 'discount';
    state.minOff = 40;
    state.bestOnly = true;
  } else {
    // Plain home: the default board, so a filter set on #/best or a search
    // from #/q never leaks back into the home view.
    state.query = '';
    state.category = 'All';
    state.store = 'All';
    state.minOff = 0;
    state.sort = 'discount';
    state.bestOnly = false;
  }
  document.title = state.bestOnly
    ? 'Best deals | DealSleuth'
    : 'DealSleuth — Real Black Friday deals, checked';
  renderToolbar();
  renderList();
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
