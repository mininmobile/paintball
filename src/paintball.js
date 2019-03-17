const util = require("util");

class Enemy extends util.Entity {
	constructor(x, y, options = {}) {
		super(x, y, scale / 1.25, scale / 1.25, options);

		this.maxHealth = options.health || 1;
		this.health = options.health || 1;

		this.on("shot", (bullet) => {
			this.health--;

			return this.health <= 0;
		});
	}
}

class Weapon {
	constructor(name, magammo, allammo, callback, interval = undefined) {
		this.name = name;
		this.callback = callback;

		this.currentmagammo = magammo;
		this.currentallammo = allammo;
		this.magammo = magammo;
		this.allammo = allammo;

		this.interval = interval;

		this.reloading = false;
	}

	shootBullet() {
		if (this.canShoot()) {
			this.currentmagammo--;
			spawn(this.callback());
		}

		if (this.canReload() && !this.canShoot()) {
			this.reload();
		}
	}

	shoot() {
		if (this.interval) {
			shooting = setInterval(() => this.shootBullet(), this.interval);
		} else {
			this.shootBullet();
		}
	}

	reload() {
		this.reloading = true;

		setTimeout(() => {
			this.currentmagammo = this.magammo;
			this.currentallammo -= this.magammo;
			this.reloading = false;
		}, 1000);
	}

	canShoot() {
		return this.currentmagammo > 0;
	}

	canReload() {
		return this.currentallammo > 0 && !this.reloading;
	}
}

class Bullet extends util.Entity {
	constructor(angle) {
		super(canvas.width / 2, canvas.height / 2, 5, 5, {
			label: "bullet",
			angle: angle,
		});

		this.on("frame", (e) => {
			e.position.x += 8 * Math.cos(e.angle);
			e.position.y += 8 * Math.sin(e.angle);

			let target = isColliding([new util.Point(e.position.x, e.position.y)]);
			
			if (target) {
				let ents = entities.filter(ent => ent != e);

				if (typeof target == "number") {
					// bullet decal or smth
				} else {
					let dead = target.emit("shot", e);

					if (dead)
						ents = ents.filter(ent => ent != target);
				}

				return ents;
			}
		});
	}
}

let canvas = document.createElement("canvas");
canvas.width = document.children[0].scrollWidth;
canvas.height = document.children[0].scrollHeight;
document.body.appendChild(canvas);

// temporary data
let shooting;

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

// render option variables
let scale = 60;

