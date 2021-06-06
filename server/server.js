import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/auth.js'

dotenv.config();

const app = express();

mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
.then(()=>console.log('DB Connected'));

app.use(bodyParser.json());
app.use(cors());
app.use('/gurukul',router);

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log('server is running on '+port)
});