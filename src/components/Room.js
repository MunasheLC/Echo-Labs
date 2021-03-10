import React, { useEffect, useRef } from 'react'
import io from "socket.io-client"
import "react-router-dom"

export default function Room() {

    const userVideo = useRef()
    const partnerVideo = useRef()
    const peerRef = useRef()
    const socketRef = useRef()
    const otherUser = useRef()
    const userStream= useRef()


    //Build INVITE
    function handleNegotiationNeededEvent(userID) {

        peerRef.current.createOffer().then(offer =>{
            return peerRef.current.setLocalDescription(offer)
        }).then(() => {
            const payload = {
                target: userID,
                 caller: socketRef.current.id,
                 sdp: peerRef.current.setLocalDescription
            }
            socketRef.current.emit("offer", payload)
        }).catch(e => console.log(e))
        
    }


    //Receiving Call Function
    function handleReceiveCall(incoming) {

        // Create receiving peer
        peerRef.current = createPeer()

        // Description object conataining the incooming SDP
        const desc = new RTCSessionDescription(incoming.sdp)

        //Set remote description. SDP of caller
        peerRef.current.setRemoteDescription(desc).then( () => {

            //Collect Tracks and attache them to the peer
            userStream.current.getTracks().forEach(track => {

                peerRef.current.addTrack(track, userStream.current)

            }).then( () => {

                //Resolves at the creation of an answer
                return peerRef.current.createAnswer()

            }).then(answer => {
                //Some SDP Data 
                return peerRef.current.setLocalDescription(answer)
            }).then( () => {
                const payload = {
                    targer: incoming.caller,
                    caller: socketRef.current.id,
                    sdp: peerRef.current.setLocalDescription
                }
                socketRef.current.emit("answer", payload)
            })
        })
        
    }

    //Answer Call Function
    function handleAnswer(message) {
        
        // Create answer sdp
        const desc = new RTCSessionDescription(message.sdp)
        peerRef.current.setRemoteDescription(desc).catch(e => console.log(e))
        
    }

    // ICE candidate communication

    function handleICECandidateEvent(e) {

        //Does event have candidate
        if (e.candidate){

            // If true create payload with other users information
            const payload = {
                target: otherUser.current,
                candidate: e.candidate
            }
            socketRef.current.emit("ice-candidate", payload)
        }
        
    }

    // ICE candidate agreement logic
    function handleNewICECandidatemsg(incoming) {

        const candidate = new RTCIceCandidate(incoming)

        peerRef.current.addICECandidate(candidate).catch(e => console.log(e))
        
    }

    //User video/audio information
    function handleTrackEvent(e) {

        partnerVideo.current.srcObject = e.streams[0]
        
    }

    //Function to create peers
    function createPeer(userID) {

        const peer = new RTCPeerConnection({

            iceServers: [
                {
                    urls: "stun:stun.telnyx.com"
                },
                {
                    urls: "turn:turn.telnyx.com?transport=tcp",
                    credential: "testpassword",
                    username: "testuser"

                }
            ]
        })

        peer.onicecandidate = handleICECandidateEvent 
        peer.ontrack = handleTrackEvent
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID)
        
    }

    //Calls the users - Later change to add multiple users to a room or grant access to a room
    function callUser(userID) {

        // Builds WebRTC peer object
        peerRef.current = createPeer(userID)

        // Returns an array of the tracks on a stream (AUdio and Video). 
        userStream.current.getTracks().forEach(track => {

            // Attach stream to peer so that it can be sent over to other user
            peerRef.current.addTrack(track, userStream.current)
        })
        
    }

    // Runs once, requests acces to user video and audio devices
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true

        // stream contains both audio and video 
        }).then(stream => {

            //attach stream to userVideo Ref, allows us to display video 
            userVideo.current.srcObject = stream;
            
            //Store stream in userStream
            userStream.current = stream
            
            // Conncet to socket server
            socketRef.current = io.connect("/")

            

            // Tell Server we're tryna join the room. Emitting event "join room" Check server,js          
            socketRef.current.emit("join room", this.props.match.roomID) // pass down the roomID to server


            // When second user joins, send the first user their ID
            socketRef.current.on("other user", userID => {
                callUser(userID);
                otherUser.current = userID
            })
            
            // From first user perspective, get the ID of the joining user
            socketRef.current.on("user join", userID => {
                otherUser.current = userID 
            })

            // What happens on offer
            socketRef.current.on("offer", handleReceiveCall)
            
            // What happens on answer
            socketRef.current.on("answer", handleAnswer)
            
            //What happens when ICE-Candidate event is called
            socketRef.current.on('ice-candidate', handleNewICECandidatemsg)
        })
        // return () => {
        //     cleanup
        //}

    }, [])

    return (
        <div>
            <video autoPlay ref={userVideo} />
            <video autoPlay ref={partnerVideo}/>
        </div>
    )
}
