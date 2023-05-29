<script>
  import Stats from "../stats/Pattern.svelte";
  import game from "../../utils/state";
  import { resultFlavorTexts as flavors } from "../consts";
</script>

<p>
  This run has ended on level
  <b class="text-success">{$game.stats.lastRound}</b>.
  <br />
  {@html flavors[Math.max(flavors.length - $game.stats.lastRound, 0)]}
</p>

<Stats />

<style>
  p {
    margin: 0 0 16px 0;
  }
  :global(img) {
    vertical-align: text-bottom;
  }
</style>
