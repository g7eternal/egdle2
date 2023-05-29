<script>
  import game from "../utils/state";
  export let cell;
  export let focused = false;

  function doClickCell(cell) {
    cell.click();
    $game = $game; // trigger full update
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
  {#if cell.visible}
    {cell.content}

    {#if $game.settings.visualAidMode}
      <div class="visual-aid">
        {cell.color}
      </div>
    {/if}
  {/if}
</div>

<style>
  .cell {
    font-size: 30px;
    width: 100px;
    max-width: 15vw;
    min-width: 50px;
    height: 100px;
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
    pointer-events: none;
    filter: none;
    transform: none;
    transition: background-color 0.3s ease-out, color 0.3s ease, filter 0.3s ease-out,
      transform 0.3s ease-out;
  }
  .cell.active {
    pointer-events: all;
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

  .visual-aid {
    font-size: 40%;
    text-transform: uppercase;
    font-weight: bold;
    text-shadow: none;
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
