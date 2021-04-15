const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const socket = require("socket.io")
const io = socket(server)

// Collection of rooms
const rooms = {}

// Event to check if a person connects to socket server. "Socket" is the socket object for one person
io.on("connection", socket => {

    //Attaching event listener to socket called "Join room". Used on the client side
    socket.on("join room", roomID => {
        
        //If room ID in collection then we already have an array of socket ID's ie someone is already in the room
        if (rooms[roomID]) {

            // New person has joined, add them to that roomID
            rooms[roomID].push(socket.id)
        } else {

            //If the room does not exist, create an Array of scoketID's in the collection 
            rooms[roomID] = [socket.id]
        }
        
        // Search for the other user. Extending later for more than 2 participants. Is there an ID in the Room ID that's not current users
        const otherUser = rooms[roomID].find(id => id !== socket.id)
        if (otherUser){

            // If another user is found emit this event
            socket.emit("other user", otherUser)
            // Tell other user that another person is in room
            socket.to(otherUser).emit("user joined", socket.id)
        }
    })

    //Call event
    socket.on("offer", payload => {
        // Initiate call towards target through event "offer" containing payload (Caller info and offer object)
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
