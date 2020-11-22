import Framework, { STATE, ATTR } from './framework';
import { enableGesture } from '../gesture/index';

export { STATE, ATTR } from './framework';

export default class Button extends Framework.Component {
	constructor() {
		super();
	}
	render() {
		this.childContainer = <span>dsadasd</span>;
		this.root = (<div>{this.childContainer}</div>).render();
		return this.root;
	}

	appendChild(child) {
		if (!this.childContainer) this.render();

		this.childContainer.appendChild(child);
	}
}
