import React, { useState ,useEffect} from 'react'
import * as Cg from "react-icons/cg";
import axios from "axios";
import {useLocation,useParams} from 'react-router-dom';

function Stu_profile() {
  const params=useParams();
    let name=params.username;
    let id=params.id
    let feature = params.feature

    const [items, setItems] = useState([{}]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/profile/"+name, {withCredentials : true}).then((response) => {
      setItems(response.data);
      });
    }, []);
    console.log(items);
try{
    let gender
    if(items.gender=="M"){
      gender="Male"
  }
  if(items.gender=="F"){
    gender="Female"
}
if(items.gender=="NA"){
  gender="Others"
}
  return (
    <><div className="banner">
      <div className='icon'><Cg.CgProfile /> </div>
      <div className='title1'>Profile</div>
    </div><div style={{ display: "flex" }}>
        <div className='left_card'>
          <div id="avatar"><img id="avatar1" src={items.avatar} width="100%" height="100%" /></div>
          <div id="sid"style={{marginTop:"5vw"}}>SID:{items.sid}</div>
          <div id="major"style={{marginTop:"0px"}}>Major: {items.major}</div>
          <div id="admission"style={{marginTop:"0px"}}>Admission Year: {items.admission_year}</div>
        </div>
        <div className='right_card'>
          <div id="fullname">Username: <div style={{ marginLeft: "2.184vw", fontWeight: "lighter" }}>{items.user.username}</div></div>
          <hr className='profile_line' />
          <div id="email">Email: <div style={{ marginLeft: "4.746vw", fontWeight: "lighter" }}>{items.user.email}</div></div>
          <hr className='profile_line' />
          <div id="birth">Date of Birth: <div style={{ marginLeft: "0.84vw", fontWeight: "lighter" }}>{items.date_of_birth}</div></div>
          <hr className='profile_line' />
          <div id="gender">Gender:<div style={{ marginLeft: "3.906vw", fontWeight: "lighter" }}> {gender}</div></div>
        </div>
      </div>
      {feature == "exp" && <button className='back_exp' style={{ marginLeft: "75.6vw" }} onClick={()=>{window.location.pathname='/experiments/add/response'+id;}}>Back</button>}
      {feature == "team" && <button className='back_exp' style={{ marginLeft: "75.6vw" }} onClick={()=>{window.location.pathname='/team/'+id;}}>Back</button>}
      {feature == "team_edit" && <button className='back_exp' style={{ marginLeft: "75.6vw" }} onClick={()=>{window.location.pathname='/team/response/'+id;}}>Back</button>}
      {feature == "questionnaire" && <button className='back_exp' style={{ marginLeft: "75.6vw" }} onClick={()=>{window.location.pathname='/questionnaire/response/'+id;}}>Back</button>}
      </>
  )}catch(e){
    return("")
  }
}

export default Stu_profile
