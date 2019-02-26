const products = {
	items: [
		{id: 1, title: 'Фитнес-браслет Xiaomi', price: 1992, img: 'https://ozon-st.cdn.ngenix.net/multimedia/c1200/1024317529.jpg'},
		{id: 1, title: 'Экшн-камера Motorola VERVECAM', price: 4886, img: 'https://ozon-st.cdn.ngenix.net/multimedia/c1200/1024079673.jpg'},
		{id: 1, title: 'Телевизор Fusion FLTV-40C100T', price: 12188, img: 'https://ozon-st.cdn.ngenix.net/multimedia/c1200/1024408365.jpg'},
		{id: 1, title: 'Будильник Philips Wake-up', price: 3221, img: 'https://ozon-st.cdn.ngenix.net/multimedia/c1200/1026294862.jpg'},
		{id: 1, title: 'Смартфон Honor 10 Lite 32GB', price: 13941, img: 'https://ozon-st.cdn.ngenix.net/multimedia/1026952805.jpg'},
		{id: 1, title: 'Silver экшн-камера', price: 3400, img: 'https://ozon-st.cdn.ngenix.net/multimedia/c1200/1017469604.jpg'},
		{id: 1, title: 'Радиотелефон Gigaset E630', price: 842, img: 'https://ozon-st.cdn.ngenix.net/multimedia/c1200/1025711951.jpg'},
		{id: 1, title: 'Sony Cyber-shot DSC-W830', price: 7742, img: 'https://ozon-st.cdn.ngenix.net/multimedia/c1200/1009002188.jpg'}	
	]
};

const renderProduct = (title, img) => {
    return `<div class="item">
				<div class="img-wrap">
					<img src="${img}" alt="фото товара" >
				</div>
				<div class="item-title">${title}</div>
				<button class="add">Добавить</button>
			</div>`
};

const renderPage = list => {
    const productsList = list.reduce((result, item) => result + renderProduct(item.title, item.img), '');
    document.querySelector('.container').innerHTML = productsList;
};

renderPage(products.items);

