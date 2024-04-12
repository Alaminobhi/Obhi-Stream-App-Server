const express = require('express');
const app = express();
const http = require("http");
const { Server } = require('socket.io')

const bodyParser = require('body-parser');
const cors = require("cors");
const mediaRoutes = require("./routes/media");
const path = require("path");
const connectToDB = require('./utils/database');
const {routers} = require('./router')
const fs = require('fs');
const {fork} = require("child_process") 
const spawn = require('child_process').spawn;
const ffmpegStatic = require('ffmpeg-static');
const { createCanvas } = require('canvas');

app.server = http.createServer(app);
// app.wss = new Server({server: app.server});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
connectToDB();
app.use(cors())
app.use(cors({exposedHeaders: '*'}));


const uploadRouter = require('./routes/upload');
const deleteRouter = require('./routes/delete');
const crexmatch = require('./routes/crexmatch');
const crexlives = require('./routes/crexlive');
const crexmatch1 = require('./routes/crexmatchlinks');
const crexlives2 = require('./routes/crex2live');
const cricbuzzlive = require('./routes/cricbuzzlive');

app.use('/', cricbuzzlive);
app.use('/', crexmatch);
app.use('/', crexlives);
app.use('/', crexmatch1 );
app.use('/', crexlives2);
app.use('/', uploadRouter);
app.use('/', deleteRouter);
// app.wss.on('connection', (ws) => {
//   console.log();
// }) 
// app.use(express.static('output_dash'));
app.use("/api/v1/media", mediaRoutes);
// app.use("/public", express.static(path.join(__dirname, "public")));

const {
  inputSettings,
  twitchSettings,
  youtubeSettings,
  facebookSettings,
  customRtmpSettings,
} = require('./ffmpeg')


app.routers = routers(app);

// const config = {
//   rtmp: {
//     port: 1935,
//     chunk_size: 60000,
//     gop_cache: true,
//     ping: 30,
//     ping_timeout: 60
//   },
//   http: {
//     port: 8000,
//     allow_origin: '*'
//   },
//   // relay: {
//   //   ffmpeg: ffmpegPath,
//   //   tasks: [
//   //     {
//   //       app: 'live',
//   //       mode: 'push',
//   //       edge: 'rtmps://live-api-s.facebook.com:443/rtmp/FB-239969042429073-0-AbzreEAxwYFPsX18',
//   //     }
//   //   ]
//   // }
// };

// var nms = new NodeMediaServer(config)
// nms.run();


const PORT = process.env.PORT || 5000;
// const WS_PORT = process.env.PORT || 3001
var server = app.server.listen(PORT, () => {
  
  // var host = server.address().address
  // var port = server.address().port
  // console.log("Example app listening at", host, port)
  console.log(`server is running on port ${PORT}`);
});

// const io = new Server(WS_PORT, {
//   /* options */
//   cors: {
//     origin: '*',
//   },
// })

const io = new Server(server, {
  pingTimeout: 60000,
  cors:{
    origin: '*',
  },
})

io.on('connection', (socket) => {
  console.log(`socket connected to ${socket.id}`)


  socket.on('start-stream', async ({loop, rtmp}) => { 

console.log(rtmp);
const customRTMP = "rtmp://a.rtmp.youtube.com/live2/3hg3-ssh5-sgv2-htcv-0dh2";
    let x = Math.floor(Math.random() * 10);
  const video = path.join(__dirname, 'videos', `url${x}.mp4`);
  const controller = new AbortController();
  const { signal } = controller; 

 
    // const inputFilePath = path.resolve(__dirname, `${fileurl}`);
    
    const ffmpegArgs2 = ['-stream_loop', '-1', '-y',
      '-i', 'pipe:0', '-c:v', 'libx264', '-preset', 'veryfast','-b:v', '1000k', '-maxrate', '1000k',
      '-bufsize', '1500k', '-pix_fmt', 'yuv420p','-r', '30', '-g', '60', '-c:a', 'aac', '-b:a', '128k', '-ac', '2', '-ar', '44100',
      '-f', 'flv', rtmp]

   const streamingProcess = spawn(ffmpegStatic, ffmpegArgs2, { signal });
        
      
    streamingProcess.stdout.on('data', (data) => {
      console.log("fhuhuh", data.toString());
    
    });
    streamingProcess.stderr.on('data', (data) => {
  console.log(data.toString());
    });
    streamingProcess.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
  });
  // Handle errors
  streamingProcess.on('error', (err) => {
  // res.send("spawning ffmpeg", err);
    console.error(`Error spawning ffmpeg: ${err}`);
  });

  socket.on('message', (msg) => {
    // console.log('DATA', msg)
    streamingProcess.stdin.write(msg)
    
  })

    // Send a confirmation message to the client
    socket.emit('stream-started', 'Live stream has started');
  });
 
  
  // // If the client disconnects, stop FFmpeg.
  // socket.conn.on('close', (e) => {
  //   console.log('kill: SIGINT')
  //   // streamingProcess.kill('SIGINT')
  // })
})