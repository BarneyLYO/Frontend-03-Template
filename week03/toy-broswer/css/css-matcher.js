function match(element, selector) {
	if (!selector || !element.attributes) return false;
	let attr_list;
	switch (String(selector).charAt(0)) {
		case '#':
			attr_list = element.attributes.filter(attr => attr.name === 'id')[0];
			return matchedById(attr_list, selector);
		case '.':
			attr_list = element.attributes.filter(attr => attr.name === 'class')[0];
			return matchedByClass(attr_list, selector);
		default:
			return matchedByTag(element, selector);
	}
}

function matchedById(attr_list, selector) {
	if (attr_list && attr_list.value === selector.replace('#', '')) return true;
	return false;
}

function matchedByClass(attr_list, selector) {
	if (attr_list && attr_list.value === selector.replace('.', '')) return true;
	return false;
}

function matchedByTag(element, selector) {
	if (element.tagName === selector) return true;
	return false;
}

module.exports = match;
