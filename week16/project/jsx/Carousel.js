import Framework, { STATE, ATTR } from './framework';
import { enableGesture } from '../gesture/index';
import { Timeline, Animation } from './animation';
import { ease } from './cubic-bezier/index';

export { STATE, ATTR } from './framework';

export default class Carousel extends Framework.Component {
	constructor() {
		super();
	}

	render() {
		this.root = document.createElement('div');
		this.root.classList.add('carousel');
		console.log(this[ATTR].src);
		for (let s of this[ATTR].src) {
			let child = document.createElement('div');
			child.style.backgroundImage = `url('${s.img}')`;
			this.root.appendChild(child);
		}
		enableGesture(this.root);
		this[STATE] = {
			position: 0
		};

		let timeline = new Timeline();
		let t = 0;
		let ax = 0;
		let handler = null;
		let children = this.root.children;

		timeline.start();

		let handlerCb = () => {
			let children = this.root.children;

			let nextIndex = (this[STATE].position + 1) % children.length;
			let current = children[this[STATE].position];
			let next = children[nextIndex];

			t = Date.now();

			timeline.add(
				new Animation(
					current.style,
					'transform',
					-this[STATE].position * 500,
					-500 - this[STATE].position * 500,
					1500,
					0,
					ease,
					v => `translateX(${v}px)`
				)
			);

			timeline.add(
				new Animation(
					next.style,
					'transform',
					500 - nextIndex * 500,
					-nextIndex * 500,
					1500,
					0,
					ease,
					v => `translateX(${v}px)`
				)
			);
			this[STATE].position = nextIndex;
			this.triggerEvent('Change', { position: this[STATE].position });
		};

		this.root.addEventListener('tap', e => {
			this.triggerEvent('Click', {
				position: this[STATE].position,
				data: this[ATTR].src[this[STATE].position]
			});
		});

		this.root.addEventListener('start', e => {
			timeline.pause();
			clearInterval(handler);
			if (Date.now - t < 1500) {
				let progress = (Date.now() - t) / 1500;
				ax = ease(progress) * 500 - 500;
			} else {
				ax = 0;
			}
		});

		this.root.addEventListener('pan', event => {
			let x = event.clientX - event.startX - ax;
			let current = this[STATE].position - Math.round((x - (x % 500)) / 500);
			//reorder the frame
			for (let offset of [-1, 0, 1]) {
				let pos = current + offset;
				pos = (pos + children.length + children.length) % children.length;
				children[pos].style.transition = 'none';
				children[pos].style.transform = `translateX(${-pos * 500 +
					offset * 500 +
					(x % 500)}px)`;
			}
		});

		this.root.addEventListener('end', event => {
			timeline.reset();
			timeline.start();
			handler = setInterval(handlerCb, 3000);

			let x = event.clientX - event.startX - ax;
			let current = this[STATE].position - Math.round((x - (x % 500)) / 500);
			let direction = Math.round((x % 500) / 500);

			if (event.isFlick) {
				if (event.velocity > 0) {
					direction = Math.floor((x % 500) / 500);
				} else {
					direction = Math.ceil((x % 500) / 500);
				}
			}

			//reorder the frame
			for (let offset of [-1, 0, 1]) {
				let pos = current + offset;
				pos = ((pos % children.length) + children.length) % children.length;
				children[pos].style.transition = 'none';
				//children[pos].style.transform = `translateX(${-pos * 500 +offset * 500 + direction * 500}px)`;
				timeline.add(
					new Animation(
						children[pos].style,
						'transform',
						-pos * 500 + offset * 500 + (x % 500),
						-pos * 500 + offset * 500 + direction * 500,
						1500,
						0,
						ease,
						v => `translateX(${v}px)`
					)
				);
			}

			this[STATE].position =
				this[STATE].position - (x - (x % 500)) / 500 - direction;
			this[STATE].position =
				((this[STATE].position % children.length) + children.length) %
				children.length;
			this.triggerEvent('Change', { position: this[STATE].position });
		});

		handler = setInterval(handlerCb, 3000);

		//this.provideMouseScrollingAdvanced();
		return this.root;
	}

	provideMouseScrollingAdvanced() {
		const children = this.root.children;
		let baseX = 0;

		this.root.addEventListener('mousedown', e => {
			let startX = e.clientX;
			const moveHandler = mEvnt => {
				let offsetX = mEvnt.clientX - startX;
				let current = baseX - Math.round((offsetX - (offsetX % 500)) / 500);

				for (let offset of [-1, 0, 1]) {
					let pos = current + offset;
					pos = (pos + children.length) % children.length;

					children[pos].style.transition = 'none';
					children[pos].style.transform = `translateX(${-pos * 500 +
						offset * 500 +
						(offsetX % 500)}px)`;
				}
			};

			const upHandler = event => {
				let offsetX = event.clientX - startX;
				baseX = baseX - Math.round(offsetX / 500);

				const next = -Math.sign(
					Math.round(offsetX / 500) - offsetX + 250 * Math.sign(offsetX)
				);
				for (let offset of [0, next]) {
					let pos = baseX + offset;
					pos = (pos + children.length) % children.length;

					children[pos].style.transition = '';
					children[pos].style.transform = `translateX(${-pos * 500 +
						offset * 500}px)`;
				}

				document.removeEventListener('mousemove', moveHandler);
				document.removeEventListener('mouseup', upHandler);
			};

			document.addEventListener('mousemove', moveHandler);
			document.addEventListener('mouseup', upHandler);
		});
	}

	provideMouseScrolling() {
		let children = this.root.children;
		let baseX = 0;

		this.root.addEventListener('mousedown', e => {
			let startX = e.clientX;
			const moveHandler = event => {
				let offsetX = event.clientX - startX;
				//let offsetY = event.clientY - startY;
				for (let child of children) {
					// one screen can only show 2 element, we dont need loop
					child.style.transition = 'none';
					child.style.transform = `translateX(${-baseX * 500 + offsetX}px)`;
				}
			};

			const upHandler = event => {
				let offsetX = event.clientX - startX;
				baseX = baseX - Math.round(offsetX / 500);
				if (baseX < 0) baseX = 0;
				if (baseX >= children.length) baseX = children.length - 1;
				console.log('o', offsetX, 'b', baseX);
				for (let child of children) {
					child.style.transition = '';
					child.style.transform = `translateX(${-baseX * 500}px)`;
				}
				document.removeEventListener('mousemove', moveHandler);
				document.removeEventListener('mouseup', upHandler);
			};

			document.addEventListener('mousemove', moveHandler);
			document.addEventListener('mouseup', upHandler);
		});
	}

	provideAutoScrolling() {
		let currentIndex = 0;
		setInterval(() => {
			let children = this.root.children;
			let nextIndex = (currentIndex + 1) % children.length;

			let current = children[currentIndex];
			let next = children[nextIndex];

			next.style.transition = 'none';
			next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

			setTimeout(() => {
				next.style.transition = ''; //set back to default html define
				current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
				next.style.transform = `translateX(${-nextIndex * 100}%)`;
				currentIndex = nextIndex;
			}, 16);
		}, 3000);
	}
}
