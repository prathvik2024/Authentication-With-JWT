const express = require("express");
const app = express();
const router = require('./router/userRoutes');
const cookieParser = require("cookie-parser")

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", router);

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
})