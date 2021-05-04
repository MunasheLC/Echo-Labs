import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import "./Room.css";
import {inCallFalse} from './DisplayParticipants';
import { db, auth } from "../firebase";
import { Link, useHistory } from "react-router-dom"
// import Editor, { echoEditor } from "./Editor"
// import { edit } from "ace-builds";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/ext-language_tools";
import { Button} from "react-bootstrap"
import {getLobbyID} from './Host'
import {UpdateRequests} from './Requests';
import {getLabData} from './Host';
import {removeUserFromRequestList} from './Requests'

// Styled component acts as as container
const Container = styled.div`
  height: 100vh;
  display: flex;
`;

const StyledVideo = styled.video`
  width: 480px;
  padding:10px;
`;

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <StyledVideo playsInline autoPlay ref={ref} />;
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};
var lab="";
var student="";

const Room = (props) => {
  document.getElementById('root').style.fontFamily="monospace"; 
  const [peers, setPeers] = useState([]); //local list of peers for displaying purposes
  const socketRef = useRef(); //socket connection
  const userVideo = useRef(); //users video
  const userTracks = useRef(); // Track ref for mute/unmute functions
  const peersRef = useRef([]); // peer connections
  const roomID = props.match.params.roomID; //The ID for the room
  const [editorCode, setEditorCode] = useState(""); //stores value of the editor for sending to server
  const codeRef = useState(""); //This ref syncs the editor to the onChange function -> basically just a store for the code too
  const [peerFlag, setPeerFlag] = useState(false); //This flag is necessary to handle updates between the server and the current user so that received update aren't automatically sent -> this behavior results in a loop 
  const echoEditor = useRef(null); // Ref is used to get access to the aceEditor functions -> used to update the value of the editor
  const history = useHistory() //Hisory hook
  const hist = useHistory();
 const [echoConsoleLogs, setEchoConsoleLogs] = useState("");
  // console.log("python", PythonShell)
  

  //tutorCheck - Called when a peer is leaving, this checks if the peer leaving is a tutor, 
  //if so remove the student from the request list on firestore as request has been satified. 
  async function tutorCheck(labid){ 
    const currentUserEmail = auth.currentUser.email
    const labDoc = await db.doc(`labs/${labid}`).get();
    const labData = labDoc.data();
    const tutors = labData.Lab_Admins;
    
    if (tutors.includes(currentUserEmail)){ 
          removeUserFromRequestList(lab,student) 
          inCallFalse(currentUserEmail);
    }
    else{
        console.log("is student");
    }
  }
  async function handleRoom(){
    
		try{
      console.log("in handle room" + lab);
      var labID = await getLabData(lab);
      //if user is tutor remove the student from requests when going back into lobby
      tutorCheck(labID);
			getLobbyID(lab).then((value) => {hist.push(`/Lobby/${value}`)});

		} catch{
		}
	}
  //used when someone presses request Help - Function calls UpdateRequests 
  //which updates a specific labs requestsList on firestore with the current users email.
  async function requestHelp(){
		try{
      alert("Requesting help");
      UpdateRequests(lab);

		} catch{
		}
	}

  //Function to create peers
  function createPeer(userToSignal, callerID, stream) {
    // Signal that you've joined to the other peers
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      //Collect the singal you're sending to, your own ID and then you stream
      socketRef.current.emit("send-signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  //Takes, the signal from person who just joined the room,
  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    //When someone wants to connect
    peer.on("signal", (signal) => {
      socketRef.current.emit("returning-signal", {
        signal,
        callerID,
      });
    });

    //Accept the signal
    peer.signal(incomingSignal);

    return peer;
  }

  //Function to mute the audio you're sending
  function muteAudio() {
    const audioStatus = userTracks.current.getAudioTracks()[0].enabled;

    if (audioStatus) {
      userTracks.current.getAudioTracks()[0].enabled = false;

      console.log("Audio muted");

      //function to update button
    } else {
      userTracks.current.getAudioTracks()[0].enabled = true;
      console.log("Audio on");
    }
  }

  //Function to stop video display
  function stopVideo() {
    const audioStatus = userTracks.current.getVideoTracks()[0].enabled;

    if (audioStatus) {
      userTracks.current.getVideoTracks()[0].enabled = false;

      console.log("Video off");

      //function to update button
    } else {
      userTracks.current.getVideoTracks()[0].enabled = true;
      console.log("Video on");
    }
  }

    //Leave button function
    function handleLeave(){

      userTracks.current.getTracks().forEach(track => track.stop());
      socketRef.current.disconnect()
      history.push("/dashboard")
      
    }
  

  //Function to run the code in the editor - runs in server via pyshell
  function handleRunCode(){
    
    let codeToRun = echoEditor.current.editor.getValue()
    console.log("codeToRun: ", codeToRun)
    socketRef.current.emit("run-code", codeToRun )

    socketRef.current.on("receive-result", result => {

      console.log("result from server is:", result)
      setEchoConsoleLogs(result)
      
    })


  }

  //Clears the editor
  function handleClearEditor(){

    echoEditor.current.editor.setValue("")
    setEchoConsoleLogs("");

  }

  // Runs once, requests acces to user video and audio devices
  useEffect(() => {
    // Conncet to socket server
    socketRef.current = io.connect("/");

    navigator.mediaDevices
      .getUserMedia({
        video: videoConstraints,
        audio: true,

        // stream contains both audio and video
      })
      .then((stream) => {
        //attach stream to userVideo Ref, allows us to display video
        userVideo.current.srcObject = stream;
        userTracks.current = stream;

        console.log("The stream object", userVideo);

        // Tell Server we're tryna join the room. Emitting event "join room" Check server,js
        socketRef.current.emit("join-room", roomID);

        // When second user joins, send the first user their ID
        socketRef.current.on("user-connection", (users) => {
          // Array of peers from server
          const peers = [];

          //Collect UserID's from the array
          users.forEach((userID) => {
            //Takes user ID of person we're making a peer for, then our own ID and stream
            const peer = createPeer(userID, socketRef.current.id, stream);

            //Init the array of peers
            peersRef.current.push({
              peerID: userID,
              peer,
            });

            //Init the local array of peers with the ID's
            peers.push({
              peerID: userID,
              peer,
            });

            //Array for rendering purposes
            // peers.push(peer);
          });

          setPeers(peers);
          console.log("The peers", peers);
        });

        //When a user joins add their peer to the peer array
        socketRef.current.on("user-joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);

          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          const peerObject = {
            peer,
            peerID: payload.callerID,
          };

          setPeers((users) => [...users, peerObject]);
        });

        socketRef.current.on("signal-return", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);

          item.peer.signal(payload.signal);
        });

        //Find peer of leaving user and remove them from the call
        socketRef.current.on("user-leaves", (id) => {
          const peerObject = peersRef.current.find((p) => p.peerID === id);

          if (peerObject) {
            peerObject.peer.destroy();
          }

          const peers = peersRef.current.filter((p) => p.peerID !== id);
          peersRef.current = peers;
          setPeers(peers);
        });

        //Receive code from peers and set it to the current codeRef
        socketRef.current.on("receive-update-code", (code) => {
          if (code == codeRef.current) {
            console.log(
              "Received code",
              code,
              "is the same as editor code",
              codeRef.current
            );
            return;
          } else {
            setPeerFlag((prevFlag) => (prevFlag = true));
            echoEditor.current.editor.setValue(code);
            echoEditor.current.editor.clearSelection();
            codeRef.current = code;
            // setPeerCode(code)
            setPeerFlag((prevFlag) => (prevFlag = false));

            console.log(
              "UPDATE EDITOR CODE FROM SERVER (ROOM.js): ",
              codeRef.current
            );
          }
        });


      });
  }, []);

  //Real time code updates - runs everytime editorCode state is updated
  useEffect(() => {

    socketRef.current.emit("update-code", editorCode);

    console.log("SENT CODE (ROOM.JS): ", editorCode);

  }, [editorCode]); //Remove []

    //MDisconnects when user changes the URL
    useEffect(() => {

      return history.listen((location) => { 
         userTracks.current.getTracks().forEach(track => track.stop());
         socketRef.current.disconnect()
      }) 
   },[history]) 
  

  //This function sets the value of the editor and the codeRef. echoEditor.setValue also runs this via the onChange
  function handleChange(value) {
    if (peerFlag == false) {

      setEditorCode(value);

      codeRef.current = value;

      console.log("change came from user:", peerFlag);
    }

    if (peerFlag == true) {

      console.log("change came from peer:", peerFlag);

      codeRef.current = value;
    }
  }

  //Add function to let users change the editor settings, maybe in a menu
  const editorSettings = {
    language: "python",
    displayName: "Echo code editor",
    theme: "dracula",
  };

  return (
    <div id="room-container">
      <div className="dash-nav" style={{position:"relative",width:"99vw", height: "10vh",backgroundColor:"#2a315d"}}>
					<div className="dash-logo" style={{ position:"relative", top:"3vh",width:"10vw", height:"30vh", color:"white"}}>

						<div className= "dash-echo-lines">
							<div id="dash-x" className="animate__animated animate__bounceInDown"></div>
							<div id="dash-y" className="animate__animated animate__bounceInDown animate__delay-1s"></div>
							<div id="dash-z" className="animate__animated animate__bounceInDown animate__delay-2s" ></div>
						</div>

					</div>
          <div className="w-100 text-center mt-2" style={{right: "-75vw", top: "-30vh", position:"relative",height:"45vh"}}>
						<ul className="nav flex-row">
            <Button onClick={handleRoom}style={{backgroundColor:"#1f2647", marginLeft:"2.5vw", width:"5vw", height: "8vh"}}>
                  <h6> Back to lobby </h6>
              </Button>
              <Button onClick={requestHelp}style={{backgroundColor:"#1f2647", marginLeft:"2.5vw", width:"5vw", height: "8vh"}}>
                  <h6> Request Help </h6>
              </Button>
              </ul>
            </div>
        </div>

      {/* <div id="editor-vid-container"> */}

        <div className="editor-container">
          {/* <div className="editor-title">
            {editorSettings.displayName} in mode {editorSettings.language}
          </div> */}

          <AceEditor
            ref={echoEditor}
            onChange={handleChange} //testFunction
            value={codeRef.current}
            name="Echo-editor"
            mode={editorSettings.language}
            theme={editorSettings.theme}
            width="50vw"
            height="78vh"
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              fontFamily: "monospace",
              fontSize: 18,
            }}
          />

          <div id="console-wrapper">
            <div class="console-buttons-section">
              <button onClick={handleRunCode} class="run-button">Run</button>
              <button onClick={handleClearEditor} class="clear-button">Clear</button>
            </div>
          </div>

          <div id="main-console">
            <ul class="conole-logs">
            {
                echoConsoleLogs ? echoConsoleLogs.map(value => (
                  <li style={{fontSize: 18}}> {">>>"} {value}</li>
                ))
                : console.log("Array is empty")
            }
            
            </ul>
          </div>
        </div>

        <div id="video-grid">
          <StyledVideo muted ref={userVideo} autoPlay playsInline />
          {peers.map((peer, index) => {
            return <Video key={peer.peerID} peer={peer.peer} />;
          })}

          <div className="controls">
            <div className="control-block">
              <div className="media-controls">
                <Button onClick={muteAudio}>Mute</Button>
              </div>

              <div onClick={stopVideo} className="media-controls">
                <Button>Camera</Button>
              </div>

              <div className="media-controls">
                <Button onClick={handleLeave}>Leave</Button>
              </div>
            </div>
          </div>
        </div>
        </div>
  );
};


//Function is used to bring across the labID that the user is currently in
export function getLab3(labID){
  lab=labID;
}
//Function is used to bring across the students email in which the tutor wants to connect with.
export function getStudent(studentemail){
  student=studentemail;
}

export default Room;
