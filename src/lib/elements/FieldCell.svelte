<script>
  import { Confetti } from "svelte-confetti";
  import game, { forceUpdateDOM } from "../utils/state";
  export let cell;
  export let focused = false;

  function doClickCell(cell) {
    if (cell.click()) forceUpdateDOM();
  }
</script>

<div
  class="cell"
  class:focused
  class:active={cell.enabled}
  class:transparent={!cell.visible}
  style:background-color={cell.visible ? cell.bgcolor : ""}
  on:click={() => doClickCell(cell)}
  on:keypress={(event) => {
    if (event.key === "Enter") doClickCell(cell);
  }}
>
  {#if cell.locked}
    <div class="lock-overlay">
      <svg fill="#555" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          d="M1016.588 1242.353v338.823h-112.94v-338.823h112.94ZM960.118 112.94c217.976 0 395.294 177.318 395.294 395.294V903.53H564.824V508.235c0-217.976 177.317-395.294 395.294-395.294Zm508.235 790.588V508.235C1468.353 228.028 1240.325 0 960.118 0S451.882 228.028 451.882 508.235V903.53H226v790.589C226 1818.692 327.308 1920 451.882 1920h1016.47c124.575 0 225.883-101.308 225.883-225.882V903.529h-225.882Z"
        />
      </svg>
    </div>
  {/if}

  {#if cell.visible}
    {cell.content}

    {#if $game.settings.visualAidMode}
      <div class="visual-aid">
        {cell.color}
      </div>
    {/if}
  {/if}

  {#if cell.finisher}
    <Confetti
      rounded
      size="12"
      amount="30"
      noGravity
      x={[-0.3, 0.3]}
      y={[0, 0.5]}
      duration="1400"
      colorArray={["#ffda4a78", "#ffcf8a77", "#ffe99e69", "#ba9f6676", "#e6be6097"]}
    />
  {/if}
</div>

<style>
  .cell {
    font-size: 28px;
    width: 90px;
    max-width: 15vw;
    min-width: 50px;
    height: 90px;
    max-height: 12vh;
    min-height: 50px;
    color: inherit;
    border: 2px solid rgba(160, 160, 160, 0.5);
    padding: 8px;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    text-shadow: 0px 0px 4px black;
    user-select: none;
    filter: none;
    transform: none;
    position: relative;
    transition: background-color 0.3s ease-out, color 0.3s ease, filter 0.3s ease-out, transform 0.3s ease-out;
  }
  .cell:not(.active) {
    cursor: not-allowed;
  }
  .cell.focused {
    transform: scale(1.05);
    filter: contrast(0.7) brightness(1.2);
    box-shadow: 0px 0px 8px rgba(var(--bs-body-color-rgb), 0.55);
  }
  .cell.active:hover {
    transition: none;
    background: rgba(192, 192, 192, 0.2);
    cursor: pointer;
  }
  .cell.transparent {
    background-color: transparent;
    color: transparent;
  }

  .lock-overlay {
    position: absolute;
    z-index: -1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .lock-overlay svg {
    position: absolute;
    bottom: 5%;
    right: 5%;
    width: 30%;
    height: auto;
    opacity: 0.8;
  }

  .visual-aid {
    font-size: 40%;
    text-transform: uppercase;
    font-weight: bold;
    text-shadow: none;
  }

  /* for debug purposes */
  :global(.chroma-keyed) .cell:not(.transparent) {
    background-color: var(--bs-secondary-bg) !important;
  }
  :global(.chroma-keyed) .cell.active:hover {
    background-color: rgba(192, 192, 192, 1);
  }
  :global(.chroma-keyed) .cell.transparent {
    background-color: var(--bs-body-bg);
  }

  @media all and (max-width: 400px) {
    .cell {
      border-width: 1px;
      font-size: 60%;
      width: 50px;
      min-width: 30px;
      height: 50px;
      min-height: 30px;
    }
    .visual-aid {
      font-size: 50%;
    }
    .lock-overlay svg {
      bottom: 3%;
      right: 3%;
      width: 44%;
      opacity: 0.8;
    }
  }
  @media all and (max-width: 200px) {
    .cell {
      border-width: 1px;
      font-size: 50%;
      min-width: 16px;
      min-height: 16px;
    }
  }
</style>
