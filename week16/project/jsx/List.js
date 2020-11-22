import Framework, { STATE, ATTR } from './framework';
import { enableGesture } from '../gesture/index';

export { STATE, ATTR } from './framework';

export default class List extends Framework.Component {
	constructor() {
		super();
	}
	render() {
		this.children = this[ATTR].data.map(this.template);
		this.root = (<div>{this.children}</div>).render();
		return this.root;
	}

	appendChild(child) {
		this.template = child;
		this.render();
	}
}
