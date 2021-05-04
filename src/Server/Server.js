const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
let {PythonShell} = require('python-shell')



//Collection of rooms
const users = {};

let codeStore = ""


//Collection of users -> This can probably be connected with the DB
const socketToRoom = {};

// Event to check if a person connects to socket server. "Socket" is the socket object for one person
io.on('connection', socket => {

    //Attaching event listener to socket event called "Join room". Used on the client side
    socket.on("join-room", roomID => {

        console.log("join succesful")
        

        //Amount of users in the room, max is 4 right now, maybe change later 
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {

                socket.emit("room full");

                return;
            }

            // New person has joined, add them to that roomID. Change socket id to users ID later
            users[roomID].push(socket.id);

        } 
        
        else {

            //If the room does not exist, create an Array of scoketID's in the collection
            users[roomID] = [socket.id];

        }


        socketToRoom[socket.id] = roomID;
        
        //List of users in the lab room excluding current user -> identified by socketID
        const usersInThisLab = users[roomID].filter(id => id !== socket.id);

        socket.emit("user-connection", usersInThisLab);

        // if (otherUser) {

        //     // If another user is found emit this event
        //     socket.emit("other user", otherUser)
        //     // Tell other user that another person is in room
        //     socket.to(otherUser).emit("user joined", socket.id)
        // }
    });


    //Essentially the call event 
    socket.on("send-signal", payload => {


        // Initiate call towards target through event "offer" containing payload (Caller info and offer object)
        io.to(payload.userToSignal).emit("user-joined", { 

            signal: payload.signal,
            callerID: payload.callerID 
        
        });
    });

    //Answer Event
    socket.on("returning-signal", payload => {

        io.to(payload.callerID).emit("signal-return", {

             signal: payload.signal,
             id: socket.id });

    });

    //Handling user disconncetion
    socket.on("disconnect", () => {

        const roomID = socketToRoom[socket.id];

        let room = users[roomID];
        
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
        socket.broadcast.emit("user-leaves",  socket.id)
        console.log("User left successfully")
    });

    // socket.on("receive-code", code => {
        
    //     code = codeStore
        

    // }) 
    socket.on("update-code", code => {

        const roomID = socketToRoom[socket.id]
        
        
        // console.log(code)
        // socket.broadcast.emit("receive-update-code", code)
        
        // SEND CODE TO EVERYONE EXCEPT MYSELF
        if(code != codeStore){

            codeStore = code

            console.log(codeStore)
            //checher peek to make sure that the code is not the same before sending it to the otrs
        socket.broadcast.emit("receive-update-code", codeStore)

        }
        
        
        

    }) 

    //Send code to the server and have it run in the python shell
    socket.on("run-code", code => {

        try{
            PythonShell.runString(code, null, function (err, result) {
            if (err) {socket.emit("receive-result", err)}
            console.log('execution finished');
            
            socket.emit("receive-result", result)
        })}

        catch(e){

            console.log(e)

        }
            

        
    })


   
});

server.listen(8000, () => console.log('server is running on port 8000'));