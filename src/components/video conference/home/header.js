import react from 'react';
import React from 'react';
import './header.css';
import '../navbar/navbar.css';
import { Redirect } from 'react-router';
import logo from '../../../img/MicrosoftTeams-image4) 1.png';
const Header = (props) => {
  const tempuser = localStorage.getItem('user');
  if (tempuser === null) {
    return <Redirect to="/login" />;
  }

  const golanding = () => {
    props.r.history.push('/');
  };
  const user = JSON.parse(tempuser);
  return (
    <react.Fragment>
      <div className="head">
        <div className="navbar">
          <div className="logandtit">
            <div className="logo">
              <img src={logo} alt="d" onClick={golanding} />
            </div>
          </div>
          <div className="grid-show">
            <img src={user.image} alt="a" /> <span>{user.name}</span>
          </div>
        </div>
      </div>
    </react.Fragment>
  );
};
export default Header;
