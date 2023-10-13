const express = require('express');
const axios = require('axios');
const app = express();
const path = require("path");
app.set('view engine', 'ejs')
const PORT = process.env.PORT || 3000;
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));


const indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.listen(PORT, () => {
    console.log(`getting something on ${PORT}`);
})