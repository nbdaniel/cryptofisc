import { EnrichedTrade } from "@/types/trade";

function fmt(n: number | null): string {
  if (n === null) return "";
  return n.toFixed(2);
}

function escape(s: string): string {
  // Wrap in quotes and escape any internal quotes
  return `"${s.replace(/"/g, '""')}"`;
}

export function exportToCsv(trades: EnrichedTrade[], ronRate: number): void {
  const showRon = ronRate > 0;

  const headers = [
    "Date", "Pair", "Side", "Price", "Executed", "Amount", "Fee",
    "Cost Basis (USDT)", "Proceeds (USDT)", "Gain/Loss (USDT)",
    ...(showRon ? ["Cost Basis (RON)", "Proceeds (RON)", "Gain/Loss (RON)"] : []),
  ];

  const rows = trades.map((t) => {
    const gainSign = (n: number | null) =>
      n === null ? "" : (n >= 0 ? "+" : "") + n.toFixed(2);

    const costRon = t.costBasis !== null ? t.costBasis * ronRate : null;
    const procRon = t.proceeds !== null ? t.proceeds * ronRate : null;
    const gainRon = t.gainLoss !== null ? t.gainLoss * ronRate : null;

    return [
      t.date, t.pair, t.side, t.price, t.executed, t.amount, t.fee,
      fmt(t.costBasis), fmt(t.proceeds), gainSign(t.gainLoss),
      ...(showRon ? [fmt(costRon), fmt(procRon), gainSign(gainRon)] : []),
    ].map(escape).join(",");
  });

  const csv = [headers.map(escape).join(","), ...rows].join("\r\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cryptofisc_export.csv";
  a.click();
  URL.revokeObjectURL(url);
}
