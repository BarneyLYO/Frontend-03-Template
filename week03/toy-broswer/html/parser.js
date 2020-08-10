const EOF = Symbol('EOF');
const ENGLISH_CHAR = /^[a-zA-Z]$/;
const EMPTY_CHAR = /^[\t\n\f ]$/;

function data(c) {
	if (c === '<') {
		return tagOpen;
	}
	//
	else if (c === EOF) {
		return;
	}
	//
	else {
		return data;
	}
}

function tagOpen(c) {
	if (c === '/') {
		return endTagOpen;
	}
	//
	else if (c.match(ENGLISH_CHAR)) {
		return tagName(c);
	}
	//
	else {
		return;
	}
}

function endTagOpen(c) {
	if (c.match(ENGLISH_CHAR)) {
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
		return tagName;
	}
	//
	else if (c === '>') {
		return data;
	}
	//
	else {
		return tagName;
	}
}

function beforeAttributeName(c) {
	if (c.match(EMPTY_CHAR)) {
		return beforeAttributeName;
	}
	//
	else if (c === '>') {
		return data;
	}
	//
	else if (c === '=') {
		return beforeAttributeName;
	}
	//
	else {
		return beforeAttributeName;
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
};
