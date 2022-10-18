const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const db = require("./models"); // import db from models/index.js
const app = express();
const httpServer = require("http").createServer(app);
require('dotenv').config()
const port = process.env.PORT; // port

//Setting
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(
  bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 5 })
);
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(async (req, res, next) => {
  var allowedOrigins = [];
  var origin = req.headers.origin;
  res.header("Access-Control-Allow-Credentials", true);
  if (allowedOrigins.indexOf(origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', origin ? origin : '*');
  }
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTION,PATCH");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Option, Authorization"
  );
  if ("OPTIONS" == req.method) {
    res.sendStatus(200); //200 is OK
  } else {
    next();
  }
});

// Import routes
const users = require("./routes/users");





// เรียกใช้งาน Index router
app.get("/", function (req, res) {
  res.status(200).json("Welcome to MY API");
});

app.use("/", [
  users
]);

db.sequelize.sync({ alter: false }).then(() => { // ตั้ง alter เป็น true ก็ต่อเมื่อต้องการ update database
    httpServer.listen(port, () => {
    console.log("==============================");
    console.log();
    console.log(`Server is running on port ${port}`);
    console.log();
    console.log("==============================");
    });
});
