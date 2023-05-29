import { browser } from "$app/environment";
import { today } from "../game/consts";
import { showAdviceFriend } from "./adviceFriend";
import { sample } from "./common";

const facts = [];

export function dailyEggFactRequired(lastVisitDate) {
  if (!browser) return false;

  // egg facts are daily
  const params = ["getFullYear", "getMonth", "getDate"];
  return params.some((method) => lastVisitDate[method]() !== today[method]());
}

async function asyncLoadEggFacts() {
  if (facts.length > 0) return;

  const data = await fetch("data/egg-facts.json");

  const list = await data.json();
  if (!list.length) throw new Error("List of facts is empty!");

  facts.push(...list);
}

export function tryShowDailyEggFact() {
  asyncLoadEggFacts()
    .then(() => {
      const fact = sample(facts);
      showAdviceFriend(fact, "Daily egg fact");
    })
    .catch((e) => console.error("Failed to get egg facts", e));
}
