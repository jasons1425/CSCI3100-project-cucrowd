import './Signup.css'
import axios from "axios"
import {useState} from "react"

function Signup(){
    const [signingup, setSignup] = useState(false)

    const handleKeypress = event => {
      if (event.charCode === 13) {
        signup();
      }
    }

    return (
        <div id="signup_page">
            <form id="signup">
                <div id="signup_title">
                    <p>Welcome to CU CROWD</p>
                    <p>Sign up your account now!</p>
                    <hr id="signup_hr"></hr>
                </div>
                <div id="signup_form">
                    <div>
                        <label htmlFor="username">Username: </label>
                        <input type="text" name="username" id="username" placeholder="username" onKeyPress={handleKeypress} required></input>
                        <label htmlFor="sid">Sid: </label>
                        <input type="number" name="sid" id="sid" placeholder="10-digit sid" onChange={() => checksid()} onKeyPress={handleKeypress} required></input>
                    </div>
                    <div>
                        <label htmlFor="birth">Date of birth: </label>
                        <input type="date" name="birth" id="birth" onKeyPress={handleKeypress} required></input>
                        <label htmlFor="gender">Gender: </label>
                        <select name="gender" id="gender" required>
                            <option value="M">M</option>
                            <option value="F">F</option>
                            <option value="NA">NA</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="email">Email address: </label>
                        <input type="email" name="email" id="email" placeholder="email" onKeyPress={handleKeypress} required></input>
                    </div>
                    <div>
                        <label htmlFor="major">Major: </label>
                        <input type="text" name="major" id="major" placeholder="your major" onKeyPress={handleKeypress} required></input>
                    </div>
                    <div>
                        <label htmlFor="admission_year">Admission year: </label>
                        <input type="date" name="admission_year" id="admission_year" onKeyPress={handleKeypress} required></input>
                    </div>
                    {signingup == false && <button type="button" onClick={signup}>Sign up</button>}
                    {signingup == true && <button type="button">Loading</button>}
                </div>
            </form>
        </div>
    )

    function signup(){
        setSignup(true);
        checkempty_username();
        checkempty_sid();
        checkempty_date_of_birth();
        checkempty_email();
        checkempty_major();
        checkempty_admission_year();
    
        if(checksid() === false){
            alert("sid format incorrect");
            setSignup(false)
            return;
        }
    
        let payload = {
            username: document.getElementById("username").value,
            email: document.getElementById("email").value,
            sid: document.getElementById("sid").value,
            gender: document.getElementById("gender").value,
            major: document.getElementById("major").value,
            date_of_birth: document.getElementById("birth").value,
            admission_year: document.getElementById("admission_year").value,
        }
    
        axios
            .post("http://localhost:8000/api/signup", payload)
            .then((res) => {
                if(res.data.result){
                    alert("Your account is successfully registered");
                    window.location.pathname = "/" ;
                }
            })
            .catch((err) => {
                setSignup(false);
                alert(err.response.data.message);
            })
    }
}
export default Signup

function checksid(){
    let sid = document.getElementById("sid").value;
    if(sid.length > 10 || sid.length < 10){
        if(!document.querySelector("#sid").classList.contains("is-invalid")){
            document.querySelector("#sid").classList.add("is-invalid");
        }
        return false;
    }else{
        if(document.querySelector("#sid").classList.contains("is-invalid")){
            document.querySelector("#sid").classList.remove("is-invalid");
        }
        return true;
    }
}

function checkempty_username(){
    let check = document.getElementById("username").value;
    if(check === ""){
        if(!document.querySelector("#username").classList.contains("is-invalid")){
            document.querySelector("#username").classList.add("is-invalid");
        }
    }else{
        if(document.querySelector("#username").classList.contains("is-invalid")){
            document.querySelector("#username").classList.remove("is-invalid");
        }
    }
}

function checkempty_sid(){
    let check = document.getElementById("sid").value;
    if(check === ""){
        if(!document.querySelector("#sid").classList.contains("is-invalid")){
            document.querySelector("#sid").classList.add("is-invalid");
        }
    }else{
        if(document.querySelector("#sid").classList.contains("is-invalid") && checksid()){
            document.querySelector("#sid").classList.remove("is-invalid");
        }
    }
}

function checkempty_date_of_birth(){
    let check = document.getElementById("birth").value;
    if(check === ""){
        if(!document.querySelector("#birth").classList.contains("is-invalid")){
            document.querySelector("#birth").classList.add("is-invalid");
        }
    }else{
        if(document.querySelector("#birth").classList.contains("is-invalid")){
            document.querySelector("#birth").classList.remove("is-invalid");
        }
    }
}

function checkempty_email(){
    let check = document.getElementById("email").value;
    if(check === ""){
        if(!document.querySelector("#email").classList.contains("is-invalid")){
            document.querySelector("#email").classList.add("is-invalid");
        }
    }else{
        if(document.querySelector("#email").classList.contains("is-invalid")){
            document.querySelector("#email").classList.remove("is-invalid");
        }
    }
}

function checkempty_major(){
    let check = document.getElementById("major").value;
    if(check === ""){
        if(!document.querySelector("#major").classList.contains("is-invalid")){
            document.querySelector("#major").classList.add("is-invalid");
        }
    }else{
        if(document.querySelector("#major").classList.contains("is-invalid")){
            document.querySelector("#major").classList.remove("is-invalid");
        }
    }
}

function checkempty_admission_year(){
    let check = document.getElementById("admission_year").value;
    if(check === ""){
        if(!document.querySelector("#admission_year").classList.contains("is-invalid")){
            document.querySelector("#admission_year").classList.add("is-invalid");
        }
    }else{
        if(document.querySelector("#admission_year").classList.contains("is-invalid")){
            document.querySelector("#admission_year").classList.remove("is-invalid");
        }
    }
}

