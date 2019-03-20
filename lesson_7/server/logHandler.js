const fs = require('fs');
const moment = require('moment');

let logHandler = (file, req, action, oldCart) => {
	let logItem = {};
	logItem.action = action;
	if (action === "add") {
		logItem.product_name = req.body.product_name;
	} else {
    	let find = oldCart.contents.find(el => el.id_product === +req.params.id);
		logItem.product_name = find.product_name;
	}
	
	logItem.time = moment().format('LLLL');

	fs.readFile(file, 'utf-8', (err, data) => {
		if (err) {
			console.log(`Log error: ${err}`);
		} else {
			let newLog = JSON.parse(data);
			newLog.push(logItem);
            fs.writeFile(file, JSON.stringify(newLog, null, 4), (err) => {
                if (err) {
                    console.log(`Log error: ${err}`);
                }
            })			
		}
	})
}

module.exports = logHandler;

