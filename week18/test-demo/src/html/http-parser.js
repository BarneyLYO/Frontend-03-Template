const { emit, getRoot, clean } = require('./http-emitter');

const EOF = Symbol('EOF');
const ENGLISH_CHAR = /^[a-zA-Z]$/;
const EMPTY_CHAR = /^[\t\n\f\s ]$/;
const SINGLE_QUOTE = `\'`;

let currentToken = null;
let currentAttribute = null;

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
	else if (typeof c === 'string' && c.match(ENGLISH_CHAR)) {
		currentToken = {
			type: 'startTag',
			tagName: ''
		};
		// we get tag name when encounter english word
		return tagName(c);
	}
	//
	else {
		return data;
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
		return data;
	}
}

function tagName(c) {
	if (c.match(EMPTY_CHAR)) {
		return beforeAttributeName;
	}
	//
	else if (c === '/') {
		emit(currentToken);
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
	//
	if (c === '/') {
		emit(currentToken);

		return selfClosingStartTag;
	}
	//
	else if (c === '>') {
		emit(currentToken);
		return data;
	}
	//
	else if (c.match(EMPTY_CHAR)) {
		return beforeAttributeName;
	}
	//
	else if (c === '=') {
		throw new Error('before attribute dont allow =');
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
	if (c === '/' || c === '>' || c === EOF || c.match(EMPTY_CHAR)) {
		return UnquotedAttributeValue;
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

function beforeAttributeValue(c) {
	if (c.match(EMPTY_CHAR)) {
		return beforeAttributeValue;
	}
	//
	else if (c === '/' || c === '>') {
		throw new Error('kurwa dont allow in before Attribute');
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
		currentToken[currentAttribute.name] = currentAttribute.value;
		emit(currentToken);
		return selfClosingStartTag;
	}
	//
	else if (c === '>') {
		currentToken[currentAttribute.name] = currentAttribute.value;
		emit(currentToken);
		return data;
	}
	//
	else {
		throw new Error('after quoted value error');
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
	else {
		throw new Error('only > allowed');
	}
}

module.exports.parseHTML = function parseHTML(html) {
	let state = data;
	for (let c of html) {
		state = state(c);
	}
	state = state(EOF);
	return getRoot();
};

module.exports.cleanCache = () => {
	currentToken = null;
	currentAttribute = null;
	clean();
};
