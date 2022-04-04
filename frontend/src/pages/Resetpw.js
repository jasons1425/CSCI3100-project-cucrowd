import './Resetpw.css'
import axios from "axios";
import { toBePartiallyChecked } from '@testing-library/jest-dom/dist/matchers';
import { useEffect, useState} from 'react';

function Resetpw() {
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        let urlString = window.location.href;
        let url = new URL(urlString);
        let token = url.searchParams.get("token")
        let payload = {token : token}

        axios
            .post("http://localhost:8000/api/password_reset/validate_token/", payload)
            .then((res) => {
                if(res.data.status == "OK"){
                    setLoading(false)
                }
            })
            .catch((err) => {
                window.location.href = "/";
            })
        },[]
    )
    
    if(isLoading){
        return <div></div>
    }

    return (
        <div id="resetpw_page">
            <div id="resetpw">
                <h1>Reset password</h1>
                <section id="req">
                    <p>Your password should fulfill requirements as below:</p>
                    <ul>
                        <li>contains at least 8 characters</li>
                        <li>is <b>not</b> too common</li>
                        <li>is <b>not</b> entirely numeric</li>
                        <li>is <b>not</b> too similar to the username</li>
                        <li>is <b>not</b> too similar to the email address</li>
                    </ul>
                </section>
                <form id="resetpw_form">
                    <div>
                        <label htmlFor="new password">New password: </label>
                        <input type="password" name="new password" id="new password" placeholder="New Password" onChange={()=> new_checkSame()} required></input>
                    </div>
                    <div>
                        <label htmlFor="confirm password">Confirm password: </label>
                        <input type="password" name="confirm password" id="confirm password" placeholder="Confirm Password" onChange={()=> confirm_checkSame()} required></input>
                    </div>
                    <div>
                        <button type="reset" onClick={()=> resetPassword()}>Reset Password</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default Resetpw

function resetPassword(){
    let newpw = document.getElementById("new password").value
    let confirmpw = document.getElementById("confirm password").value

    if(newpw != confirmpw){
        alert("Reset Password Failed!")
        return;
    }else{
        let urlString = window.location.href;
        let url = new URL(urlString);
        let token = url.searchParams.get("token")
        let payload = {password : newpw, token : token}

        axios
            .post("http://localhost:8000/api/password_reset/confirm/", payload)
            .then((res) => {
                if(res.data.status == "OK"){
                    alert("your passord has been reset");
                    window.location.href='/';
                }
            })
            .catch((err) => {
                alert(err.response.data.password)
            })
    }
}

function confirm_checkSame(){
    let newpw = document.getElementById("new password").value
    let confirmpw = document.getElementById("confirm password").value

    if(newpw != confirmpw){
        if(!document.getElementById("confirm password").classList.contains("is-invalid")){
            document.getElementById("confirm password").classList.add("is-invalid")
        }
    }else{
        if(document.getElementById("confirm password").classList.contains("is-invalid")){
            document.getElementById("confirm password").classList.remove("is-invalid")
        }
    }

}

function new_checkSame(){
    let newpw = document.getElementById("new password").value
    let confirmpw = document.getElementById("confirm password").value

    if(newpw == confirmpw){
        if(document.getElementById("confirm password").classList.contains("is-invalid")){
            document.getElementById("confirm password").classList.remove("is-invalid")
        }
    }
}