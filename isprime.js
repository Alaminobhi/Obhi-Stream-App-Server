const spawn = require('child_process').spawn;
const path = require('path');
const ffmpegStatic = require('ffmpeg-static');
const stream = require('stream');
const ytdl = require('ytdl-core');
const fs = require('fs');
const { exec } = require('child_process');
const ffmpeg = require('fluent-ffmpeg');
const puppeteer = require('puppeteer');

const httpsReq = require("https");
const { createCanvas, loadImage } = require('canvas')
// const { renderer, encoder } = require("@pankod/canvas2video");

const readline = require('readline');


process.on("message", message => {
  // console.log(message);
  const jsonResponse = livestream(message);
    process.send(jsonResponse);
 
    // process.exit();
});

async function livestream(message) {
  const {fileurl, loop, rtmp, from, mp3url} = message;
    
  if (from === 'ytvideo') {
    ytvideos(message);
    console.log('yt');
  }
  if (from === 'fbvideo') {
    fbvideos(message);
   console.log('fb');
  }
  if (from === 'filevideo') {
    videos(message);
    console.log('videos');
  } 
  if (from === 'photo') {
    videos(message);
    console.log('videos');
  } 
  if (from === 'canvas') {
    canvaspu(message);
    console.log('canvas');
  }
  // else {
  //   isPrime(message);
  // }

  return {
    livestatus: "Start Live Stream", videourl: 'live'
      }
};

async function videos(message) {
  const {fileurl, loop, rtmp, from, mp3url} = message;

    try {

        const videoPath = path.join(__dirname, 'videos', fileurl);

        const audioPath = path.join(__dirname, 'videos', mp3url);

        let hhh = "https://video-cph2-1.xx.fbcdn.net/v/t42.1790-2/10000000_1786397035191223_1431468712832817305_n.mp4?_nc_cat=105&ccb=1-7&_nc_sid=55d0d3&efg=eyJybHIiOjcwNSwicmxhIjo0MDk2LCJ2ZW5jb2RlX3RhZyI6InN2ZV9zZCJ9&_nc_ohc=gPAiVSwFhUEAX8D_5a9&rl=705&vabr=392&_nc_ht=video-cph2-1.xx&oh=00_AfC_wN-vNthvMrrhIRVqnhHt1o660_oTpQnGGOnabCZ63Q&oe=65E8DC66&dl=1";

        const controller = new AbortController();
        const { signal } = controller; 

        let ffmpegsetup = '';

        if (from === 'filevideo') {
          ffmpegsetup = ['-stream_loop', loop, '-re', '-i', videoPath, '-c:v', 'libx264', '-preset', 'veryfast','-b:v', '1000k', '-maxrate', '1000k',
                       '-bufsize', '1500k', '-pix_fmt', 'yuv420p','-r', '30', '-g', '60', '-c:a', 'aac', '-b:a', '128k', '-ac', '2', '-ar', '44100',
                      '-f', 'flv', rtmp];
        }
        if (from === 'photo') {
          ffmpegsetup =['-loop', '1', '-t', '900000', '-i', videoPath, '-i', audioPath, '-c:v', 'libx264', '-preset', 'veryfast','-b:v', '1000k', '-maxrate', '1000k',
                  '-bufsize', '1500k', '-pix_fmt', 'yuv420p','-r', '30', '-g', '60', '-c:a', 'aac', '-b:a', '128k', '-ac', '2', '-ar', '44100',
                    '-f', 'flv', rtmp];
        } else {
          
        }


      //   const ffmpegCommand3 =['-loop', '1', '-t', '10000', '-i', videoPath, '-i', audioPath, '-c:v', 'libx264', '-preset', 'veryfast','-b:v', '1000k', '-maxrate', '1000k',
      //  '-bufsize', '1500k', '-pix_fmt', 'yuv420p','-r', '30', '-g', '60', '-c:a', 'aac', '-b:a', '128k', '-ac', '2', '-ar', '44100',
      //   '-f', 'flv', rtmp];

      //   const ffmpegCommand2 =['-loop', '1', '-t', '1000', '-i', videoPath,
      //   '-loop', '1', '-t', '500', '-i', inputPath2,
      //   '-loop', '1', '-t', '500', '-i', inputPath3,
      //   '-loop', '1', '-t', '500', '-i', inputPath4,
      //   '-loop', '1', '-t', '500', '-i', inputPath5,
      //   '-loop', '1', '-t', '500', '-i', inputPath6,
      //   '-i', audioPath,
      //    '-filter_complex',
      //     "[0:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=out:st=1000:d=1[v0]; \
      //       [1:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=in:st=0:d=1,fade=t=out:st=500:d=1[v1]; \
      //       [2:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=in:st=0:d=1,fade=t=out:st=500:d=1[v2]; \
      //       [3:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=in:st=0:d=1,fade=t=out:st=500:d=1[v3]; \
      //       [4:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=in:st=0:d=1,fade=t=out:st=500:d=1[v4]; \
      //       [5:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=in:st=0:d=1,fade=t=out:st=500:d=1[v5]; \
      //       [v0][v1][v2][v3][v4][v5]concat=n=6:v=1:a=0,format=yuv420p[v]",
      //        '-map',"[v]", '-map', '6:a', '-preset', 'veryfast','-b:v', '1000k', '-maxrate', '1000k',
      //        '-bufsize', '1500k', '-pix_fmt', 'yuv420p','-r', '30', '-g', '60', '-c:a', 'aac', '-b:a', '64k', '-ac', '2', '-ar', '44100',
      //         '-f', 'flv', rtmp];

      //   const ffmpeg2 = ['-loop', '1', '-re', '-i', videoPath, '-i', audioPath, '-c:v', 'libx264','-preset', 'veryfast','-b:v', '1000k', '-maxrate', '1000k',
      //   '-bufsize', '1500k', '-pix_fmt', 'yuv420p', '-r', '30', '-g', '60', '-c:a', 'aac', '-b:a', '128k', '-t', '4000',
      //   '-f', 'flv', rtmp];

      // const ffmpegCommand =['-stream_loop', loop, '-re', '-i', videoPath, '-c:v', 'libx264', '-preset', 'veryfast','-b:v', '1000k', '-maxrate', '1000k',
      //  '-bufsize', '1500k', '-pix_fmt', 'yuv420p','-r', '30', '-g', '60', '-c:a', 'aac', '-b:a', '64k', '-ac', '2', '-ar', '44100',
      //   '-f', 'flv', rtmp];
    
          streamingProcess = spawn(ffmpegStatic, ffmpegsetup, { signal });
      
    
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
      }
      
      catch (error) {
        console.log('err', error);
        return {error}
      }


    return {
      livestatus: "Start Live Stream", videourl: 'live'
        }

}


