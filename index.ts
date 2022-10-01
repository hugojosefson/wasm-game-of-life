// @deno-types="../pkg/wasm_game_of_life.d.ts"
import { Universe } from "./pkg/wasm_game_of_life.js";

const CURSOR_TOP_LEFT = "\x1b[1;1H";
const CURSOR_HIDE = "\x1b[?25l";
const CURSOR_SHOW = "\x1b[?25h";

function startUniverse(universe: Universe): () => void {
  let done = false;
  console.clear();

  function anotherTickPlease(u: Universe): void {
    u.tick();
    console.log(CURSOR_TOP_LEFT + u.render());

    if (done) {
      return;
    }
    setTimeout(anotherTickPlease, 0, u);
  }

  anotherTickPlease(universe);
  return () => done = true;
}

addEventListener("unload", () => {
  console.log(CURSOR_SHOW);
});
console.log(CURSOR_HIDE);

const stopUniverse = startUniverse(
  Universe.new(
    Deno.consoleSize(Deno.stdout.rid).columns,
    Deno.consoleSize(Deno.stdout.rid).rows,
  ),
);

Deno.addSignalListener("SIGINT", () => {
  stopUniverse();
});
