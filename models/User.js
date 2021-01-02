const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


// 스키마
const userSchema = mongoose.Schema({
    // 필드
    name:{
        type: String,
        maxlength: 50,
    }
    ,
    email:{
        type: String,
        trim: true,
        // 하나만 존재해야함
        unique:1
    },
    password:{
        type: String,
        minlength: 5,
    },
    lastname:{
        type: String,
        maxlength: 50 ,
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
// 비밀번호 암호화(몽구스에서 가져온 함수)
userSchema.pre('save', function(next){
    var user = this;// 유저정보를 가르킴

    if(user.isModified('password')){
        //user필드안에 password가 변경 될때만 실행

        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    }else{
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    //plainPassword = 1234567     암호화된 비밀번호 @1#213414 -> 같은 지 체크
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
      if(err) return cb(err); //아닐때
      cb(null, isMatch); //맞을때
      })
  }

  userSchema.methods.generateToken = function(cb) {

      var user = this;

      var token = jwt.sign(user._id.toHexString(), 'secretToken')

      // user._id + 'secretToken' = token
      // ->
      // 'secretToken' -> user._id

      user.token = token
      user.save(function(err, user){
          if(err) return cb(err)
          cb(null, user)
      })
  }

  userSchema.statics.findByToken = function( token, cb){
      var user =this;
    //   user._id + '' = token

    //  토큰을 decode 한다.
      jwt.verify(token, 'secretToken', function(err, decoded){


        user.findOne({"_id":decoded, "token":  token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);
        })
      })
  }
// 모델로 감싸주기 
const User = mongoose.model('User', userSchema)

module.exports = {User}