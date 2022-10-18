const jwt = require('jsonwebtoken')  // ใช้งาน jwt module
const controllers = require('../controllers/index');
const fs = require('fs') // ใช้งาน file system module ของ nodejs

// สร้าง middleware ฟังก์ชั่นสำหรับ verification token
const authorization = (async (req, res, next) => {
    // ใช้ค่า privateKey เ็น buffer ค่าที่อ่านได้จากไฟล์ private.key ในโฟลเดอร์ config
    const privateKey = fs.readFileSync(__dirname + '/../config/private.key')
    const authorization = req.headers['authorization']  // ดึงข้อมูล authorization ใน header
    // ถ้าไม่มีการส่งค่ามา ส่ง ข้อความ json พร้อม status 401 Unauthorized
    if (!authorization) return res.status(401).json({
        "status": false,
        "message": "Unauthorized"
    })
    const token = req.headers['authorization'].split(' ')[1]
    if (!token) return res.status(401).json({ // หากไมมีค่า token
        "status": false,
        "message": "Unauthorized"
    })
    jwt.verify(token, privateKey, async function (err, decoded) {
        if (err) return res.status(401).json({
            "status": false,
            "message": "Unauthorized" // error.sqlMessage
        })
        if (decoded.exp === undefined) return res.status(401).json({
            "status": false,
            "message": "Unauthorized" // error.sqlMessage
        })
        if (decoded.Sub == "{{ชื่อ Token}}") {
            const result = await controllers.users.GetByID(decoded.ID);
            if (result) {
                if (Date.now() >= decoded.exp * 1000 || decoded.Sub !== "{{ชื่อ Token}}") {
                    return res.status(401).json({
                        "status": false,
                        "message": "Unauthorized" // error.sqlMessage
                    })
                } else {
                    next()
                }
            } else {
                return res.status(401).json({
                    "status": false,
                    "message": "Unauthorized" // error.sqlMessage
                })
            }
        } else {
            return res.status(401).json({
                "status": false,
                "message": "Unauthorized" // error.sqlMessage
            })
        }
    });
})

module.exports = authorization   // ส่ง middleware ฟังก์ชั่นไปใช้งาน