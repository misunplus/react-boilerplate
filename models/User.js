const mongoose = require('mongoose');

// 스키마
const userSchema = mongoose.Schema({
    // 필드
    name:{
        type: String,
        maxlenght: 50
    }
    ,
    email:{
        type: String,
        trim: true,
        // 하나만 존재해야함
        unique:1
    },
    paswword:{
        type: String,
        maxlenght: 5
    },
    lastname:{
        type: String,
        maxlenght: 50 
    },
    //관리자1  일반유저0  기본값0
    role:{
        type: Number,
        default: 0,
    },
    // 오브젝트를 사용하지 않아도 됨
    image:String,
    // 유효성
    token: {
        type: String
    },
    //토큰을 사용할 기간 
    tokenExp:{
        type: Number
    }
})


// 모델로 감싸주기 
const User = mongoose.model('User', userSchema)

module.exports = {User}