// player variables
let selectedWeapon = 0;
let weapons = [
	new Weapon("Pistol", 30, 240, () => {
		let bullet = new Bullet(angle(canvas.width / 2, canvas.height / 2, mouse.x, mouse.y));

		return bullet;
	}),
	new Weapon("Shotgun", 30, 240, () => {
		let bulletA = new Bullet(angle(canvas.width / 2, canvas.height / 2, mouse.x, mouse.y) - util.toRad(15));
		let bulletB = new Bullet(angle(canvas.width / 2, canvas.height / 2, mouse.x, mouse.y));
		let bulletC = new Bullet(angle(canvas.width / 2, canvas.height / 2, mouse.x, mouse.y) + util.toRad(15));

		return [bulletA, bulletB, bulletC];
	}),
	new Weapon("Rifle", 30, 240, () => {
		let bullet = new Bullet(angle(canvas.width / 2, canvas.height / 2, mouse.x, mouse.y));

		return bullet;
	}, 50),
]

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
	new Enemy(scale * 2, scale * 2, { health: 10 }),
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

			case "Digit1": selectWeapon(0); break;
			case "Digit2": selectWeapon(1); break;
			case "Digit3": selectWeapon(2); break;
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

	document.addEventListener("mousedown", (e) => {
		weapons[selectedWeapon].shoot();
	});

	document.addEventListener("mouseup", (e) => {
		clearInterval(shooting);
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
		let cpoints = [
			new util.Point(canvas.width / 2 - scale / 2.5, canvas.height / 2 - scale / 2.5),
			new util.Point(canvas.width / 2 + scale / 2.5, canvas.height / 2 - scale / 2.5),
			new util.Point(canvas.width / 2 - scale / 2.5, canvas.height / 2 + scale / 2.5),
			new util.Point(canvas.width / 2 + scale / 2.5, canvas.height / 2 + scale / 2.5),
		];

		{ // x movement
			x = Math.round(x + velx);

			if (isColliding(cpoints))
				x -= Math.round(velx);
		}

		{ // y movement
			y = Math.round(y + vely);

			if (isColliding(cpoints))
				y -= Math.round(vely);
		}
	}

	{ // calculate entity movement
		let ents = entities;

		for (let i = 0; i < entities.length; i++) {
			let e = entities[i];

			let newents = e.emit("frame", e);

			if (newents) ents = newents;
		}
		
		entities = ents;
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

					if (e.label != "bullet")
						ctx.ellipse(e.position.x + e.size.w / 2 + x, e.position.y + e.size.h / 2 + y, e.size.w / 2, e.size.h / 2, 0, 0, Math.PI * 2);
					if (e.label == "bullet")
						ctx.ellipse(e.position.x, e.position.y, e.size.w / 2, e.size.h / 2, 0, 0, Math.PI * 2);
				} break;
			}

			ctx.fillStyle = e.render.color;
			ctx.fill();

			if (e.label != "bullet" && e.maxHealth != e.health) {
				ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
				ctx.fillRect(e.position.x + x, e.position.y + y - em(0.8), e.size.w, em(0.5));

				ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
				ctx.fillRect(e.position.x + x, e.position.y + y - em(0.8), (e.size.w / e.maxHealth) * e.health, em(0.5));
			}
		});
	}

	{ // display weapon info
		weapons.forEach((w, i) => {
			if (i == selectedWeapon) {
				ctx.fillStyle = "#ddd";
				ctx.fillRect(em(), em() + (em() * i * 2), 240, em() * 2);
				ctx.fillStyle = "#161621";
				ctx.fillText(`${w.name} (${w.currentmagammo} / ${w.currentallammo})`, em() * 1.5, (em() * 2.4) + (em() * i * 2));
			} else {
				ctx.fillStyle = "#ddd";
				ctx.fillText(`${w.name} (${w.currentmagammo} / ${w.currentallammo})`, em() * 1.5, (em() * 2.4) + (em() * i * 2));
			}
		});
	}

	// show player
	ctx.fillStyle = "#ddd";
	ctx.beginPath();
	ctx.ellipse(canvas.width / 2, canvas.height / 2, scale / 2.5, scale / 2.5, 0, 0, Math.PI * 2);
	ctx.fill();
})();

function isColliding(points) {
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[i].length; j++) {
			if (map[i][j] == 1) {
				let blockx = j * scale + x;
				let blocky = i * scale + y;

				let colliding = false;

				points.forEach((p) => {
					if ((p.x >= blockx && p.x <= blockx + scale) &&
						(p.y >= blocky && p.y <= blocky + scale)) {
						colliding = true;
					}
				});

				if (colliding) return map[i][j];
			}
		}
	}

	for (let i = 0; i < entities.length; i++) {
		let e = entities[i];

		let colliding = false;

		points.forEach((p) => {
			if ((p.x >= e.position.x + x && p.x <= e.position.x + e.size.w + x) &&
				(p.y >= e.position.y + y && p.y <= e.position.y + e.size.h + y)) {
				colliding = true;
			}
		});

		if (colliding) return e;
	}
}

function spawn(e) {
	if (e[0]) {
		e.forEach(ent => entities.push(ent));
	} else {
		entities.push(e);
	}
}

function angle(cx, cy, ex, ey) {
	return Math.atan2(ey - cy, ex - cx);
}

function em(x = 1) {
	return x * parseFloat(getComputedStyle(document.body).fontSize);
}

function selectWeapon(ipos) {
	// ipos = inventory position
	selectedWeapon = ipos;
}

// fuck lenovo and their shitty keyboards
// fuck 'em
