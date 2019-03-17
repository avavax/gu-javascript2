Vue.component('app-error', {
	props: ['errorMsg'],
	template: `
	<div>
		<p> Server connection failure.</p>
		<p> {{errorMsg}} </p>
	</div>
	`
})