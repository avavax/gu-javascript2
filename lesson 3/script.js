const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

// функция запроса на промисах

/* let getRequest = (url, cb) => {
    let xhr = new XMLHttpRequest();
    // window.ActiveXObject -> xhr = new ActiveXObject()
    xhr.open("GET", url, true);

    const promise = new Promise((resolve, reject) => {
	    xhr.onreadystatechange = () => {
	        if(xhr.readyState === 4){
	            if(xhr.status !== 200){
	                reject('Error');
	            } else {
	                resolve(xhr.responseText);
	            }
	        }
	    }
    });

    promise
    	.then(data => cb(data))
    	.catch(error => {
    		console.error(error);
    	});

    xhr.send();
};

getRequest(`${API}/catalogData.json`, function(data) {
	console.log(data);
}) */

class ProductsList {

	constructor(container = '.container'){
		this.container = container;
		this.goods = [];
		this.allProducts = [];
		this._getProducts()
			.then(data => {
				this.goods = [...data];
				this.render()
			});	
    	this._testProducts();			
	}

    _getProducts() {

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

		const block = document.querySelector(this.container);
		for (let product of this.goods) {
			const productObj = new ProductItem(product);
			this.allProducts.push(productObj);
			block.insertAdjacentHTML('beforeend', productObj.render());
		}
	}

	// метод для подсчёта общей суммы товаров
	calcAllCost() {
		return this.allProducts.reduce((sum, el) => sum + el.price, 0);
	}	
}

class ProductItem {

    constructor(product, img = 'default-placeholder.png'){
        this.product_name = product.product_name;
        this.price = product.price;
        this.id_product= product.id_product;
        this.img = product.img || img;
    }

    render() {

	    return `<div class="item">
					<div class="img-wrap">
						<img src="${this.img}" alt="фото товара" >
					</div>
					<div class="item-title">${this.product_name}</div>
					<div class="item-title"><em>${this.price} руб</em></div>
					<button class="add" data-id="${this.id_product}">Добавить</button>
				</div>`;
    }
}

class CartItem {

	constructor(item, img = 'default-placeholder.png') {
        this.product_name = item.product_name;
        this.price = item.price;
        this.quantity = item.quantity || 1;
        this.id_product = item.id_product;
        this.img = item.img || img;
	}

	render() {
		return `<div class="cart-item">
					<div class="cart-item__img">
						<img src="${this.img}" alt="товар">		
					</div>
					<div class="cart-item__caption">
						<p>${this.product_name}</p>
						<p>${this.quantity} x ${this.price} руб</p>
						<i class="fa fa-times-circle remove" aria-hidden="true" data-id="${this.id_product}"></i>
					</div>
				</div>`
	}
}

class Cart {

	constructor(container = '.cart-content'){
		this.container = container;
		this.allProducts = [];
		this.result = {quant:0, cost: 0}
		this._getProducts()
			.then(data => {
				this.allProducts = [...data.contents];
				this.render();
			});	
	}

    _getProducts() {
        return fetch(`${API}/getBasket.json`)
            .then(result => result.json())
            .catch(error => {
                console.error(error);
            })
    }


	addItem(id, list) {
		// Добавить товар в корзину по id
		let targetElement = list.allProducts.filter( el => el.id_product === id)[0];
		let flag = false;

		// проверка есть ли уже такой товар
		this.allProducts.forEach(el => {
			if (el.id_product === id) {
				el.quantity++;
				flag = true;
			}
		});

		// если нет - добавляем новый объект
		if (!flag) {
			let config = {
				id_product: targetElement.id_product,
				product_name: targetElement.product_name,
				img: targetElement.img,
				price: targetElement.price
			}
			let cartItem = new CartItem(config);
			this.allProducts.push(cartItem);
			
		}

		this.render();
	}

	removeItem(id) {

		this.allProducts.forEach(el => {
			if (el.id_product === id) {
				el.quantity--;
			}
		});
		this.render();		
	}

	render() {

		const block = document.querySelector(this.container);
		block.innerHTML = '';
		for (let item of this.allProducts) {
			const cartItem = new CartItem(item);
			if (item.quantity) {
				block.insertAdjacentHTML('beforeend', cartItem.render());				
			}
		}

		this._calcCart();
		let result;
		if (this.result.quant) {
			result = `<div class="cart-result">Товаров в корзине: ${this.result.quant}<br>
						Общая сумма: ${this.result.cost} руб</div>`;
		} else {
			result = `<div class="cart-result">Товары в корзине отсутствуют</div>`;
		}
		block.insertAdjacentHTML('beforeend', result);				
	}

	_calcCart() {
		// подсчитать стоимость и количество товаров
		this.result.quant = this.allProducts.reduce((sum, elem) => sum += elem.quantity, 0);
		this.result.cost = this.allProducts.reduce((sum, elem) => sum += elem.quantity * elem.price, 0);
	}
}



window.addEventListener('DOMContentLoaded', () => {

	let list = new ProductsList();

	const cartBtn = document.querySelector('.cart');
	cartBtn.addEventListener('click', () =>{
		document.querySelector('.cart-content').classList.toggle('hidden');
	});

	let cart = new Cart();

	// вешаем обработчик для добавления товара
	document.querySelector('.container').addEventListener('click', e => {
		
		if (e.target && e.target.classList.contains('add')) {
			cart.addItem(+e.target.dataset.id, list);
		}
	});

	// вешаем обработчик для удаления товара из корзины
	document.querySelector('.cart-content').addEventListener('click', e => {
		
		if (e.target && e.target.classList.contains('remove')) {
			cart.removeItem(+e.target.dataset.id);
		}
	});


});

