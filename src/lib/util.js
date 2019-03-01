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
			this.position = new Point(x, y);
			this.size = new Point(w, h, true);
			this.angle = options.angle || 0;

			this.render = options.render || {
				"shape": "circle",
				"color": "#f00",
				"sprite": undefined,
			}
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
