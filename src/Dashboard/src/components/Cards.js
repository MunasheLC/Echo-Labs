import React, {useState} from 'react';
import './Cards.css';

function Cards() {
  let time = new Date().toLocaleTimeString();

  const [clockTime, set_clockTime] = useState(time);

  const updateTime = () => {
      time = new Date().toLocaleTimeString();
      set_clockTime(time);
  };

 setInterval(updateTime, 1000);

  return (
    <div className="cards">
            <div className='cards-container'>

                <div className='card-item-labRoom'>
                    <div className='card-header1'>
                        <h4>Your Labrooms</h4>
                    </div>
                </div>

                <div className='card-item-Direct-Messages'>
                    <div className='card-header2'>
                        <h5>Direct Messages</h5>
                    </div>
                </div>

                <div className='card-item-Clock'>
                    <div className = 'clock'>
                        {clockTime}
                   </div>
                </div>

                <div className='card-item-Stats'>
                    <div className='card-header'>
                        <h4>Statistics</h4>
                    </div>
                </div>

                <div className='card-item-profile'>
                    <div className='card-header1'>
                        <img src={''}></img>
                    </div>
                </div>

            </div>
    </div>
  );
}

export default Cards;