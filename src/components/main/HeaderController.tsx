import React from "react";
import './main.scss';



const HeaderController = () =>{



    return (
        <>
            <div className="headerBox">
                <div className="log-file">EasyWaySolution</div>
                <nav className="nav">
                <ul className="nav-bar">
                    <li className="nav-item"><a href="/Home">Home</a></li>
                    <li className="nav-item"><a href="/StudentRegistrationController">Registration</a></li>
                    <li className="nav-item"><a href="#">Attendence</a></li>
                </ul>
                </nav>
            </div>
        </>
    );
}

export default HeaderController;