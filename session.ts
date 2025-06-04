import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

type Session = {
    id: string,
    username: string
}

interface RequestWithSession extends Request {
    session?: Session
}

const sessions: Session[] = []

function customSessionParser(req: RequestWithSession,res: Response, next: NextFunction){
    const sessionId = req.cookies.session_id
    if(sessionId){
        req.session = sessions.find((s)=> s.id === sessionId)
    }
    next()
}

app.use(express.json());
app.use(cors({origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(customSessionParser);
const PORT = 5600;

app.post('/login', (req: RequestWithSession,res: Response)=>{
    if(req.session){
        res.status(400).json({error: 'You are already logged in ' + req.session.username});
        return  
    }
    if(!req.body.username){
        res.status(400).json({error: 'Username is missing'})
        return 
    }

    const session = {
        id: String(Math.random()),
        username: req.body.username
    }
    sessions.push(session);

    res.cookie('session_id', session.id, {maxAge: (60 * 60 * 1000), httpOnly: true} ).json({ok: true}) // One hour
})


app.get('/sessions' , (req:RequestWithSession, res: Response)=>{
    if(!req.session){
        res.status(400).json({error: 'Log in first'});
        return;
    }
    res.json({activeSessions: sessions.map((s)=> s.username )})
})

app.listen(PORT, ()=> console.log('Server is running on port ', PORT))

