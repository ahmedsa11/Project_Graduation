import react, { useState } from 'react';
import { useHistory } from 'react-router';
import { Api } from '../api/api';
const NewPassword = (props) => {
  const [formValue, setFormValue] = useState({
    newPassword: '',
    confirmNewPassword: '',
  });
  const history = useHistory();
  const [error, seterror] = useState({});
  const validation = () => {
    const error = {};
    if (newPassword.trim() === '') {
      error.newPassword = 'password is require';
    }
    if (confirmNewPassword.trim() === '') {
      error.confirmNewPassword = 'password is require';
    } else if (newPassword.length < 8) {
      error.newPassword = 'password must be bigger than 8';
    }
    if (confirmNewPassword !== newPassword)
      error.confirmNewPassword = 'must enter the same pass';
    seterror(error);
    return Object.keys(error).length === 0 ? null : error;
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValue((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  const { newPassword, confirmNewPassword } = formValue;
  const urldata = `${Api}/${props.Phone}`;
  const handlepass = async (e) => {
    e.preventDefault();
    const error = validation();
    if (error) return;
    let data = await fetch(urldata, {
      method: 'PATCH',
      body: JSON.stringify({
        password: newPassword,
      }),
      headers: {
        'Content-Type': 'application/json',
        API_KEY: process.env.REACT_APP_API_KEY,
      },
    });
    let res = await data.json();
    if (res.status === 'success') {
      history.push('/login');
    } 
  };
  return (
    <react.Fragment>
      <div className="forgetpass">
        <form onSubmit={handlepass} className="container">
          <div id="hidepass" className="hidepass">
            <label htmlFor="username" className="form-label">
              Enter New Password
            </label>
            <div className="inputcout">
              <input
                className="inputsetting"
                type="password"
                onChange={handleChange}
                name="newPassword"
              />
            </div>
            {error.newPassword && (
              <span className="text-danger">{error.newPassword}</span>
            )}
            <label htmlFor="username" className="form-label">
              Confirm New Password
            </label>
            <div className="inputcout">
              <input
                className="inputsetting"
                type="password"
                onChange={handleChange}
                name="confirmNewPassword"
              />
            </div>
            {error.confirmNewPassword && (
              <span className="text-danger">{error.confirmNewPassword}</span>
            )}
          </div>
          <button type="submit" className="btn btn-primary">
            Go to login
          </button>
        </form>
      </div>
    </react.Fragment>
  );
};

export default NewPassword;
