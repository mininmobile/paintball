{ // contain stuff
	let _id = -1;

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

			this.render = options.render || {
				"shape": "circle",
				"color": "#f00",
				"sprite": undefined,
			}

			this.events = [];
		}

		toString() {
			return this.label;
		}

		/**
		 * Add an event listener.
		 * @param {"frame"} event
		 * @param {(event, error: string) => {}} callback 
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
