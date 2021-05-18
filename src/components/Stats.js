import React, { useEffect, useState, useRef } from "react";
import { Card, Button } from "react-bootstrap";
import { Link} from "react-router-dom"
import { db, auth } from "../firebase";
import shortid from 'shortid';
import {getLab} from './CreateRoom';
import { Bar } from 'react-chartjs-2';
import { render } from "@testing-library/react";
import { useHistory } from "react-router-dom"
import { withTheme } from "styled-components";
import {getLabData} from "./Host";



const BarChartt=()=>{
  const hist = useHistory();

    const [state, setter] = useState([])
    const [counter, setCount] = useState([])

    async function handleLeave(){
  
      try{
        hist.push("/")
  
      } catch{
      }
  
    }

    const labCount=[]

    const getLabCount = async(value)=>{
        console.log("chekc value" + value);
        var labid = await getLabData(value);
        const labDoc = await db.doc(`labs/${labid}`).get();
        const labData = labDoc.data();
        const count = labData.Counter;
        if(count){
          console.log("check count" + count);
          labCount.push(count);
        }
        else{
          labCount.push(1);
        }
        console.log(labCount);
    };

    useEffect(()=>{
      const interval = setInterval(async() => {
      setCount(labCount);
    },2000); //runs every 2 seconds
    return () => clearInterval(interval);
    },[]);

    useEffect(async() =>{
      const lab = []
      const labArray = await getLabsToDisplay();
      labArray.forEach((value:string) =>{
        lab.push(value);
        getLabCount(value);
      });

      setter(lab);
      console.log("state2" + state);
      console.log("state3" + labCount);
  }, [])

  const option = {scales: { yAxes: [{ ticks: { beginAtZero: true, fontColor:"#000" }, },], xAxes: [{ ticks: { beginAtZero: true, fontSize: 16 }, },], }, maintainAspectRatio:false }

  document.body.style.background = "#1c1f3e";
    return (
      <div id="dash-container" className="animate__animated animate__bounceInRight" style={{}}>
				<div className="dash-nav" style={{position:"relative", left: "20px",width:"20vw", height: "100%",backgroundColor:"#2a315d"}}>
					<div className="dash-logo" style={{ position:"relative", top:"5vh",width:"10vw", height:"30vh" ,margin:"0 auto", color:"white"}}>
						
						<div className= "dash-echo-lines">
							<div id="dash-x" className="animate__animated animate__bounceInDown"></div>
							<div id="dash-y" className="animate__animated animate__bounceInDown animate__delay-1s"></div>
							<div id="dash-z" className="animate__animated animate__bounceInDown animate__delay-2s" ></div>
						</div>

						<div className="circle">
							<i className="fas fa-user-secret fa-3x center"></i>
						</div>
					</div>
          <div className="w-100 text-center mt-2" style={{ top: "25vh" }} onClick={handleLeave}>

            <h2 className="Button-text-1">Statistics</h2>
        </div>

			
          <div className="w-100 text-center mt-2" style={{ top: "25vh" }} onClick={handleLeave}>
          <Button id="">
								<h2 className="Button-text-1">Dashboard</h2>
							</Button>
        </div>


				</div>

				<div id="dash-card-container1" style={{backgroundColor:"lightsteelblue",left:"23vw", top:"-75vh"}}>
         <Bar
          data={{
            labels: state, //labs array the user is in
            datasets: [{
              label: 'Number of Participants for each recent lab session',
              data: counter,
              backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1,
              
            }],
          }}
          height={400}
          width={600}
          options={option}
        />
      </div>
      </div>

    )
  }
  export default BarChartt;


  export const getLabsToDisplay= async() => {
    const userId = auth.currentUser.uid;
    const fetchPromises = [];
  
    if (userId){
      // console.log("getting labroom List for user: " + userId);
      const userDoc = await db.doc(`users/${userId}`).get(); //gets the users entire collection using their id in firestore
      const userData = userDoc.data();
  
      const labs = userData.labs; //gets the users lab list from their firestore collection
      if (labs){ //if labs exist
        labs.forEach((labId:String) => {  //for each lab in the users lablist
          const nextProm = db.doc(`labs/${labId}`).get(); //get the lab fields for that particular lab from the labs collection in firestore
          fetchPromises.push(nextProm); // and store the lab info into fetchpromises
        });
  
        const labsToDisplay = await Promise.all(fetchPromises);
        const labArray  = labsToDisplay.map((lab) => {return lab.data().Lab_Name}); //creates a new array which is populated with the result of lab.data()
        console.log(" in labstodisplay " + labArray)
        return labArray;
        // this.setState({ labArray});  
  }
    }
  }