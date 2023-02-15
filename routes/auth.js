const router = require("express").Router();
const registerValidation = require("../vaildation").registerValidation;
const loginValidation = require("../vaildation").loginValidation;
const User = require("../models").userModel;
const { compare } = require("bcrypt");
const jwt = require("jsonwebtoken");



router.use((req, res, next) => {
    console.log("a request is coming in to auth.js");
    next();
});

router.get("/testAPI", (req, res) => {
    const msgObj = {
        message:"Text api is working"
    };
    return res.json(msgObj);
});

router.post("/register", async(req, res) => {
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist) return res.status(400).send("信箱已經有人註冊過了");
    const newUser = new User({
        email:req.body.email,
        username:req.body.username,
        password:req.body.password,
    });
    try{
        const savedUser = await newUser.save();
        res.status(200).send({
            msg:"資料新增成功",
            savedObject:savedUser,
        });
    } catch (err) {
        res.status(400).send("資料新增失敗");
    }
});

router.post("/login", (req, res) => {
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    User.findOne({email:req.body.email},function(err,user){
        if(err) {
            res.status(400).send("無法找到使用者帳戶");
        }else{
            user.comparePassword(req.body.password, function(err, isMatch) {
                if(err) return res.status(400).send(err);
                if(isMatch) {
                    const tokenObject = {_id:user._id, email:user.email};
                    const token = jwt.sign(tokenObject,process.env.PASSPORT_SECRET);
                    res.send({success:true, token:"JWT" + token,user})
                } else {
                    console.log(err);
                    res.status(401).send("密碼錯誤");
                }
            });
        }
    });
});

module.exports = router;
