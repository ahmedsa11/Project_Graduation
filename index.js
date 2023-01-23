const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  },
});
// hassib socket.io
const sio = require('socket.io-client')('https://asl.connect-asl.site/');

app.use(cors());
app.use(express.static('public'));

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let socketList = {};
let rooms = {};
let queues = {};

// Socket
io.on('connection', (socket) => {
  sio.removeAllListeners();
  console.log(`New User connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
  // new user join a room
  socket.on('BE-join-room', ({ roomId, user, video, audio, typeMeet }) => {
    socket.join(roomId);
    console.log(`User join room, ${socket.id}, ${user.name}, ${roomId}`);
    // save user info to socketList
    socketList[socket.id] = { user, video, audio };
    if (rooms[roomId] == undefined)
      rooms[roomId] = {
        typeMeet,
        users: [],
      };
    rooms[roomId].users = rooms[roomId].users.filter(
      (ele) => ele.mobile !== user.mobile
    );
    rooms[roomId].users = [user, ...rooms[roomId].users];
    console.log({ socketList });

    // tell all users in the room that new user join
    socket.to(roomId).emit('FE-user-join', {
      userId: socket.id,
      info: socketList[socket.id],
    });

    // user leave the room
    socket.on('disconnect', () => {
      delete socketList[socket.id];
      console.log(`User disconnected: ${socket.id}, ${user.name}`);
      socket.to(roomId).emit('FE-user-leave', { userId: socket.id });
      socket.leave(roomId);
    });
  });

  socket.on('BE-call-user', ({ userToCall, from, signal }) => {
    io.to(userToCall).emit('FE-receive-call', {
      signal,
      from,
      info: socketList[socket.id],
    });
  });

  socket.on('BE-accept-call', ({ signal, to }) => {
    io.to(to).emit('FE-call-accepted', {
      signal,
      answerId: socket.id,
    });
  });

  socket.on(
    'BE-send-message',
    ({ roomId, msg, sender, img, inputImage }) => {
      io.in(roomId).emit('FE-receive-message', {
        msg,
        sender,
        img,
        inputImage,
      });
    }
  );

  socket.on('BE-toggle-camera-audio', ({ roomId, switchTarget }) => {
    if (socketList[socket.id]) {
      if (switchTarget === 'video') {
        socketList[socket.id].video = !socketList[socket.id].video;
      } else {
        socketList[socket.id].audio = !socketList[socket.id].audio;
      }
      console.log('toggle camera audio');
      console.log({ socketList });
      socket
        .to(roomId)
        .emit('FE-toggle-camera', { userId: socket.id, switchTarget });
    } else {
      console.log('user not found', socket.id);
    }
  });

  // feature 1 (convert text to frame)
  socket.on('send-text', ({ data, roomId, name }) => {
    console.log('received data from frontend', data);
    if (queues[roomId] == undefined)
      queues[roomId] = {
        finished: true,
        info: [],
      };
    queues[roomId].info = [{ data, name }, ...queues[roomId].info];
    if (queues[roomId].finished)
      sio.emit('stream_text', { data: '', id: roomId });
  });

  // receive frame from  hassib
  sio.on('stream_text', ({ data, id: roomId }) => {
    console.log('received data from hassib');
    io.in(roomId).emit('receive-frame', { buffer: data });
  });

  // trigger when hassib finishs to convert text to frame
  sio.on('send', ({ id: roomId }) => {
    console.log(roomId);
    console.log('finished sending 1');
    queues[roomId].finished = true;
    if (queues[roomId].info.length > 0) {
      let { data, name } = queues[roomId].info.pop();
      queues[roomId].finished = false;
      sio.emit('stream_text', { data, id: roomId });
      io.in(roomId).emit('receive-text', {
        data,
        name,
      });
    }
    socket.emit('send');
  });

  // feature 2
  socket.on('stream_sign', ({ landmarks, name, roomId }) => {
    io.in(roomId).emit('send_sender_name', { name });
    sio.emit('stream_sign', { landmarks, id: roomId });
  });

  sio.on('stream_sign', ({ text, id: roomId }) => {
    io.in(roomId).emit('stream_sign', { text });
  });

  // join sign room (superroom from original room)
  socket.on('join-sign-room', ({ roomId, id }) => {
    console.log('join sign room', socket.id, roomId + id);
    io.in(roomId).emit('enable-f1-to-all');
    socket.join(roomId + id);
  });
  socket.on('leave-sign-room', async ({ roomId, id }) => {
    console.log('leave sign room', socket.id, roomId + id);
    socket.leave(roomId + id);
    const sockets = await io.in(roomId + id).fetchSockets();
    if (sockets.length === 0) {
      console.log('no one in room');
      io.in(roomId).emit('disable-f1-to-all');
    } else {
      console.log('someone in room');
    }
  });

  // get users in rooms
  socket.on('get-all-users', ({ roomId }) => {
    socket.emit('get-all-users', {
      users: rooms[roomId].users,
      roomId,
      typeMeet: rooms[roomId].typeMeet,
    });
  });

  socket.on('get-rooms-user', ({ mobile }) => {
    const userRooms = [];
    for (const room in rooms) {
      if (rooms[room].users.find((user) => user.mobile === mobile))
        userRooms.push(room);
    }

    socket.emit('get-rooms-user', { userRooms });
  });
});

http.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
