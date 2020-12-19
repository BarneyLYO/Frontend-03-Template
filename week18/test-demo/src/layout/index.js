function getStyle(element) {
	if (!element.style) element.style = {};

	for (let prop in element.computedStyle) {
		//let p = element.computedStyle.value;  No need

		element.style[prop] = element.computedStyle[prop].value.value;
		if (element.style[prop].toString().match(/px$/)) {
			element.style[prop] = parseInt(element.style[prop]);
		}

		if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
			element.style[prop] = parseInt(element.style[prop]);
		}
	}
	return element.style;
}

function preConfigFlexProperty(style) {
	['width', 'height'].forEach(size => {
		if (style[size] === 'auto' || style[size] === '') {
			style[size] = null;
		}
	});

	if (!style.flexDirection || style.flexDirection === 'auto')
		style.flexDirection = 'row';
	if (!style.justifyContent || style.justifyContent === 'auto')
		style.justifyContent = 'flex-start';
	if (!style.flexWrap || style.flexWrap === 'auto') style.flexWrap = 'nowrap';
	if (!style.alignContent || style.alignContent === 'auto')
		style.alignContent = 'stretch';
	if (!style.alignItems || style.alignItems === 'auto')
		style.alignItems = 'stretch';
}

function defineFlexProperty(style) {
	/**
	 * TODO:
	 * Personally I dont think define tons of varaible is good way to go
	 */
	let mainSize,
		mainStart,
		mainEnd,
		mainSign,
		mainBase,
		crossSize,
		crossStart,
		crossEnd,
		crossSign,
		crossBase;

	if (style.flexDirection === 'row') {
		mainSize = 'width';
		mainStart = 'left';
		mainEnd = 'right';
		mainSign = +1;
		mainBase = 0;

		crossSize = 'height';
		crossStart = 'top';
		crossEnd = 'bottom';
	}

	if (style.flexDirection === 'row-reverse') {
		mainSize = 'width';
		mainStart = 'right';
		mainEnd = 'left';
		mainSign = -1;
		mainBase = style.width;

		crossSize = 'height';
		crossStart = 'top';
		crossEnd = 'bottom';
	}

	if (style.flexDirection === 'column') {
		mainSize = 'height';
		mainStart = 'top';
		mainEnd = 'bottom';
		mainSign = +1;
		mainBase = 0;

		crossSize = 'width';
		crossStart = 'left';
		crossEnd = 'right';
	}

	if (style.flexDirection === 'column-reverse') {
		mainSize = 'height';
		mainStart = 'bottom';
		mainEnd = 'top';
		mainSign = -1;
		mainBase = style.width;

		crossSize = 'width';
		crossStart = 'right';
		crossEnd = 'left';
	}

	if (style.flexWrap === 'wrap-reverse') {
		var tmp = crossStart;
		crossStart = crossEnd;
		crossEnd = tmp;
		crossSign = -1;
	}
	//
	else {
		crossBase = 0;
		crossSign = 1;
	}

	return {
		mainSize,
		mainStart,
		mainEnd,
		mainSign,
		mainBase,
		crossSize,
		crossStart,
		crossEnd,
		crossSign,
		crossBase
	};
}

function processAutoMainSize(style, elementStyle, items, mainSize) {
	if (style[mainSize]) return false;

	elementStyle[mainSize] = 0;
	for (let i = 0; i < items.length; i++) {
		let item = items[i];
		let itemStyle = getStyle(item);
		if (itemStyle[mainSize] !== null || itemStyle[mainSize]) {
			elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
		}
	}
	return true;
}

function collectElementIntoRow(style, items, isAutoMainSize, config) {
	const { mainSize, crossSize } = config;

	let flexLine = [];
	let flexLines = [flexLine];
	let mainSpace = style[mainSize];
	let crossSpace = 0;

	items.forEach((item, i) => {
		let itemStyle = getStyle(item);

		if (!itemStyle[mainSize]) itemStyle[mainSize] = 0;

		if (itemStyle.flex) flexLine.push(item);
		//
		else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
			mainSpace -= itemStyle[mainSize];

			if (itemStyle[crossSize])
				crossSpace = Math.max(crossSpace, itemStyle[crossSize]);

			flexLine.push(item);
		}
		//
		else {
			if (itemStyle[mainSize] > style[mainSize])
				itemStyle[mainSize] = style[mainSize];

			if (mainSpace < itemStyle[mainSize]) {
				flexLine.mainSpace = mainSpace;
				flexLine.crossSpace = crossSpace;
				flexLine = [item];
				flexLines.push(flexLine);
				mainSpace = style[mainSize];
				crossSpace = 0;
			}
			//
			else {
				flexLine.push(item);
			}

			if (!itemStyle[crossSize])
				crossSapce = Math.max(crossSpace, itemStyle[crossSize]);
			mainSpace -= itemStyle[mainSize];
		}
	});
	flexLine.mainSpace = mainSpace;

	return { flexLine, flexLines, mainSpace, crossSpace };
}

function predefineCrossSpace(
	style,
	flexLine,
	isAutoMainSize,
	crossSpace,
	crossSize
) {
	if (style.flexWrap === 'nowrap' || isAutoMainSize)
		flexLine.crossSapce =
			style[crossSize] !== void 0 ? style[crossSize] : crossSpace;
	//
	else flexLine.crossSpace = crossSpace;
}

