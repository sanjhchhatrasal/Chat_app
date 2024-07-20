const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const socketIo = require("socket.io");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const io = socketIo(server);

let username = [];
let userid = [];
var count = 0;

io.on("connection", function(socket){
    console.log("Connected to socketIo");

    socket.on("username", function(name){
        username.push(name)
        userid.push(socket.id)
        socket.emit("username-set", name);
        io.emit("connected-users", {totalusers : username.length, usernames: username})
        console.log(username.length)
    })

    socket.on("send-msg", function(data){
        if(userid.indexOf(socket.id) !== -1){
            let name = username[userid.indexOf(socket.id)]
            io.emit("recieve-msg", {id: socket.id, ...data, name})
        }
        
    })

    socket.on("typing", function(){
        if(userid.indexOf(socket.id) !== -1){
            let name = username[userid.indexOf(socket.id)]
            socket.broadcast.emit("typing")
            console.log(`typing...${name}`)
        }
    })

    socket.on("disconnect", function(){
        if(userid.indexOf(socket.id) !== -1){
            userid.splice(userid.indexOf(socket.id),1)
            username.splice(username.indexOf(socket.id),1);
            io.emit("disconnected-user", {totalusers : username.length, usernames: username})
        }
    })
})

app.get("/", (req, res) => {
    res.render("index")
});

server.listen(3000)