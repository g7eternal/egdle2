<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";

  import tippy from "tippy.js";
  import "tippy.js/animations/shift-away-extreme.css";
  import "tippy.js/dist/svg-arrow.css";

  export let content;
  export let interactive = false;

  let tippyInstance = null,
    tippyRoot = null;

  const dispatch = createEventDispatcher();

  let animator = false; // toggles animation block

  onMount(() => {
    animator = true;

    setTimeout(() => {
      tippyInstance = tippy(tippyRoot, {
        animation: "shift-away-extreme",
        arrow: false,
        maxWidth: Math.min(window.innerWidth, 800) / 2,
        duration: [150, 0],
        theme: "light-border",
        placement: "right-end",
        hideOnClick: true,
        offset: [69, 10],
        allowHTML: true,
        trigger: "manual",
        onHide: function () {
          animator = false;
          setTimeout(() => dispatch("hide-advice"), 500);
          return true;
        },
        interactive,
        content,
      });

      tippyInstance.show();
    }, 180);
  });

  const transitionParams = {
    duration: 200,
    x: -200,
  };
</script>

{#if animator}
  <div class="okayeg" in:fly={transitionParams} out:fly={transitionParams}>
    <img src="icon-512x512.png" width="512" height="512" alt="Okayeg" bind:this={tippyRoot} />
  </div>
{/if}

<style>
  .okayeg {
    position: fixed;
    z-index: 20;
    bottom: -8px;
    left: -8px;
    width: 120px;
    max-width: 33%;
    cursor: crosshair;
  }
  .okayeg img {
    width: 100%;
    height: 100%;
  }
</style>
