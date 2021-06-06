import express from 'express'
import bodyParser from 'body-parser'
import {signup,signin} from '../controllers/auth.js'

const router = express.Router();
router.use(bodyParser.json({limit: "30mb", extended : true}))
router.use(bodyParser.urlencoded({limit:"30mb", extended : true}))

router.post('/signup',signup);
router.post('/signin',signin);

export default router;