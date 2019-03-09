const text = `
One: 'Hi Mary.' Two: 'Oh, hi.'
One: 'How are you doing?'
Two: 'I'm doing alright. How about you?'
    One: 'Not too bad. The weather is great isn't it?'
    Two: 'Yes. It's absolutely beautiful today.'
One: 'I wish it was like this more frequently.'
Two: 'Me too.'
One: 'So where are you going now?'
Two: 'I'm going to meet a friend of mine at the department store.'
One: 'Going to do a little shopping?'
Two: 'Yeah, I have to buy some presents for my parents.'
One: 'What's the occasion?'
    Two: 'It's their anniversary.'
One: 'That's great. Well, you better get going. You don't want to be late.'
Two: 'I'll see you next time.'
One: 'Sure. Bye.'
`;

// 1. Придумать шаблон, который заменяет одинарные кавычки на двойные. 

const newText = text.replace(/'/g, '"');
console.log(newText);

// 2. Придумать шаблон, который заменяет одинарные кавычки на двойные. 

const newTextVar2 = text.replace(/\B'/g, '"');
console.log(newTextVar2);

// 3. Создать форму обратной связи

class JSMailer {

	constructor(formName = '#myForm') {

		this.form = document.querySelector(formName);
		this.formData = {};
		this.validator = new Map ([
			['name', /^[a-zA-Zа-яА-ЯёЁ]+/],
			['phone', /^\+7\(\d{3}\)\d{3}-\d{4}$/],
			['email', /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/],
			['text', /[^\s]+/]
		]);
		this._init()
	}

	_init() {

		this.form.addEventListener('submit', e => {
			e.preventDefault();
			this.formData = new FormData(this.form);
			if (this._validate()) {
				this._sending()
			}
		})
	}

	_sending() {

		// посылаем сообщение на обработчик mailer.php - простая заглушка
		fetch('mailer.php', {
				method: 'post',
				body: this.formData
			}).then(response => {
				return response.json()
			}).then(data => {
				// отправлено успешно
				console.log('Сообщение успешно отправлено');
				this._clearInputs()
			}).catch(error => {
				// ошибка отправления
				console.error(error)
			});
	}

	_validate() {

		let valid = true;
		this.validator.forEach((reg, field) => {
			const blockHelp = document.querySelector(`#${field}Help`);
			const blockInput = document.querySelector(`[name=${field}]`);
			if (reg.test(this.formData.get(field))) {
				// проверка поля пройдена
				blockHelp.classList.add('hidden');
				blockInput.classList.remove('red-border')
			} else {
				// проверка не пройдена
				valid = false;
				blockHelp.classList.remove('hidden');
				blockInput.classList.add('red-border')

			}
		})
		return valid
	}

	_clearInputs() {

		// очистка полей после удечной отправки формы
		let inputs = this.form.querySelectorAll('input');
		inputs.forEach(el => {
			el.value = '';
		});
		let textareas = this.form.querySelectorAll('textarea');
		textareas.forEach(el => {
			el.value = '';
		});				
	}
}

const jsMailer = new JSMailer();