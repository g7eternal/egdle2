<script>
  import MaterialIcon from "./MaterialIcon.svelte";
  import { isMobileClient } from "../utils/common";
  import game from "../utils/state";

  const share = {
    error: false,
    result: "",
    ready: true,
  };

  function reEnableShareBtn(result) {
    share.result = result;
    setTimeout(() => {
      share.result = "";
      share.ready = true;
    }, 2000);
  }

  function doShare() {
    try {
      if (!share.ready) return;
      share.ready = false;

      const data = $game.getShareableData();

      // mobile frogs have their native way of sharing things
      if (isMobileClient()) {
        const shareable = { text: data };
        if (navigator.share && navigator.canShare && navigator.canShare(shareable)) {
          navigator
            .share(shareable)
            .catch((e) => {
              // AbortError is not malicious
              if (e instanceof Error)
                switch (e.name) {
                  case "AbortError":
                    return; // user aborted sharing
                  default:
                    throw e; // other errors should be dealt with!
                }
            })
            .then(
              () => reEnableShareBtn("Results shared!"),
              (e) => console.error("Sharing failed", e)
            );
          return;
        }
      }

      // desktop friends - let's hope they use modern browsers
      navigator.clipboard.writeText(data).then(
        () => reEnableShareBtn("Copied to clipboard!"),
        (e) => console.error("Clipboard sharing failed", e)
      );
    } catch (e) {
      console.error("Share failed (browser error): ", e);
      share.error = true;
    }
  }
</script>

<button
  class="btn btn-success"
  class:btn-happy={share.result}
  class:btn-danger={share.error}
  disabled={!share.ready}
  on:click={doShare}
>
  {#if share.error}
    <MaterialIcon>error_outline</MaterialIcon>
    Sharing failed!
  {:else if share.result}
    <MaterialIcon>check_circle_outline</MaterialIcon>
    {share.result}
  {:else if share.ready}
    <MaterialIcon>share</MaterialIcon>
    Share your stats
  {:else}
    <div class="spinner-grow spinner-grow-sm" role="status">
      <span class="visually-hidden">Share in progress...</span>
    </div>
  {/if}
</button>

<style>
  .btn {
    min-width: 50%;
    margin: auto;
    filter: none;
    transition: opacity 0.3s ease-out, filter 0.4s ease-out;
  }
  .btn-happy {
    filter: saturate(2);
    font-weight: 500;
  }
</style>
