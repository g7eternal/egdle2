<script>
  import ShareButton from "../elements/ShareButton.svelte";
  import MaterialIcon from "../elements/MaterialIcon.svelte";
  import game from "../utils/state";
</script>

<div class="modal-content">
  <div class="modal-header">
    <h5 class="modal-title fs-5" id="mdlStatsTitle">
      <MaterialIcon size="24px">leaderboard</MaterialIcon> Stats
    </h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
  </div>
  <div class="modal-body">
    {#if $game}
      <h5 class="text-center mb-3">{$game.name}</h5>
      <svelte:component this={$game.statsComponent} />
    {:else}
      ℹ️ Choose a game to see relevant stats
    {/if}
  </div>
  <div class="modal-footer">
    <ShareButton />
  </div>
</div>
