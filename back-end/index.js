const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const seedRouter = require("./routes/seedRoutes.js");
const productRouter = require("./routes/productRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const orderRouter = require("./routes/orderRoutes.js");
const { isAuth } = require("./utils.js");

dotenv.config();
const PORT = 5000;

const app = express();
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);

app.set("trust proxy", 1);
app.use(
  session({
    secret: "keyboard cat",
    name: "ameer2",
    resave: true,
    saveUninitialized: true,

    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/session", (req, res) => {
  req.session.view = (req.session.view || 0) + 1;
  res.json({ viewCount: req.session.view });
});
app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use(express.static(path.join(__dirname, "/client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../front-end/build/index.html"));
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: err.message });
});

const mongoUrl =
  "mongodb+srv://admin:admin@shopping-data.adnwqep.mongodb.net/?retryWrites=true&w=majority";
mongoose.connection.once("open", () => console.log("connected to mongoDB"));
try {
  mongoose.connect(mongoUrl);
} catch (err) {
  console.log(err);
}

app.listen(PORT, console.log(`The server is running on port:${PORT}`));
