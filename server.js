const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const https = require("https");
const fs = require("fs");
// multer for saving of images
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

// require routes
const productRoutes = require("./routes/product");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/order");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", [
        "http://localhost:4200",
        "https://kneiterlegitiem.nl",
    ]);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With, Origin, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "PUT, GET, POST, PATCH, DELETE, OPTIONS"
    );

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});

//app.use routes
app.use("/products", productRoutes);
app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

const httpsServer = https.createServer(
    {
        key: fs.readFileSync(
            "/etc/letsencrypt/live/kneiterlegitiem.nl/privkey.pem"
        ),
        cert: fs.readFileSync(
            "/etc/letsencrypt/live/kneiterlegitiem.nl/fullchain.pem"
        ),
    },
    app
);

mongoose
    .connect(process.env.DB_CONNECT)
    .then((result) => {
        httpsServer.listen(8080, () => {
            console.log("listening on https port 8080");
        });
    })
    .catch((err) => console.log(err));
