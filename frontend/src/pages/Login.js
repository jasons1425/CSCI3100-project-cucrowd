import React, { Component } from 'react';
import axios from "axios";
import './Login.css';
import logo from '../components/cu-crowd-logo.png'



function Login() {
    //getting username and password from input box
    function login (){
        let info = {username : document.getElementById("username").value, password : document.getElementById("password").value};
        axios
            .post("http://localhost:8000/api/login", info, {withCredentials : true})
            .then((res) => {
                if(res.data.result === true){
                    window.location.reload(false);
                }
            })
            .catch((error) => {
                if(error.response.data.result === false){
                    window.alert(error.response.data.message);
                }
                document.querySelectorAll("input")[0].classList.add("is-invalid");
                document.querySelectorAll("input")[1].classList.add("is-invalid");
                return;
            });
    };

    function styling(){
        var link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css");
        link.setAttribute("integrity", "sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T");
        link.setAttribute("crossorigin", "anonymous");
        document.querySelector("head").insertBefore(link, document.querySelector("head").querySelectorAll("style")[0]);
    }

        return (
            <div onLoad={()=>styling()}>
                <img className="image" src={logo} alt="cu-crowd-logo"></img>
                <div className="form-signin">
                    <form>
                        <div className="form-floating">
                            <input className="form-control" type="text" name="username" id="username" placeholder="username" required></input>
                        </div>
                        <div className="form-floating">
                            <input className="form-control" type="password" name="password" id="password" placeholder="password" required></input>
                        </div>
                        <button className="left btn-padding btn btn-lg btn-primary" type="reset" onClick={() => login()}>Login</button>
                        <button className="right btn-padding btn btn-lg btn-primary">Sign Up</button>
                    </form>
                </div>
            </div>
        )
    
}
 
export default Login;