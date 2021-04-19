import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import "./Room.css"


// Styled component acts as as container
const Container = styled.div`
    height: 100vh;
    display: flex;
`;

const StyledVideo = styled.video`
     height: 400px;
     width: 300px;
     padding: 10px;

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
    const userTracks = useRef();// Track ref for mute/unmute functions
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
            socketRef.current.emit("send-signal", { 
                userToSignal, 
                callerID, 
                signal 
            
            })
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
            socketRef.current.emit("returning-signal", { 
                
                signal, 
                callerID 
            })
        })

        //Accept the signal
        peer.signal(incomingSignal);

        return peer;
    }

    //Function to mute the audio you're sending 
    function muteAudio(){
        
        const audioStatus = userTracks.current.getAudioTracks()[0].enabled
        
        if (audioStatus){

            userTracks.current.getAudioTracks()[0].enabled = false

            console.log("Audio muted")
                
            //function to update button
        }
        else{
            
            userTracks.current.getAudioTracks()[0].enabled = true
            console.log("Audio on")
        }

    }

    //Function to stop video display
    function stopVideo(){
        
        const audioStatus = userTracks.current.getVideoTracks()[0].enabled
        
        if (audioStatus){

            userTracks.current.getVideoTracks()[0].enabled = false

            console.log("Video off")
                
            //function to update button
        }
        else{
            
            userTracks.current.getVideoTracks()[0].enabled = true
            console.log("Video on")
        }
        
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
            userTracks.current = stream
            
            console.log("The stream object", userVideo)
            
            // Tell Server we're tryna join the room. Emitting event "join room" Check server,js
            socketRef.current.emit("join-room", roomID);
            
             // When second user joins, send the first user their ID
            socketRef.current.on("user-connection", users => {

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
            socketRef.current.on("user-joined", payload => {

                const peer = addPeer(payload.signal, payload.callerID, stream);

                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("signal-return", payload => {

                const item = peersRef.current.find(p => p.peerID === payload.id);

                item.peer.signal(payload.signal);
            });
        })
    }, []);


    return (
        
        <div id="room-container">
            <div id="video-grid">
                
                <StyledVideo muted ref={userVideo} autoPlay playsInline />
                {peers.map((peer, index) => {
                    return (
                        <Video key={index} peer={peer} />
                    );
                })}


<               div class="controls">
                    <div class="control-block">
                        <div class="media-controls">
                            <button onClick={muteAudio}>Mute</button>
                        </div>

                        <div onClick={stopVideo}class="media-controls">
                            <button>Camera</button>
                        </div>

                        <div class="media-controls">
                            <button>Leave</button>
                        </div>

                    </div>
            </div >
            </div>
            

         
            
            <div class="center-codeEditor">
                    code editor here
                    {/* More on this later */}
            </div>
        </div>
        
    );
};

export default Room;
