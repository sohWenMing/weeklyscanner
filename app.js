const express = require('express');
const axios = require('axios');
const app = express();
const path = require("path");
app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));


const indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.listen(3000, () => {
    console.log('getting something on port 3000');
})