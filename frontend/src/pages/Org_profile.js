import React , { useState ,useEffect}from 'react'
import * as Cg from "react-icons/cg";
import axios from "axios";
import {useLocation,useParams} from 'react-router-dom';
function Org_profile() {
    const params=useParams();
    let name=params.username;
    let id=params.id

    const [items, setItems] = useState([{}]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/profile/org/"+name, {withCredentials : true}).then((response) => {
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
          <div id="avatar"><img id="avatar1" src={"http://localhost:8000"+items.avatar} width="300px" height="300px" /></div>
          <div id="org" style={{bottom:"0px"}}>{items.org_name}</div>
        </div>
        <div className='right_card'>
          <div id="fullname">Username: <div style={{ marginLeft: "2.184vw", fontWeight: "lighter" }}>{items.user.username}</div></div>
          <hr className='profile_line' />
          <div id="email">Email: <div style={{ marginLeft: "4.746vw", fontWeight: "lighter" }}>{items.user.email}</div></div>
          <hr className='profile_line' />
          <div id="gender">Gender:<div style={{ marginLeft: "3.906vw", fontWeight: "lighter" }}> {gender}</div></div>
        </div>
      </div>
      <section id="org_info_card_container">
    <div className='org_info_card'> 
    <div style={{display:"flex"}}>
    <div id="title">Organiztion Introduction:</div>
    </div>
    <div id="intro">{items.org_intro}</div>
    <div id="title1">Organiztion Website: <div style={{marginLeft:"0.84vw", fontWeight:"lighter"}}>{items.org_url}</div></div>
    <div id="title2">Organiztion Email:<div style={{marginLeft:"0.84vw", fontWeight:"lighter"}}>{items.org_email}</div></div>
    </div>
    </section>
      <button className='back_exp' style={{ marginLeft: "75.6vw" }} onClick={()=>{window.location.pathname='/experiments/'+id;}}>Back</button>
      </>
  )}catch(e){
    return("")
  }
}


export default Org_profile
