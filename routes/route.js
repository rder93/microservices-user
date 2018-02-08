const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const request = require('request');

const User = require('../models/users');
const UserMessage = require('../models/users_messages');
const port = 5000;


function retrieveService(serviceid, callback) {
    var options = {
        url: "http://localhost:3000/api/getService/"+serviceid,
        method: "GET",
        json: true
    };
    request(options, function (error, response, body) {
        if (response.statusCode == 200) {
            callback(null, body);
        }else{
            callback(error, null);
        }
    });
};


//retrieving all users
router.get('/users', (req, res, next) => {
    User.find(function(err, users) {
        res.status(200).json(users);
    })
});

//retrieving all messages
router.get('/messages/:id', (req, res, next) => {
    UserMessage.find({"service.user._id": req.params.id}, function(err, usermessages) {
        if (err) {
            res.status(500).json(err);
        }
        res.status(200).json(usermessages);
    });

});


router.get('/message/:id', (req, res, next) => {
    UserMessage.findOne({_id: req.params.id}, function(err, usermessage) {
        if (err) {
            res.status(500).json(err);
        }
        res.status(200).json(usermessage);
    });

});
//retrieve one user
router.get('/user/:id', (req, res, next) => {
    User.findOne({ _id: req.params.id }, function(err, user) {
        if (err) {
            res.status(500).json({error: "No existe el usuario"});
        }

        res.status(200).json(user);

    });
});

//retrieve one user by email
router.get('/user/:email/:password', (req, res, next) => {
    let password = req.params.password;
    User.findOne({ email: req.params.email, password: req.params.password}, function(err, user) {
        if (user) {
            res.status(200).json({"msg":"Has iniciado sesión exitosamente...", "user": user});
            res.end();
        }else{
            res.status(500).json({ "error": 'Email o password incorrecta. Verifique los datos...'});
            res.end();
        }
        // console.log(req.params.password);
        // if (err) {
        //     res.status(500).json({ "error": 'Email o password incorrecta. Verifique los datos...'});
        // }else if (user.password == password) {
        //     res.status(200).json({"msg":"Has iniciado sesión exitosamente...", "user": user});
        // }else {
        //     res.status(500).json({ "error": 'Email o password incorrecta. Verifique los datos...'});
        // }

    });
});

//retrieve one user comment
router.get('/usercomment/:id', (req, res, next) => {
    UserComment.findOne({ _id: req.params.id }, function(err, usercomment) {
        if (err) {
            res.json(err);
        }

        res.json(usercomment);

    });
});


//add user
router.post('/user', (req, res, next) => {

    User.find({email : req.body.email}, function (err, user) {
        if (user.length){
            if (user[0].email) {
                res.status(500).json({ "error": 'El email que has escrito ya existe...' });
                res.end();
            }else{
                res.status(500).json({ "error": 'El username que has escrito ya existe...' });
                res.end();
            }
        }else{

            let message = new UserMessage({
                service: req.body.name,
                password: req.body.password,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
            });

            // console.log(req.body);

            newUser.save((err, user) => {
                if (err) {
                    res.status(500).json({ "error": 'Ha ocurrido un error. Intente nuevamente' });
                    res.end();
                } else {
                    res.status(200).json({ "msg": 'La cuenta ha sido creada satisfactoriamente.', user: user});
                    // console.log({ "msg": 'La cuenta ha sido creada satisfactoriamente.', user: user});
                    res.end();
                }
            });
        }
    });
});

router.post('/message', (req, res, next) => {

    // console.log(req.body);

    User.find({_id : req.body.userid}, function (err, user) {
        if (err) {
            res.status(500).json({ "error": 'Ha ocurrido un error. Intente nuevamente' });
            res.end();
        }else{
            
            retrieveService(req.body.serviceid, function(error, response){

                let message = new UserMessage({
                    subject: req.body.subject,
                    message: req.body.message,
                    service: response,
                    postedBy: user[0]
                });

                message.save((err, user) => {
                    if (err) {
                        res.status(500).json({ "error": 'Ha ocurrido un error. Intente nuevamente' });
                        res.end();
                    } else {
                        res.status(200).json({ "msg": 'El mensaje ha sido enviado satisfactoriamente.', message: user});
                        // console.log({ "msg": 'El mensaje ha sido enviado satisfactoriamente.', message: user});
                        res.end();
                    }
                });

            });
        }

    });
});

//delete user
router.delete('/user/:id', (req, res, next) => {
    User.remove({ _id: req.params.id }, function(err, result) {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});


//update user
router.put('/user/:id', (req, res, next) => {
    User.findOneAndUpdate({ _id: req.params.id }, {
            $set: {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            }
        },
        function(err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("successs");

            }
        });
});

module.exports = router;