'use strict';
//listen => recognize => dispatch === event
// new listener(new recognize(dispatch))

//{cature, once,passive:能否preventdefault，同步触发或异步触发}

/*
touch事件 start以后一定会触发move在同一元素上， 不需要和mouse一样按下了才监听move和up
因为没有办法越过touchstart去触发touchmove
 e 有多个触点 e。changedTouches:{
clientX: 40.317710876464844
clientY: 115.36979675292969
force: 1
identifier: 0
pageX: 40.317710876464844
pageY: 115.36979675292969
radiusX: 15.333333015441895
radiusY: 15.333333015441895
rotationAngle: 0
screenX: 879.23828125
screenY: 232.52734375
target: body
}
*/

export class Dispatcher {
	constructor(element) {
		this.element = element;
	}
	dispatch(type, properties) {
		let event = new Event(type); //CustomEvent(type,{})
		Object.keys(properties).forEach(p => (event[p] = properties[p]));
		console.log(type, properties);
		this.element.dispatchEvent(event);
	}
}

export class Listener {
	constructor(element, recognizer) {
		this.isListeningMouse = false;
		this.contexts = new Map();
		this.initialMouseListener(element, recognizer);
		this.initialTouchListener(element, recognizer);
	}

	initialMouseListener(element, recognizer) {
		element.addEventListener('mousedown', e => {
			//e.button which button on mouse
			let ctx = Object.create(null);
			this.contexts.set('mouse' + (1 << e.button), ctx);
			recognizer.start(e, ctx);
			let mouseMove = e => {
				//e.buttons; //那些键， 掩码
				let button = 1;
				while (button <= e.buttons) {
					if (button & e.buttons) {
						let key; // in buttons 中建和右键顺序是反的
						switch (button) {
							case 2:
								key = 4;
								break;
							case 4:
								key = 2;
								break;
							default:
								key = button;
								break;
						}
						recognizer.move(e, this.contexts.get('mouse' + key));
					}
					button = button << 1;
				}
			};

			let mouseUp = e => {
				recognizer.end(e, this.contexts.get('mouse' + (1 << e.button)));
				this.contexts.delete('mouse' + (1 << e.button));
				if (this.contexts.size === 0) {
					document.removeEventListener('mousemove', mouseMove);
					document.removeEventListener('mouseup', mouseUp);
					this.isListeningMouse = false;
				}
			};
			if (!this.isListeningMouse) {
				document.addEventListener('mousemove', mouseMove);
				document.addEventListener('mouseup', mouseUp);
				this.isListeningMouse = true;
			}
		});
	}

	initialTouchListener(element, recognizer) {
		element.addEventListener('touchstart', e => {
			Array.from(e.changedTouches).forEach(i => {
				let ctx = Object.create(null);
				this.contexts.set(i.identifier, ctx);
				recognizer.start(i, ctx);
			});
		});

		element.addEventListener('touchmove', e => {
			Array.from(e.changedTouches).forEach(i =>
				recognizer.move(i, this.contexts.get(i.identifier))
			);
		});

		element.addEventListener('touchend', e => {
			Array.from(e.changedTouches).forEach(i => {
				recognizer.end(i, this.contexts.get(i.identifier));
				this.contexts.delete(i.identifier);
			});
		});
		//系统打断
		element.addEventListener('touchcancel', e => {
			Array.from(e.changedTouches).forEach(i => {
				recognizer.cancel(i, this.contexts.get(i.identifier));
				this.contexts.delete(i.identifier);
			});
		});
	}
}

export class Recognizer {
	static TAP = Symbol('TAP');
	static PAN = Symbol('PAN');
	static PRESS = Symbol('PRESS');
	static FLICK = Symbol('FLICK');

	constructor(dispatcher) {
		this.dispatcher = dispatcher;
	}

	start(point, context) {
		(context.startX = point.clientX), (context.startY = point.clientY);
		context.points = [{ t: Date.now(), x: point.clientX, y: point.clientY }];
		context.state = Recognizer.TAP;
		context.handler = setTimeout(() => {
			context.state = Recognizer.PRESS;
			clearTimeout(context.handler);
			context.handler = null;
			this.dispatcher.dispatch('press start', context);
		}, 500);
	}

	move(point, context) {
		let dx = point.clientX - context.startX,
			dy = point.clientY - context.startY;
		if (context.state !== Recognizer.PAN && dx ** 2 + dy ** 2 > 100) {
			context.state = Recognizer.PAN;
			context.isVertical = Math.abs(dx) < Math.abs(dy);
			this.dispatcher.dispatch('panstart', {
				startX: context.startX,
				startY: context.startY,
				clientX: point.clientX,
				clientY: point.clientY,
				isVertical: context.isVertical
			});
			clearTimeout(context.handler);
		}

		if (context.state === Recognizer.PAN) {
			this.dispatcher.dispatch('pan', {
				startX: context.startX,
				startY: context.startY,
				clientX: point.clientX,
				clientY: point.clientY,
				isVertical: context.isVertical
			});
		}

		context.points = context.points.filter(p => Date.now() - p.t < 500);

		context.points.push({
			t: Date.now(),
			x: point.clientX,
			y: point.clientY
		});
	}

	end(point, context) {
		switch (context.state) {
			case Recognizer.PAN:
				this.dispatcher.dispatch('panend', {
					startX: context.startX,
					startY: context.startY,
					clientX: point.clientX,
					clientY: point.clientY,
					isVertical: context.isVertical
				});
				break;
			case Recognizer.TAP:
				clearTimeout(context.handler);
				this.dispatcher.dispatch('tap', {});
				break;
			case Recognizer.PRESS:
				this.dispatcher.dispatch('pressend', context);
				break;
		}

		context.points = context.points.filter(p => Date.now() - p.t < 500);
		let v = 0;
		if (context.points.length) {
			let d =
				(point.clientX - context.points[0].x) ** 2 +
				(point.clientY - context.points[0].y) ** 2;
			d = Math.sqrt(d);
			v = d / (Date.now() - context.points[0].t);
		}

		if (v > 1.5) {
			context.state = Recognizer.FLICK;
			this.dispatcher.dispatch('flick', {
				startX: context.startX,
				startY: context.startY,
				clientX: point.clientX,
				clientY: point.clientY,
				isVertical: context.isVertical,
				velocity: v
			});
		}
	}

	cancel(point, context) {
		this.dispatcher.dispatch('cancel', {});
	}
}

export function enableGesture(element) {
	new Listener(element, new Recognizer(new Dispatcher(element)));
}

enableGesture(document.documentElement);
