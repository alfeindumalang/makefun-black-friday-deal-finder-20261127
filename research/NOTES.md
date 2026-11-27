# DealSleuth — research notes

## The board
- 26 deals, 7 stores (Amazon, Best Buy, Walmart, Target, Newegg, B&H Photo,
  Macy's), 6 categories (Laptops, TVs, Audio, Gaming, Home & Kitchen, Toys).
- Every price was read by the agent in this session on Black Friday morning,
  27 Nov 2026, about 08:00 UTC, in a deals source that names the store.
  The source is named on each deal; the checked time is 2026-11-27T08:00:00Z
  on all of them.

## Deal sources (all read 27 Nov 2026, ~08:00 UTC)
- TradingView / Benzinga, "Black Friday 2026 Tech Deals" (published 27 Nov
  05:34 UTC): MacBook Air M5, HP OmniBook 5, MacBook Neo, Legion Pro 7i,
  TCL 65" Fire TV, Hisense H5R1 65", AirPods Pro 3, Sony XM5, Bose QC,
  Beats Solo 4, Beats Studio Pro, Switch 2 bundle, Samsung 9100 Pro 2TB,
  Gigabyte Z890, Kindle Paperwhite.
- Walmart Black Friday deals page: AirPods Pro 3 ($149), iPad A16, Ninja
  SLUSHi, Shark Detect, LEGO Technic Jesko.
- SooMuch, "24 Real Sale Gifts We Price-Checked" (checked at the stores
  25 Nov): Breville Smart Oven (Target), KitchenAid Dutch Oven (Macy's).
- Tom's Guide via TechResearchOnline: Sony XM6 ($348), Fire TV Stick 4K
  Plus ($29).
- Amazon Black Friday ad roundup, Houston News Network: Dyson V9, LEGO
  Botanicals Wildflower.
- TechRadar Best Buy list via Montgomery Daily News: Hisense U7 55".

## Honesty notes
- Best Buy's "was" prices are the store's "comparable value", not a past
  selling price. Each Best Buy deal carries wasKind "comp", and the card
  and the detail page label it; the footer explains it.
- AirPods Pro 3 was $179 at Amazon/Walmart earlier in the week (neeshu.com,
  26 Nov) and $149 on Black Friday morning — the verdict note says so.
- Switch 2 bundle is only 9% off; its verdict is SMALL CUT, with the note
  that bundles almost never discount.
- KitchenAid Dutch Oven: the $334 "was" is a lofty list price; the note
  says to judge the $100 tag itself.
- No price was invented. Where a source gave a sale price but no "was"
  (e.g. Insignia 40" Fire TV, TCL 55" Roku), the deal was left out.

## Cross-store comparisons
- MacBook Air 13" M5: $1,049 at Best Buy and at Amazon.
- AirPods Pro 3: $149.99 at Target, $149 at Walmart.

## Validation (done 27 Nov 2026, ~08:02 UTC / 15:02 WIB)
- `MAKEFUN_OUTPUT_DIR=/tmp/bf-out1 node main.ts` and `...=/tmp/bf-out2 node
  main.ts`, then `diff -r` — CLEAN (byte-identical). Dossier 617,979 bytes
  (< 1.5 MiB cap). First load: 6 files, ~32 KB.
- Headless Chrome (CDP, Chrome for Testing 158, test-cdp.mjs): 0 console
  errors, 0 exceptions, requests only to localhost (index.html + 5 app
  files). Home renders 26 cards; #/best shows 18 cards, min discount 40%;
  search "headphones" shows 5 cards; detail page renders AirPods Pro 3.
- Screenshots (all real renders, all < 256 KiB): 1-deals.jpg 131,562 B
  (1280x800, #/), 2-best.jpg 132,265 B (1280x800, #/best), 3-phone.jpg
  51,398 B (390x844, #/), 4-search.jpg 119,620 B (1280x800,
  #/q/headphones). All four viewed directly: header, toolbar, stats and
  cards readable; phone layout stacks cleanly.
- One bug found and fixed in testing: the #/best filter (min discount 40%)
  leaked into a later #/q search because the search route did not reset the
  other filters. Fixed in app/main.js: every route now resets the filters
  it does not set (edit in a later message than the first write).
