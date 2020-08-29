const REGEX_COMBINATOR = />|~|\+/;
const REGEX_COMPOSED = /^(\.|\#){0,1}(\w)+(\.|\#){1}(\w)+/;

function match(selector, element) {
	const selector_collection = selector
		.split(',')
		.map(rule =>
			rule.match(REGEX_COMBINATOR) || rule.includes(' ')
				? processRelationShip(rule)
				: [rule]
		);

	const result_collection = new Array(selector_collection.length).fill(false);

	selector_collection.forEach((list, index) => {
		let queue = list
			.map(rule =>
				rule.match(REGEX_COMPOSED) ? decomposeComposedSelector(rule) : rule
			)
			.reduce((accu, curr) => {
				if (curr instanceof Array) {
					return [...accu, ...curr];
				}
				return [...accu, curr];
			});

		while (queue && queue.length) {
			const current = queue.shift();

			if (current === ' ') {
				const target = queue.shift();
				if (!walkAndValidateTillTheRoot(element, target)) {
					result_collection[index] = false;
				}
			}
			//
			else if (current === '>') {
				const target = queue.shift();
				if (!walkToParentAndValidate(element, target)) {
					result_collection[index] = false;
				}
			}
			//
			else if (current === '+') {
				const target = queue.shift();
				if (!walkToSibilingAndValidate(element, target)) {
					result_collection[index] = false;
				}
			} else if (current === '~') {
				const target = queue.shift();
				if (!walkToParentAndCheckAllSiblingValidate(element, target)) {
					result_collection[index] = false;
				}
			} else {
				result_collection[index] = matchRule(element, current);
			}
		}
	});
	return result_collection.find(r => !!r);
}

function walkToParentAndCheckAllSiblingValidate(node, target) {
	if (!node.parentElement) return false;
	const origin = node;
	node = node.parentElement;
	if (!node.children || !node.children.length) return false;
	return [...node.children].find(n => n !== origin && matchRule(n, target));
}

function walkToSibilingAndValidate(node, target) {
	if (!node.previousElementSibling) return false;
	node = node.previousElementSibling;
	return matchRule(node, target);
}

function walkToParentAndValidate(node, target) {
	if (!node.parentElement) return false;
	node = node.parentElement;
	return matchRule(node, target);
}

function walkAndValidateTillTheRoot(node, target) {
	if (!node.parentElement) return false;
	node = node.parentElement;

	if (matchRule(node, target)) {
		return true;
	}

	walkAndValidateTillTheRoot(node, target);
}

function matchRule(node, target) {
	let matched = false;
	switch (target[0]) {
		case '.':
			matched = node.className
				.toLowerCase()
				.split(' ')
				.find(name => name === target.toLowerCase());
			if (matched) {
				return true;
			}
			break;
		case '#':
			matched = node.id.toLowerCase() === target.id.toLowerCase();
			if (matched) {
				return true;
			}
			break;
		default:
			matched = node.tagName.toLowerCase() === target.toLowerCase();
			return matched;
	}
	return false;
}

function decomposeComposedSelector(rule) {
	return String(rule)
		.split('')
		.reduceRight(_seperateRelation());
}

function processRelationShip(rule) {
	return String(rule)
		.trim()
		.split('')
		.reduce(_concatStrListSpaces)
		.reverse();
}

/**
 * Function<<String[],String>,String> reduce function for only allow the space to be
 * relationship handler, this is the prove why the string process is one of the stupid
 * issue in CS, because user input is always fucking annoying
 * @param {String[]} str_list
 * @param {String} curr
 */
function _concatStrListSpaces(str_list, curr) {
	const gathered = [...str_list];
	const prev_index = gathered.length - 1;

	if (!curr.match(REGEX_COMBINATOR) || curr === ' ') {
		if (
			gathered[prev_index] !== ' ' &&
			!gathered[prev_index].match(REGEX_COMBINATOR)
		) {
			gathered[prev_index] += curr;
			return gathered;
		}
		//
		else if (
			gathered[prev_index] !== ' ' &&
			gathered[prev_index].match(REGEX_COMBINATOR)
		) {
			return [...gathered, curr];
		}
		//
		else {
			return [...gathered, curr];
		}
	}
	//
	else {
		if (curr === ' ' && gathered[prev_index] === ' ') {
			return gathered;
		}

		if (curr === ' ' && gathered[prev_index].match(REGEX_COMBINATOR)) {
			return gathered;
		}

		if (curr.match(REGEX_COMBINATOR) && gathered[prev_index] === ' ') {
			gathered[prev_index] = curr;
			return gathered;
		}

		return [...gathered, curr];
	}
}

function _seperateRelation() {
	let start_new = false;
	return (a, r) => {
		const gathered = [...a];
		const pending = r + gathered[gathered.length - 1];
		if (r === '.' || r === '#') {
			start_new = true;
			gathered[gathered.length - 1] = pending;
			return gathered;
		}
		if (start_new) {
			start_new = false;
			return [...gathered, r];
		}
		gathered[gathered.length - 1] = pending;
		return gathered;
	};
}
