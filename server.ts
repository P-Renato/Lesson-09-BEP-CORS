import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
const PORT = 4050;


app.get('/', (req, res) =>{
    console.log('Requeste header is: ', req.headers)
    console.log('Request cookies is: ', req.cookies)

    res.send('Hello World!')
})

app.get('/cookie', (req,res) => {

    res.header('Set-Cookie', 'testingCookie=hello555; Expires=Wed, 31 Oct 2028 13:37:00 GMT; Secure: HttpOnly')
    res.send('Hi from cookie endpoint')
})

app.get('/easycookie', (req,res)=> {

    res.cookie('otherSessionId', 'hello123456', {expires: new Date(Date.now() + 900000), secure: true, httpOnly: true})
    res.send('Cookie set using another method')
})


// Do not do like this!! 
app.get('/lamecookie', (req,res)=> {

    res.cookie('lameSessionId', 'bad')
    res.send('Cookie set using another method')
})

app.listen(PORT, ()=> console.log('Server is running on PORT ', PORT))