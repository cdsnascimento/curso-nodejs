
let NeDB = require('nedb');
let db = new NeDB({
    filename: 'users.db',
    autoload:true
});

module.exports = (app) => {

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

    route.post((req, res) =>{

        db.insert(req.body, (err, user) => {
            if (err){
                app.utils.error.send(err, req, res);
            }else{
                res.status(200).json(user);
            }
        });

    });

};