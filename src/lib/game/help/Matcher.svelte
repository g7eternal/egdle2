<script>
  import currentGame from "$lib/utils/state";
</script>

<p>This is a memory game where you need to match the eggs.</p>
<p>Click two cells, and if they match - they stay. The game ends when you match all the eggs.</p>

<hr />
<img src="example/matcher.webp" alt="Example - Matcher" />
<hr />

<p>
  Any pair of cells will match if they have the same color. There are
  <b>{$currentGame.colors.length}</b>
  distinct colors in total.
</p>

<p>
  If you are having a hard time distinguishing between cells of similar colors, try enabling the
  <strong>✴️&nbsp;Visual aid mode</strong>.
</p>

<hr />

<p class="fw-bold">
  Field will be refreshed each day! Keep playing and share your score with friends!
</p>

<style>
  img {
    margin-left: 5%;
    width: 90%;
    height: auto;
  }
</style>
