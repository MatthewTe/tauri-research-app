import { writable } from "svelte/store";


export enum vimModes {
    Normal, 
    Insert,
    Search
}

export enum components {
    StockWindow,
    PersonWindow,
    TickerFullInfoWindow
}

export let vimMode = writable(vimModes.Normal)

const numberArray: string[] = []
export let vimNumberArray = writable(numberArray)
export let selectedComponent = writable(components.StockWindow)