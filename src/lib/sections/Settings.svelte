<script>
  import { dev as devMode } from "$app/environment";
  import { settings, toggleDarkMode } from "../utils/settings";
  import game, { forceUpdateDOM } from "../utils/state";
  import { settingsLibrary } from "../game/consts";
  import DevModeButtons from "../elements/DevModeButtons.svelte";

  function updateExternalOption(event) {
    const key = event.currentTarget.dataset.optionkey;
    const value = Boolean(event.currentTarget.checked);
    $game.setOption(key, value);
    forceUpdateDOM();
  }
</script>

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

  input,
  label {
    cursor: pointer;
  }

  small.form-text {
    opacity: 0.69;
  }
  small.disabled {
    opacity: 1;
    color: rgb(136, 104, 0);
  }
</style>
