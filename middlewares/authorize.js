const jwt = require('jsonwebtoken')  // ใช้งาน jwt module
const userRepo = require('../repositories/users');
require('dotenv').config()
const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY;

// สร้าง middleware ฟังก์ชั่นสำหรับ verification token
const authorization = (async (req, res, next) => {
    const authorization = req.headers['authorization']  // ดึงข้อมูล authorization ใน header
    if (!authorization) return res.status(401).json({
        message: "Unauthorized" 
    })
    const token = req.headers['authorization'].split(' ')[1]
    if (!token) return res.status(401).json({ // หากไมมีค่า token
        message: "Unauthorized"
    })
    jwt.verify(token, AUTH_SECRET_KEY, async function (err, decoded) {
        if (err) return res.status(401).json({
            message: "Unauthorized"
        })
        if (!decoded.exp) return res.status(401).json({
            message: "Unauthorized"
        })
        if (decoded.sub == "api_testing") {
            const result = await userRepo.fineOne({ account_id: decoded.id }) // ตรวจสอบ account_id ว่ามีอยู่ในฐานข้อมูลหรือไม่
            if (result) {
                if (Date.now() >= decoded.exp * 1000 || decoded.sub !== "api_testing") {
                    return res.status(401).json({
                        message: "Unauthorized"
                    })
                } else {
                    next()
                }
            } else {
                return res.status(401).json({
                    message: "Unauthorized"
                })
            }
        } else {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
    });
})

module.exports = authorization   // ส่ง middleware ฟังก์ชั่นไปใช้งาน