async function ytvideos(message) {
  const {fileurl, loop, rtmp, from, mp3url} = message;

    try {

        // Global constants

        const tracker = {
          start: Date.now(),
          audio: { downloaded: 0, total: Infinity },
          video: { downloaded: 0, total: Infinity },
          merged: { frame: 0, speed: '0x', fps: 0 },
        };

        // Get audio and video streams
        const audio = ytdl(fileurl, { quality: 'highestaudio' })
          .on('progress', (_, downloaded, total) => {
            tracker.audio = { downloaded, total };
          });
        const video = ytdl(fileurl, { quality: 'highestvideo' })
          .on('progress', (_, downloaded, total) => {
            tracker.video = { downloaded, total };
          });

        // Prepare the progress bar
        let progressbarHandle = null;
        const progressbarInterval = 1000;
        const showProgress = () => {
          readline.cursorTo(process.stdout, 0);
          const toMB = i => (i / 1024 / 1024).toFixed(2);

          process.stdout.write(`Audio  | ${(tracker.audio.downloaded / tracker.audio.total * 100).toFixed(2)}% processed `);
          process.stdout.write(`(${toMB(tracker.audio.downloaded)}MB of ${toMB(tracker.audio.total)}MB).${' '.repeat(10)}\n`);

          process.stdout.write(`Video  | ${(tracker.video.downloaded / tracker.video.total * 100).toFixed(2)}% processed `);
          process.stdout.write(`(${toMB(tracker.video.downloaded)}MB of ${toMB(tracker.video.total)}MB).${' '.repeat(10)}\n`);

          process.stdout.write(`Merged | processing frame ${tracker.merged.frame} `);
          process.stdout.write(`(at ${tracker.merged.fps} fps => ${tracker.merged.speed}).${' '.repeat(10)}\n`);

          process.stdout.write(`running for: ${((Date.now() - tracker.start) / 1000 / 60).toFixed(2)} Minutes.`);
          readline.moveCursor(process.stdout, 0, -3);
        };

        // Start the ffmpeg child process
        const ffmpegProcess = spawn(ffmpegStatic, ['-stream_loop', loop, '-re','-loglevel', '8', '-hide_banner','-progress', 'pipe:3','-i', 'pipe:4', '-i', 'pipe:5','-map', '0:a',
        '-map', '1:v', '-c:v', 'libx264', '-preset', 'veryfast','-b:v', '1000k', '-maxrate', '1000k',
        '-bufsize', '1500k', '-pix_fmt', 'yuv420p','-r', '30', '-g', '60', '-c:a', 'aac', '-b:a', '128k', '-ac', '2', '-ar', '44100',
       '-f', 'flv', rtmp] , {
          windowsHide: true,
          stdio: [
            /* Standard: stdin, stdout, stderr */
            'inherit', 'inherit', 'inherit',
            /* Custom: pipe:3, pipe:4, pipe:5 */
            'pipe', 'pipe', 'pipe',
          ],
        });

        ffmpegProcess.on('close', () => {
          console.log('done');
          // Cleanup
          process.stdout.write('\n\n\n\n');
          clearInterval(progressbarHandle);
        });

        // Link streams
        // FFmpeg creates the transformer streams and we just have to insert / read data
        ffmpegProcess.stdio[3].on('data', chunk => {
          // Start the progress bar
          if (!progressbarHandle) progressbarHandle = setInterval(showProgress, progressbarInterval);
          // Parse the param=value list returned by ffmpeg
          const lines = chunk.toString().trim().split('\n');
          const args = {};
          for (const l of lines) {
            const [key, value] = l.split('=');
            args[key.trim()] = value.trim();
          }
          tracker.merged = args;
        });

        audio.pipe(ffmpegProcess.stdio[4]);
        video.pipe(ffmpegProcess.stdio[5]);

    }
      
    catch (error) {
      console.log('err', error);
      return {error}
    }


  return {
    livestatus: "Start Live Stream", videourl: 'live'
      }

}

