const spawn = require('child_process').spawn;
const fs = require('fs');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');
const {fork} = require("child_process") 
const {Worker} = require('worker_threads');

const ytdl = require('ytdl-core');
const axios = require('axios');

exports.routers = (app) => {

  app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
  });
  
    app.get("/worker", function (req, res) {
      let worker = new Worker('./worker.js');

      worker.send()

      worker.on('message', (data)=>{
        res.status(200).json({data});

      })
      
    });


      app.get("/livestream", (req, res) => {
    
        console.log(req.query);
        const childProcess = fork('./isprime.js');
        childProcess.send(req.query)
        childProcess.on("message", (data) => {
          res.status(200).json(data);
        })

      });

      app.get("/alldownload", (req, res) => {

        const childProcess = fork('./downloader.js');
        childProcess.send(req.query)
        childProcess.on("message", (data) => {
          res.status(200).json(data);
        })

      });

      app.get("/texttomp3", (req, res) => {

        const childProcess = fork('./texttomp3.js');
        childProcess.send(req.query)
        childProcess.on("message", (data) => {
          res.status(200).json(data);
        })

      });

      app.get("/ffmpegvideo", (req, res) => {

        const childProcess = fork('./encoder.js');
        childProcess.send(req.query)
        childProcess.on("message", (data) => {
          res.status(200).json(data);
        })

      });

      app.get("/videolist", (req, res) => {
        const videoPath = path.join(__dirname,'videos');
    
        fs.readdir(videoPath,(err,items)=>{

          res.status(200).json(items);
         
        });

        

        
      });


      app.get("/fbdown", async (req, res) => {
        const filename = req.query.filename;
        const urllink = req.query.urllink;
        const videoPath = path.join(__dirname,'videos', filename);
    
        console.log(req.query);
        try {
          const response = await axios.get(urllink, { responseType: 'stream' });
          const writeStream = fs.createWriteStream(videoPath);
          response.data.pipe(writeStream);
          await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
          });
          res.status(200).json('done');
          console.log('Video downloaded successfully!');
        } catch (error) {
          console.error('Error downloading video:', error);
        }

        
      });
      
      app.get('/video-live', async function(req, res){
        

        // const {item} = req.query;
        
        const range = req.headers.range;
        if(!range){
            res.status(400).send("Requires Range header");
        }
       
        const videoPath = await path.join(__dirname, 'videos', "Video.mp4");
        
        const videoSize = fs.statSync(videoPath).size;
        // console.log("size of video is:", videoSize);
        const CHUNK_SIZE = 10**6; //1 MB
        const start = Number(range.replace(/\D/g, "")); 
        const end = Math.min(start + CHUNK_SIZE , videoSize-1);
        const contentLength = end-start+1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": 'bytes',
            "Content-Length": contentLength,
            "Content-Type": "video/mp4"
        }
        res.writeHead(206,headers);
        const videoStream = fs.createReadStream(videoPath, {start, end});
        videoStream.pipe(res);
      
      });
      
      
      app.post('/added-stream', async function (req, res) {
        const {fileurl, loop, urlkey} =req.body;
          console.log('huihuygygyug', fileurl, loop, urlkey);
      
        //   fs.readFile( __dirname + "/" + "videos/ok.mp4", 'utf8', function (err, data) {
        //     console.log( data );
        //     res.end( data ); 
        //  });
         
      
        try {
          // const filePath = await path.join(__dirname, './videos/ok.mp4');
          // const videoPath = await "./videos/ok.mp4";
          const videoPath = await "https://astream-server.vercel.app/video-live";
      
          const url ='rtmps://live-api-s.facebook.com:443/rtmp/FB-246363178443448-0-AbzNhl9Dkqj2GHtF';
          const url1 ='FB-231542346605076-0-AbyE4AmCXITp4eKd';
      
      
           const ffmpegProcess = await spawn(ffmpegPath, ['-stream_loop', loop, '-re', '-i', videoPath, 
              '-c', 'copy',
              '-f', 'flv', urlkey,]);
      
              ffmpegProcess.stdout.on('data', (data) => {
                    console.log("fhuhuh", data.toString());
                    
                  });
              ffmpegProcess.stderr.on('data', (data) => {
                
                    console.log(data.toString());
                  });
              ffmpegProcess.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
              });
              // Handle errors
              ffmpegProcess.on('error', (err) => {
                res.send("spawning ffmpeg", err);
                  console.error(`Error spawning ffmpeg: ${err}`);
              });
              res.send({hi: "hhhhhhh hgygygyg hgygyg"});
         
         } catch (error) {
          res.send({hi: "hhhhhhh hgygygyg hgygyg", error});
           console.log(error);
         }
        
        }); 
}