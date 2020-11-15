import Carousel from './carousel';
import Framework from './framework';
import { Timeline, Animation } from './animation';
import { easeIn } from './cubic-bezier';

const pic = [
	'https://gamasutra.com/db_area/images/news/320213/Final-fantasy-1.jpg',
	'https://gamasutra.com/db_area/images/news/320213/ff1_wrmech.jpg',
	'https://gamasutra.com/db_area/images/news/320213/Super-Mario-64.jpg',
	'https://gamasutra.com/db_area/images/news/320213/Screen_Shot_2017-12-09_at_4_36_25_PM.jpg',
	'https://gamasutra.com/db_area/images/news/320213/hqdefault.jpg',
	'https://gamasutra.com/db_area/images/news/320213/2ed0nr6kyfax.png'
];
let a = <Carousel src={pic} />;

//document.body.appendChild(a);
a.mountTo(document.body);

{
	const tl = new Timeline();
	tl.start();
	tl.add(
		new Animation(
			document.querySelector('#el').style,
			'transform',
			0,
			500,
			2000,
			0,
			easeIn,
			v => `translateX(${v}px)`
		)
	);

	document.querySelector('#el2').style.transition = `transform 3s ease-in`;
	document.querySelector('#el2').style.transform = `translateX(500px)`;

	document.querySelector('#pause').addEventListener('click', () => {
		tl.pause();
	});
	document.querySelector('#resume').addEventListener('click', () => {
		tl.resume();
	});
}
