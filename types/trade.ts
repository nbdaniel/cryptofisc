export interface Trade {
  date: string;
  pair: string;
  side: string;
  price: string;
  executed: string;
  amount: string;
  fee: string;
}

export interface EnrichedTrade extends Trade {
  costBasis: number | null;
  proceeds: number | null;
  gainLoss: number | null;
}
