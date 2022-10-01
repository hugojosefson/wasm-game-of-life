// @deno-types="../pkg/wasm_game_of_life.d.ts"
import { Universe } from "./pkg/wasm_game_of_life.js";

const CURSOR_TOP_LEFT = "\x1b[1;1H";
const CURSOR_HIDE = "\x1b[?25l";
const CURSOR_SHOW = "\x1b[?25h";
const STOP_SIGNALS: Deno.Signal[] = [
  "SIGINT",
  "SIGTERM",
  "SIGQUIT",
  "SIGABRT",
  "SIGHUP",
];

function onAnyStopSignal(cb: () => void): void {
  STOP_SIGNALS.forEach((signal) => {
    Deno.addSignalListener(signal, cb);
  });
}

function startUniverse(universe: Universe): () => void {
  console.clear();
  console.log(CURSOR_HIDE);

  let done = false;
  function anotherTickPlease(u: Universe): void {
    u.tick();
    console.log(CURSOR_TOP_LEFT + u.render());

    if (done) {
      return;
    }
    setTimeout(anotherTickPlease, 1, u);
  }

  anotherTickPlease(universe);
  return () => done = true;
}

let stopUniverse: () => void | undefined;
function moveToTheNextUniverse() {
  stopUniverse?.();
  stopUniverse = startUniverse(
    Universe.new(
      Deno.consoleSize(Deno.stdout.rid).columns,
      Deno.consoleSize(Deno.stdout.rid).rows,
    ),
  );
}
function stopCurrentUniverse() {
  stopUniverse?.();
  stopUniverse = undefined;
}

onAnyStopSignal(stopCurrentUniverse);
Deno.addSignalListener("SIGWINCH", moveToTheNextUniverse);

addEventListener("unload", () => {
  console.log(CURSOR_SHOW);
});

moveToTheNextUniverse();
