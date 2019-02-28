let canvas = document.createElement("canvas");
canvas.width = document.children[0].scrollWidth;
canvas.height = document.children[0].scrollHeight;
document.body.appendChild(canvas);

let x = 0;
let y = 0;

let playerSpeed = 2;

let movup = false;
let movdn = false;
let movlt = false;
let movrt = false;

let map = [
	[1, 1, 1, 1, 1],
	[1, 0, 0, 0, 1],
	[1, 1, 1, 0, 1],
	[1, 0, 0, 0, 1],
	[1, 1, 1, 1, 1],
]

let scale = 60;

{ // controls
	document.addEventListener("keydown", (e) => {
		switch (e.code) {
			case "KeyW": movup = true; break;
			case "KeyS": movdn = true; break;
			case "KeyA": movlt = true; break;
			case "KeyD": movrt = true; break;
		}
	});

	document.addEventListener("keyup", (e) => {
		switch (e.code) {
			case "KeyW": movup = false; break;
			case "KeyS": movdn = false; break;
			case "KeyA": movlt = false; break;
			case "KeyD": movrt = false; break;
		}
	});
}

// rendering and physics
let ctx = canvas.getContext("2d");
ctx.lineWidth = 2;
ctx.font = "1em Arial";

(function frame() {
	window.requestAnimationFrame(frame);

	ctx.fillStyle = "#161621";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	{ // movement
		if (movup) y += 1 * playerSpeed;
		if (movdn) y -= 1 * playerSpeed;
		if (movlt) x += 1 * playerSpeed;
		if (movrt) x -= 1 * playerSpeed;
	}

	{ // show map
		ctx.fillStyle = "#aaa";

		for (let i = 0; i < map.length; i++) {
			for (let j = 0; j < map[i].length; j++) {
				if (map[i][j] == 1) {
					ctx.fillRect(j * scale + x, i * scale + y, scale, scale);
				}
			}
		}
	}

	// show player
	ctx.fillStyle = "#ddd";
	ctx.ellipse(canvas.width / 2 - scale / 4, canvas.height / 2 - scale / 4, scale / 2, scale / 2, 0, 0, Math.PI * 2);
	ctx.fill();
})();
