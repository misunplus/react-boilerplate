const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// 유저 정보 가져오기
const {User} = require("./models/User");

// application/x-www-form-urldncode  <-이런 데이터를 가저와서 분석
app.use(bodyParser.urlencoded({extended: true}));

// application/json <-이런 이런 데이터를 가저와서 분석
app.use(bodyParser.json());



mongoose.connect('mongodb+srv://beckia:1704misun!@boilerplate.bffjl.mongodb.net/boilerplate?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('mongoDB Connected..'))
    .catch(err => console.log(err))



app.get('/', (req,res) => res.send('Hello World!'))

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


app.listen(port, () => console.log(`example app listening on port ${port}!`))
