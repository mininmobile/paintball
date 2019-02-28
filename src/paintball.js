let canvas = document.createElement("canvas");
canvas.width = document.children[0].scrollWidth;
canvas.height = document.children[0].scrollHeight;
document.body.appendChild(canvas);

document.body.click();

// render options variable
let scale = 60;

// movement variabled
let velx = 0;
let vely = 0;
let playerSpeed = 3;
let movforce = 0.2;
let movlt = false;
let movrt = false;
let movup = false;
let movdn = false;

// position variables
let x = 0;
let y = 0;

let lastx = x;
let lasty = y;

// map variables
let map = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
	[1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

{ // initialize
	{ // map ignition
		for (let i = 0; i < map.length; i++) {
			for (let j = 0; j < map[i].length; j++) {
				let blockx = j * scale;
				let blocky = i * scale;

				switch (map[i][j]) {
					case 2: {
						x = canvas.width / 2 - blockx - scale / 2;
						y = canvas.height / 2 - blocky - scale / 2;
					} break;
				}
			}
		}
	}
}

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

	{ // calculate player movement
		velx += movlt ? movforce : -movforce;
		velx += movrt ? -movforce : movforce;
		vely += movup ? movforce : -movforce;
		vely += movdn ? -movforce : movforce;

		if (velx > playerSpeed) velx = playerSpeed;
		if (velx < -playerSpeed) velx = -playerSpeed;
		if (vely > playerSpeed) vely = playerSpeed;
		if (vely < -playerSpeed) vely = -playerSpeed;

		velx = Math.round(velx * 10) / 10;
		vely = Math.round(vely * 10) / 10;

		if (!movlt && !movrt && velx != 0) {
			if (velx < 0)
				velx += movforce;
			
			if (velx > 0)
				velx -= movforce;
		}

		if (!movup && !movdn && vely != 0) {
			if (vely < 0)
				vely += movforce;

			if (vely > 0)
				vely -= movforce;
		}

		lastx = x;
		lasty = y;
		x = Math.round(x + velx);
		isColliding("x");
		y = Math.round(y + vely);
		isColliding("y");
	}

	{ // show map
		for (let i = 0; i < map.length; i++) {
			for (let j = 0; j < map[i].length; j++) {
				let blockx = j * scale + x;
				let blocky = i * scale + y;

				switch (map[i][j]) {
					case 1: {
						ctx.fillStyle = "#aaa";
						ctx.fillRect(blockx, blocky, scale, scale);
					} break;

					case 2: {
						ctx.fillStyle = "#0a0";
						ctx.fillRect(blockx, blocky, scale, scale);
					} break;
				}
			}
		}
	}

	// show player
	ctx.fillStyle = "#ddd";
	ctx.beginPath();
	ctx.ellipse(canvas.width / 2, canvas.height / 2, scale / 2.5, scale / 2.5, 0, 0, Math.PI * 2);
	ctx.fill();
})();

function isColliding(d = "b") {
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[i].length; j++) {
			if (map[i][j] == 1) {
				let blockx = j * scale + x;
				let blocky = i * scale + y;

				let playerx = canvas.width / 2 - scale / 2.5;
				let playery = canvas.height / 2 - scale / 2.5;
				let playerw = (scale / 2.5) * 2;
				let playerh = (scale / 2.5) * 2;

				if (((playerx > blockx && playerx < blockx + scale) &&
					 (playery > blocky && playery < blocky + scale)) || 
					((playerx + playerw > blockx && playerx + playerw < blockx + scale) &&
					 (playery + playerh > blocky && playery + playerh < blocky + scale))) {
						if (d == "b" || d == "x") x -= Math.round(velx);
						if (d == "b" || d == "y") y -= Math.round(vely);
					}
			}
		}
	}
}
