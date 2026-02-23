import { EnrichedTrade } from "@/types/trade";

interface PairRow {
  pair: string;
  sells: number;
  gainLoss: number;
}

function fmtSigned(n: number, suffix = ""): string {
  return (n >= 0 ? "+" : "") + n.toFixed(2) + suffix;
}

export function TaxSummary({
  trades,
  ronRate = 0,
}: {
  trades: EnrichedTrade[];
  ronRate?: number;
}) {
  const showRon = ronRate > 0;

  const byPair = new Map<string, PairRow>();
  for (const t of trades) {
    if (t.side.toUpperCase() !== "SELL" || t.gainLoss === null) continue;
    const row = byPair.get(t.pair) ?? { pair: t.pair, sells: 0, gainLoss: 0 };
    row.sells += 1;
    row.gainLoss += t.gainLoss;
    byPair.set(t.pair, row);
  }

  const rows = Array.from(byPair.values()).sort((a, b) =>
    a.pair.localeCompare(b.pair)
  );

  if (rows.length === 0) return null;

  const totalGains = rows.reduce((s, r) => s + Math.max(0, r.gainLoss), 0);
  const totalLosses = rows.reduce((s, r) => s + Math.min(0, r.gainLoss), 0);
  const net = totalGains + totalLosses;

  return (
    <div className="mt-10">
      <h2 className="text-sm font-semibold text-slate-700 mb-3">Tax Summary</h2>

      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pair
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Sell Trades
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Gain / Loss (USDT)
              </th>
              {showRon && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Gain / Loss (RON)
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((r) => (
              <tr key={r.pair} className="hover:bg-slate-50">
                <td className="px-4 py-2 font-mono text-xs text-slate-800">
                  {r.pair}
                </td>
                <td className="px-4 py-2 text-right text-xs text-slate-500">
                  {r.sells}
                </td>
                <td
                  className={`px-4 py-2 text-right font-mono text-xs font-medium ${
                    r.gainLoss >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {fmtSigned(r.gainLoss)}
                </td>
                {showRon && (
                  <td
                    className={`px-4 py-2 text-right font-mono text-xs font-medium ${
                      r.gainLoss >= 0 ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {fmtSigned(r.gainLoss * ronRate, " RON")}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 border-t border-slate-200">
            <tr>
              <td
                colSpan={2}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Net realized
              </td>
              <td
                className={`px-4 py-2 text-right font-mono text-xs font-bold ${
                  net >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {fmtSigned(net)} USDT
              </td>
              {showRon && (
                <td
                  className={`px-4 py-2 text-right font-mono text-xs font-bold ${
                    net >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {fmtSigned(net * ronRate, " RON")}
                </td>
              )}
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-3 flex gap-6 text-xs text-slate-500">
        <span>
          Gains:{" "}
          <span className="font-mono text-emerald-600">
            +{totalGains.toFixed(2)} USDT
          </span>
          {showRon && (
            <span className="font-mono text-emerald-600 ml-1">
              / +{(totalGains * ronRate).toFixed(2)} RON
            </span>
          )}
        </span>
        <span>
          Losses:{" "}
          <span className="font-mono text-red-600">
            {totalLosses.toFixed(2)} USDT
          </span>
          {showRon && (
            <span className="font-mono text-red-600 ml-1">
              / {(totalLosses * ronRate).toFixed(2)} RON
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
