const createElement = (type, attributes, ...children) => {
	let element;
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

	for (let child of children) {
		if (typeof child === 'string') {
			child = new TextWrapper(child);
		}
		element.appendChild(child);
	}
	return element;
};

class Component {
	constructor() {
		//this.root = this.render();
	}

	setAttribute(name, value) {
		this.root.setAttribute(name, value);
	}
	appendChild(child) {
		//this.root.appendChild(child);
		child.mountTo(this.root);
	}
	mountTo(parent) {
		parent.appendChild(this.root);
	}
}

class ElementWrapper extends Component {
	constructor(type) {
		this.root = document.createElement(type);
	}
}

class TextWrapper extends Component {
	constructor(content) {
		this.root = document.createTextNode(content);
	}
}

export default {
	createElement,
	TextWrapper,
	ElementWrapper,
	Component
};
