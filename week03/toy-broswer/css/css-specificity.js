//[inline, id, class, tagName]
//div div #id => [0,1,0,2]
//div #my #id => [0,2,0,1]
//if higher position can be compare we donr think about the lower position
function specificity(selector) {
	let p = [0, 0, 0, 0];
	let selector_parts = selector.split(' ');

	for (let part of selector_parts) {
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
