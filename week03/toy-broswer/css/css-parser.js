const css = require('css');
const { compare, specificity } = require('./css-specificity');
const match = require('./css-matcher');

let rules = [];

function addCssRules(text) {
	let ast = css.parse(text);
	rules.push(...ast.stylesheet.rules);
}

function computeCSS(element, dom) {
	let elements = dom.slice().reverse(); // resolve from parent -> children

	if (!element.computedStyle) element.computedStyle = {};

	for (let rule of rules) {
		let selectorParts = rule.selectors[0].split(' ').reverse(); // resolve from parent -> children

		if (!match(element, selectorParts[0])) continue;

		let matched = false;

		let j = 1;
		for (let i = 0; i < elements.length; i++) {
			if (match(elements[i], selectorParts[j])) j++;
		}

		if (j >= selectorParts.length) {
			matched = true;
		}
		if (matched) {
			let sp = specificity(rule.selectors[0]);
			let computed_style = element.computedStyle;

			for (let declaration of rule.declarations) {
				if (!computed_style[declaration.property]) {
					computed_style[declaration.property] = {};
				}

				if (!computed_style[declaration.property].specificity) {
					computed_style[declaration.property].value = declaration;
					computed_style[declaration.property].specificity = sp;
				}
				//
				else if (
					compare(computed_style[declaration.property].specificity, sp) < 0
				) {
					computed_style[declaration.property].value = declaration;
					computed_style[declaration.property].specificity = sp;
				}
			}
			//console.log(element.computedStyle);
		}
	}
}

module.exports = {
	addCssRules,
	computeCSS
};