function layout(element) {
	if (!element.computedStyle) return;

	let elementStyle = getStyle(element);
	if (elementStyle.display !== 'flex') return;

	let items = element.children.filter(e => e.type === 'element');

	items.sort(function(a, b) {
		return (a.order || 0) - (b.order || 0);
	});

	let style = elementStyle;

	preConfigFlexProperty(style);

	let {
		mainSize,
		mainStart,
		mainEnd,
		mainSign,
		mainBase,
		crossSize,
		crossStart,
		crossEnd,
		crossSign,
		crossBase
	} = defineFlexProperty(style);

	let isAutoMainSize = processAutoMainSize(
		style,
		elementStyle,
		items,
		mainSize
	);

	let { flexLine, flexLines, mainSpace, crossSpace } = collectElementIntoRow(
		style,
		items,
		isAutoMainSize,
		{
			mainSize,
			crossSize
		}
	);

	predefineCrossSpace(style, flexLine, isAutoMainSize, crossSpace, crossSize);

	if (mainSpace < 0) {
		var scale = style[mainSize] / (style[mainSize] - mainSpace);

		var currentMain = mainBase;

		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var itemStyle = getStyle(item);

			if (itemStyle.flex) {
				itemStyle[mainSize] = 0;
			}

			itemStyle[mainSize] = itemStyle[mainSize] * scale;

			itemStyle[mainStart] = currentMain;
			itemStyle[mainEnd] =
				itemStyle[mainStart] + mainSign * itemStyle[mainSize];
			currentMain = itemStyle[mainEnd];
		}
	}
	//
	else {
		flexLines.forEach(function(items) {
			var mainSpace = items.mainSpace;
			var flexTotal = 0;

			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				var itemStyle = getStyle(item);
				if (itemStyle.flex !== null && itemStyle.flex !== void 0) {
					flexTotal += itemStyle.flex;
					continue;
				}
			}

			if (flexTotal > 0) {
				var currentMain = mainBase;
				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					var itemStyle = getStyle(item);
					if (itemStyle.flex) {
						itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
					}
					itemStyle[mainStart] = currentMain;
					itemStyle[mainEnd] =
						itemStyle[mainStart] + mainSign * itemStyle[mainSize];
					currentMain = itemStyle[mainEnd];
				}
			}
			//
			else {
				if (style.justifyContent === 'flex-start') {
					var currentMain = mainBase;
					var step = 0;
				}
				if (style.justifyContent === 'flex-end') {
					var currentMain = mainSpace * mainSign + mainBase;
				}
				if (style.justifyContent === 'center') {
					var currentMain = (mainSpace / 2) * mainSign + mainBase;
					var step = 0;
				}
				if (style.justifyContent === 'space-between') {
					var step = (mainSpace / (items.length - 1)) * mainSign;
					var currentMain = mainBase;
				}
				if (style.justifyContent === 'space-around') {
					var step = (mainSpace / items.length) * mainSign;
					var currentMain = step / 2 + mainBase;
				}
				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					itemStyle[(mainStart, currentMain)];
					itemStyle[mainEnd] =
						itemStyle[mainStart] + mainSign * itemStyle[mainSize];
					currentMain = itemStyle[mainEnd] + step;
				}
			}
		});
	}
	// 计算交叉轴尺寸
	if (!style[crossSize]) {
		crossSpace = 0;
		elementStyle[crossSize] = 0;
		for (var i = 0; i < flexLines.length; i++) {
			elementStyle[crossSize] =
				elementStyle[crossSize] + flexLines[i].crossSpace;
		}
	}
	//
	else {
		crossSpace = style[crossSize];
		for (var i = 0; i < flexLines.length; i++) {
			crossSpace -= flexLines[i].crossSpace;
		}
	}

	if (style.flexWrap === 'wrap-reverse') {
		crossBase = style[crossSize];
	}
	//
	else {
		crossBase = 0;
	}
	var lineSize = style[crossSize] / flexLines.length;
	var step;
	if (style.alignContent === 'flex-start') {
		crossBase += 0;
		stype = 0;
	}
	if (style.alignContent === 'flex-end') {
		crossBase += crossSign * crossSpace;
		step = 0;
	}
	if (style.alignContent === 'center') {
		crossBase += (crossSign * crossSpace) / 2;
		step = 0;
	}
	if (style.alignContent === 'space-between') {
		crossBase += 0;
		step = crossSpace / (flexLines.length - 1);
	}
	if (style.alignContent === 'space-around') {
		step = crossSpace / flexLines.length;
		crossBase += (crossSign * step) / 2;
	}
	if (style.alignContent === 'stretch') {
		crossBase += 0;
		step = 0;
	}
	flexLines.forEach(items => {
		var lineCrossSize =
			style.alignContent === 'stretch'
				? items.crossSpace + crossSpace / flexLines.length
				: items.crossSpace;
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var itemStyle = getStyle(item);

			var align = itemStyle.alignSelf || style.alignItems;
			if (itemStyle[crossSize] === null || itemStyle[crossSize] === void 0) {
				itemStyle[crossSize] = align === 'stretch' ? lineCrossSize : 0;
			}
			if (align === 'flex-start') {
				itemStyle[crossStart] = crossBase;
				itemStyle[crossEnd] =
					itemStyle[crossStart] + crossSign * itemStyle[crossSize];
			}
			if (align === 'flex-end') {
				itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
				itemStyle[crossStart] =
					itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
			}
			if (align === 'center') {
				itemStyle[crossStart] =
					crossBase + (crossSign * (lineCrossSize - itemStyle[crossSize])) / 2;
				itemStyle[crossEnd] =
					itemStyle[crossStart] + crossSign * itemStyle[crossSize];
			}
			if (align === 'stretch') {
				itemStyle[crossStart] = crossBase;
				itemStyle[crossEnd] =
					crossBase +
					crossSign * (itemStyle[crossSize] != null && itemStyle[crossSize]);
				itemStyle[crossSize] =
					crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
			}
		}
		crossBase += crossSign * (lineCrossSize + step);
	});
}

module.exports = layout;