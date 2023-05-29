<script>
  import { Confetti } from "svelte-confetti";
  import game, { forceUpdateDOM } from "../utils/state";
  export let cell;
  export let allowFlicks = false;
  export let focused = false;

  // puzzle piece:
  export let isPuzzlePiece = false;
  let puzzleScale, puzzleOffset, puzzleX, puzzleY;

  $: {
    const sizeOffset = 123;
    puzzleOffset = (cell.puzzleId || $game.field.size) - 1;
    puzzleScale = $game.field.width * sizeOffset + "% " + $game.field.height * sizeOffset + "%";
    puzzleX = 4 + (110 * (puzzleOffset % $game.field.width)) / $game.field.width + "%";
    puzzleY = 1 + (110 * Math.floor(puzzleOffset / $game.field.height)) / $game.field.height + "%";
  }

  function doClickCell(cell) {
    if (cell.click()) forceUpdateDOM();
  }

  function startFlick(cell, event) {
    if (!allowFlicks || !cell.enabled) return;
    if (!event?.target) return;
    event.preventDefault();

    // remember the original cell
    $game._touchStartCell = cell;
    $game._touchAction = event.touches[0];
    $game._touchOrigin = event.target.getBoundingClientRect();
  }
  function endFlick(cell, event) {
    if (!allowFlicks || !cell.enabled) return;
    if (!event?.target) return;
    event.preventDefault();

    const fullTouch = event.changedTouches.item($game._touchAction.identifier);
    if (!fullTouch) return;

    // detect the type of touch motion
    const motionX = fullTouch.clientX - $game._touchAction.clientX;
    const motionY = fullTouch.clientY - $game._touchAction.clientY;
    const absMotionX = Math.abs(motionX);
    const absMotionY = Math.abs(motionY);
    if (absMotionX >= $game._touchOrigin.width / 2 || absMotionY >= $game._touchOrigin.height / 2) {
      // flick confirmed
      const i = $game.field.cells.findIndex((c) => c === $game._touchStartCell);
      if (i >= 0) {
        let j = i;
        if (absMotionX > absMotionY) {
          j += Math.sign(motionX);
        } else {
          j += Math.sign(motionY) * $game.field.width;
        }
        const secondCell = $game.field.cells[j];
        $game.swapTwoCells($game._touchStartCell, secondCell);
      }
      $game.activeCell = null;
    } else {
      // not a flick - emulate click
      doClickCell($game._touchStartCell);
    }

    // cleanup
    delete $game._touchStartCell;
    delete $game._touchAction;
    delete $game._touchOrigin;
    forceUpdateDOM();
  }

  function startDrag(cell) {
    if (!allowFlicks || !cell.enabled) return;
    // mark original cell
    $game._dragStartCell = cell;
  }
  function endDrag(cell) {
    if (!allowFlicks || !cell.enabled) return;
    if ($game._dragStartCell === cell) return;

    // swap original and target cell
    $game.swapTwoCells($game._dragStartCell, cell);
    delete $game._dragStartCell;
    $game.activeCell = null;

    forceUpdateDOM();
  }
</script>

<div
  class="cell"
  class:focused
  class:puzzle-piece={isPuzzlePiece}
  class:active={cell.enabled}
  class:transparent={!cell.visible}
  style:background-color={cell.visible ? cell.bgcolor : ""}
  style:background-size={puzzleScale}
  style:background-position-x={puzzleX}
  style:background-position-y={puzzleY}
  tabindex="-1"
  on:mousedown={(event) => startDrag(cell, event)}
  on:mouseup={(event) => endDrag(cell, event)}
  on:touchstart={(event) => startFlick(cell, event)}
  on:touchend={(event) => endFlick(cell, event)}
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
    font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
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
    background-color: rgba(192, 192, 192, 0.2);
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
    transition: none;
    background-color: var(--bs-secondary-bg) !important;
  }
  :global(.chroma-keyed) .cell.active:hover {
    background-color: rgba(192, 192, 192, 1);
  }
  :global(.chroma-keyed) .cell.transparent {
    transition: none;
    background-color: var(--bs-body-bg);
  }

  .cell.puzzle-piece {
    font-weight: bold;
    text-shadow: 0px 0px 2px white, 0px 0px 3px white, 0px 0px 4px white;
  }
  :global([data-bs-theme="dark"]) .cell.puzzle-piece {
    text-shadow: 0px 0px 2px black, 0px 0px 2px black;
  }
  .cell.puzzle-piece:not(.transparent) {
    background-repeat: no-repeat;
    background-image: url(/example/puzzle-pic.png);
  }
  .cell.puzzle-piece:hover {
    filter: brightness(1.3);
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
    .cell.puzzle-piece {
      font-size: 75%;
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
