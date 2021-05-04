import "firebase/auth"
import "firebase/firestore"
import { auth } from "../firebase"
import { db } from "../firebase"
import { v4 as uuid } from "uuid"


export default async function getHost(labName){ //This function gets the host(an email) who created the lab
    const labcollection = db.collection('labs'); 
    const labCheck = await labcollection.where('Lab_Name', '==', labName).get();
    var lab;
    if (labCheck){
        labCheck.forEach(doc =>{
        lab = doc.id
        });
    const labdoc = await db.doc(`labs/${lab}`).get();
    const HostData = labdoc.data();
    const Host = HostData.Host_email;
    return Host;
    }
}

export const getLabHost = async(lab) =>{ //this function needs to be called in order to call getHost
    const result = await getHost(lab); 
    return result;
};

export async function getLabData(labName){ // gets all the lab information on firestore for a specific lab
    const labcollection = db.collection('labs'); 
    const labCheck = await labcollection.where('Lab_Name', '==', labName).get();
    var result;
    if (labCheck){
        labCheck.forEach(doc =>{
        result = doc.id;  
    })};
    return result;
}

export const makeActive = async(lab) =>{ // Assigns the labActive field on firestore to true, indicates that a lab is currently in progress.
    const result = await getLabData(lab);
    const LabID = result;
    const LabData = {LabActive: true};
    db.doc(`/labs/${LabID}`).set(LabData, {merge:true});
};

export const checkLabActive = async(lab) =>{ // Queries firestore - function that checks if a specific lab is in progress.
    const result = await getLabData(lab);
    const labdoc = await db.doc(`labs/${result}`).get();
    const labData = labdoc.data();
    const Active = labData.LabActive;
    return Active;
}

export const getcheckLabActive = async(lab) =>{ // function needs to be called in order for checkLabActive to run.
    const result = await checkLabActive(lab); 
    return result;
};

export const lobbyID = async(lab) => { //Queries firestore to get a specific labs lobby ID
    const result = await getLabData(lab);
    const labdoc = await db.doc(`labs/${result}`).get();
    const lobbyData = labdoc.data();
    const ID = lobbyData.ID;
    return ID;
}

export const getLobbyID = async(lab) =>{ //needs to be called in order for function lobbyID to work
    const result = await lobbyID(lab); 
    return result;
};

async function getuserData(){  // Queries firestore in order to get a specific users information.
    const email = auth.currentUser.email
    const usercollection = db.collection('users'); 
    const userCheck = await usercollection.where('email', '==', email).get();
    var result;
    if (userCheck){
        userCheck.forEach(doc =>{
        result = doc.id;  
    })};
    return result;
}
export const userRoomID = async() => { //A function that gets a users specific RoomID from firestore.
    const result = await getuserData();
    const userdoc = await db.doc(`users/${result}`).get();
    const userData = userdoc.data();
    const ID = userData.roomID;
    return ID;
}

export const getuserRoomID = async(lab) =>{ //needs to be called in order for userRoomID to run.
    const result = await userRoomID(lab); 
    return result;
};

async function getPeerData(email){ // A function with a specific email in its paramaters in order to query firestore to get a specific users information 
    const usercollection = db.collection('users'); 
    const userCheck = await usercollection.where('email', '==', email).get();
    var result;
    if (userCheck){
        userCheck.forEach(doc =>{
        result = doc.id;  
    })};
    return result;
}
export const PeerRoomID = async(email) => { // get another persons RoomID - Tutors call this in order to get students roomID to join their session.
    const result = await getPeerData(email);
    const userdoc = await db.doc(`users/${result}`).get();
    const userData = userdoc.data();
    const ID = userData.roomID;
    return ID;
}

export const getPeerRoomID = async(email) =>{ // needs to be called for PeerRoomID to run.
    console.log("in getPeerRoomID");
    const result = await PeerRoomID(email); 
    return result;
};