async function fbvideos(message) {
  const {fileurl, loop, rtmp, from, mp3url} = message;

    try {

        // let URL = await ndown("https://www.facebook.com/watch/?v=1106684820375505")
        // console.log(URL)

        const url = "https://video-cph2-1.xx.fbcdn.net/v/t42.1790-2/10000000_1786397035191223_1431468712832817305_n.mp4?_nc_cat=105&ccb=1-7&_nc_sid=55d0d3&efg=eyJybHIiOjcwNSwicmxhIjo0MDk2LCJ2ZW5jb2RlX3RhZyI6InN2ZV9zZCJ9&_nc_ohc=gPAiVSwFhUEAX8D_5a9&rl=705&vabr=392&_nc_ht=video-cph2-1.xx&oh=00_AfC_wN-vNthvMrrhIRVqnhHt1o660_oTpQnGGOnabCZ63Q&oe=65E8DC66&dl=1";
    
      // Global constants

      const tracker = {
        start: Date.now(),
        audio: { downloaded: 0, total: Infinity },
        video: { downloaded: 0, total: Infinity },
        merged: { frame: 0, speed: '0x', fps: 0 },
      };

      const videoPath = path.join(__dirname,'videos', "fileName2.mp4");
        const file = fs.createWriteStream(videoPath);
      httpsReq.get(url, response => {
        response.pipe(ffmpegProcess.stdio[5]);
        // response.pipe(file)
      })
      .on('progress', (_, downloaded, total) => {
        tracker.video = { downloaded, total };
      });
   
      // Prepare the progress bar
      let progressbarHandle = null;
      const progressbarInterval = 1000;
      const showProgress = () => {
        readline.cursorTo(process.stdout, 0);
        const toMB = i => (i / 1024 / 1024).toFixed(2);

        process.stdout.write(`Audio  | ${(tracker.audio.downloaded / tracker.audio.total * 100).toFixed(2)}% processed `);
        process.stdout.write(`(${toMB(tracker.audio.downloaded)}MB of ${toMB(tracker.audio.total)}MB).${' '.repeat(10)}\n`);

        process.stdout.write(`Video  | ${(tracker.video.downloaded / tracker.video.total * 100).toFixed(2)}% processed `);
        process.stdout.write(`(${toMB(tracker.video.downloaded)}MB of ${toMB(tracker.video.total)}MB).${' '.repeat(10)}\n`);

        process.stdout.write(`Merged | processing frame ${tracker.merged.frame} `);
        process.stdout.write(`(at ${tracker.merged.fps} fps => ${tracker.merged.speed}).${' '.repeat(10)}\n`);

        process.stdout.write(`running for: ${((Date.now() - tracker.start) / 1000 / 60).toFixed(2)} Minutes.`);
        readline.moveCursor(process.stdout, 0, -3);
      };

      // Start the ffmpeg child process
      const ffmpegProcess = spawn(ffmpegStatic, ['-stream_loop', loop, '-re', '-i', 'pipe:5',
       '-c:v', 'libx264', '-preset', 'veryfast','-b:v', '1000k', '-maxrate', '1000k',
      '-bufsize', '1500k', '-pix_fmt', 'yuv420p','-r', '30', '-g', '60', '-c:a', 'aac', '-b:a', '128k', '-ac', '2', '-ar', '44100',
     '-f', 'flv', rtmp] , {
        windowsHide: true,
        stdio: [
          /* Standard: stdin, stdout, stderr */
            'inherit',
          /* Custom: pipe:3, pipe:4, pipe:5 */
            'pipe',
        ],
      });

      ffmpegProcess.on('close', () => {
        console.log('done');
        // Cleanup
        process.stdout.write('\n\n\n\n');
        clearInterval(progressbarHandle);
      });

      // Link streams
      // FFmpeg creates the transformer streams and we just have to insert / read data
      // ffmpegProcess.stdio[3].on('data', chunk => {
      //   // Start the progress bar
      //   if (!progressbarHandle) progressbarHandle = setInterval(showProgress, progressbarInterval);
      //   // Parse the param=value list returned by ffmpeg
      //   const lines = chunk.toString().trim().split('\n');
      //   const args = {};
      //   for (const l of lines) {
      //     const [key, value] = l.split('=');
      //     args[key.trim()] = value.trim();
      //   }
      //   tracker.merged = args;
      // });

        // const videoPath = path.join(__dirname,'videos', "fileName2.mp4");
        // const file = fs.createWriteStream(videoPath);

       

       
    
    }
    catch (error) {
      console.log('err', error);
      return {error}
    }


  return {
    livestatus: "Start Live Stream", videourl: 'live'
      }

}

