const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
var count = 0;
var frames = [];

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
        count++;
        frames.push(landmarks);
        // console.log(count);
        if (count == 10) {
            sio.emit("stream_sign", {'landmarks':frames});
            console.log(frames.length);
            count = 0;
            frames=[];
        }
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                        {color: '#00FF00', lineWidth: 1});
        drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: .5});
        }
  }
  canvasCtx.restore();
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
  selfieMode: true
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {

    await hands.send({image: videoElement});
    
  },

});
camera.start();

const sio = io();
sio.on('connect', () => {
  console.log('connected');
  
});

sio.on('disconnect', () => {
  console.log('disconnected');
});

sio.on("connect_error", (e=None) =>{
  console.log(e.message)
});
// send data to the server


// recive data from the server
sio.on("stream_sign", (pyload)=>{
//   console.log('receive done ', pyload["text"]);
  document.getElementById("text").innerHTML = pyload["text"];
  
});
