<script>
  import { dev as devMode } from "$app/environment";
  import { settings, toggleDarkMode } from "../utils/settings";
  import game, { forceUpdateDOM } from "../utils/state";
  import { settingsLibrary, cellColors } from "../game/consts";

  import DevModeButtons from "../elements/DevModeButtons.svelte";
  import MaterialIcon from "../elements/MaterialIcon.svelte";

  function updateExternalOption(event) {
    const key = event.currentTarget.dataset.optionkey;
    const value = Boolean(event.currentTarget.checked);
    $game.setOption(key, value);
    forceUpdateDOM();
  }

  function doSetCellColor(eventTarget, callerIndex) {
    // useful for binary game mode, where there are two dropdowns with colors
    const anotherIndex = Math.abs(callerIndex - 1);
    if ($game.settings.colors[anotherIndex] === eventTarget.value) {
      // swap colors, disallow picking same color
      $game.settings.colors[anotherIndex] = $game.settings.colors[callerIndex];
    }
    $game.settings.colors[callerIndex] = eventTarget.value;
    $game.setOption("colors", $game.settings.colors);
  }
</script>

<div class="modal-content">
  <div class="modal-header">
    <h5 class="modal-title fs-5" id="mdlSettingsTitle">
      <MaterialIcon size="24px">settings</MaterialIcon> Settings
    </h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
  </div>
  <div class="modal-body">
    <div class="option-block">
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          id="opt_DarkMode"
          checked={$settings.darkMode}
          on:change={() => toggleDarkMode()}
        />
        <label class="form-check-label" for="opt_DarkMode">💡 Dark theme</label>
        <br />
        <small class="form-text">Toggles light/dark mode for the page</small>
      </div>
    </div>

    <div class="option-block">
      {#if $game}
        {#each Object.keys($game.settings) as key}
          {@const lib = settingsLibrary[$game.id][key]}
          {@const disabled = $game.disabledSettings.has(key)}

          {#if lib.type === "color_multiselect"}
            <hr />
            <div class="d-flex flex-row my-2">
              <div class="flex-grow-1">
                <span class="form-check-label">{lib.title}</span>
                <br />
                <small class="form-text" class:disabled>
                  {disabled ? lib.error : lib.desc}
                </small>
              </div>
              <div class="d-flex flex-column gap-2">
                {#each $game.settings[key] as color, colorIndex}
                  <select
                    class="form-select"
                    style:border-color={color}
                    style:color
                    value={color}
                    on:change={(event) => doSetCellColor(event.currentTarget, colorIndex)}
                  >
                    {#each Object.keys(cellColors) as colorOption}
                      <option value={colorOption} style:background-color={cellColors[colorOption]}>
                        {colorOption}
                      </option>
                    {/each}
                  </select>
                {/each}
              </div>
            </div>
          {:else}
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id={"opt_" + key}
                checked={$game.settings[key]}
                {disabled}
                data-optionkey={key}
                on:change={updateExternalOption}
              />
              <label class="form-check-label" for={"opt_" + key}>{lib.title}</label>
              <br />
              <small class="form-text" class:disabled>
                {disabled ? lib.error : lib.desc}
              </small>
            </div>
          {/if}
        {/each}
      {:else}
        <div class="mt-2 fst-italic text-center text-secondary">
          More options will be available after you choose a game
        </div>
      {/if}

      {#if devMode}
        <hr />
        <h6 class="text-center">Developer mode options</h6>
        <div class="d-flex justify-content-center">
          <DevModeButtons />
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .option-block {
    margin: 0;
    padding: 8px 0;
    width: 100%;
    border-bottom: 1px solid var(--bs-modal-header-border-color);
  }
  .option-block:last-child {
    border-bottom: none;
  }

  .form-check-input {
    filter: hue-rotate(-75deg) saturate(0.7);
  }

  select,
  input,
  label {
    cursor: pointer;
  }

  option {
    color: var(--bs-body-color);
  }

  small.form-text {
    opacity: 0.69;
  }
  small.disabled {
    opacity: 1;
    color: rgb(136, 104, 0);
  }
</style>
