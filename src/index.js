const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("../firebaseConfig.js");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const analyticsRouter = require("./routers/analytics");
const usersRouter = require("./routers/users");
const chatsRouter = require("./routers/chats");

var corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use("/analytics", analyticsRouter);
app.use("/users", usersRouter);
app.use("/chats", chatsRouter);

app.get("/run-analytics", async (req, res) => {
  res.status(200).send("hi");
});

app.get("/", async (req, res) => {
  res.status(200).send("hi");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
