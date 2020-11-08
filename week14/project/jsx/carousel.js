import Framework from './framework';

export default class Carousel extends Framework.Component {
	constructor() {
		super();
		this.attributes = Object.create(null);
	}
	setAttribute(name, value) {
		this.attributes[name] = value;
	}
	mountTo(parent) {
		parent.appendChild(this.render());
	}
	render() {
		this.root = document.createElement('div');
		this.root.classList.add('carousel');
		for (let s of this.attributes['src']) {
			let child = document.createElement('div');
			child.style.backgroundImage = `url('${s}')`;
			this.root.appendChild(child);
		}
		this.provideMouseScrollingAdvanced();
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
