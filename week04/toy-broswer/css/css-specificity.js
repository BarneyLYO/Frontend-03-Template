//[inline, id, class, tagName]
//div div #id => [0,1,0,2]
//div #my #id => [0,2,0,1]
//if higher position can be compare we donr think about the lower position

const REGEX_COMBINED = /[a-zA-Z]{1}[a-zA-Z0-9]*|\.[a-zA-Z]{1}[a-zA-Z0-9]*|#[a-zA-Z0-9]+/g;

function specifyCompound(sub, p) {
	sub.forEach(rule => {
		switch (rule.charAt(0)) {
			case '#':
				p[1] += 1;
				break;
			case '.':
				p[2] += 1;
				break;
			default:
				p[3] += 1;
				break;
		}
	});
}

function specifySimple(selector, p) {}

function specificity(selector) {
	let p = [0, 0, 0, 0];
	let selector_parts = selector.split(' ');

	for (let part of selector_parts) {
		const sub = part.match(REGEX_COMBINED);
		if (Array.isArray(sub) && sub.length) {
			specifyCompound(sub, p);
		} else {
			if (part.charAt(0) === '#') {
				p[1] += 1;
			}
			//
			else if (part.charAt(0) === '.') {
				p[2] += 1;
			}
			//
			else {
				p[3] += 1;
			}
		}
	}
	return p;
}

function compare(s1, s2) {
	if (s1[0] - s2[0]) return s1[0] - s2[0];
	if (s1[1] - s2[1]) return s1[1] - s2[1];
	if (s1[2] - s2[2]) return s1[2] - s2[2];
	return s1[3] - s2[3];
}

module.exports = {
	compare,
	specificity
};
