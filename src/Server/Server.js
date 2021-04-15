const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);


//Collection of rooms
const users = {};

//Collection of users -> This can probably be connected with the DB
const socketToRoom = {};

// Event to check if a person connects to socket server. "Socket" is the socket object for one person
io.on('connection', socket => {

    //Attaching event listener to socket called "Join room". Used on the client side
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
<<<<<<< HEAD
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
    });

});

server.listen(8000, () => console.log('server is running on port 8000'));
=======
        io.to(payload.target).emit("offer", payload)
    })

    // Answer event
    socket.on("answer", payload => {
        // When answered send info back to originator 
        io.to(payoload.target).emit("answer", payload)
    })

    // Event to have partcipants agree on a connection 
    socket.on("ice-candidate", incoming => {
        io.to(incoming.target.emit("ice-candidate", incoming.candidate))
    })
})

server.listen(8000, () => console.log("Server is running on port 8000")) 
>>>>>>> d2d6dd2ab919bfb64383a871a873d2d4f9ea381b
