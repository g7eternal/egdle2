<script>
  export let header = "";
  export let headerspan = 2;
</script>

<table class="table table-striped">
  {#if header}
    <thead>
      <tr>
        <td colspan={headerspan} class="fs-5 fw-semibold">
          {header}
        </td>
      </tr>
    </thead>
  {/if}
  <tbody>
    <slot />
  </tbody>
</table>

<style>
  tbody :global(tr:first-child) {
    border-top-width: var(--bs-border-width);
  }
</style>
