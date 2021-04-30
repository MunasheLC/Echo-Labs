import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import "./Room.css";
// import Editor, { echoEditor } from "./Editor"
// import { edit } from "ace-builds";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

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

const Room = (props) => {
  const [peers, setPeers] = useState([]); //local list of peers for displaying purposes
  const socketRef = useRef(); //server
  const userVideo = useRef(); //users video
  const userTracks = useRef(); // Track ref for mute/unmute functions
  const peersRef = useRef([]); // peer connection
  const roomID = props.match.params.roomID; //The ID for the room
  const [editorCode, setEditorCode] = useState(""); //stores value of the editor for sending to server
  const codeRef = useState(""); //This ref syncs the editor to the onChange function -> basically just a store for the code too
  const [peerFlag, setPeerFlag] = useState(false); //This flag is necessary to handle updates between the server and the current user so that received update aren't automatically sent -> this behavior results in a loop 
  const echoEditor = useRef(null); // Ref is used to get access to the aceEditor functions -> used to update the value of the editor


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
    language: "javascript",
    displayName: "Echo code editor",
    theme: "monokai",
  };

  return (
    <div id="room-container">
      <div id="video-grid">
        <StyledVideo muted ref={userVideo} autoPlay playsInline />
        {peers.map((peer, index) => {
          return <Video key={peer.peerID} peer={peer.peer} />;
        })}

        <div class="controls">
          <div class="control-block">
            <div class="media-controls">
              <button onClick={muteAudio}>Mute</button>
            </div>

            <div onClick={stopVideo} class="media-controls">
              <button>Camera</button>
            </div>

            <div class="media-controls">
              <button>Leave</button>
            </div>
          </div>
        </div>
      </div>

      <div className="editor-container">
        <div className="editor-title">
          {editorSettings.displayName} in mode {editorSettings.language}
        </div>

        <AceEditor
          ref={echoEditor}
          onChange={handleChange} //testFunction
          value={codeRef.current}
          name="Echo-editor"
          mode={editorSettings.language}
          theme={editorSettings.theme}
          width="40vw"
          height="70vh"
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            fontFamily: "Inconsolata",
            fontSize: 24,
          }}
        />

        <div id="console--button-wrapper">
          <div class="console-buttons">
            <button class="run-button">Run</button>
            <button class="clear-button">Clear</button>
          </div>
        </div>

        <div id="main-console">
          <ul class="conole-logs"></ul>
        </div>
      </div>
    </div>
  );
};

export default Room;
