
const { check, validationResult } = require('express-validator');

let checkFields = [
        check('name').not().isEmpty(),
        check('email').not().isEmpty().isEmail(),
        check('password').not().isEmpty()
];
            


let NeDB = require('nedb');
//const { user } = require('../utils/validator');

let db = new NeDB({
    filename: 'users.db',
    autoload:true
});


module.exports = app => {

    let route = app.route('/users');

    route.get((req, res) =>{

        db.find({}).sort({name: 1}).exec((err, users) => {
            if (err){
                app.utils.error.send(err, req, res); // como o codigo 400 é padrão, nao precisamos passar
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    users // quando a chave tem o mesmo nome do valore, precisamos apenas informar um dos nomes
                });
            }

        });

    });

    let routeId = app.route('/users/:id'); 

    routeId.get((req, res) => {
        db.findOne({_id:req.params.id}).exec((err, user) => {
            if (err){
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(user);
            }
        });
    });


    
    routeId.put(checkFields, (req, res) => {

        let errors = validationResult(req);
         
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            db.update({_id:req.params.id}, req.body, err => {
                if (err){
                    app.utils.error.send(err, req, res);
                } else {
                    res.status(200).json(Object.assign(req.params, req.body));
                }
            }); 
        }
    }); 

   

    route.post(checkFields,
        (req, res) => {
        
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            db.insert(req.body, (err, user) => {
                if (err) {
                    app.utils.error.send(err, req, res);
                } else {
                    res.status(200).json(user);
                }
            });
        }


    });

    routeId.delete((req, res) => {
        db.remove({_id:req.params.id},{}, err => {
            if (err){
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(req.params);
            }
        });
    });


};