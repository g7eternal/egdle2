<script>
  import game from "../utils/state";
  export let cell;

  function doClickCell(cell) {
    cell.click();
    $game = $game; // trigger full update
  }
</script>

<div
  class="cell"
  class:active={cell.enabled}
  class:transparent={!cell.visible}
  style:background-color={cell.visible ? cell.bgcolor : ""}
  on:click={() => doClickCell(cell)}
  on:keypress={(event) => {
    if (event.key === "Enter") doClickCell(cell);
  }}
>
  {cell.visible ? cell.content : ""}
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
    border: 2px solid rgb(160, 160, 160, 0.5);
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-shadow: 0px 0px 4px black;
    user-select: none;
    pointer-events: none;
    transition: background-color 0.3s ease-out, color 0.3s ease;
  }
  .cell.active {
    pointer-events: all;
  }
  .cell.active:hover {
    transition: none;
    background: rgb(192, 192, 192, 0.2);
    cursor: pointer;
  }
  .cell.transparent {
    background-color: transparent;
    color: transparent;
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
