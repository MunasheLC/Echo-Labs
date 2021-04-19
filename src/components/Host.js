import "firebase/auth"
import "firebase/firestore"
import firebase from 'firebase/app'
import { auth } from "../firebase"
import { db } from "../firebase"
import { v4 as uuid } from "uuid"


export default async function getHost(labName){
    const labcollection = db.collection('labs'); // gets the labs collection from firestore
    const labCheck = await labcollection.where('Lab_Name', '==', labName).get();
    var result;
    if (labCheck){
        labCheck.forEach(doc =>{
          result = getLabH(doc.id)  //gets id of lab from lab_name
          return result;
        });

    return result; //returns promise with the result inside
    }
}

async function getLabData(labName){
    const labcollection = db.collection('labs'); // gets the labs collection from firestore
    const labCheck = await labcollection.where('Lab_Name', '==', labName).get();
    var result;
    if (labCheck){
        labCheck.forEach(doc =>{
        result = doc.id;  
    })};
    return result;
}

async function getLabH(labId){
    const labdoc = await db.doc(`labs/${labId}`).get();
    const HostData = labdoc.data();
    const Host = HostData.Host_email;
    return Host;
}

export const getLabHost = async(lab) =>{
    const result = await getHost(lab); //gets the promise returned by Admin
    return result;
};

export const makeActive = async(lab) =>{
    const result = await getLabData(lab);
    const LabID = result;
    const LabData = {LabActive: true};
    db.doc(`/labs/${LabID}`).set(LabData, {merge:true});
};

export const CheckActive = async(lab) =>{
    const result = await getLabData(lab);
    const labdoc = await db.doc(`labs/${result}`).get();
    const labData = labdoc.data();
    const Active = labData.LabActive;
    return Active;
}

export const getCheckActive = async(lab) =>{
    const result = await CheckActive(lab); 
    return result;
};

export const getID = async(lab) => {
    const result = await getLabData(lab);
    const labdoc = await db.doc(`labs/${result}`).get();
    const HostData = labdoc.data();
    const ID = HostData.RoomID;
    return ID;
}

export const getCheckID = async(lab) =>{
    const result = await getID(lab); 
    return result;
};