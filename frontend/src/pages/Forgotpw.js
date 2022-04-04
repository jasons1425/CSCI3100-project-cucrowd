import './Forgotpw.css'
import axios from "axios";
import { toBePartiallyChecked } from '@testing-library/jest-dom/dist/matchers';
import { useState} from 'react';


function Forgotpw() {
  const [isSending, setSending] = useState(false);
  document.addEventListener("keypress", function(e){
    if(e.keyCode === 13 || e.which === 13){
      e.preventDefault();
      return false;
    }
  })

  function sendemail(e){
    let payload = { email : document.getElementById("email").value}
    if(document.querySelector("#email").classList.contains("is-invalid")){
      document.querySelector("#email").classList.remove("is-invalid");
    }
    setSending(true);
    axios
      .post("http://localhost:8000/api/password_reset/", payload)
      .then((res) => {
        if(res.data.status == "OK"){
          setSending(false);
          window.alert("Email has been successfully sent to your mailbox. Please check!")
          window.location.pathname='/';
        }
      })
      .catch((error) => {
        setSending(false);
        window.alert(error.response.data.email);
        document.querySelector("#email").classList.add("is-invalid");
      })
  }

  return (
    <div id="forgotpw_page">
      <form id="forgotpw">
        <h1>Forgot Password</h1>
        <p>Please enter your email account</p>
        <p>A confirmation letter and link for resetting the password will be sent to your mailbox.</p>
        <hr></hr>
        <label htmlFor="email">Email: </label>
        <input type="email" name="email" id="email" placeholder="email" required></input>
        <div>
          <button type="reset" id="forgotpw-button"  onClick={(e) => sendemail(e)}>Send</button>
        </div>
        <div>&nbsp;{isSending && <section id="loading_forgotpw">Loading... Please wait.</section>}</div>
      </form>
    </div>
    
  )
}
export default Forgotpw




