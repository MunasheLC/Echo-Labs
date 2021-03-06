import React from "react";
import { Card } from "react-bootstrap";
import { Link} from "react-router-dom"
import { db, auth } from "../firebase";
import shortid from 'shortid';
import {getLab} from './CreateRoom';
import {getLabsToDisplay} from './Stats';

class DisplayUserLabRooms extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      labArray: "",
    };
  }

  async componentDidMount(){
    
        const labArray  = await getLabsToDisplay(); //creates a new array which is populated with the result of lab.data()
        console.log(labArray);
        
        if (labArray == null){
          console.log("is empty");
        }
        if (labArray !=null){
          if (labArray.length !=0){
            this.setState({ labArray});  
          }
        }
      }
  

  render(){ 
    const array = this.state.labArray;
    return (
      <div id ="row" className="lab-row">
        {
          // below Array.from() is used with an arrow function to manipulate the items in labArray - so for each item in the array, display a card and the lab name on the users dashboard.
          Array.from(array, child =>{ 
            const a = child;
            return(
              //each lab card is associated with a specific key, this key is generated by shortid
              <Link to='/create-room' onClick={() => getLab(a)} className = 'lab-links' style={{textDecoration: "none"}}>
                <Card id="lab-card-style-2" key={shortid.generate()}>
                  <Card.Body>
                    {/* display the lab card and its name(.Lab_Name taken from the lab collection in firestore) on the dashboard */}
                      <h2 className="dash-cards-h2">{child}</h2>   
                  </Card.Body>
                </Card>  
              </Link>
            )
          })
        }
      </div>

    )
  }
}

export default DisplayUserLabRooms;
