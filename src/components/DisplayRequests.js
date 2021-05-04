import { Card, NavLink } from "react-bootstrap";
import { Link} from "react-router-dom";
import shortid from 'shortid';
import {getPeerRoomID} from './Host';
import {useHistory } from "react-router-dom"
import {getLab3} from './Room'
import {getStudent} from './Room'
import {inCallTrue} from './DisplayParticipants';
import { db, auth } from "../firebase";
import {removeUserFromRequestList} from "./Requests"

const DisplayRequests = (props) => {
    const {
        lab,
        array
    } = props
    var roomID = "";
    const history = useHistory();

    function checkPeerRoom(v){
            getPeerRoomID(v).then((value) => {history.push(`/room/${value}`)});
            getLab3(lab);
            getStudent(v);
            inCallTrue(auth.currentUser.email);
            removeUserFromRequestList(lab,v)
        }

    return (
        <div>
            <div id ="row2" className="lab-row">
            {
                array.map(value =>(
                
                <Card id="lab-card-style-3" key={shortid.generate()} >
                  <Card.Body>
                  <Link to="/test" onClick={(event) => checkPeerRoom(value)} className = 'lab-links' style={{textDecoration: "none"}}>
                      <h5 className="dash-cards-h3">{value}</h5>   
                      </Link>
                  </Card.Body>
              </Card>  
                ))
                }
            </div>
            </div>
    );
}
export default DisplayRequests;