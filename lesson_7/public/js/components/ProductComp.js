Vue.component('app-products', {
	data() {
		return {
			products: []
		}
	},
	methods: {
		filter(filterData) {
			const regexp = new RegExp(filterData, 'i');
			this.products.forEach(el => el.filter = regexp.test(el.product_name));
		}
	},
	mounted() {
		this.$parent.getJson(`/api/products`)
			.then(data => {
				for (let el of data) {
					if (!el.img) {
						el.img = 'img/default-placeholder.png';
					}
					el.filter = true;
					this.products.push(el);

				}
			})
	},
	template: `
	<div class="container">
		<app-product class="item" 
			v-for="item of products" 
			:key="item.id_product" 
			v-if="item.filter" 
			:product="item">
		</app-product>
	</div>`
});

Vue.component('app-product', {
	props: ['product'],
	template: `
		<div class="item">
			<div class="img-wrap">
				<img :src="product.img" alt="фото товара" >
			</div>
			<div class="item-title">{{product.product_name}}</div>
			<div class="item-title"><em>{{product.price}} руб</em></div>
			<button class="add" @click="$root.$refs.appCart.addProduct(product)">Добавить</button>
		</div>	
	`
});