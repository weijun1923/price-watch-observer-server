const express =  require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const cors = require("cors");
const passport = require("passport");
require("./config/passport")(passport);

// mongodb atlas connect
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(() => {
    console.log("Connect to mongodb atlas connect");
})
.catch((e) => {
    console.log(e);
});

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));//body parser
app.use(cors());
// loing and register middleware
app.use("/api/user" , authRoute);

app.head("/" , (req , res) => {
    res.status(200).end();
    console.log("--- UptimeRobot wakeup request ---");
});

// listen
const port = process.env.PORT || 8080;
app.listen(port, () =>{
    console.log(`Server running on port ${port}`);
});