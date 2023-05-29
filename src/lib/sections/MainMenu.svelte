<script>
  import { fade } from "svelte/transition";
  import { appReady, settings } from "../utils/settings";
  import { nullFunction } from "../game/consts";

  import { getInstance as egdle } from "../game/classic";
  import { getInstance as matcher } from "../game/matcher";
  import { getInstance as pattern } from "../game/pattern";
  import { getInstance as filler } from "../game/filler";
  import { getInstance as aimlab } from "../game/aimlab";

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
          init: matcher,
          name: "Pairs",
          desc: "Click around and locate all matching eggs on the field.",
        },
      ],
    },
    {
      title: "Other games",
      list: [
        {
          id: "aimlab",
          init: aimlab,
          name: "Reflex",
          desc: "Collect the randomly appearing eggs as quickly as possible",
        },
        {
          id: "pattern",
          init: pattern,
          name: "Patterns",
          desc: "A fun test: how many eggs can you store in your memory?",
        },
        {
          id: "filler",
          init: filler,
          name: "Filler",
          desc: "Fill the screen with eggs as quickly and efficiently as possible",
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
          <img src={`panel/${game.id}.png`} alt="Okayeg" />
          <div>
            <h3>
              {game.name}
              {#if $appReady && !$settings.seenGames.includes(game.id)}
                <span class="badge bg-success">New!</span>
              {/if}
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
  h3 {
    margin: 8px 0;
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
    width: 84px;
    height: 84px;
    border-color: var(--bs-btn-border-color);
    border-style: solid;
    border-width: 0px;
    border-right-width: 1px;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    margin: auto 8px auto 0;
  }
  li p {
    font-size: 90%;
    margin: 0;
  }

  .btn {
    margin: 4px 0;
    padding: 0;
    text-align: left;
  }

  .promise {
    width: 100%;
    margin: 0;
    padding-bottom: 16px;
    font-style: italic;
    text-align: center;
    opacity: 0.5;
  }

  @media all and (max-width: 360px) {
    li {
      flex-flow: column nowrap;
    }
    li img {
      margin: 16px auto 0 auto;
      border-width: 1px;
      border-radius: 6px;
    }
    .btn {
      padding: 0 8px 8px 8px;
      text-align: center;
    }
  }
</style>
