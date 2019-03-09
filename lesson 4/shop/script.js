const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

class Item {

    constructor(product, img = 'default-placeholder.png'){
        this.product_name = product.product_name;
        this.price = product.price;
        this.id_product= product.id_product;
        this.img = product.img || img;
        this.quantity = product.quantity || 1;
    }
}

class ProductItem extends Item {

	constructor(config) {
		super(config);
	}

	render() {
	    return `<div class="item" data-id="${this.id_product}">
					<div class="img-wrap">
						<img src="${this.img}" alt="фото товара" >
					</div>
					<div class="item-title">${this.product_name}</div>
					<div class="item-title"><em>${this.price} руб</em></div>
					<button class="add" data-id="${this.id_product}"
					data-product_name="${this.product_name}"
					data-price="${this.price}"
					data-img="${this.img}">Добавить</button>
				</div>`;		
	}
}

class CartItem extends Item {

	constructor(config) {
		super(config);
	}

	render() {
		return `<div class="cart-item" data-id="${this.id_product}">
					<div class="cart-item__img">
						<img src="${this.img}" alt="товар">		
					</div>
					<div class="cart-item__caption">
						<p>${this.product_name}</p>
						<p class="cart-product-data">${this.quantity} x ${this.price} руб</p>
						<i class="fa fa-times-circle remove" aria-hidden="true" data-id="${this.id_product}"></i>
					</div>
				</div>`
	}
}

class ProductsList {

	constructor(cart, container = '.container', filterForm = '.search-form') {
		this.container = container;
		this.filterForm = filterForm;
		this.goods = [];
		this.allProducts = [];
		this.cart = cart;
		this._getProducts()
			.then(data => {
				this.goods = [...data];
				this.render()
			});	
    	this._testProducts();
    	this._init();			
	}

	_init() {

		// подключение обработчиков на каталог (кнопка добавить)
		document.querySelector(this.container).addEventListener('click', e => {
			if (e.target && e.target.classList.contains('add')) {
				this.cart.addItem(e.target);
			}
		});

		const filterBlock = document.querySelector(this.filterForm);
		filterBlock.addEventListener('click', e => {
			e.preventDefault();
			this._filter(filterBlock.querySelector('input').value);
		});

	}

	_filter(data) {
		if (!data) return;
		const regexp = new RegExp(data, 'i');
		this.allProducts.forEach(elem => {
			let isShow = regexp.test(elem.product_name);
			const block = document.querySelector(`.item[data-id="${elem.id_product}"]`);
			if (isShow) {
				block.classList.remove('hidden');
			} else {
				block.classList.add('hidden');
			}
		})
	}

    _getProducts() {
    	// загрузка товаров из каталога
        return fetch(`${API}/catalogData.json`)
            .then(result => result.json())
            .catch(error => {
                console.error(error);
            })
    }		

    // исходные товары оставлены просто для количества и проверки взаимодействия goods и allProducts
    _testProducts() {

		this.goods = [
			{id_product: 1, product_name: 'Фитнес-браслет Xiaomi', price: 1992, img: 'https://ozon-st.cdn.ngenix.net/multimedia/c1200/1024317529.jpg'},
			{id_product: 2, product_name: 'Экшн-камера Motorola VERVECAM', price: 4886, img: 'https://ozon-st.cdn.ngenix.net/multimedia/c1200/1024079673.jpg'},
			{id_product: 3, product_name: 'Телевизор Fusion FLTV-40C100T', price: 12188, img: 'https://ozon-st.cdn.ngenix.net/multimedia/c1200/1024408365.jpg'},
			{id_product: 4, product_name: 'Будильник Philips Wake-up', price: 3221, img: 'https://ozon-st.cdn.ngenix.net/multimedia/c1200/1026294862.jpg'},
			{id_product: 5, product_name: 'Смартфон Honor 10 Lite 32GB', price: 13941, img: 'https://ozon-st.cdn.ngenix.net/multimedia/1026952805.jpg'},
			{id_product: 6, product_name: 'Silver экшн-камера', price: 3400, img: 'https://ozon-st.cdn.ngenix.net/multimedia/c1200/1017469604.jpg'},
		];
		this.render();
    }


