Vue.component('app-error', {
	data() {
		return {
			text: ''
		}
	},
	methods: {
		setError(error) {
			this.text = error
		}
	},
	computed: {
		isVisible() {
			return this.text !== ''
		}
	},
	template: `
		<div class="overlay" v-if="isVisible"> 
			<div class="error-block">
				<p class="error-msg">{{ text }}</p>
				<button class="close-btn" @click="setError('')">&times;</button>
			</div>
		</div>`
})