const express = require('express');
const app = express();
const port = 8080; 
const path = require('path');
const fs = require('fs');
const cors = require('cors');

app.use(cors());
// 경로 확인 
// app.get('/', function (req, res){
//     console.log('현재 실행중인 파일의 디렉터리 절대 경로 : '+__dirname);
// });

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/public/signup.html');
});

app.get('/checkpostlist', (req, res) => {
  res.sendFile(__dirname + '/public/checkpostlist.html');
});

app.get('/createpost', (req, res) => {
  res.sendFile(__dirname + '/public/createpost.html');
});

app.get('/detailpost', (req, res) => {
  res.sendFile(__dirname + '/public/detailpost.html');
});

app.get('/modifyinfo', (req, res) => {
  res.sendFile(__dirname + '/public/modifyinfo.html');
});

app.get('/modifypasswd', (req, res) => {
  res.sendFile(__dirname + '/public/modifypasswd.html');
});

app.get('/moidifypost', (req, res) => {
  res.sendFile(__dirname + '/public/modifypost.html');
});

app.use((req, res, next) => {
  res.status(404).send('not found');
})

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message)
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


