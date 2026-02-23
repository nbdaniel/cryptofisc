# CryptoFisc

Web app for Romanian accountants to process Binance trade history CSVs.

## Features

- Upload a Binance trade history CSV and view all transactions in a table
- FIFO cost-basis calculation per asset pair
- RON conversion using a manual BNR exchange rate
- Per-pair tax summary with net realized gain/loss
- Export the enriched table to CSV (UTF-8 BOM for Excel compatibility)

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. Export your trade history from Binance: **Orders → Trade History → Export**
2. Upload the CSV using the **Upload CSV** button
3. Enter the BNR exchange rate (1 USDT = X RON) to see RON columns — [check rate](https://www.bnr.ro/Cursul-de-schimb--1224.aspx)
4. Review the trade table and tax summary
5. Click **Export CSV** to download the enriched file for your accountant

## Stack

- [Next.js 14](https://nextjs.org) (App Router)
- [Tailwind CSS](https://tailwindcss.com)
- TypeScript
- No external data-processing dependencies
