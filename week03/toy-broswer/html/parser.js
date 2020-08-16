const EOF = Symbol('EOF');
const ENGLISH_CHAR = /^[a-zA-Z]$/;
const EMPTY_CHAR = /^[\t\n\f ]$/;
const SINGLE_QUOTE = `\'`;

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

let stack = [{ type: 'document', children: [] }];

function emit(token) {
	let top = stack[stack.length - 1];

	if (token.type === 'startTag') {
		let element = {
			type: 'element',
			children: [],
			attribute: []
		};

		element.tagName = token.tagName;

		for (let p in token) {
			if (p !== 'type' && p !== 'tagName') {
				element.attribute.push({
					name: p,
					value: token[p]
				});
			}
		}

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

function data(c) {
	if (c === '<') {
		//< found and goes to the tagOpen state
		return tagOpen;
	}
	//
	else if (c === EOF) {
		emit({
			type: 'EOF'
		});
		return;
	}
	//
	else {
		emit({
			type: 'text',
			content: c
		});
		return data;
	}
}
//lexical analize
function tagOpen(c) {
	if (c === '/') {
		// found the tag end
		return endTagOpen;
	}
	//
	else if (c.match(ENGLISH_CHAR)) {
		currentToken = {
			type: 'startTag',
			tagName: ''
		};
		// we get tag name when encounter english word
		return tagName(c);
	}
	//
	else {
		return;
	}
}

function endTagOpen(c) {
	if (c.match(ENGLISH_CHAR)) {
		currentToken = {
			type: 'endTag',
			tagName: ''
		};
		return tagName(c);
	}
	//
	else if (c === '>') {
	}
	//
	else if (c === EOF) {
	}
	//
	else {
	}
}

function tagName(c) {
	if (c.match(EMPTY_CHAR)) {
		return beforeAttributeName;
	}
	//
	else if (c === '/') {
		return selfClosingStartTag;
	}
	//
	else if (c.match(ENGLISH_CHAR)) {
		currentToken.tagName += c;
		return tagName;
	}
	//
	else if (c === '>') {
		emit(currentToken);
		return data;
	}
	//
	else {
		currentToken.tagName += c; //TODOs: check
		return tagName;
	}
}

function beforeAttributeName(c) {
	if (c.match(EMPTY_CHAR)) {
		return beforeAttributeName;
	}
	//
	else if (c === '/' || c === '>' || c === EOF) {
		return afterAttributeName(c);
	}
	//
	else if (c === '=') {
	}
	//
	else {
		currentAttribute = {
			name: '',
			value: ''
		};
		return attributeName(c);
	}
}

function attributeName(c) {
	if (c.match(EMPTY_CHAR) || c === '/' || c === '>' || c === EOF) {
		return afterAttributeName(c);
	}
	//
	else if (c === '=') {
		return beforeAttributeValue;
	}
	//
	else if (c === '\u0000') {
	}
	//
	else if (c === '"' || c === "'" || c === '<') {
	}
	//
	else {
		currentAttribute.name += c;
		return attributeName;
	}
}

function afterAttributeName(c) {}

function beforeAttributeValue(c) {
	if (c.match(EMPTY_CHAR) || c === '/' || c === '>' || c === EOF) {
		return beforeAttributeValue;
	}
	//
	else if (c === '"') {
		return doubleQuotedAttributeValue;
	}
	//
	else if (c === "'") {
		return singleQuotedAttributeValue;
	}
	//
	else if (c === '>') {
		console.log('before attribute', c);
	}
	//
	else {
		return UnquotedAttributeValue(c);
	}
}

function doubleQuotedAttributeValue(c) {
	if (c === '"') {
		currentToken[currentAttribute.name] = currentAttribute.value;
		return afterQuotedAttributeValue;
	}
	//
	else if (c === '\u0000') {
	}
	//
	else if (c === EOF) {
	}
	//
	else {
		currentAttribute.value += c;
		return doubleQuotedAttributeValue;
	}
}

function singleQuotedAttributeValue(c) {
	if (c === SINGLE_QUOTE) {
		currentToken[currentAttribute.name] = currentAttribute.value;
		return afterQuotedAttributeValue;
	}
	//
	else if (c === '\u0000') {
	}
	//
	else if (c === EOF) {
	}
	//

	//
	else {
		currentAttribute.value += c;
		return singleQuotedAttributeValue;
	}
}

function afterQuotedAttributeValue(c) {
	if (c.match(EMPTY_CHAR)) {
		return beforeAttributeName;
	}
	//
	else if (c === '/') {
		return selfClosingStartTag;
	}
	//
	else if (c === '>') {
		currentToken[currentAttribute.name] = currentAttribute.value;
		emit(currentToken);
		return data;
	}
	//
	else if (c === EOF) {
	}
	//
	else {
		currentAttribute.value += c;
		return doubleQuotedAttributeValue;
	}
}

function UnquotedAttributeValue(c) {
	if (c.match(EMPTY_CHAR)) {
		currentToken[currentAttribute.name] = currentAttribute.value;
		return beforeAttributeName;
	}
	//
	else if (c === '/') {
		currentToken[currentAttribute.name] = currentAttribute.value;
		return selfClosingStartTag;
	}
	//
	else if (c === '>') {
		currentToken[currentAttribute.name] = currentAttribute.value;
		emit(currentToken);
		return data;
	}
	//
	else if (c === '\u0000') {
	}
	//
	else if (c === '"' || c === "'" || c === '<' || c === '=' || c === '`') {
	}
	//
	else if (c === EOF) {
	} else {
		currentAttribute.value += c;
		return UnquotedAttributeValue;
	}
}

function selfClosingStartTag(c) {
	if (c === '>') {
		currentToken.isSelfClosing = true;
		return data;
	}
	//
	else if (c === 'EOF') {
	}
	//
	else {
	}
}

module.exports.parseHTML = function parseHTML(html) {
	let state = data;
	for (let c of html) {
		state = state(c);
	}
	state = state(EOF);
	console.log(stack[0]);
};