async function canvas(message) {
  const {fileurl, loop, rtmp, from, mp3url} = message;

  const controller = new AbortController();
        const { signal } = controller; 

  const videoPath = path.join(__dirname, 'videos', 'sex.jpg');
  const video = path.join(__dirname, 'videos', 'url.mp4');
  // const imgPath = path.join(__dirname, 'frames', '*.png');
  //       const file = fs.createWriteStream(imgPath);
    try {
     

      // Width and height of the canvas
const width = 640;
const height = 480;

// Duration of the video in seconds
const duration = 5;

// Output video file path
const videoOutput = 'output.mp4';

// Function to generate a single frame
function generateFrame(canvas, frameNumber) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // Draw something on the frame
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText(`Frame ${frameNumber}`, 50, 50);
}

// Create canvas
const canvas = createCanvas(width, height);

// Generate frames
const frames = [];
for (let i = 0; i < duration * 30; i++) {
    generateFrame(canvas, i);
    frames.push(canvas.toBuffer('image/png'));
}

// Write frames to disk
const frameDir1 = './frames';
const frameDir = path.join(__dirname, 'frames');
if (!fs.existsSync(frameDir)) {
    fs.mkdirSync(frameDir);
}

// for (let i = 0; i < duration * 30; i++) {
//   generateFrame(canvas, i);
//   fs.writeFileSync(`${frameDir}/frame${i.toString().padStart(5, '0')}.png`, canvas.toBuffer('image/png'));
// }

// // Use ffmpeg to create video
// ffmpeg()
//   .input(`${frameDir}/frame%05d.png`)
//   .inputFPS(30)
//   .outputOptions('-c:v', 'libx264')
//   .outputOptions('-pix_fmt', 'yuv420p')
//   .output(video)
//   .on('end', () => {
//       console.log('Video created:', video);
//   })
//   .on('error', (err) => {
//       console.error('Error:', err);
//   })
//   .run();


frames.forEach((frame, index) => {
    fs.writeFileSync(`${frameDir}/frame${index.toString().padStart(5, '0')}.png`, frame);
});

// Run ffmpeg to create video
const ffmpegCommand = ['ffmpeg', '-framerate', '30', '-i', `${frameDir}/frame00000.png`, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', video];
const ffmpegCommand3 = ['-loop', '1', '-framerate', '30', '-i', `${frameDir}/frame%05d.png`, '-c:v', 'libx264', '-preset', 'veryfast','-b:v', '1000k', '-maxrate', '1000k',
'-bufsize', '1500k', '-pix_fmt', 'yuv420p','-r', '30', '-g', '60', '-c:a', 'aac', '-b:a', '128k', '-ac', '2', '-ar', '44100',
  '-f', 'mp4', video]

// const ffmpegCommand2 = ['ffmpeg', '-framerate', '30', '-i', `${frameDir}/frame%05d.png`, '-c:v', 'libx264', '-r', '30', '-pix_fmt', 'yuv420p', video]

streamingProcess = spawn(ffmpegStatic, ffmpegCommand3, { signal });
      
    
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
// exec(ffmpegCommand, (error, stdout, stderr) => {
//     if (error) {
//         console.error(`Error: ${error.message}`);
//         return;
//     }
//     if (stderr) {
//         console.error(`stderr: ${stderr}`);
//         return;
//     }
//     console.log(`Video created: ${videoOutput}`);
// });


    }
      
    catch (error) {
      console.log('err', error);
      return {error}
    }


  return {
    livestatus: "Start Live Stream", videourl: 'live'
      }

}

