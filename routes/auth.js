const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken') // ใช้งาน jwt module
const { uuidv7 } = require("uuidv7");
require('dotenv').config()
const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY;
const userRepo = require('../repositories/users');



router.route('/user/signup')
    .post(async (req, res, next) => {
        try {
            const { username, password, fist_name, last_name } = req.body
            const user = await userRepo.fineOne({ username })
            if (user) {
                return res.status(400).json({ message: 'Username already exists' });
            } else {
                const saltRounds = 12;
                const account_id = uuidv7();

                bcrypt.genSalt(saltRounds, function (err, salt) {
                    if (salt) {
                        bcrypt.hash(`${account_id}${password}`, salt).then(async function (hash) {
                            if (hash) {
                                const Creating = await userRepo.create({
                                    account_id,
                                    username,
                                    password: hash,
                                    fist_name,
                                    last_name
                                })
                                res.status(201).json({
                                    message: 'Sign-up successfully',
                                    user: {
                                        id: Creating.id,
                                        username: Creating.username,
                                        account_id: Creating.account_id
                                    }
                                });
                            } else {
                                res.status(500).json({ message: 'Server error, unable to hash password' });
                            }
                        });
                    } else {
                        res.status(500).json({ message: 'Server error, unable to generate salt' });
                    }
                })
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Internal server error' });
        }
    })


router.route('/user/signin')
    .post(async (req, res, next) => {
        try {
            const { username, password } = req.body
            const User = await userRepo.fineOne({ username })
            if (User) {
                bcrypt.compare(`${User.user_id}${password}`, User.password).then(async function (match) {
                    if (match) {
                        const access_token = jwt.sign({
                            sub: "api_testing", // ตั้งชื่อ Token
                            id: User.user_id, // ข้อมูลที่จะนำไปใส่ใน token แนะนำเป็น ID ของ user
                        }, AUTH_SECRET_KEY, { expiresIn: '1h' }); // ตั้งเวลา token
                        const token = {
                            token_type: 'Bearer',
                            access_token,
                        }
                        delete access_token.password
                        res.status(200).json({
                            message: 'Sign-in successfully',
                            user: {
                                id: User.user_id,
                                username: User.username,
                                account_id: User.account_id
                            },
                            token
                        });
                    } else {
                        res.status(401).json({ message: 'Password is incorrect' });
                    }
                });
            } else {
                res.status(404).json({ message: 'Username not found' });
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Internal server error' });
        }
    })




module.exports = router