<script>
  import { scale } from "svelte/transition";

  export let isVisible = false;
  export let runFunction;

  let countdown = 3;

  const countTimer = setInterval(() => {
    countdown -= 1;
    if (countdown === 0) runFunction();
    if (countdown < 0) {
      clearInterval(countTimer);
      isVisible = false;
    }
  }, 1000);
</script>

<!-- timer representation -->
{#key countdown}
  <div class="countdown" in:scale>{countdown || "GO!"}</div>
{/key}

<style>
  .countdown {
    transform: scale(1.3);
    font-weight: 500;
    color: var(--bs-primary-text);
  }
</style>
