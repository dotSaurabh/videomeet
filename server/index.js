import { Server } from "socket.io";

const io = new Server(5000,{
  cors: true
});

const emailToRoomId = new Map()  // map is diferent from map loop . this one store key value pair like object
const roomIdToSocketId = new Map() 

io.on("connection", (socket) => {
  console.log(`A user connected`,socket.id);
  socket.on("room:join", (data) => {
    const {email, roomId} = data  //destructuring data from client
    emailToRoomId.set(email, socket.id)  // setting the room id to the email
    roomIdToSocketId.set(socket.id, email) // setting the socket id to the room id
    io.to(roomId).emit('user:joined',{email,id:socket.id}) // new user enter the same room 
    socket.join(roomId)     // adding the it to same room 
     io.to(socket.id).emit("room:join",data)
     console.log(data)

  })

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
    console.log(`data has been send step 1`);
  });
   

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
    console.log(`data has been send step 2`);
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log(" data has been send step 3");
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
});