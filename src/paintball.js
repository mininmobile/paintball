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

	let colliding = false;

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

		x = Math.round(x + velx);
		y = Math.round(y + vely);
	}

	{ // show map + calculate map collisions
		ctx.fillStyle = "#aaa";

		for (let i = 0; i < map.length; i++) {
			for (let j = 0; j < map[i].length; j++) {
				if (map[i][j] == 1) {
					let blockx = j * scale + x;
					let blocky = i * scale + y;

					ctx.fillRect(blockx, blocky, scale, scale);

					let playerx = canvas.width / 2 - scale / 2.5;
					let playery = canvas.height / 2 - scale / 2.5;
					let playerw = (scale / 2.5) * 2;
					let playerh = (scale / 2.5) * 2;
	
					if (((playerx > blockx && playerx < blockx + scale) &&
					     (playery > blocky && playery < blocky + scale)) || 
					    ((playerx + playerw > blockx && playerx + playerw < blockx + scale) &&
					     (playery + playerh > blocky && playery + playerh < blocky + scale))) {
							colliding = true;
						}
				}
			}
		}
	}

	// show player
	ctx.strokeStyle = "#f00";
	ctx.fillStyle = "#ddd";
	ctx.beginPath();
	ctx.ellipse(canvas.width / 2, canvas.height / 2, scale / 2.5, scale / 2.5, 0, 0, Math.PI * 2);
	ctx.fill();
	if (colliding) ctx.stroke();
})();

