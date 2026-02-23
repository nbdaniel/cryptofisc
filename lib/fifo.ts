import { Trade, EnrichedTrade } from "@/types/trade";

interface Lot {
  qty: number;
  costPerUnit: number;
}

export function computeFifo(trades: Trade[]): EnrichedTrade[] {
  const enriched: EnrichedTrade[] = trades.map((t) => ({
    ...t,
    costBasis: null,
    proceeds: null,
    gainLoss: null,
  }));

  // Sort indices by date ascending so FIFO order matches trade history
  const order = enriched
    .map((_, i) => i)
    .sort((a, b) => enriched[a].date.localeCompare(enriched[b].date));

  const lots = new Map<string, Lot[]>();

  for (const i of order) {
    const t = enriched[i];
    if (!lots.has(t.pair)) lots.set(t.pair, []);
    const queue = lots.get(t.pair)!;

    const qty = parseFloat(t.executed);
    const amount = parseFloat(t.amount);
    const price = parseFloat(t.price);

    if (isNaN(qty) || isNaN(amount) || isNaN(price)) continue;

    if (t.side.toUpperCase() === "BUY") {
      queue.push({ qty, costPerUnit: price });
      t.costBasis = amount;
    } else if (t.side.toUpperCase() === "SELL") {
      t.proceeds = amount;

      let remaining = qty;
      let totalCost = 0;

      while (remaining > 1e-10 && queue.length > 0) {
        const lot = queue[0];
        const used = Math.min(lot.qty, remaining);
        totalCost += used * lot.costPerUnit;
        lot.qty -= used;
        remaining -= used;
        if (lot.qty < 1e-10) queue.shift();
      }

      t.costBasis = totalCost;
      t.gainLoss = amount - totalCost;
    }
  }

  return enriched;
}
