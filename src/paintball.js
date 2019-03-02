const util = require("util");

let canvas = document.createElement("canvas");
canvas.width = document.children[0].scrollWidth;
canvas.height = document.children[0].scrollHeight;
document.body.appendChild(canvas);

// render options variable
let scale = 60;

// movement variabled
let velx = 0;
let vely = 0;
let playerSpeed = 4;
let movforce = 0.3;
let movlt = false;
let movrt = false;
let movup = false;
let movdn = false;

// position variables
let x = 0;
let y = 0;
let lastx = x;
let lasty = y;

// mouse object
let mouse = new util.Point(0, 0);
document.addEventListener("mousemove", (e) => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
});

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

let entities = [
	new util.Entity(scale * 2, scale * 2, scale / 1.25, scale / 1.25),
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
		let playerx = canvas.width / 2 - scale / 2.5;
		let playery = canvas.height / 2 - scale / 2.5;
		let playerr = (scale / 2.5) * 2;

		{ // x movement
			x = Math.round(x + velx);
			
			let d = isColliding("x", playerx, playery, playerr, playerr);

			if (d == "x")
				x -= Math.round(velx);
		}

		{ // y movement
			y = Math.round(y + vely);

			let d = isColliding("y", playerx, playery, playerr, playerr);

			if (d == "y")
				y -= Math.round(vely);
		}
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

	{ // show entities
		entities.forEach((e) => {
			switch (e.render.shape) {
				case "circle": {
					ctx.beginPath();
					ctx.ellipse(e.position.x + e.size.w / 2 + x, e.position.y + e.size.h / 2 + y, e.size.w / 2, e.size.h / 2, 0, 0, Math.PI * 2);
				} break;
			}

			ctx.fillStyle = e.render.color;
			ctx.fill();
		});
	}

	// show player
	ctx.fillStyle = "#ddd";
	ctx.beginPath();
	ctx.ellipse(canvas.width / 2, canvas.height / 2, scale / 2.5, scale / 2.5, 0, 0, Math.PI * 2);
	ctx.fill();
})();

function isColliding(d = "b", ex, ey, ew, eh) {
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[i].length; j++) {
			if (map[i][j] == 1) {
				let blockx = j * scale + x;
				let blocky = i * scale + y;
				ctx.strokeRect(blockx, blocky, scale, scale);

				if (((ex > blockx && ex < blockx + scale) &&
				     (ey > blocky && ey < blocky + scale)) || 
				    ((ex + ew > blockx && ex + ew < blockx + scale) &&
				     (ey + eh > blocky && ey + eh < blocky + scale))) {
					if (d == "x") return "x";
					if (d == "y") return "y";
					if (d == "b") return "b";
				}
			}
		}
	}

	for (let i = 0; i < entities.length; i++) {
		let e = entities[i];

		let entityx = e.position.x + x;
		let entityy = e.position.y + y;
		let entityw = e.size.w;
		let entityh = e.size.h;

		if (((ex > entityx && ex < entityx + entityw) &&
		     (ey > entityy && ey < entityy + entityh)) || 
		    ((ex + ew > entityx && ex + ew < entityx + entityw) &&
		     (ey + eh > entityy && ey + eh < entityy + entityh))) {
			if (d == "x") return "x";
			if (d == "y") return "y";
			if (d == "b") return "b";
		}
	}
}

function angle(cx, cy, ex, ey) {
	return Math.atan2(ey - cy, ex - cx);
}
