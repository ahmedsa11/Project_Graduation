const socket = io('/', {
  upgrade: false,
});
const roomId = Date.now();
const user = {
  name: 'name-1',
  id: 'id-1',
};
socket.on('connect', () => {
  console.log('connected');
});

socket.on('disconnect', () => {
  console.log('disconnected');
});

socket.emit('BE-join-room', {
  roomId,
  user,
  video: true,
  audio: true,
});

socket.emit('send-text', {
  data: 'hot',
  roomId,
  name: user.name,
});
// socket.emit('send-text', {data: 'hot',roomId,name: user.name,});
socket.on('receive-text', ({ data, name }) => {
  console.log('receive text & name ', { data, name });
});

socket.on('receive-frame', ({ buffer }) => {
  console.log('received frame from backend');
  document.getElementById('stream_asl_v').src =
    'data:image/jpeg;base64,' + arrayBufferToBase64(buffer);
});
const arrayBufferToBase64 = (buffer) => {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};
