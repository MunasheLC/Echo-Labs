import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import { Button } from './Button';
import './Navbar.css';

function Navbar() {
    const [click, setClick] = useState(false);
    // const [button, setButton] = useState(true);

    const handleClick =()=> {
        return setClick(!click); 
    };
    // /* Above changes hamburger menu to X on click */
    
    
    const closeMobileMenu = () => setClick(false);

    // const showButton = () => {  //check sizing of screen if less than 960 its mobile
    //     if(window.innerWidth <= 960){
    //         setButton(false);
    //     }
    //     else{
    //         setButton(true);
    //     }
    // };

    // window.addEventListener('resize', showButton);


    return (
        <>
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                   
                </Link>
                <div className="menu-icon" onClick={handleClick}> 
                    <i className={click ? 'fas fa-times' : 'fas fa-bars'} /> 
                </div>  {/* if click false = Hamburger menu, if clicked true = X sign */}  
                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    <li className='nav-item'>
                        <Link to='/' className = 'nav-links' onClick={closeMobileMenu}>
                            Dashboard
                        </Link>

                    </li>
                    <li className='nav-item'>
                        <Link to='/services' className = 'nav-links' onClick={closeMobileMenu}>
                            Friends
                        </Link>
                        
                    </li>
                    <li className='nav-item'>
                        <Link to='/products' className = 'nav-links' onClick={closeMobileMenu}>
                            Settings
                        </Link>
                        
                    </li>
                    {/* <li className='nav-item'>
                        <Link to='/sign-up' className = 'nav-links-mobile' onClick={closeMobileMenu}>
                            Sign-up
                        </Link>
                        
                    </li> */}

                </ul>

                {/* {button && <Button buttonStyle='btn--outline'>SIGN UP</Button>} */}
            </div>

        </nav>
        </>
    )
}

export default Navbar