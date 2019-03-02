class ProductsList {

	constructor(container = '.container'){
		this.container = container;
		this.goods = [];
		this.allProducts = [];
		this._fetchProducts()
	}

	_fetchProducts() {

		this.goods = [
			{id: 1, title: 'Фитнес-браслет Xiaomi', price: 1992, img: 'https://ozon-st.cdn.ngenix.net/multimedia/c1200/1024317529.jpg'},
			{id: 2, title: 'Экшн-камера Motorola VERVECAM', price: 4886, img: 'https://ozon-st.cdn.ngenix.net/multimedia/c1200/1024079673.jpg'},
			{id: 3, title: 'Телевизор Fusion FLTV-40C100T', price: 12188, img: 'https://ozon-st.cdn.ngenix.net/multimedia/c1200/1024408365.jpg'},
			{id: 4, title: 'Будильник Philips Wake-up', price: 3221, img: 'https://ozon-st.cdn.ngenix.net/multimedia/c1200/1026294862.jpg'},
			{id: 5, title: 'Смартфон Honor 10 Lite 32GB', price: 13941, img: 'https://ozon-st.cdn.ngenix.net/multimedia/1026952805.jpg'},
			{id: 6, title: 'Silver экшн-камера', price: 3400, img: 'https://ozon-st.cdn.ngenix.net/multimedia/c1200/1017469604.jpg'},
			{id: 7, title: 'Радиотелефон Gigaset E630', price: 842, img: 'https://ozon-st.cdn.ngenix.net/multimedia/c1200/1025711951.jpg'},
			//{id: 8, title: 'Sony Cyber-shot DSC-W830', price: 7742, img: 'https://ozon-st.cdn.ngenix.net/multimedia/c1200/1009002188.jpg'},
			{id: 8, title: 'Sony Cyber-shot DSC-W830', price: 7742}		
		];
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
        this.title = product.title;
        this.price = product.price;
        this.id = product.id;
        this.img = product.img || img;
    }

    render() {

	    return `<div class="item" data-id="${this.id}">
					<div class="img-wrap">
						<img src="${this.img}" alt="фото товара" >
					</div>
					<div class="item-title">${this.title}</div>
					<button class="add">Добавить</button>
				</div>`;
    }
}

class Cart {

	constructor (container = '.cart') {
		this.container = container;
		this.allProducts = [];
	}

	addItem(id) {
		// Добавить товар в корзину по id
	}

	removeItem(id) {
		// удалить товар из корзины  по id
	}

	clear() {
		// полностью очистить корзину
	}

	render() {
		// отобразить
	}

	_calcCart() {
		// подсчитать стоимость и количество товаров
	}
}

let list = new ProductsList();
list.render();

console.log(list.calcAllCost());

