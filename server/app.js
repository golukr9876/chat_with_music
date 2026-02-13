import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = 4100;

const app = express();
const server = createServer(app);
const io = new Server(server, {
     cors: {
        // origin: "https://chat-app-frontend-kgfp.vercel.app",
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.use(
     cors({
        // origin: "https://chat-app-frontend-kgfp.vercel.app",\
        origin: "http://localhost:5173/",
        methods: ["GET", "POST"],
        credentials: true,
    })
)

io.on("connection", (socket) => {
    socket.on('join-room', (room) => {
       
        socket.join(room);
        //  console.log("room joined : ", room);
        // socket.to(room).emit("user-connected", socket.id);
    });

    socket.on("delete-for-everyone", ({room, id}) => {
        io.to(room).emit("delete-message", id);
    })

    socket.on("music", ({query, room}) => {
        io.to(room).emit("play-music", query);
    })

    socket.on("message", ({ newMsg, room, Id}) => {
        // console.log(name);
        socket.to(room).emit("recieve-message", {newMsg, Id});
    });

})

app.get("/", (req, res)=>{
    res.send("hello man, how are you");
} )
server.listen(port, () => {
    console.log(`server is running on port ${port}`);
})