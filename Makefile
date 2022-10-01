all: clean fmt build run

build:
	wasm-pack build --target deno
	# export getUint8Memory0()
	sed -E 's|function getUint8Memory0|export function getUint8Memory0|g' -i pkg/wasm_game_of_life.js
	echo "export function getUint8Memory0(): Uint8Array;" >> pkg/wasm_game_of_life.d.ts

clean:
	rm -rf pkg

fmt:
	deno fmt *.ts
	cargo fmt

run:
	deno run --reload --allow-read=pkg/wasm_game_of_life_bg.wasm index.ts

.PHONY: build clean fmt run
