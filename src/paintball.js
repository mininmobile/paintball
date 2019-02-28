let canvas = document.createElement("canvas");
canvas.width = document.children[0].scrollWidth;
canvas.height = document.children[0].scrollHeight;
document.body.appendChild(canvas);

// render options variable
let scale = 60;

// movement variabled
let velx = 0;
let vely = 0;
let playerSpeed = 2;
let movforce = 0.1;
let movlt = false;
let movrt = false;
let movup = false;
let movdn = false;

// position variables
let x = canvas.width / 2 - scale * 1.7;
let y = canvas.height / 2 - scale * 1.7;

// map variables
let map = [
	[1, 1, 1, 1, 1],
	[1, 0, 0, 0, 1],
	[1, 1, 1, 0, 1],
	[1, 0, 0, 0, 1],
	[1, 1, 1, 1, 1],
]

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

		x = Math.round(x + velx);
		y = Math.round(y + vely);
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
	ctx.beginPath();
	ctx.ellipse(canvas.width / 2 - scale / 5, canvas.height / 2 - scale / 5, scale / 2.5, scale / 2.5, 0, 0, Math.PI * 2);
	ctx.fill();
})();

function isColliding() {

}
