import React, { useEffect, useState, useRef } from "react";
// import "codemirror/lib/codemirror.css"
// import "codemirror/theme/monokai.css"
// import "codemirror/mode/python/python"
// import "codemirror/mode/javascript/javascript"
// import {Controlled as ControlledEditor } from "react-codemirror2"
import "./Editor.css"
import "react-ace"
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python"
import "ace-builds/src-noconflict/mode-javascript"
import "ace-builds/src-noconflict/mode-java"
import "ace-builds/src-noconflict/theme-monokai"
import "ace-builds/src-noconflict/ext-language_tools"
import { edit } from 'ace-builds';
import ace from "react-ace";



//Not even sure if this component is still useful, leaving it here for posterity

//Probably change display name to something else related to the users
export function Editor(props) {
    //  console.log("The editor props", props)
    const {
        
        language, 
        displayName, 
        theme,
        myChange,
        updateCode, //code updates
        
        
    
    } = props


    
   
    const [peerCode, setPeerCode] = useState("")
    const updateCodeRef = useRef("") // stores past code value
    const currentCodeRef = useRef("") // stores past code value
    const echoEditor = useRef(null) 
    const [source, setSource] = useState(true)
    // const [peerSource, setPeerSource] = useState(false)
    let peerSource = false
   

    console.log("EDITOR PROPS: " , echoEditor.current)
    

   

    
    //function to handle changes made on the editor
    function handleChange(value){
        //codeRef check in here
        if(peerSource)
        {   
            console.log("Change came from peer")
            currentCodeRef.current = value
            
            
        }
       else
        {
            // console.log("Change came from current user")
            currentCodeRef.current = value
            // updateCodeRef.current = value
            //runs setEditCode which then sends code to the server
            myChange(value)
            
        }
        peerSource = false   
        console.log("RESET PEER SOURCE: ", peerSource)
        
        // myChange(value)
        
        // console.log("EDITOR CONTENT", value)
        // console.log("current code ref content (EDITOR.js)", currentCodeRef.current)
       
        // console.log("Fuckin dumb shit ffs")
        //echoEditor.current.props.value
        // onsole.log("UPDATED VALUE CONTENT:", updatedCode)
    
    
    }
    //Only sends code when setEditor code is used NBNBNBNBNB
    function peerUpdates() {
        console.log("PRE CHANGE", updateCode)
        
        // if(updateCode != updateCodeRef.current)
        if (updateCode != echoEditor.current.editor.getValue())
        {   //onChange(updateCodeRef)
            //consider setting with = sign to prevent fireing setEditorCode
            peerSource = true
            console.log("PEERS SOURCE IS NOW: ", peerSource)
            // echoEditor.current.editor.setValue(updateCode)
            // handleChange(updateCode)
            echoEditor.current.editor.getSession().setValue(updateCode)
            echoEditor.current.editor.clearSelection()

            
            console.log("NEW CODE: " ,updateCode)
            
        }
        // onChange(updateCodeRef.current)
        // setUpdateCode(updateCode)
        

        peerSource = false
        
    }




    useEffect(() => {
        
        console.log("SOURCE IS PEER: ", peerSource)
        peerUpdates()
    
       
 
    },[props.updateCode])


    return (
        
        
        <div className="editor-container" >
            <div className="editor-title">
                {displayName} in mode {language}
            </div>

            <AceEditor ref={echoEditor}
                onChange={handleChange} //testFunction
                value={currentCodeRef.current}
                name= "Echo-editor"
                mode= {language}
                theme={theme}
                width= "40vw"
                height= "70vh"
                setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                fontFamily: "Inconsolata",
                fontSize: 24
                
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
    )
}


export default function (params) {
    return;
}