<script>
  import { fade } from "svelte/transition";
  import { settings } from "../utils/settings";
  import { getInstance as egdle } from "../game/classic";
  import { nullFunction } from "../game/consts";
  import game from "../utils/state";

  const variants = [
    {
      title: "Daily games",
      list: [
        {
          id: "classic",
          init: egdle,
          name: "Classic",
          desc: "Find the hidden egg in as few taps as possible.",
        },
        {
          id: "matcher",
          init: nullFunction,
          name: "Matcher",
          desc: "Click around and locate all matching egg pairs on the field.",
        },
      ],
    },
    {
      title: "Other games",
      list: [
        {
          id: "sweeper",
          init: nullFunction,
          name: "Egg-sweeper",
          desc: "A twist of a popular game - with eggs!",
        },
        {
          id: "pattern",
          init: nullFunction,
          name: "Patterns",
          desc: "A fun test: how many eggs can you store in your memory?",
        },
      ],
    },
  ];

  function setGame(variant) {
    $game = variant.init();
  }
</script>

<div class="main" in:fade={{ duration: 200 }}>
  {#each variants as section}
    <h2 class="text-success">{section.title}</h2>
    <ul>
      {#each section.list as game}
        <li
          class="btn btn-outline-secondary"
          class:disabled={game.init === nullFunction}
          on:click={() => setGame(game)}
          on:keypress={(event) => {
            if (event.key === "Enter") setGame(game);
          }}
        >
          <img src="icon-384x384.png" alt="Okayeg" />
          <div>
            <h3>
              {#if !$settings.seenGames?.includes(game.id)}
                <span class="badge bg-success">New!</span>
              {/if}
              {game.name}
            </h3>
            <p>{game.desc}</p>
          </div>
        </li>
      {/each}
    </ul>
  {/each}
</div>

<p class="promise">...more new games to be added soon!</p>

<style>
  .main {
    padding: 8px;
  }
  h2 {
    margin-bottom: 16px;
    width: 100%;
    font-size: 24px;
    text-align: center;
    text-transform: uppercase;
    opacity: 0.7;
  }
  h3 .badge {
    font-size: 50%;
    vertical-align: middle;
  }
  ul {
    padding: 0;
    margin-bottom: 40px;
    list-style-type: none;
  }

  li {
    list-style-type: none;
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    gap: 8px;
  }
  li.disabled {
    display: none;
  }
  li img {
    width: 80px;
    height: 80px;
    margin: auto 0;
  }
  li p {
    margin: 0;
  }

  .btn {
    margin: 4px 0;
    padding-left: 8px;
    padding-right: 8px;
    text-align: left;
  }

  .promise {
    width: 100%;
    margin: 0;
    font-style: italic;
    text-align: center;
    opacity: 0.5;
  }

  @media all and (max-width: 360px) {
    li {
      flex-flow: column nowrap;
    }
    li img {
      margin: 0 auto;
    }
  }
</style>
