import React from "react";
import { Card } from "react-bootstrap";
import { Link} from "react-router-dom"
import { db, auth } from "../firebase";
import shortid from 'shortid';

class getUserLabRooms extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      rArray: ""
    };
  }

  async componentDidMount(){
    const userId = auth.currentUser.uid;
    const fetchPromises =[];
    if (userId){
      console.log("getting labroom List for user: " + userId);
      const userDoc = await db.doc(`users/${userId}`).get();
      const userData = userDoc.data();

      const labs = userData.labs;
      labs.forEach((labId:String) => {
        // console.log(`getting data for lab: ${labId} `);
        const nextProm = db.doc(`labs/${labId}`).get();
        fetchPromises.push(nextProm);
      });

      const snapshots = await Promise.all(fetchPromises);
      const rArray  = snapshots.map((snapshot) => {return snapshot.data()});
      this.setState({ rArray});
    }
  }

  render(){ 
    const array = this.state.rArray;
    return (
      <div id ="row">
        {
          Array.from(array, child =>{
            return(
              <Card id="lab-card-style-2" key={shortid.generate()}>
                <Link to='/test' className = 'lab-links' style={{textDecoration: "none"}}>
                  <Card.Body>
                      <h2 className="dash-cards-h2">{child.Lab_Name}</h2>
                  </Card.Body>
                </Link>
              </Card>  
            )
          })
        }
      </div>

    )
  }
}

export default getUserLabRooms;
