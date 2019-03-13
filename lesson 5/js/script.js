const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
	el: '#app',

	data: {
		urls: {
			catalog: '/catalogData.json',
			addToBasket: '/addToBasket.json',
			deleteFromBasket: '/deleteFromBasket.json',
			getBasket: '/getBasket.json'
		},
        products: [],
        cartList: [],
        filterData: '',
        cartShow: false
	},

	methods: {
		getJson(url) {
			return fetch(url)
				.then(result => result.json())
				.catch(error => {
					console.log(error);
				})
		},

		addProduct(product) {
	        this.getJson(`${API + this.urls.addToBasket}`)
	        	.then(data => {
	        		if (data.result === 1) {
	        			let productId = product.id_product;
	        			let find = this.cartList.find(el => el.id_product === productId);
	        			if (find) {
	        				++find.quantity;
	        				// здесь нужно как-то обновить изображение корзины
	        				this.cartShow = !this.cartShow;
	        				this.cartShow = !this.cartShow;

	        			} else {
							product.quantity = 1;
							this.cartList.push(product);        				
	        			}
	        		} else {
	        			alert ('Error');
	        		}
	        	})
		},

		remProduct(product) {

			this.getJson(`${API + this.urls.deleteFromBasket}`)
	        	.then(data => {
	        		if (data.result === 1) {
	        			let productId = product.id_product;
	        			let find = this.cartList.find(el => el.id_product === productId);
						if (find.quantity === 1) {
							this.cartList.splice(this.cartList.indexOf(find), 1)
						} else {
							--find.quantity;
							// здесь нужно как-то обновить изображение корзины
							this.cartShow = !this.cartShow;
	        				this.cartShow = !this.cartShow;							
						}
	        		} else {
	        			alert ('Error');
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

		filter($event) {
			$event.preventDefault();
			const regexp = new RegExp(this.filterData, 'i');
			this.products.forEach(el => el.filter = regexp.test(el.product_name));
		}

	},

	mounted() {
		this.getJson('js/data.json')
			.then(data => {
				for (let el of data) {
					el.filter = true;
					this.products.push(el);
				}
			});		
		this.getJson(`${API + this.urls.catalog}`)
			.then(data => {
				for (let el of data) {
					if (!el.img) {
						el.img = 'img/default-placeholder.png';
					}
					el.filter = true;
					this.products.push(el);

				}
			});
		this.getJson(`${API + this.urls.getBasket}`)
			.then(data => {
				for (let el of data.contents) {
					if (!el.img) {
						el.img = 'img/default-placeholder.png';
					}
					this.cartList.push(el);
				}
			});		

	}		
})
