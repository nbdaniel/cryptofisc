import { EnrichedTrade } from "@/types/trade";

const BASE_HEADERS = [
  "Date", "Pair", "Side", "Price", "Executed", "Amount", "Fee",
  "Cost Basis", "Proceeds", "Gain / Loss",
];
const RON_HEADERS = ["Cost Basis (RON)", "Proceeds (RON)", "Gain / Loss (RON)"];

function fmt(n: number | null): string {
  if (n === null) return "—";
  return n.toFixed(2);
}

function fmtGain(n: number | null, suffix = ""): string {
  if (n === null) return "—";
  return (n >= 0 ? "+" : "") + n.toFixed(2) + suffix;
}

export function TradeTable({
  trades,
  ronRate = 0,
}: {
  trades: EnrichedTrade[];
  ronRate?: number;
}) {
  const showRon = ronRate > 0;
  const headers = showRon ? [...BASE_HEADERS, ...RON_HEADERS] : BASE_HEADERS;

  return (
    <div className="overflow-x-auto border border-slate-200 rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {trades.map((t, i) => {
            const costRon = t.costBasis !== null ? t.costBasis * ronRate : null;
            const procRon = t.proceeds !== null ? t.proceeds * ronRate : null;
            const gainRon = t.gainLoss !== null ? t.gainLoss * ronRate : null;

            return (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-4 py-2 font-mono text-xs text-slate-600 whitespace-nowrap">
                  {t.date}
                </td>
                <td className="px-4 py-2 font-mono text-xs text-slate-800 whitespace-nowrap">
                  {t.pair}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      t.side.toUpperCase() === "BUY"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {t.side}
                  </span>
                </td>
                <td className="px-4 py-2 font-mono text-xs text-slate-600 whitespace-nowrap">
                  {t.price}
                </td>
                <td className="px-4 py-2 font-mono text-xs text-slate-600 whitespace-nowrap">
                  {t.executed}
                </td>
                <td className="px-4 py-2 font-mono text-xs text-slate-600 whitespace-nowrap">
                  {t.amount}
                </td>
                <td className="px-4 py-2 font-mono text-xs text-slate-600 whitespace-nowrap">
                  {t.fee}
                </td>
                <td className="px-4 py-2 font-mono text-xs text-slate-600 whitespace-nowrap">
                  {fmt(t.costBasis)}
                </td>
                <td className="px-4 py-2 font-mono text-xs text-slate-600 whitespace-nowrap">
                  {fmt(t.proceeds)}
                </td>
                <td
                  className={`px-4 py-2 font-mono text-xs font-medium whitespace-nowrap ${
                    t.gainLoss === null
                      ? "text-slate-400"
                      : t.gainLoss >= 0
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {fmtGain(t.gainLoss)}
                </td>

                {showRon && (
                  <>
                    <td className="px-4 py-2 font-mono text-xs text-slate-600 whitespace-nowrap">
                      {fmt(costRon)}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-slate-600 whitespace-nowrap">
                      {fmt(procRon)}
                    </td>
                    <td
                      className={`px-4 py-2 font-mono text-xs font-medium whitespace-nowrap ${
                        gainRon === null
                          ? "text-slate-400"
                          : gainRon >= 0
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {fmtGain(gainRon, " RON")}
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
