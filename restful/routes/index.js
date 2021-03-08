let express  = require('express');
let routesUsers = express.Router();

routesUsers.get('/', (req, res) =>{//ROTA PRINCIPAL

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Olá</h1>');

});

module.exports = routesUsers;

