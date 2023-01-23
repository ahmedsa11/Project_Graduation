import react from 'react';
import { NavLink } from 'react-router-dom';
import './navbar.css';
const Navbar = () => {
  const opennav = () => {
    const icon = document.querySelector('.toggler');
    icon.onclick = () => {
      document.querySelector('.icon-opts .nav').classList.toggle('open');
      document.querySelector('.toggler').classList.toggle('fa-times');
    };
  };
  return (
    <react.Fragment>
      <div className="icon-opts">
        <i
          className="fa fa-ellipsis-h toggler"
          aria-hidden="true"
          onClick={opennav}
        ></i>
        <ul className="nav justify-content-center">
          <NavLink to="/home" className="linkk">
            <li className="nav-item">
              <i className="fas fa-home"></i>
            </li>
          </NavLink>
          <NavLink to="/setting" className="linkk">
            <li className="nav-item">
              <i className="fas fa-cog"></i>
            </li>
          </NavLink>
        </ul>
      </div>
    </react.Fragment>
  );
};
export default Navbar;
