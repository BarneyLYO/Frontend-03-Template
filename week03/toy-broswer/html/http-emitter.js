const { addCssRules, computeCSS } = require('../css');
let stack = [{ type: 'document', children: [] }];

function emit(token, currentTextNode) {
	let top = stack[stack.length - 1];

	if (token.type === 'startTag') {
		let element = {
			type: 'element',
			children: [],
			attributes: []
		};

		element.tagName = token.tagName;

		for (let p in token) {
			if (p !== 'type' && p !== 'tagName') {
				element.attributes.push({
					name: p,
					value: token[p]
				});
			}
		}
		computeCSS(element, stack);

		top.children.push(element);
		element.parent = top;

		if (!token.isSelfClosing) {
			stack.push(element);
		}

		currentTextNode = null;
	}
	//
	else if (token.type === 'endTag') {
		if (top.tagName !== token.tagName) {
			throw new Error('Tag start end doesnt match!');
		}
		//
		else {
			/* when encounter style tag, collect the css rules */
			if (top.tagName === 'style') {
				addCssRules(top.children[0].content);
			}
			stack.pop();
		}
		currentTextNode = null;
	}
	//
	else if (token.type === 'text') {
		if (currentTextNode === null) {
			currentTextNode = {
				type: 'text',
				content: ''
			};
			top.children.push(currentTextNode);
		}
		currentTextNode.content += token.content;
	}
}

function getRoot() {
	return stack[0];
}

module.exports = { emit, getRoot };
