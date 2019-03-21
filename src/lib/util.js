{ // contain stuff
	let _id = 0;

	let Point = class {
		constructor(x, y, isSize = false) {
			if (isSize) {
				this.w = x;
				this.h = y;
			} else {
				this.x = x;
				this.y = y;
			}
		}
	}

	let Entity = class {
		constructor(x, y, w, h, options = {}) {
			this.id = NextID();
			this.label = options.label || "entity";
			this.angle = options.angle || 0;
			this.position = new Point(x, y);
			this.size = new Point(w, h, true);

			if (options.render) {
				let ro = options.render;

				this.render = {
					"shape": ro.shape || "circle",
					"color": ro.color || "#f00",
					"sprite": ro.sprite || undefined,
					"action": ro.action || (() => {}),
				}
			} else {
				this.render = {
					"shape": "circle",
					"color": "#f00",
					"sprite": undefined,
					"action": () => {},
				}
			}

			this.events = [];
		}

		toString() {
			return this.label;
		}

		/**
		 * Add an event listener.
		 * @param {"frame"} event
		 * @param {() => {}} callback 
		 */
		on(event, callback) {
			this.events.push({
				event: event,
				callback: callback,
			});
		}

		/**
		 * Call all event listeners of an event.
		 * @param {"frame"} event
		 */
		emit(event, options = {}) {
			let result;

			this.events.forEach((e) => {
				if (e.event == event) {
					result = e.callback(options);
				}
			});

			return result;
		}
	}

	let pathToPoints = (p) => {
		let path = [];

		p.forEach((x) => {
			let y = x.split(" ").map(v => parseInt(v));
			path.push(new Point(y[0], y[1]));
		});

		return path;
	}

	let comparePoints = (p1, p2) => {
		if (p1.w) {
			return p1.w == p2.w && p1.h == p2.h;
		} else {
			return p1.x == p2.x && p1.y == p2.y;
		}
	}

	let last = (a) => {
		return a[a.length - 1]
	}

	let toDeg = (rad) => {
		return rad * (180 / Math.PI);
	}
	
	let toRad = (deg) => {
		return deg * (Math.PI / 180);
	}

	let NextID = () => {
		return _id++;
	}

	function require(module) {
		switch (module) {
			case "util": {
				return {
					NextID: NextID,
					toDeg: toDeg,
					toRad: toRad,
					last: last,
					pathToPoints: pathToPoints,
					comparePoints: comparePoints,
					Entity: Entity,
					Point: Point,
				}
			} break;

			default: {
				throw new Error(`Invalid Module; Cannot find "${module}" module.`);
			}
		}
	}
}
