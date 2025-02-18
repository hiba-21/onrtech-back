const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const app = require("./App");
const serverless = require('serverless-http');
const express = require('express');

const app = express();
 
app.use(cors({
    origin: ["https://onrtech-front.vercel.app"],
    methods: ["GET,POST,DELETE,PUT,PATCH"],
    credentials: true,
}));

const handler = serverless(app, { provider: 'azure' });
module.exports.funcName = async (context, req) => {
  context.res = await handler(context, req);
}
// DB Connection
const DBConnectionHandler = require("./Utils/DBconnect");
DBConnectionHandler();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("ONRWEB Server is running!");
});
// 404 Error handler
app.use("*", (req, res) => {
    res.status(404).json({ message: "Not Found" });
});

// Error Handeling Middleware(default synchronous error handling middleware from express)
app.use((err, req, res, next) => {
    if (res.headersSent) {
        next("There was a problem");
    } else {
        if (err.message) {
            res.status(err.status || 500).send(err.message);
        } else {
            res.status(500).send("Something went wrong");
        }
    }
});

/*app.use(express.static("./client-main/dist"));
app.get("*",(req,res) => {
    res.sendFile(path.resolve(__dirname,"client-main","dist","index.html"))
});*/


/*app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});*/
