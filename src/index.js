require('dotenv').config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./utils/db.js");
const userRoute = require("./routes/user.route.js");
const postRoute = require("./routes/post.route.js");
const authRoute = require("./routes/auth.route.js");
const messageRoute = require("./routes/message.route.js");
const { errorHandler } = require("./middlewares/error.middlewares.js");
const { app, server } = require("./socket/socket.js");
const path = require("path");

const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
    origin: "http://localhost:5173",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// yha pr apni api ayengi
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

app.use(errorHandler);


app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
})

server.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});