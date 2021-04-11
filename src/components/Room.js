import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}


const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};






const Room = (props) => {
    const [peers, setPeers] = useState([]); //local list of peers for displaying purposes
    const socketRef = useRef(); //server
    const userVideo = useRef(); //users video
    const peersRef = useRef([]); // peer connection
    const roomID = props.match.params.roomID; //The ID for the room

    //Function to create peers
    function createPeer(userToSignal, callerID, stream) {

        // Signal that you've joined to the other peers
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {

            //Collect the singal you're sending to, your own ID and then you stream
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }


    //Takes, the signal from person who just joined the room, 
    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })


         //When someone wants to connect 
        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        //Accept the signal
        peer.signal(incomingSignal);

        return peer;
    }


    // Runs once, requests acces to user video and audio devices
    useEffect(() => {

         // Conncet to socket server
        socketRef.current = io.connect("/");

        navigator.mediaDevices.getUserMedia({

             video: videoConstraints, 
             audio: true 

            // stream contains both audio and video
            }).then(stream => {
            
            //attach stream to userVideo Ref, allows us to display video
            userVideo.current.srcObject = stream;
            
            // Tell Server we're tryna join the room. Emitting event "join room" Check server,js
            socketRef.current.emit("join room", roomID);
            
             // When second user joins, send the first user their ID
            socketRef.current.on("all users", users => {

                // Array of peers from server
                const peers = [];

                //Collect UserID's from the array
                users.forEach(userID => {

                    //Takes user ID of person we're making a peer for, then our own ID and stream
                    const peer = createPeer(userID, socketRef.current.id, stream);

                    //Init the array of peers
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })

                    //Array for rendering purposes
                    peers.push(peer);
                })

                setPeers(peers);
            })

            //When a user joins add their peer to the peer array
            socketRef.current.on("user joined", payload => {

                const peer = addPeer(payload.signal, payload.callerID, stream);

                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {

                const item = peersRef.current.find(p => p.peerID === payload.id);

                item.peer.signal(payload.signal);
            });
        })
    }, []);


    return (
        <Container>
            <StyledVideo muted ref={userVideo} autoPlay playsInline />
            {peers.map((peer, index) => {
                return (
                    <Video key={index} peer={peer} />
                );
            })}
        </Container>
    );
};

export default Room;