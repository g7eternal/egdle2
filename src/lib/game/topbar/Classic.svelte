<script>
  import currentGame from "$lib/utils/state";
  import tippy from "$lib/utils/tippy";
</script>

<div class="bar">
  <div class="section left">
    {#if $currentGame.settings.hardMode}
      <span use:tippy={{ content: "Hard mode!" }}>♨️</span>
    {/if}
    🥚 {$currentGame.name}
    <b>#{$currentGame.issue}</b>
  </div>
  <div class="section right">
    Clicks:
    <b class="text-success">{$currentGame.clicks}</b>
  </div>
</div>

<style>
  .bar {
    padding: 8px 0;
    display: flex;
    flex-flow: row wrap;
  }
  .section {
    flex: 1 0 auto;
    text-align: center;
    font-size: 20px;
  }

  @media all and (max-width: 400px) {
    .bar {
      flex-flow: column nowrap;
    }
    .section {
      margin: 8px 0;
    }
  }
</style>
