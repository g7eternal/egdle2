<script>
  import Stats from "../stats/Matcher.svelte";
  import game from "../../utils/state";
  import { resultFlavorTexts as flavors } from "../consts";
  import DailyCountdown from "../../elements/DailyCountdown.svelte";
</script>

<h6>🥳 Matching finished! 🥚</h6>
<p>
  You have cleared the field in
  <b class="text-success">{$game.stats.lastClicks}</b>
  clicks.
  <br />
  {@html flavors[
    Math.min(
      Math.max(0, Math.floor(($game.stats.lastClicks - $game.field.size) / 5)),
      flavors.length - 1
    )
  ]}
</p>

<Stats />

<DailyCountdown />

<style>
  p {
    margin: 16px 0;
  }
  :global(img) {
    vertical-align: text-bottom;
  }
</style>