async function canvas2 (message) {

  const {fileurl, loop, rtmp, from, mp3url} = message;

  const videoPath = path.join(__dirname, 'videos', 'sex.jpg');

  const imgPath = path.join(__dirname,'videos', "fileName2.PNG");
  const file = fs.createWriteStream(imgPath);

  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext("2d");

  // Write "Awesome!"
ctx.font = '30px Impact'
ctx.rotate(0.1)
ctx.fillText('Awesome!', 50, 100)

// Draw line under text
var text = ctx.measureText('Awesome!')
ctx.strokeStyle = 'rgba(0,0,0,0.5)'
ctx.beginPath()
ctx.lineTo(50, 102)
ctx.lineTo(50 + text.width, 102)
ctx.stroke()

// Draw cat with lime helmet
loadImage(videoPath).then((image) => {
  ctx.drawImage(image, 100, 10, 700, 700)
  canvas.createPNGStream().pipe(file);
  // console.log('<img src="' + canvas.toDataURL() + '" />')
})

}

async function canvas1(message) {
  const {fileurl, loop, rtmp, from, mp3url} = message;

  const controller = new AbortController();
  const { signal } = controller; 
  let x = Math.floor(Math.random() * 10);
  const video = path.join(__dirname, 'videos', `url${x}.mp4`);

    try {

const frameRate = 30;
const duration = 20; // 10 minutes in seconds

// Set canvas dimensions
const width = 1920;
const height = 1080;

// const frameRate = 30;
// const duration = 20; // 10 minutes in seconds

// // Set canvas dimensions
// const width = 1920;
// const height = 1080;


// // RTMP server URL
// const rtmpServerUrl = 'rtmp://example.com/live/stream_key';

// // Create a canvas
// const canvas = createCanvas(width, height);
// const ctx = canvas.getContext('2d');

// // Function to generate each frame
// function generateFrame(frameNumber) {
  
//     ctx.fillStyle = 'white';
//     ctx.fillRect(0, 0, width, height);

//     // Draw something on the frame
//     ctx.fillStyle = 'black';
//     ctx.font = '30px Arial';
//     ctx.fillText(`Frame ${frameNumber}`, 50, 50);

//     // Return the canvas as a PNG buffer
//     return canvas.toBuffer('image/png');
// }

async function generateFrame(frameNumber) {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext("2d");
  const bgImage = await loadImage(
    "https://us-central1-centered-1580668301240.cloudfunctions.net/randomPhoto?collectionId=j1fwrKAGDIg"
  );

  // center fill
  const hRatio = canvas.width / bgImage.width;
  const vRatio = canvas.height / bgImage.height;
  const ratio = Math.max(hRatio, vRatio);
  const centerShift_x = (canvas.width - bgImage.width * ratio) / 2;
  const centerShift_y = (canvas.height - bgImage.height * ratio) / 2;

  ctx.drawImage(
    bgImage,
    0,
    0,
    bgImage.width,
    bgImage.height,
    centerShift_x,
    centerShift_y,
    bgImage.width * ratio,
    bgImage.height * ratio
  );

  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000000aa";
  ctx.fill();

  const posterImage = await loadImage(
    "https://firebasestorage.googleapis.com/v0/b/centered-staging-groups/o/p21O3WRts9SjDIeaGjJP2gaPb7n1-qa-test-cassidy-feature.jpg?alt=media&token=433f5479-549e-4bd1-9543-61879de08c8c"
  );

  ctx.save();

  roundedRect(ctx, 814, 51, 336, 528, 10);

  ctx.clip();

  ctx.drawImage(posterImage, 814, 51, 336, 528);

  ctx.restore();

  const logoImage = await loadImage("./Dark.png");

  ctx.drawImage(logoImage, 121, 252, 462, 114);

    // Return the canvas as a PNG buffer
    return canvas.toBuffer('image/png');
}



// Execute ffmpeg command
const ffmpegArgs =  [
  '-y', // Overwrite output file if it exists
  '-f', 'image2pipe',
  '-framerate', '30',
  '-i', 'pipe:0',
  '-c:v', 'libx264',
  '-pix_fmt', 'yuv420p',
  '-preset', 'ultrafast',
  '-t', `${duration}`,
  video
  // '-f', 'flv',
  // '-flvflags', 'no_duration_filesize',
  // rtmp // Output video file name
];

const ffmpegArgs1 = [
  '-y',
  '-framerate', '30',
  '-f', 'image2pipe',
  '-i', '-',
  '-c:v', 'libx264',
  '-pix_fmt', 'yuv420p',
  video
];

const ffmpegArgs3 = [
  '-f', 'image2pipe',
  '-framerate', '30',
  '-i', 'pipe:0',
  '-c:v', 'libx264',
  '-pix_fmt', 'yuv420p',
  '-preset', 'ultrafast',
  '-f', 'flv',
  rtmp
];

const ffmpegArgs2 = ['-stream_loop', loop, '-y', '-framerate', '30', '-f', 'image2pipe',
      '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast','-b:v', '1000k', '-maxrate', '1000k',
      '-bufsize', '1500k', '-pix_fmt', 'yuv420p','-r', '30', '-g', '60', '-c:a', 'aac', '-b:a', '128k', '-ac', '2', '-ar', '44100',
      '-f', 'flv', rtmp]

      const ffmpeg = spawn(ffmpegStatic, ffmpegArgs);



    ffmpeg.stdout.on('data', (data) => {
        console.log("fhuhuh", data.toString());
       
      });
      ffmpeg.stderr.on('data', (data) => {
    console.log( "hhhhhh", data.toString());
      });
      ffmpeg.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
  // Handle errors
  ffmpeg.on('error', (err) => {
    // res.send("spawning ffmpeg", err);
      console.error(`Error spawning ffmpeg: ${err}`);
  });

// Generate and stream frames
for (let i = 0; i < duration * frameRate; i++) {
  const frameData = generateFrame(i);
  ffmpeg.stdin.write(frameData);
}

ffmpeg.stdin.end();



    }
      
    catch (error) {
      console.log('err', error);
      return {error}
    }


  return {
    livestatus: "Start Live Stream", videourl: 'live'
      }

}


