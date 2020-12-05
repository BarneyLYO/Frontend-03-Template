import HelloWord from './HelloWorld.vue';
import Vue from 'Vue';

// new Vue({
// 	el: '#app',
// 	template: '<HelloWorld/>',
// 	components: { HelloWord }
// });

new Vue({
	el: '#app',
	render: h => h(HelloWord)
});
