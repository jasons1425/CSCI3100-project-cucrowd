import React, { useState ,useEffect} from 'react'
import * as Cg from "react-icons/cg";
import axios from "axios";
import {useLocation,useParams} from 'react-router-dom';

function Org_edit() {
  const params=useParams();
    let name=params.username;

    function save(){
      let payload;
      payload = {
        org_url: document.getElementById("exp_title").value,
        org_email: document.getElementById("venue").value,
        org_intro: document.getElementById("description").value,
      }
      axios.post('http://localhost:8000/api/profile/uploaad', payload, {withCredentials : true})
    }
  return (
    <>
    <div className="banner">
      <div className='icon'><Cg.CgProfile /> </div>
      <div className='title1'>Profile</div>
    </div><div className='exp_form'>

    <label>Organiztion Introduction:</label><br/>
    <textarea rows="15" cols="165" name="description" id="description" form="usrform" required></textarea>
    <br/>

    <label>Organiztion Website:
    <input type="text" name="title" id="exp_title"   />
    </label><br/>
    <label>Organiztion Email:
    <input style={{marginLeft:"60px"}} type="text" name="venue" id="venue"   />
    </label><br/>
    <div style={{display:"flex"}}>
    <button className='back_exp' onClick={()=>{window.location.pathname='/profile';}}>Back</button>
    <button className='reset_exp' onClick={()=>reset()}>Reset</button>
    <button className='create_exp' onClick={()=>save()}>Save</button>
    </div>
      </div>
      </>

  )
}

function reset (){
  document.getElementById("description").value="";
        document.getElementById("exp_title").value="";
        document.getElementById("venue").value="";
}



export default Org_edit