async function canvas22(message) {
  const {fileurl, loop, rtmp, from, mp3url} = message;

  const controller = new AbortController();
  const { signal } = controller; 
  let x = Math.floor(Math.random() * 10);
  const video = path.join(__dirname, 'videos', `url${x}.mp4`);

    try {

const ffmpegArgs2 = ['-stream_loop', loop, '-y',
      '-i', 'pipe:0', '-c:v', 'libx264', '-preset', 'veryfast','-b:v', '1000k', '-maxrate', '1000k',
      '-bufsize', '1500k', '-pix_fmt', 'yuv420p','-r', '30', '-g', '60', '-c:a', 'aac', '-b:a', '128k', '-ac', '2', '-ar', '44100',
      '-f', 'flv', rtmp]

      const ffmpeg = spawn(ffmpegStatic, ffmpegArgs2);



    ffmpeg.stdout.on('data', (data) => {
        console.log("fhuhuh", data.toString());
       
      });
      ffmpeg.stderr.on('data', (data) => {
    console.log( "hhhhhh", data.toString());
      });
      ffmpeg.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
  // Handle errors
  ffmpeg.on('error', (err) => {
    // res.send("spawning ffmpeg", err);
      console.error(`Error spawning ffmpeg: ${err}`);
  });


    }
      
    catch (error) {
      console.log('err', error);
      return {error}
    }


  return {
    livestatus: "Start Live Stream", videourl: 'live'
      }

}

