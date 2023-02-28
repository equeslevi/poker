import express from "express";
import http from "http";
import { Worker } from "worker_threads"
import { handler } from "./client/build/handler.js"
import mongo from "./modules/mongodb-server.js";
import CryptoJS from 'crypto-js'
import { Server as socketIO } from "socket.io";
import dayjs from "dayjs";
/*
========================================================
== IMPORTING ROUTES
========================================================
*/
import { router as round } from './routes/api-round.js'

const app = express()
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'))

app.get('/robots.txt', function (req, res) {
  res.type('text/plain');
  res.send("User-agent: *\nDisallow: /");
});

app.use('/api/round/', round);

/*
========================================================
== //PASS TO SVELTE IF NOTHING MATCHES
========================================================
*/
app.use(handler);

const server = http.Server(app);
server.listen(5000);

const io = new socketIO(server, {
  cors: {
    origin: "*"
  }
});

io.socketsJoin("waiting-room");

io.on('connection', socket => {
  socket.join("waiting-room");
  socket.on('message', (message) => {
    const newObj = {
      time: dayjs(Date.now()).format('HH:mm'),
      message: message
    }
    socket.to("waiting-room").emit("new-chat", newObj);
    socket.emit("self-chat", newObj);
  });
});

io.of("/").adapter.on("create-room", (room) => {
  console.log(`room ${room} was created`);
});

io.of("/").adapter.on("join-room", (room, id) => {
  console.log(`socket ${id} has joined room ${room}`);
});

await mongo.connect()
app.listen(port, () => {
  console.log(`SERVER STARTED AT PORT ${port}`)
})