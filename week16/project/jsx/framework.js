const createElement = (type, attributes, ...children) => {
	let element;
	if (!type) throw new Error('type missing');

	if (typeof type === 'string') {
		//element = document.createElement(type);
		element = new ElementWrapper(type);
	}
	//
	else {
		element = new type();
	}

	for (let attr in attributes) {
		element.setAttribute(attr, attributes[attr]);
	}
	let processChildren = children => {
		for (let child of children) {
			if (typeof child === 'object' && child instanceof Array) {
				processChildren(child);
				continue;
			}

			if (typeof child === 'string') {
				child = new TextWrapper(child);
			}

			element.appendChild(child);
		}
	};

	processChildren(children);
	return element;
};
export const STATE = Symbol('state');
export const ATTR = Symbol('attr');

class Component {
	constructor() {
		this[ATTR] = Object.create(null);
		this[STATE] = Object.create(null);
	}

	setAttribute(name, value) {
		this[ATTR][name] = value;
	}
	appendChild(child) {
		//this.root.appendChild(child);
		child.mountTo(this.root);
	}
	mountTo(parent) {
		if (!this.root) this.render();
		parent.appendChild(this.root);
	}
	triggerEvent(type, args) {
		const typeAction = 'on' + type.replace(/^[\s\S]/, s => s.toUpperCase());
		if (!this[ATTR][typeAction]) {
			return;
		}
		this[ATTR][typeAction](new CustomEvent(type, { detail: args }));
	}
	render() {
		return this.root;
	}
}
class ElementWrapper extends Component {
	constructor(type) {
		super();
		this.root = document.createElement(type);
	}
	setAttribute(name, value) {
		this.root.setAttribute(name, value);
	}
}

class TextWrapper extends Component {
	constructor(content) {
		super();
		this.root = document.createTextNode(content);
	}
}

export default {
	createElement,
	TextWrapper,
	ElementWrapper,
	Component
};