async function canvaspu(message) {
  const {fileurl, loop, rtmp, from, mp3url} = message;

  const controller = new AbortController();
  const { signal } = controller; 
  let x = Math.floor(Math.random() * 10);
  const video = path.join(__dirname, 'videos', `url${x}.jpeg`);

    try {
      

      const frameRate = 30;
      const duration = 20;

      // // Example usage
      const url = 'https://crex.live/scoreboard/OFB/1IR/10th-Match/J/K/kkr-vs-rcb-10th-match-indian-premier-league-2024/live';

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);
      await page.setViewport({ width: 1920, height: 1080 });
      // Capture a screenshot
     const scr = await page.screenshot({video, fullPage: true});
      const screenshot = await page.screenshot({video, type: 'jpeg', quality: 10 });

      console.log(scr);
      await browser.close();

// const ffmpegArgs2 = ['-stream_loop', loop, '-y',
//       '-i', 'pipe:0', '-c:v', 'libx264', '-preset', 'veryfast','-b:v', '1000k', '-maxrate', '1000k',
//       '-bufsize', '1500k', '-pix_fmt', 'yuv420p','-r', '30', '-g', '60', '-c:a', 'aac', '-b:a', '128k', '-ac', '2', '-ar', '44100',
//       '-f', 'flv', rtmp]

//       const ffmpeg = spawn(ffmpegStatic, ffmpegArgs2);



//     ffmpeg.stdout.on('data', (data) => {
//         console.log("fhuhuh", data.toString());
       
//       });
//       ffmpeg.stderr.on('data', (data) => {
//     console.log( "hhhhhh", data.toString());
//       });
//       ffmpeg.on('close', (code) => {
//     console.log(`child process exited with code ${code}`);
//   });
//   // Handle errors
//   ffmpeg.on('error', (err) => {
//     // res.send("spawning ffmpeg", err);
//       console.error(`Error spawning ffmpeg: ${err}`);
//   });

  // const url = 'https://crex.live/scoreboard/OFB/1IR/10th-Match/J/K/kkr-vs-rcb-10th-match-indian-premier-league-2024/live';

  // for (let i = 0; i < duration * frameRate; i++) {
    
  //   const frameData = captureWebpage(url);
  //   ffmpeg.stdin.write(frameData);
  // }
  
  // ffmpeg.stdin.end();

    }
      
    catch (error) {
      console.log('err', error);
      return {error}
    }


  return {
    livestatus: "Start Live Stream", videourl: 'live'
      }

}

// Function to capture the content of a webpage using Puppeteer
async function captureWebpage(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const video = path.join(__dirname, 'videos', 'urlk.png');
  // Capture a screenshot
  await page.screenshot({video, fullPage: true});
  // const screenshot = await page.screenshot({ type: 'jpeg', quality: 10 });

  await browser.close();

  // return screenshot;
}



// async function captureWebPage(url) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
  
//   await page.goto(url, { waitUntil: 'networkidle2' }); // Wait until page is fully loaded
  
//   const dimensions = await page.evaluate(() => {
//       const { width, height } = document.documentElement.getBoundingClientRect();
//       return { width, height };
//   });
  
//   const canvas = await page.evaluate((dimensions) => {
//       const canvas = document.createElement('canvas');
//       canvas.width = dimensions.width;
//       canvas.height = dimensions.height;
//       const ctx = canvas.getContext('2d');
//       ctx.drawImage(document.documentElement, 0, 0);
//       // return canvas;
//       return canvas.captureStream();
//   }, dimensions);
  
//   return canvas;
//   // const stream = canvas.captureStream();
  
//   // // You can now do something with the stream, such as save it as a video or serve it to clients
  
//   // await browser.close();
// }
