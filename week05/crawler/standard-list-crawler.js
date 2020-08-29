const container = document.querySelector('#container');
const children = [...(container ? container.children : [])];
const MapHtmlToObj = el => ({
	name: el.children[1].innerText,
	url: el.children[1].children[0].href
});
const mapped = children
	.filter(el => el.getAttribute('data-tag').match(/css/))
	.map(MapHtmlToObj);

const objlist = JSON.stringify(mapped);
