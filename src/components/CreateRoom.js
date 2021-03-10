import React from 'react'
import { v4 as uuid } from "uuid"
import { useHistory } from "react-router-dom"

export default function CreateRoom() {

    const history = useHistory()
    
    // Create room with the UUID
    function create () {
        const id = uuid()
        history.push(`/room/${id}`)
        
        }

    return (
        <div>
            <button onClick={create}>Create Room</button> 
        </div>
    )
}
