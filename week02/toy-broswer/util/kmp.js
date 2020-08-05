const patternStateMachine = str => {
	const len = str.length;

	// states[current_state][with_char] = next_state
	let states = new Array(len);
	for (let i = 0; i < len; i++) {
		// 0 <= ascii(char) < 256
		let arr = new Array(256).fill(0);
		states[i] = arr;
	}

	//shadow state for record the last state
	let shadow = 0;

	states[0][str.charCodeAt(0)] = 1;

	for (let i = 1; i < len; i++) {
		for (let c = 0; c < 256; c++) {
			if (c === str.charCodeAt(i)) {
				states[i][c] = i + 1; // state forward
			} else {
				states[i][c] = states[shadow][c]; //state reconsume
			}
		}
		//update with the last max prefix matched step
		shadow = states[shadow][str.charCodeAt(i)];
	}

	return states;
};

const search = (txt, search_str) => {
	const sub_len = search_str.length;
	const txt_len = txt.length;

	const states = patternStateMachine(search_str);

	let curr_state = 0;

	for (let i = 0; i < txt_len; i++) {
		curr_state = states[curr_state][txt.charCodeAt(i)];

		if (curr_state === sub_len) {
			return i - sub_len + 1;
		}
	}

	return -1;
};

search('qqqqwwwweeeeeqwe', 'qwe');
search('asdfhgfdwe', 'asdas');
search('zzzxxxccc', 'xxx');
