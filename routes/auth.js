const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken') // ใช้งาน jwt module
const http = require('../config/http');
const controllers = require('../controllers/index');


router.route('/user/signup')
    .post(async (req, res, next) => {
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
                                    http.response(res, 201, true, 'Sign-Up successful');
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


router.route('/user/signin')
    .post(async (req, res, next) => {
        try {
            const result = await controllers.users.GetByUsername(req.body.username);
            if (result) {
                bcrypt.compare(req.body.password, result.password).then(async function (match) {
                    if (match) {
                        const privateKey = fs.readFileSync(__dirname + '/../config/private.key')
                        var AccessToken = jwt.sign({
                            "Sub": "{{ชื่อ Token}}", // ตั้งชื่อ Token
                            "ID": result.id, // ข้อมูลที่จะนำไปใส่ใน token แนะนำเป็น ID ของ user
                        }, privateKey, { expiresIn: '1h' }); // ตั้งเวลา token
                        var token = {
                            token_type: 'Bearer',
                            access_token: AccessToken
                        }
                        delete result.password
                        http.response(res, 200, true, 'Sign-in successful', result, token);
                    } else {
                        http.response(res, 404, false, 'Password is incorrect');
                    }
                });
            } else {
                http.response(res, 404, false, 'This account is not administrator')
            }
        } catch (e) {
            console.log(e);
            http.response(res, 500, false, 'Internal server error')
        }
    })




module.exports = router