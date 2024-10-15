import { writable } from "svelte/store";

export interface StockTableRow {
    Company: string
    Ticker: string
    MarketCap: number
    RecentNews: string
}

export interface StockTableData {
    columns: string[]
    rows: StockTableRow[]
}

export let selectedTicker = writable("")