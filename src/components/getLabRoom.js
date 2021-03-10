import React from "react";
import { Card } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom"
import { db } from "../firebase";

class getLabRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      labs: []
    };
  }

  componentDidMount() {
    db.collection("labs")
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        console.log(data);
        this.setState({ labs: data });
      });
  }

  render() {
      return (
          <div id="row">
          {
              this.state.labs &&
              this.state.labs.map( lab =>{
                  return(
                    <Card id="labCardStyles2">
                      <Link to='/test' className = 'lab-links' style={{textDecoration: "none"}}>
                        <Card.Body>
                            <h2 className="dash-cards-h2">{lab.title}</h2>
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

export default getLabRoom;