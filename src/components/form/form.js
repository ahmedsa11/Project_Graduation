import react, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './form.css';
import { Api } from '../api/api';
import Verification from '../verification/verification';
import authentication from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import logo from '../../img/log.png';
import gender from '../../img/gender.png';
import Loader from '../loader/loader';
class Form extends Component {
  state = {
    username: '',
    mobile: '',
    pass: '',
    confirm: '',
    error: {},
    loginn: '',
    mobilelog: '',
    passlog: '',
    gender: '',
    loading: false,
  };
  setUpRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      'sign-in-button',
      {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // onSignInSubmit();
        },
      },
      authentication
    );
  };
  repp = () => {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const form = document.getElementById('formm');

    signUpButton.addEventListener('click', () => {
      form.classList.add('right-panel-active');
    });

    signInButton.addEventListener('click', () => {
      form.classList.remove('right-panel-active');
    });
  };
  componentDidMount() {
    this.repp();
  }
  header = {
    API_KEY: process.env.REACT_APP_API_KEY,
    'Content-Type': 'application/json',
    // 'Content-Type': 'application/x-www-form-urlencoded',
  };
  handlesubsignup = async (e) => {
    e.preventDefault();

    const error = this.validsignup();
    if (error) return;
    this.setState({ loading: true });
    //back end
    let data = await fetch(`${Api}/${this.state.mobile}`, {
      headers: this.header,
      method: 'GET',
    });
    let res = await data.json();

    if (res.status === 'success') {
      this.setState({ loading: false });
      const error = {};
      error.mobile = 'this mobile already exist';
      this.setState({ error });

      return;
    }

    this.setUpRecaptcha();
    const phoneNumber = '+' + this.state.mobile;
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(authentication, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        this.setState({ loading: false });
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        this.setState({
          loginn: 'true',
        });
        window.confirmationResult = confirmationResult;
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };
  validsignup = () => {
    const error = {};
    if (this.state.username.trim() === '') {
      error.username = 'username is require';
    } else if (this.state.username.length < 3) {
      error.username = 'username must be bigger than 2';
    }
    if (this.state.pass.trim() === '') {
      error.pass = 'password is require';
    } else if (this.state.pass.length < 8) {
      error.pass = 'password must be bigger than 8';
    }

    if (this.state.confirm !== this.state.pass)
      error.confirm = 'must enter the same pass';
    if (this.state.mobile.trim() === '') error.mobile = 'mobile is require';
    if (this.state.gender === '') error.gender = 'gender is require';
    this.setState({ error });
    return Object.keys(error).length === 0 ? null : error;
  };
  handlechangesignup = (e) => {
    let state = { ...this.state };
    state[e.currentTarget.name] = e.currentTarget.value;
    this.setState(state);
  };
  /*log in*/
  handlesublogin = async (e) => {
    e.preventDefault();

    const error = this.validlogin();
    if (error) return;
    //back end
    this.setState({ loading: true });
    const url = `${Api}/login`;
    const data = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        API_KEY: process.env.REACT_APP_API_KEY,
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        mobile: this.state.mobilelog,
        password: this.state.passlog,
      }), // body data type must match "Content-Type" header
    });
    const res = await data.json();
    // this.setState({loading:true})
    if (res.status === 'error') {
      this.setState({ loading: false });
      const error = {};
      error.mobilelog = res.message.mobile;
      error.passlog = res.message.password;
      this.setState({ error });
    }
    if (res.status === 'success') {
      this.setState({ loading: false });
      delete res.data._id;
      localStorage.setItem('user', JSON.stringify(res.data));
      this.setState({
        loginn: 'login',
      });
    }
  };
  validlogin = () => {
    const error = {};
    if (this.state.mobilelog.trim() === '')
      error.mobilelog = 'mobile is require';
    if (this.state.passlog.trim() === '') error.passlog = 'password is require';
    this.setState({ error });
    return Object.keys(error).length === 0 ? null : error;
  };
  handlechangelogin = (e) => {
    let state = { ...this.state };
    state[e.currentTarget.name] = e.currentTarget.value;
    this.setState(state);
  };
  render() {
    if (this.state.loginn === 'true') {
      return (
        <react.Fragment>
          <Verification
            phone={this.state.mobile}
            username={this.state.username}
            pass={this.state.pass}
            gender={this.state.gender}
            set={this.setUpRecaptcha}
            direct="signup"
          />
        </react.Fragment>
      );
    }
    if (this.state.loginn === 'login') {
      return (
        <react.Fragment>
          <Redirect to="/home" />
        </react.Fragment>
      );
    }

    return (
      <react.Fragment>
        <div id="sign-in-button"></div>
        {this.state.loading ? <Loader /> : null}
        <div className="form" id="formm">
          <div className="form-container sign-up" id="s">
            <form onSubmit={this.handlesubsignup}>
              <img src={logo} alt="logo" />
              <h1 className="REGTITLE">REGISTER</h1>
              <div className="inputcontainer">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  name="username"
                  onChange={this.handlechangesignup}
                  placeholder="Full Name"
                />
              </div>
              {this.state.error.username && (
                <span className="text-danger">{this.state.error.username}</span>
              )}
              <div className="inputcontainer">
                <i className="fas fa-mobile-alt i"></i>
                <PhoneInput
                  name="mobile"
                  placeholder="Phone Number"
                  value={this.state.mobile}
                  onChange={(mobile) => this.setState({ mobile })}
                />
              </div>
              {this.state.error.mobile && (
                <span className="text-danger">{this.state.error.mobile}</span>
              )}
              <div className="inputcontainer">
                <i className="fas fa-lock"></i>
                <input
                  className="form-control"
                  type="password"
                  name="pass"
                  onChange={this.handlechangesignup}
                  placeholder="Enter Password"
                />
              </div>
              {this.state.error.pass && (
                <span className="text-danger">{this.state.error.pass}</span>
              )}
              <div className="inputcontainer">
                <i className="fas fa-lock"></i>
                <input
                  className="form-control"
                  type="password"
                  name="confirm"
                  onChange={this.handlechangesignup}
                  placeholder="Confirm Password"
                />
              </div>
              {this.state.error.confirm && (
                <span className="text-danger">{this.state.error.confirm}</span>
              )}
              <div className="inputcontainer">
                <img src={gender} alt="gender" />
                <select onChange={this.handlechangesignup} name="gender">
                  <option defaultValue hidden>
                    Gender
                  </option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              {this.state.error.gender && (
                <span className="text-danger">{this.state.error.gender}</span>
              )}
              <button type="submit" className="signup">
                REGISTER
              </button>
              <p className="agree logg">
                Already have an account ?
                <a href="#l" className="log">
                  Login
                </a>
              </p>
              <br />
            </form>
          </div>
          <div className="form-container sign-in" id="l">
            <form onSubmit={this.handlesublogin}>
              <img src={logo} alt="logo" />
              <h1 className="LOGTITLE">LOGIN</h1>
              <div className="inputcontainer">
                <i className="fas fa-mobile-alt"></i>
                <input
                  type="number"
                  name="mobilelog"
                  onChange={this.handlechangelogin}
                  placeholder="Phone Number"
                />
              </div>
              {this.state.error.mobilelog && (
                <span className="text-danger">
                  {this.state.error.mobilelog}
                </span>
              )}
              <div className="inputcontainer">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  name="passlog"
                  onChange={this.handlechangelogin}
                  placeholder="Password"
                />
              </div>
              {this.state.error.passlog && (
                <span className="text-danger">{this.state.error.passlog}</span>
              )}
              <button type="submit" className="login">
                LOGIN
              </button>
              <p className="agree logg">
                you need create account ?
                <a href="#s" className="log">
                  REGISTER
                </a>
              </p>
              <Link to="/forget">forget your password..?</Link>
            </form>
          </div>

          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h2 className="titleoverlay">Welcome Back!</h2>
                <p>
                  To keep connected with us <br />
                  please login with your <br />
                  personal info
                </p>
                <button className="go" id="signIn">
                  LOGIN
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1 className="titleoverlay">Hello, Friend!</h1>
                <p>Enter your personal details and start journey with us</p>
                <button className="go" id="signUp">
                  REGISTER
                </button>
              </div>
            </div>
          </div>
        </div>
      </react.Fragment>
    );
  }
}

export default Form;