	render() {
		// вывод товаров каталога
		const block = document.querySelector(this.container);
		for (let product of this.goods) {
			const productObj = new ProductItem(product);
			this.allProducts.push(productObj);
			block.insertAdjacentHTML('beforeend', productObj.render());
		}
	}
}

class Cart {

	constructor(container = '.cart-content', cartHandler = '.cart') {
		this.container = container;
		this.allProducts = [];
		this.result = {quant:0, cost: 0};
		this.cartBtn = document.querySelector(cartHandler);
		this._getJson(`${API}/getBasket.json`)
			.then(data => {
				//console.log(data);
				this.allProducts = [...data.contents];
				this.render();
			});

		this._init();	

	}

    _getJson(url) {
    	// получение каталожные данных для корзины
        return fetch(url ? url : `${API + this.url}`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            })
    }

    _init() {

    	// инициализация обработчиков на дом-элементы
		document.querySelector(this.container).addEventListener('click', e => {
			if (e.target && e.target.classList.contains('remove')) {
				this.removeItem(e.target);
			}
		});

		this.cartBtn.addEventListener('click', () =>{
			document.querySelector(this.container).classList.toggle('hidden');
		});
    }

	addItem(el) {

		// Добавить в корзину товар el
        this._getJson(`${API}/addToBasket.json`)
            .then(data => {
                if(data.result === 1){
                    let productId = +el.dataset['id'];
                    let find = this.allProducts.find(product => product.id_product === productId);
                    if(find){
                        find.quantity++;
						this._updateCart(find);
                    } else {
                        let product = {
                            id_product: productId,
                            price: +el.dataset['price'],
                            product_name: el.dataset['product_name'],
                            img: el.dataset['img'],
                            quantity: 1
                        };
                        this.allProducts.push(product);
                        this.render();
                    }
                } else {
                    alert('Error');
                }
            })		
	}

	_updateCart(product) {

		// обновить корзину при удалении или добавлении элемента
		const block = document.querySelector(`.cart-item[data-id="${product.id_product}"]`);
		block.querySelector('.cart-product-data').textContent = `${product.quantity} x ${product.price} руб`;
		this._renderResult();
	}


	removeItem(el) {

		// удалить элемент
        this._getJson(`${API}/deleteFromBasket.json`)
            .then(data => {
                if(data.result === 1) {
                    let productId = +el.dataset['id'];
                    let find = this.allProducts.find(product => product.id_product === productId);
                    if (find.quantity > 1) {
                        find.quantity--;
                        this._updateCart(find);
                    } else {
                        this.allProducts.splice(this.allProducts.indexOf(find), 1);
                        document.querySelector(`.cart-item[data-id="${productId}"]`).remove();
                    }
                    this._renderResult();
                } else {
                    alert('Error');
                }
            })
	}

	render() {

		// рендер корзины
		const block = document.querySelector(this.container);
		block.innerHTML = '';
		for (let item of this.allProducts) {
			const cartItem = new CartItem(item);
			if (item.quantity) {
				block.insertAdjacentHTML('beforeend', cartItem.render());				
			}
		}
		block.insertAdjacentHTML('beforeend', `<div class="cart-result"></div>`);
		this._renderResult();
	}

	_renderResult() {
		// обновить итого в корзине
		const block = document.querySelector('.cart-result');

		this._calcCart();
		let result;
		if (this.result.quant) {
			result = `Товаров в корзине: ${this.result.quant}<br>
						Общая сумма: ${this.result.cost} руб`;
		} else {
			result = `Товары в корзине отсутствуют`;
		}
		block.innerHTML = result;
	}
	
	_calcCart() {
		// подсчёт общего количества и стоимости товара в корзине
		this.result.quant = this.allProducts.reduce((sum, elem) => sum += elem.quantity, 0);
		this.result.cost = this.allProducts.reduce((sum, elem) => sum += elem.quantity * elem.price, 0);
	}
}

window.addEventListener('DOMContentLoaded', () => {

	let cart = new Cart();
	let list = new ProductsList(cart);
});


