const fs = require('fs');
const cart = require('./cart');
const logHandler = require('./logHandler');

const actions = {
    add: cart.add,
    change: cart.change,
    del: cart.del
}

let handler = (req, res, action, file) => {
    fs.readFile(file, 'utf-8', (err, data) => {
        if(err){
            res.sendStatus(404, JSON.stringify({result: 0, text: err}))
        } else {
            logHandler('server/db/log.json', req, action, JSON.parse(data));
            
            let newCart = actions[action](JSON.parse(data), req);

            fs.writeFile(file, newCart, (err) => {
                if(err){
                    res.send('{"result": 0}');
                } else {
                    res.send('{"result": 1}');
                }
            })
        }
    });

    

};

module.exports = handler;