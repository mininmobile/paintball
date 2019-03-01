{ // contain stuff
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
		constructor(x, y, w, h, options) {
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

	function require(module) {
		switch (module) {
			case "util": {
				return {
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
