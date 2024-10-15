<script lang="ts">

  import { invoke } from "@tauri-apps/api/core";

  import { onMount, onDestroy } from 'svelte';
  import VimSettings from "./VimSettings.svelte";
  import { vimMode, vimModes, selectedComponent, components, vimNumberArray } from "../lib/vimModeStore";
  import { selectedTicker } from "../lib/selectedTicketStore";
  import StockComponent from "./StockComponent.svelte";
  import PeopleComponent from "./PeopleComponent.svelte";
  import TickerInfoComponent from "./TickerInfoComponent.svelte";

  function handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      
      case "Escape":
        $vimMode = vimModes.Normal
        let emptyArray: string[] = []
        $vimNumberArray = emptyArray
        break

      case "i":
        if ($vimMode === vimModes.Normal) {
          $vimMode = vimModes.Insert
          let emptyArray: string[] = []
          $vimNumberArray = emptyArray
        }
        break

      case "/":
        if ($vimMode == vimModes.Normal) {
          $vimMode = vimModes.Search
          let emptyArray: string[] = []
          $vimNumberArray = emptyArray
        }
        break
      
        case ":":
        if ($vimMode == vimModes.Normal) {
          $vimMode = vimModes.Search
          let emptyArray: string[] = []
          $vimNumberArray = emptyArray
        }
        break
    }
  }

  onMount(() => {
    window.addEventListener("keydown", handleKeydown)
  })

  onDestroy(() =>{
    window.removeEventListener("keydown", handleKeydown)
  })

</script>
  
<div class="container">

  {#if $selectedComponent === components.StockWindow}
    <StockComponent></StockComponent>
  {:else if $selectedComponent === components.PersonWindow} 
    <PeopleComponent></PeopleComponent>
  {:else if $selectedComponent === components.TickerFullInfoWindow}
    <TickerInfoComponent ticker={$selectedTicker}></TickerInfoComponent>
  {/if}

<VimSettings></VimSettings>
</div>

<style>
:root {
  font-family: 'Menlo', 'Monaco', 'monospace';
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #D3D3D3;
  background-color: #1E1E1E;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

.container {
  margin: 0;
  padding-top: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
</style>
