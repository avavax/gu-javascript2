Vue.component('app-cart', {
	data() {
		return {
	        cartList: [],
	        cartShow: false
    	}
	},
	methods: {
		addProduct(product) {
			let find = this.cartList.find(el => el.id_product === product.id_product);
			if (find) {
				this.$parent.putJson(`/api/cart/${find.id_product}`, {quantity: 1})
					.then(data => {
						if (data.result === 1) {
							find.quantity++;
						}
				})
			} else {
				let prod = Object.assign({quantity: 1}, product);
				this.$parent.postJson(`/api/cart`, prod)
					.then(data => {
						if (data.result === 1) {
							this.cartList.push (prod);
						}
				})
			}
		},

		remProduct(product) {
			console.log(product.id_product);
			this.$parent.deleteJson(`/api/cart/${product.id_product}`)
	        	.then(data => {
	        		if (data.result === 1) {
	        			let productId = product.id_product;
	        			if (product.quantity === 1) {
							this.cartList.splice(this.cartList.indexOf(product), 1)
						} else {
							--product.quantity;
						}
	        		} 
	        	})			
   		},

		cartRevew() {
			let result;
			let items = this.cartList.reduce((sum, current) => sum + current.quantity, 0);
			let cost = this.cartList.reduce((sum, current) => sum + current.quantity * current.price, 0);
			if (!cost) {
				result = `Товары в корзине отсуствуют`;
			} else {
				result = `Товаров в корзине: ${items} <br>
					Общая сумма: ${cost} руб`;
			}
			return result
		},
	},
	mounted() {
		this.$parent.getJson(`/api/cart`)
			.then(data => {
				for (let el of data.contents) {
					if (!el.img) {
						el.img = 'img/default-placeholder.png';
					}
					this.cartList.push(el);
				}
			});	
	},
	template: `
		<div class="cart-wrapper">
			<button @click="cartShow = !cartShow" class="cart">Корзина</button>
			<div v-if="cartShow" class="cart-content">
				<app-cart-item class="cart-item" 
					v-for="product of cartList" 
					:key="product.id_product"
					:product="product">
				</app-cart-item>
				<div class="cart-result" v-html="cartRevew()"></div>
			</div>
		</div>`
});

Vue.component('app-cart-item', {
	props: ['product'],
	template: `
		<div class="cart-item">
			<div class="cart-item__img">
				<img :src="product.img" alt="товар">		
			</div>
			<div class="cart-item__caption">
				<p>{{product.product_name}}</p>
				<p class="cart-product-data">{{product.quantity}} x {{product.price}} руб</p>
				<i class="fa fa-times-circle remove" aria-hidden="true" @click="$parent.remProduct(product)"></i>
			</div>
		</div>	
	`
});