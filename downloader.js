const path = require('path');
const axios = require('axios');
const ytdl = require('ytdl-core');
const fs = require('fs');
const readline = require('readline');
const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const OpenAI = require("openai");
const PlayHT = require('playht');
const fetch = require('node-fetch');

PlayHT.init({
  apiKey: '02988d4a759e480fad9355d6487a9fae',
  userId: 'prbO4DEWGKe7emwFsG7uN2PUjv63',
});

ffmpeg.setFfmpegPath(ffmpegStatic);


process.on("message", message => {
  console.log(message);
  const {filename, urllink, format} = message;
  
  if (format === '.mp4') {
  
    const jsonResponse = yturlload(message);
    
    process.send(jsonResponse);
  } else if (format === '.mp3') {

    const jsonResponse = ytaudio(message);
    
    process.send(jsonResponse);

  } else if(format === '.vtt') {

    const jsonResponse = translateVideo(message);
    
    process.send(jsonResponse);

  } else if(format === 'videotomp3') {

    const jsonResponse = videotoaudio(message);
    
    process.send(jsonResponse);

  }
  else if(format === 'fbvideo') {

    const jsonResponse = videotoaudio(message);
    
    process.send(jsonResponse);

  }
  else {
    const jsonResponse = ytaudio(message);
    process.send(jsonResponse);
  }

})


async function ytdown(message) {
    const {filename, urllink, from, format} = message;
    const videoPath = path.join(__dirname,'videos', `${filename}${format}`);

    let startTime = Date.now();
    let endTime = Date.now();

    // const inputPath = 'bpl.mp4';
    // // const outputPath = path.join(__dirname, 'videos', 'bplout.mp3');
    // const outputPath = 'rtmps://live-api-s.facebook.com:443/rtmp/FB-337646445904614-0-AbzcJltFvpjeEhhu';
    // const scaleOptions = ['scale=1280:720', 'scale=640:320'];
    // const videoCodec = 'libx264';
    // const x264Options = 'keyint=24:min-keyint=24:no-scenecut';
    // const videoBitrates = ['1000k', '2000k', '4000k'];

        
    try {

        let videoid = ytdl.getURLVideoID(urllink);
        let video = ytdl(urllink);
        ytdl.getInfo(videoid).then(info => {
 
          console.log(info);
            console.log("title", info.videoDetails.title);
        });

        // ffmpeg()
        // .input(video)
        // .videoFilters(scaleOptions)
        // .videoCodec(videoCodec)
        // .addOption('-x264opts', x264Options)
        // .outputOptions('-b:v', videoBitrates[0])
        // .format('flv')
        // .output(outputPath)
        // .on('data', (data) => {
        //   console.log("fhuhuh", data.toString());
         
        // })
        // .on('end', () => {
        //     console.log('DASH encoding complete.');
        // })
        // .on('error', (err) => {
        //     console.error('Error:', err.message);
        // })
        // .run();

        video.pipe(fs.createWriteStream(videoPath));
        video.once('response', () =>{
            console.log(startTime);
        });
        video.on('progress', (chunkLenth, downloaded, total) =>{

            const precent = downloaded / total;
            const downloadMinets = (Date.now() - startTime) / 1000 / 60;
            const downloadTime = (downloadMinets / precent) - downloadMinets;
            readline.cursorTo(process.stdout,0);
            process.stdout.write(`${(precent * 100).toFixed(2)}% download`);
            process.stdout.write(`${(downloaded / 1024 / 1024).toFixed(2)} MB of ${(total / 1024 / 1024).toFixed(2)} MB\n`);

            process.stdout.write(`${downloadMinets.toFixed(2)} Minets`);
            process.stdout.write(`${downloadTime.toFixed(2)} download time`);
            readline.moveCursor(process.stdout, 0 , -1);
        });
        
        video.on('end', () =>{

            process.stdout.write('\n\n');
            console.log('download complete');
        });
    }
      
      catch (error) {
        console.log('hhhhhh', error);
        return {error}
      }

    return {
      livestatus: "Start Live Stream", videourl: 'live'
        }

}

async function yturlload(message) {

    const {filename, urllink, from, format} = message;
    const videoPath = path.join(__dirname,'videos', `${filename}${format}`);

    let videoId = ytdl.getURLVideoID(urllink);

    // Get video info from YouTube
    ytdl.getInfo(videoId).then((info) => {
      // Select the video format and quality
      const format = ytdl.chooseFormat(info.formats,{qualityLabel:"360p"});

      console.log(info.formats);

      // Create a write stream to save the video file
      // const outputFilePath = `${info.videoDetails.title}.${videoFormat.container}`;
      const outputStream = fs.createWriteStream(videoPath);
      // Download the video file
      ytdl.downloadFromInfo(info, { format: format }).pipe(outputStream);
      // When the download is complete, show a message
      outputStream.on('finish', () => {
        console.log(`Finished downloading: ${videoPath}`);
      });
    }).catch((err) => {
      console.error(err);
    });

  return {
    livestatus: "Start Live Stream", videourl: 'live'
      }

}

