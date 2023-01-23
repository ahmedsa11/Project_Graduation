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
sio.emit("stream_text", {'data':"language", "id": "sio.id"});


// recive data from the server
sio.on("stream_text", (pyload)=>{
  console.log('receive done ', pyload["id"]);
  document.getElementById("stream_asl").src =  "data:image/jpeg;base64," +arrayBufferToBase64(pyload["data"]);

});



function arrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
     binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}


