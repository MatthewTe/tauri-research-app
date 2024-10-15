<script lang="ts">

    import { vimMode, vimModes, selectedComponent, components, vimNumberArray } from "../lib/vimModeStore";
    import type { StockTableData} from "$lib/selectedTicketStore";
    import { selectedTicker } from "../lib/selectedTicketStore";
    import { onMount, onDestroy, tick } from 'svelte';

    let stockComponentTable: HTMLTableElement

    // Track the rows, columns and selected cell
    let cells: NodeListOf<HTMLTableCellElement>;
    let numRows: number;
    let focusedCellIndex: number = 0;
    let nunmCols: number = 4;
    
    let prevKeyPress: string | null = null;

    onMount(() => {

        cells = stockComponentTable.querySelectorAll("td")
        cells.forEach((element) => {
            element.addEventListener("focus", trackCellIndexFocus)
        })

        numRows = stockComponentTable.querySelectorAll("tr").length
        if (cells.length > 0) {
            (cells[0] as HTMLElement).focus()
            focusedCellIndex = 0;
            window.addEventListener("keydown", handleKeyNavigation)
        }

    })

    onDestroy(() => {
        window.removeEventListener("keydown", handleKeyNavigation)
        cells = stockComponentTable.querySelectorAll("td")
        cells.forEach((element) => {
            element.removeEventListener("focus", trackCellIndexFocus)
        })
    })

    function trackCellIndexFocus(event: FocusEvent) {
        // Finding the index of the cell from the array of index values:
        let focusedCell = (event.target as HTMLTableCellElement)
        focusedCellIndex = Array.from(cells).indexOf(focusedCell)
        
    }

    function handleKeyNavigation(event: KeyboardEvent) {
        if ($vimMode === vimModes.Normal) {

            // Catching number entries:
            if (/^\d$/.test(event.key)) {
                $vimNumberArray.push(event.key)
                $vimNumberArray = $vimNumberArray

            } else {
                // Letters
                let nextFocusedCellIndex = focusedCellIndex;

                // Loading in the number buffer to modify the vim motions query:
                let numberPrefix: number = 1;
                if ($vimNumberArray.length !== 0) {
                    numberPrefix = parseInt($vimNumberArray.join(""))
                }

                switch (event.key) {

                    case "h":

                        if (numberPrefix !== 1) {
                            if ((focusedCellIndex - (1 * numberPrefix)) <= 0) {
                                nextFocusedCellIndex = 0
                            } else {
                                nextFocusedCellIndex = focusedCellIndex - (1 * numberPrefix);
                            }
                        } else {
                            if ((focusedCellIndex % nunmCols) !== 0) {
                                nextFocusedCellIndex = focusedCellIndex - 1;
                            }
                        }
                        break

                    case "j":
                        if ((focusedCellIndex + nunmCols) < cells.length) {
                            nextFocusedCellIndex = focusedCellIndex + nunmCols;
                        }
                        break
                    case "k":
                        if ((focusedCellIndex - nunmCols) >= 0) {
                        nextFocusedCellIndex = focusedCellIndex - nunmCols;
                        }
                        break
                    case "l":

                        if (numberPrefix !== 1) {
                            if ((focusedCellIndex + (1 * numberPrefix)) >= cells.length) {
                                nextFocusedCellIndex = cells.length - 1
                            } else {
                                nextFocusedCellIndex = focusedCellIndex + (1 * numberPrefix);
                            }
                        } else {
                            if ((focusedCellIndex % nunmCols) !== (nunmCols - 1)) {
                                nextFocusedCellIndex = focusedCellIndex + 1;
                            }
                        }
                    break

                    case "G":
                        nextFocusedCellIndex = cells.length - 1
                    case "g":
                        if (prevKeyPress === "g") {
                            nextFocusedCellIndex = 0
                                // svelte-ignore missing-declaration
        }
                    case "Enter":

                        // Setting ticker to global store:
                        let selectedRow = Math.floor(focusedCellIndex  / nunmCols)
                        let ticker = exampleStockDatasets.rows[selectedRow].Ticker
                        $selectedTicker = ticker

                        // Selected Ticker component global store:
                        $selectedComponent = components.TickerFullInfoWindow

                        return
                    default:
                        if ($vimNumberArray.length !== 0) {
                            let emptyArray: string[] = []
                            $vimNumberArray = emptyArray
                        }
                        return
                }
                if (nextFocusedCellIndex != null) {
                    focusedCellIndex = nextFocusedCellIndex;
                    cells[focusedCellIndex].focus()
                    //console.log(cells[focusedCellIndex])
                }

                prevKeyPress = event.key

                // Purging number buffer;
                if ($vimNumberArray.length !== 0) {
                    let emptyArray: string[] = []
                    $vimNumberArray = emptyArray
                }
            }

        }
    }

    let exampleStockDatasets: StockTableData = {
        columns: ["Ticker", "Company", "Market Cap", "Recent News"],
        rows: [
            {
                Company: "Microsoft",
                Ticker: "MSFT",
                MarketCap: 3456,
                RecentNews: "Lorem Ipsum example of some news"
            },
            {
                Company: "Amazon",
                Ticker: "AMZN",
                MarketCap: 3456,
                RecentNews: "Lorem Ipsum example of some news"
            },
            {
                Company: "Tesla",
                Ticker: "TSLA",
                MarketCap: 3456,
                RecentNews: "Lorem Ipsum example of some news"
            },
            {
                Company: "Apple",
                Ticker: "AAPL",
                MarketCap: 3456,
                RecentNews: "Lorem Ipsum example of some news"
            },
            {
                Company: "INTL",
                Ticker: "Intel",
                MarketCap: 3456,
                RecentNews: "Lorem Ipsum example of some news"
            }
        ]
    }

</script>

<div>
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <table bind:this={stockComponentTable}>

        <tr>
        {#each exampleStockDatasets.columns as columnName }
            <th>{columnName}</th>
        {/each}
        </tr>

        {#each exampleStockDatasets.rows as stockDataRow}
            <tr>
                <td tabindex="0">{stockDataRow.Ticker}</td>
                <td tabindex="0">{stockDataRow.Company}</td>
                <td tabindex="0">{stockDataRow.MarketCap}</td>
                <td tabindex="0">{stockDataRow.RecentNews}</td>
            </tr>
        {/each}

    </table> 
</div>

<style>
table {
    width: 100%;
    border-collapse: collapse;
}
th, td {
    width: auto;
    padding: 8px;
    border: 1px solid #ddd;
}
td:focus {
    color: red;
}
</style>