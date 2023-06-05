// Modules init
const { Server } = require("socket.io");
const { createServer } = require('http');
const cookieParser = require('cookie-parser');
const md = require('markdown-it')('commonmark', {
  html: true,
  linkify: true,
  typographer: true
});
const striptags = require('striptags');
const cors = require('cors');
const { Socket } = require("socket.io-client");
const { instrument } = require("@socket.io/admin-ui");

// Declarations
const httpServer = createServer();
VERSION = 'v1.0.0'

// App init
const io = new Server({ 
  maxHttpBufferSize: 1e8,
  wsEngine: require("eiows").Server,
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true
  }
});

instrument(io, {
  auth: {
    type: "basic",
    username: "cadmins",
    password: "$2y$10$TkyJP6MUI0yRCY4JvRbAQ.A5grLzOoSgizoyoyHxDGjn1Vj8l7U4C"
  },
});
app.use(cors()); 
app.use(cookieParser());

io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

// Socket.io init
io.on('connection', function (client) {
  console.log('Client connected...');
  client.join('::GENERAL');
  client.emit('ID', client.id);

  client.on('join', function (data) {
    console.log(data);
 //   get(client).catch(console.dir);
  });

  client.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  client.on('joinEmit', function (data) {
    client.to(data.room).emit('broadJoin', "<div id='joinmsg'>" + data + "</div>")
    client.emit('broadJoin', "<div id='joinmsg'>You joined the chat room.</div>")
  });

  client.on('joinRoom', (data) => {
    client.leave(data.pre)
    client.join(data.room);
    client.to(data.room).emit('broad', "<div id='joinmsg'>" + data.js + "</div>")
    client.emit('broad', "<div id='joinmsg'>You joined the " + data.room + ".</div>")
    console.log(data.jsc);
  })

  client.on("disconnected", (data) => {
    console.log(data);
  });

  client.on('imageUpdate', (data) => {
   console.log(data)
  })

  client.on("disconnectEmit", (data) => {
    client.to(data.room).emit('broad', "<div id='joinmsg'>" + data + "</div>")
  });

  client.on('messages', function (data) {
    if (data.type == 'none') {
      /*

      CHEATSHEET:

      client.emit('EVENT', DATA)
      send to user
      client.to(ROOM).emit('EVENT', DATA)
      broadcast

      */

        client.emit('broad', "<div class='chmscon'><div id='msghead' style='margin-bottom: 5px;'><img style='width: 48px; height: 48px; border-radius: 2em; margin-right: 3px;' src='" + data.user.pfp + "'><strong id='user'><a id='a' href='" + data.user.url + "'>" + data.user.disName + " (" + data.user.genName + "): </a></strong><span id='date' style='color: #000000 !important; font-weight: 300 !important; font-size: small;'>[at <span id='datea'></span>]</span id='date'></div><div class='chat-msg user'>" + striptags(md.render(striptags(data.text)), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "</div></div>");
        client.to(data.room).emit('broad', "<div class='chmscon'><div id='msghead' style='margin-bottom: 5px;'><img style='width: 48px; height: 48px; border-radius: 2em; margin-right: 3px;' src='" + data.user.pfp + "'><strong id='user'><a id='a' href='" + data.user.url + "'>" + data.user.disName + " (" + data.user.genName + "): </a></strong><span id='date' style='color: #000000 !important; font-weight: 300 !important; font-size: small;'>[at <span id='datea'></span>]</span id='date'></div><div class='chat-msg other'>" + striptags(md.render(striptags(data.text)), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "</div></div>");
        client.to(data.room).emit('broadNotif', data);
    } else /* if (data.type == 'image') */ {
          client.emit('broad', "<div class='chmscon'><div id='msghead' style='margin-bottom: 5px;'><img style='width: 48px; height: 48px; border-radius: 2em; margin-right: 3px;' src='" + data.user.pfp + "'><strong id='user'><a id='a' href='" + data.user.url + "'>" + data.user.disName + " (" + data.user.genName + "): </a></strong><span id='date' style='color: #000000 !important; font-weight: 300 !important; font-size: small;'>[at <span id='datea'></span>]</span id='date'></div><div class='chat-msg user'>" + striptags(md.render(striptags(data.text)), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "<br><span id='imga' style='display:none;'>" + data.file + "</span><img id='imgtbd' class='sentImage' src=''></div></div>");
          client.to(data.room).emit('broad', "<div class='chmscon'><div id='msghead' style='margin-bottom: 5px;'><img style='width: 48px; height: 48px; border-radius: 2em; margin-right: 3px;' src='" + data.user.pfp + "'><strong id='user'><a id='a' href='" + data.user.url + "'>" + data.user.disName + " (" + data.user.genName + "): </a></strong><span id='date' style='color: #000000 !important; font-weight: 300 !important; font-size: small;'>[at <span id='datea'></span>]</span id='date'></div><div class='chat-msg other'>" + striptags(md.render(striptags(data.text)), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "<br><span id='imga' style='display:none;'>" + data.file + "</span><img id='imgtbd' class='sentImage' src=''></div></div>");
          client.to(data.room).emit('broadNotif', data);
    } /*  else if (data.type == 'video') {
          client.emit('broad', "<div class='chmscon'><div id='msghead' style='margin-bottom: 5px;'><img style='width: 48px; height: 48px; border-radius: 2em; margin-right: 3px;' src='" + data.user.pfp + "'><strong id='user'><a id='a' href='" + data.user.url + "'>" + data.user.disName + " (" + data.user.genName + "): </a></strong><span id='date' style='color: #000000 !important; font-weight: 300 !important; font-size: small;'>[at <span id='datea'></span>]</span id='date'></div><div class='chat-msg user'>" + striptags(md.render(striptags(data.text)), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "<br><span id='imga' style='display:none;'>" + data.file + "</span><video id='imgtbd' class='sentImage' src='" + data.file + "' controls autoplay></video></div></div>");
          client.to(data.room).emit('broad', "<div class='chmscon'><div id='msghead' style='margin-bottom: 5px;'><img style='width: 48px; height: 48px; border-radius: 2em; margin-right: 3px;' src='" + data.user.pfp + "'><strong id='user'><a id='a' href='" + data.user.url + "'>" + data.user.disName + " (" + data.user.genName + "): </a></strong><span id='date' style='color: #000000 !important; font-weight: 300 !important; font-size: small;'>[at <span id='datea'></span>]</span id='date'></div><div class='chat-msg other'>" + striptags(md.render(striptags(data.text)), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "<br><span id='imga' style='display:none;'>" + data.file + "</span><video id='imgtbd' class='sentImage' src='" + data.file + "' controls autoplay></video></div></div>");
      client.to(data.room).emit('broadNotif', data);
    } else if (data.type == 'audio') {
      client.emit('broad', "<div class='chmscon'><div id='msghead' style='margin-bottom: 5px;'><img style='width: 48px; height: 48px; border-radius: 2em; margin-right: 3px;' src='" + data.user.pfp + "'><strong id='user'><a id='a' href='" + data.user.url + "'>" + data.user.disName + " (" + data.user.genName + "): </a></strong><span id='date' style='color: #000000 !important; font-weight: 300 !important; font-size: small;'>[at <span id='datea'></span>]</span id='date'></div><div class='chat-msg user'>" + striptags(md.render(striptags(data.text)), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "<br><span id='imga' style='display:none;'>" + data.file + "</span><audio id='imgtbd' controls src='" + data.file + "'></div></div>");
      client.to(data.room).emit('broad', "<div class='chmscon'><div id='msghead' style='margin-bottom: 5px;'><img style='width: 48px; height: 48px; border-radius: 2em; margin-right: 3px;' src='" + data.user.pfp + "'><strong id='user'><a id='a' href='" + data.user.url + "'>" + data.user.disName + " (" + data.user.genName + "): </a></strong><span id='date' style='color: #000000 !important; font-weight: 300 !important; font-size: small;'>[at <span id='datea'></span>]</span id='date'></div><div class='chat-msg other'>" + striptags(md.render(striptags(data.text)), ['strong', 'i', 'em', 'code', 'a', 'div', 'sub', 'sup', 's']) + "<br><span id='imga' style='display:none;'>" + data.file + "</span><audio id='imgtbd' controls src='" + data.file + "'></div></div>");
      client.to(data.room).emit('broadNotif', data);
    } */
  });

});

httpServer.listen(3000);