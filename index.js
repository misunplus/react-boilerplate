const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');

// 유저 정보 가져오기
const {User} = require("./models/User");

// application/x-www-form-urldncode  <-이런 데이터를 가저와서 분석
app.use(bodyParser.urlencoded({extended: true}));

// application/json <-이런 이런 데이터를 가저와서 분석
app.use(bodyParser.json());
app.use(cookieParser());


mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('mongoDB Connected..'))
    .catch(err => console.log(err))



app.get('/', (req,res) => res.send('Hello World!nn'))

app.post('/register', (req, res) => {
    // 회원가입에 필요한 정보를 클라이언트에서 가져오면
    //그것을 데이터 베이스에 넣기.

    // 인스턴트 생성
    const user = new User(req.body)

    // mongoDB 메서드
    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})


app.post("/login", (req, res) => {
    // 1.  요청된 이메일을 데이터베이스에 있는지 찾기
    User.findOne({ email: req.body.email}, (err, user) => {
      if(!user) {
        return res.json({
          loginSuccess: false,
          message : "제공된 이메일에 해당하는 유저가 없습니다."
        })
      }

      // 2. 요청된 이메일이 있다면 비밀번호가 맞는 비밀번호인지 확인


      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch)
          return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."
        })
        // 3. 비밀번호 까지 맞다면 토큰을 생성하기
        user.generateToken((err,user) => {
          if(err) return res.status(400).send(err)

          // 토큰을 저장한다. 어디에? 들어있는 토큰 저장 (쿠키, 로컬스트리지)
          res.cookie("x_auth",user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id})
        })
      })
    })
})

app.listen(port, () => console.log(`example app listening on port ${port}!`))