async function ytaudio(message) {
  const {filename, urllink, from, format} = message;
  const audioPath = path.join(__dirname,'videos', `${filename}${format}`);

  let startTime = Date.now();
  let endTime = Date.now();

  const inputPath = 'bpl.mp4';
  // const outputPath = path.join(__dirname, 'videos', 'bplout.mp3');
  const outputPath = 'rtmps://live-api-s.facebook.com:443/rtmp/FB-337646445904614-0-AbzcJltFvpjeEhhu';
  const scaleOptions = ['scale=1280:720', 'scale=640:320'];
  const videoCodec = 'libx264';
  const x264Options = 'keyint=24:min-keyint=24:no-scenecut';
  const videoBitrates = ['1000k', '2000k', '4000k'];

      
  try {

      let videoid = ytdl.getURLVideoID(urllink);
      let video = ytdl(urllink);
      ytdl.getInfo(videoid).then(info => {

          console.log("title", info.videoDetails.title);
      });

      ffmpeg()
      .input(video)
      .audioCodec('libmp3lame')
      .format('mp3')
      .output(audioPath)
      .on('progress', function(progress) {
        console.log('Processing: ' + progress.currentKbps + 'kb');

      })
      .on('end', () => {
          console.log('DASH encoding complete.');
      })
      .on('error', (err) => {
          console.error('Error:', err.message);
      })
      .run();

      
      // video.once('response', () =>{
      //     console.log(startTime);
      // });
      // video.on('progress', (chunkLenth, downloaded, total) =>{

      //     const precent = downloaded / total;
      //     const downloadMinets = (Date.now() - startTime) / 1000 / 60;
      //     const downloadTime = (downloadMinets / precent) - downloadMinets;
      //     readline.cursorTo(process.stdout,0);
      //     process.stdout.write(`${(precent * 100).toFixed(2)}% download`);
      //     process.stdout.write(`${(downloaded / 1024 / 1024).toFixed(2)} MB of ${(total / 1024 / 1024).toFixed(2)} MB\n`);

      //     process.stdout.write(`${downloadMinets.toFixed(2)} Minets`);
      //     process.stdout.write(`${downloadTime.toFixed(2)} download time`);
      //     readline.moveCursor(process.stdout, 0 , -1);
      // });
      
      // video.on('end', () =>{

      //     process.stdout.write('\n\n');
      //     console.log('download complete');
      // });
  }
    
    catch (error) {
      console.log('hhhhhh', error);
      return {error}
    }

  return {
    livestatus: "Start Live Stream", videourl: 'live'
      }

}

async function videotoaudio(message) {
  const {filename, urllink, from, format} = message;
  const audioPath = path.join(__dirname,'videos', `${filename}.mp3`);
  const videoPath = path.join(__dirname,'videos', urllink);
   
  try {

      ffmpeg()
      .input(videoPath)
      .audioCodec('libmp3lame')
      .format('mp3')
      .output(audioPath)
      .on('progress', (chunkLenth, downloaded, total) =>{

          const precent = downloaded / total;
          const downloadMinets = (Date.now() - startTime) / 1000 / 60;
          const downloadTime = (downloadMinets / precent) - downloadMinets;
          readline.cursorTo(process.stdout,0);
          process.stdout.write(`${(precent * 100).toFixed(2)}% download`);
          process.stdout.write(`${(downloaded / 1024 / 1024).toFixed(2)} MB of ${(total / 1024 / 1024).toFixed(2)} MB\n`);

          process.stdout.write(`${downloadMinets.toFixed(2)} Minets`);
          process.stdout.write(`${downloadTime.toFixed(2)} download time`);
          readline.moveCursor(process.stdout, 0 , -1);
      })
      .on('end', () => {
          console.log('DASH encoding complete.');
      })
      .on('error', (err) => {
          console.error('Error:', err.message);
      })
      .run();

  }
    
    catch (error) {
      console.log('hhhhhh', error);
      return {error}
    }

  return {
    livestatus: "Start Live Stream", videourl: 'live'
      }

}


async function getFacebookVideoInfo(videoUrl, accessToken) {
    try {
      const videoIdMatch = videoUrl.match(/videos\/(\d+)/);
      if (!videoIdMatch) {
        throw new Error('Invalid video URL');
      }
  
      const videoId = videoIdMatch[1];
      const apiUrl = `https://graph.facebook.com/v15.0/${videoId}?fields=source&access_token=${accessToken}`;
  
      const response = await axios.get(apiUrl);
  
      if (response.data.source) {
        return response.data.source;
      } else {
        throw new Error('Video source not found.');
      }


      // const audio = "some aduio link";  
      // const video = "some video link";    
      
      // proc.addInput(video)     
      //    .output('${some path}./video.mp4')      
      //    .format('mp4')      
      //    .on("error", err => console.log(err))     
      //    .on('end', () => console.log('Done'));    
         
      // if(audio) {  
      //     proc.addInput(audio);   
      // }  
      // proc.run()

    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  async function translateVideo(message) {
    const {filename, urllink, from, format} = message;
    const audioPath = path.join(__dirname,'videos', 'hello-playht.mp3');
    const vttPath = path.join(__dirname,'videos', `${filename}${format}`);
   

    try {

     // Fetch stock female PlayHT 2.0 voices
const voices = await PlayHT.listVoices({
  // gender: 'female',
  // language: "English (CA)",
  voiceEngine: ['PlayHT2.0'],
  // isCloned: false,
});

// Output them to the console.
console.log(JSON.stringify(voices, null, 2));

      // Create a file stream
      const fileStream = fs.createWriteStream(audioPath);

      // Stream audio from text
      const stream = await PlayHT.stream('নির্বাচনকালীন ভেদাভেদ ভুলে ঐক্যবদ্ধ থাকতে বললেন মুক্তিযুদ্ধবিষয়ক মন্ত্রী', {
        voiceEngine: 'PlayHT2.0-turbo',
        voiceId: 's3://peregrine-voices/oliver_narrative2_parrot_saad/manifest.json',
        outputFormat: 'mp3',
        temperature: 1.5,
        quality: 'high',
        speed: 0.8,
      });

      // Pipe stream into file
      stream.pipe(fileStream);
  }
    
    catch (error) {
      console.log('hhhhhh', error);
      return {error}
    }

  return {
    livestatus: "Start Live Stream", videourl: 'live'
      }
   
  }
  