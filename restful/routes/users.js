
const { check, validationResult } = require('express-validator');

let yourValidationChains =  [
                            check('name','O nome é obrigatório.').notEmpty(),
                            check('email','O Email está inválido.').notEmpty().isEmail()
                            ];



let NeDB = require('nedb');
const { user } = require('../utils/validator');

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

    routeId.put((req, res) => {
        db.update({_id:req.params.id}, req.body, err => {
            if (err){
                app.u.error.send(err, req, res);
            } else {
                res.status(200).json(Object.assign(req.params, req.body));
            }
        });
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

    route.post(yourValidationChains,(req, res) => {
        
        if (!app.utils.validator.user(app, req, res)) return false;

        db.insert(req.body, (err, req, res) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(user);
            }
        });
    });


/* 
    route.post(yourValidationChains, (req, res) =>{

        let errors = validationResult(req);

                    if (!errors.isEmpty()){

                        app.utils.error.send(errors, req, res);
                        return false;
                    }

                    db.insert(req.body, (err, user) => {
                        if (err){
                            app.utils.error.send(err, req, res);
                        }else{
                            res.status(200).json(user);
                        }
                    });

    });
     */

};