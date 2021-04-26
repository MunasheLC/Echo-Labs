import React, { useEffect, useState } from "react";
// import "codemirror/lib/codemirror.css"
// import "codemirror/theme/monokai.css"
// import "codemirror/mode/python/python"
// import "codemirror/mode/javascript/javascript"
// import {Controlled as ControlledEditor } from "react-codemirror2"
import "./Editor.css"
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python"
import "ace-builds/src-noconflict/mode-javascript"
import "ace-builds/src-noconflict/mode-java"

import "ace-builds/src-noconflict/theme-monokai"
import "ace-builds/src-noconflict/ext-language_tools"
import { edit } from 'ace-builds';





//Probably change display name to something else related to the users
export default function Editor(props) {
     console.log("The editor props", props)
    const {
        
        language, 
        displayName, 
        theme,
        onChange,
        updateCode //code updates
        
        
    
    } = props

    
    const [updatedCode, setUpdateCode] = useState("")
   

  
    //function to handle changes made on the editor
    function handleChange(value){

        onChange(value)
        // setUpdateCode(prevCode => {
        //         prevCode = value
        //     })
        // console.log("Current editor code", updateCode)
        console.log("current enditor content", value)
        // console.log("UPDATED VALUE CONTENT:", updatedCode)
    
    
    }

    function peerUpdates() {

       
        if(updateCode != "")
           { console.log("peer update" ,updateCode)
            setUpdateCode(updateCode)
            console.log("NEW CODE: " ,updatedCode)
            }
        
        
    }

    useEffect(() => {
        
        
        peerUpdates()
 
    },)


    return (
        <div className="editor-container">
            <div className="editor-title">
                {displayName} in mode {language}
            </div>

            <AceEditor
                 onChange={handleChange}
                 value={updatedCode}
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
                    fontSize: 14
    
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
