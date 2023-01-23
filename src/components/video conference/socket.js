import io from 'socket.io-client';
// const socket = io('http://localhost:8080');
// const socket = io('https://socket.connect-asl.site/',{transports: ['websocket'], upgrade: false});
const socket = io('https://backend-socket-tabarani.herokuapp.com/', {
  transports: ['websocket'],
  upgrade: false,
});
// const socket = io('https://bac3-41-237-45-53.eu.ngrok.io');
export default socket;
