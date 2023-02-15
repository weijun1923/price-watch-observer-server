const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); 

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minLength:3,
        maxLength:50,
    },
    email:{
        type:String,
        required:true,
        minLength:5,
        maxLength:100,
    },
    password:{
        type:String,
        required:true,
        minLength:6,
        maxLength:1024,
    },
    date:{
        type:Date,
        default:Date.now
    }
});

// 資料儲存前將密碼加密
userSchema.pre("save" , async function(next) {
    // 如果密碼有變更或者新增
    if(this.isModified("password") || this.isNew) {
        // 將密碼加密
        const hash = await bcrypt.hash(this.password,10);
        this.password = hash;
        next();
    } else {
        return next();
    }
});

// 登入時密碼比對
userSchema.methods.comparsPassword = function(password, cb) {
    // 使用者密碼 與 資料庫密碼比對
    bcrypt.compare(password, this.password,(err, isMatch) => {
        if(err) {
            return cb(err, isMatch);
        } else {
            cb(null, isMatch);
        }
    });
};

module.exports = mongoose.model("User" , userSchema);