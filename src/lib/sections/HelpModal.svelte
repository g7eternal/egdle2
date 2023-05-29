<script>
  import MaterialIcon from "$lib/elements/MaterialIcon.svelte";
  import game from "../utils/state";
</script>

<div class="modal-content">
  <div class="modal-header">
    <h5 class="modal-title fs-5" id="mdlHelpTitle">
      <MaterialIcon size="26px">help_outline</MaterialIcon> About
    </h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
  </div>
  <div class="modal-body">
    {#if $game}
      <h4>{$game.name}</h4>
      <svelte:component this={$game.helperComponent} />
    {:else}
      <h4>
        <b>🥚 Egdle</b> Game Hub 🥚
      </h4>
      <p>
        A collection of mini-games with eggs.<br />
        Egg mixes, news, big plays, tilts. Everything that is somewhat related to egg.
      </p>
      <p>
        Information about each game is available inside: select any game, then click the
        <b><MaterialIcon>help_outline</MaterialIcon> Help</b> icon.
      </p>
      <p>
        <b><MaterialIcon>settings</MaterialIcon> Settings</b> menu allows you to customize your experience.
        Some options are only available once you get into the game.
      </p>
    {/if}

    <hr />
    <div class="authorship text-muted">
      Egdle Game Hub created with <MaterialIcon color="#c99" size="16px">favorite</MaterialIcon> by
      <a href="https://g7eternal.com/" rel="noreferrer" target="_blank">G7Eternal</a>
    </div>
  </div>
</div>

<style>
  h4 {
    text-align: center;
    margin-bottom: 16px;
  }

  .authorship {
    font-size: 12px;
  }
</style>
