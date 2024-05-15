const express = require('express')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/connectDB')
const router = require('./routes/index')
const cookiesParser = require('cookie-parser')
const { app, server } = require('./socket/index')

// const app = express()
const whitelist = ["https://ssvamsee.github.io/", "https://ssvamsee.github.io/chatapp", "http://localhost:3000", "http://localhost:4000"]
function checkReferer(req, res, next) {
    const referer = req.headers.referer || '';
    if (whitelist.some(allowedReferer => referer.startsWith(allowedReferer)) || !referer) {
      if (referer) {
        req.headers.origin = referer;
      }
      next();
    } else {
      res.status(403).json({ error: 'Not allowed by CORS' });
    }
  }
  app.use(checkReferer);

  const corsOptions = {
    origin: function (origin, callback) {
      callback(null, true);
    },
    credentials:true
  };
  
app.use(cors(corsOptions));

app.use(express.json())
app.use(cookiesParser())

const PORT = process.env.PORT || 8080

app.get('/',(request,response)=>{
    response.json({
        message : "Server running at " + PORT
    })
})

//api endpoints
app.use('/api',router)

connectDB().then(()=>{
    server.listen(PORT,()=>{
        console.log("server running at " + PORT)
    })
})
