const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const http = require('../config/http');
const controllers = require('../controllers/index');
const authorization = require('../config/authorize'); // ตัวเช็ค Token


router.route('/users')
    .post(authorization, async (req, res, next) => {
        try {
            const user = await controllers.users.GetByUsername(req.body.username);
            if(user){
                http.response(res, 404, false, 'Username is duplicate')
                return
            }else{
                const saltRounds = 12;
                bcrypt.genSalt(saltRounds, function (err, salt) {
                    if (salt) {
                        bcrypt.hash(req.body.password, salt).then(async function (hash) {
                            if (hash) {
                                req.body.password = hash
                                req.body.created_at = new Date()
                                const Creating = await controllers.users.Insert(req.body)
                                if (Creating) {
                                    http.response(res, 201, true, 'Created successful');
                                } else {
                                    http.response(res, 400, false, 'Bad request, unable to created data');
                                }
                            } else {
                                http.response(res, 404, false, 'Server error, unable encryption password')
                            }
                        });
                    } else {
                        http.response(res, 404, false, 'Server error, unable gen salt password')
                    }
                })
            }
        } catch (e) {
            console.log(e);
            http.response(res, 500, false, 'Internal server error')
        }
    })
    .get(authorization ,async (req, res, next) => {
        try {
            const result = await controllers.users.List();
            if (result) {
                http.response(res, 200, true, 'Get successful', result)
            } else {
                http.response(res, 400, false, 'Bad request, unable to query data')
            }
        } catch (e) {
            console.log(e);
            http.response(res, 500, false, 'Internal server error')
        }
    })
    
router.route('/user/:id')
    .put(authorization ,async (req, res, next) => {
        try {
            const ID = req.params.id
            if(req.body.password){
                delete req.body.password
            }
            const result = await controllers.users.Update(req.body, ID);
            if (result.affectedRows > 0) {
                http.response(res, 200, true, 'Update successful')
            } else {
                http.response(res, 204, false, 'No Content, no data in entity')
            }
        } catch (e) {
            console.log(e);
            http.response(res, 500, false, 'Internal server error')
        }
    })
    .get(authorization, async (req, res, next) => {
        try {
            const ID = req.params.id
            const result = await controllers.users.GetByID(ID);
            if (result) {
                delete result.password
                http.response(res, 200, true, 'Get successful', result)
            } else {
                http.response(res, 204, false, 'No Content, no data in entity')
            }
        } catch (e) {
            console.log(e);
            http.response(res, 500, false, 'Internal server error')
        }
    })
    .delete(authorization, async (req, res, next) => {
        try {
            const ID = req.params.id
            const result = await controllers.users.Delete(ID);
            if (result.affectedRows > 0) {
                http.response(res, 200, true, 'Deleted successful')
            } else {
                http.response(res, 400, false, 'Bad request, unable to query deleted')
            }
        } catch (e) {
            console.log(e);
            http.response(res, 500, false, 'Internal server error')
        }
    })




module.exports = router