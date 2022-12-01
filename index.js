const express = require('express');
const cors = require('cors'); // so that server sends data to ports thar we require

const app = express();
app.use(express.json());
app.use(cors());

require("dotenv").config({ path: "./config.env" });
const connectDb = require("./utils/connectDb.js");
connectDb();

const PORT  = process.env.PORT || 8080; // need to setup port value in .env file

//Routes
app.use('/api', require('./api/task'));


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})