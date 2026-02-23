"use client";

import { useRef, useState } from "react";
import { EnrichedTrade, Trade } from "@/types/trade";
import { computeFifo } from "@/lib/fifo";
import { exportToCsv } from "@/lib/exportCsv";
import { TradeTable } from "./TradeTable";
import { TaxSummary } from "./TaxSummary";

function parseCsv(text: string): Trade[] {
  const lines = text.split("\n").filter((l) => l.trim() !== "");
  // skip header row
  const rows = lines.slice(1);
  return rows.map((line) => {
    const cells = line.split(",").map((c) => c.trim());
    return {
      date: cells[0] ?? "",
      pair: cells[1] ?? "",
      side: cells[2] ?? "",
      price: cells[3] ?? "",
      executed: cells[4] ?? "",
      amount: cells[5] ?? "",
      fee: cells[6] ?? "",
    };
  });
}

export function CsvUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [trades, setTrades] = useState<EnrichedTrade[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [ronRate, setRonRate] = useState<number>(0);

  function handleFile(file: File) {
    setError("");
    setTrades([]);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = parseCsv(text);
        if (parsed.length === 0) {
          setError("No trade rows found. Check that the file has data rows below the header.");
          return;
        }
        setTrades(computeFifo(parsed));
      } catch {
        setError("Failed to parse CSV. Make sure it is a valid Binance trade history export.");
      }
    };
    reader.onerror = () => {
      setError("Could not read the file.");
    };
    reader.readAsText(file, "UTF-8");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleChange}
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
        >
          Upload CSV
        </button>
        {fileName && (
          <span className="text-sm text-slate-500">{fileName}</span>
        )}
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2 mb-6">
        <label className="text-sm text-slate-600 whitespace-nowrap">1 USDT =</label>
        <input
          type="number"
          min="0"
          step="0.0001"
          placeholder="e.g. 4.75"
          value={ronRate || ""}
          onChange={(e) => setRonRate(parseFloat(e.target.value) || 0)}
          className="w-28 px-3 py-1.5 text-sm border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
        <span className="text-sm text-slate-600">RON</span>
        <a
          href="https://www.bnr.ro/Cursul-de-schimb--1224.aspx"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-400 hover:text-slate-600 underline"
        >
          BNR rate
        </a>
      </div>

      {trades.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-400">
              {trades.length} transaction{trades.length !== 1 ? "s" : ""} loaded
            </p>
            <button
              onClick={() => exportToCsv(trades, ronRate)}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Export CSV
            </button>
          </div>
          <TradeTable trades={trades} ronRate={ronRate} />
          <TaxSummary trades={trades} ronRate={ronRate} />
        </div>
      )}
    </div>
  );
}
