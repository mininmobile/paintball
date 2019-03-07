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
			
			this.velocity = new Point(0, 0);
			this.maxVelocity = options.maxVelocity || 4;
			this.friction = options.friction || 0.3;

			this.render = options.render || {
				"shape": "circle",
				"color": "#f00",
				"sprite": undefined,
			}

			this.events = [];

			this.on("frame", () => {
				let vel = this.velocity;

				this.position.x += Math.round(vel.x);
				this.position.y += Math.round(vel.y);

				if (vel.x != 0) {
					if (vel.x < 0)
						vel.x += this.friction;
					
					if (vel.x > 0)
						vel.x -= this.friction;
				}

				if (vel.y != 0) {
					if (vel.y < 0)
						vel.y += this.friction;

					if (vel.y > 0)
						vel.y -= this.friction;
				}

				if (vel.y < -this.maxVelocity) vel.y = -this.maxVelocity;
				if (vel.y > this.maxVelocity) vel.y = this.maxVelocity;
				if (vel.x < -this.maxVelocity) vel.x = -this.maxVelocity;
				if (vel.x > this.maxVelocity) vel.x = this.maxVelocity;
			});
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

	let NextID = () => {
		return _id++;
	}

	function require(module) {
		switch (module) {
			case "util": {
				return {
					NextID: NextID,
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
