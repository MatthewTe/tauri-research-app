<script lang='ts'>

    import { onMount, onDestroy } from 'svelte';
    import { vimMode, vimModes, selectedComponent, components, vimNumberArray } from "../lib/vimModeStore";
    import { selectedTicker } from '$lib/selectedTicketStore';

    let globalSearchInput: HTMLInputElement;
    let searchValue: string;
    let inputClass: string = "default-search";
    let searchError: boolean = false;

    // Focusing on the search:
    function focusOnGlobalInput() {
        if (globalSearchInput) {
            globalSearchInput.focus();
        }
    }
    function removeFocusOnGlobalInput() {
        if (globalSearchInput) {
            globalSearchInput.blur()
        }
    }
    $: if ($vimMode === vimModes.Search) {
        focusOnGlobalInput()
        // searchError = false;
        window.addEventListener("keydown", parseSearchResult)

    } else if ($vimMode === vimModes.Normal) {
        removeFocusOnGlobalInput()
        if (globalSearchInput) {
            searchValue = ""
            window.removeEventListener("keydown", parseSearchResult)
        }
    }

    // Executing Search Components:
    function parseSearchResult(event: KeyboardEvent) {
        if (event.key === "Enter") {
            if (globalSearchInput) {
                parseSearchQuery(searchValue)
                $vimMode = vimModes.Normal
            }
        }
    }

    $: inputClass = searchError ? "search_result_error": "default-search";
    function parseSearchQuery(searchInput: string) {

        let searchQueryParams: string[] = searchInput.split(":")
        if (searchQueryParams.length > 0) {
            switch (searchQueryParams[1]) {
                case "stock":
                    
                    // Further applying logic to stock vim selections:
                    if (searchQueryParams.length > 2) {
                        $selectedComponent = components.TickerFullInfoWindow
                        $selectedTicker = searchQueryParams[2] // :stock:ticker
                        searchValue = ''
                        break
                    }

                    $selectedComponent = components.StockWindow
                    searchValue = ''
                    break


                case "author":
                    $selectedComponent = components.PersonWindow
                    searchValue = ''
                    break
                default:
                    // No query it throws an error:
                    searchValue = "Search query not valid"
                    searchError = false;
                    console.log(inputClass)
            }
        } else {
            searchValue = "Search query not valid"
            searchError = false;
            console.log(inputClass)
        }

    }

</script>

<div>
    {#if $vimMode == vimModes.Normal}
        <span>Normal: </span>
    {:else if $vimMode == vimModes.Insert}
        <span>Insert: </span>
    {:else if $vimMode == vimModes.Search}
        <span>Search: </span>
    {/if}

    <span>
        <input bind:this={globalSearchInput} class={inputClass} bind:value={searchValue} type="text" name="global_search_box" id="global_search_box">
    </span>

    {#if $vimNumberArray.length !== 0}
        <span>{$vimNumberArray.join('')}</span>
    {/if}

</div>

<style>
div {
    font-size: 10pt;
    position: absolute;
    bottom: 10px;
    margin: 0.15rem;
}
input {
    font-family: inherit;
    background-color: transparent;
    border: none;
    font-size: inherit;
    outline: none;
    color: inherit;
}
input.search_result_error {
    font-family: inherit;
    background-color: transparent;
    border: none;
    font-size: inherit;
    outline: none;
    color: red;
}
</style>