import { CsvUploader } from "@/components/CsvUploader";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">CryptoFisc</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Upload your Binance trade history to review transactions.
          </p>
        </header>
        <CsvUploader />
      </div>
    </main>
  );
}
