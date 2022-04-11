import React,{ useState ,useEffect} from 'react'
import './Profile.css'
import * as Cg from "react-icons/cg";
import axios from "axios";
import * as Io from "react-icons/io";


function Profile() {
    const [items, setItems] = useState([{}]);
    const [teams, setTeams] = useState();
    const [leadingTeams, setLeadingTeams] = useState();

  useEffect(() => {
    axios.get("http://localhost:8000/api/profile/me", {withCredentials : true}).then((response) => {
      setItems(response.data);
      });
    }, []);
    console.log(items.avatar);

    const [exp, setExps] = useState([{}]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/profile/me/joining", {withCredentials : true}).then((response) => {
      setExps(response.data);
      });
    }, []);
    console.log(exp);
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

  useEffect(() => {
    axios
        .get("http://localhost:8000/api/profile/me/team_application", {withCredentials:true})
        .then((res)=>{
            setTeams(res.data);
        })
  }, []);

  useEffect(() => {
    axios
        .get("http://localhost:8000/api/profile/me/leading_team", {withCredentials:true})
        .then((res)=>{
          setLeadingTeams(res.data);
        })
  }, []);

   try{
  return (
      <>
    <div className="banner"> 
            <div className='icon'><Cg.CgProfile /> </div>
            <div className='title1'>Profile</div>
            </div>
    <div style={{display:"flex"}}>
    <div className='left_card'>
        <div id="avatar"><img id="avatar1" src={"http://localhost:8000"+items.avatar} width="300px" height="300px"/></div>
        <label>
        <input type="file" name="image" id="changeavatar" />
        <div id="uploadimg" >Upload Avatar</div>
        </label>
        <div id="saveimg" onClick={()=>{
          let formData = new FormData();
          let image = document.querySelector('#changeavatar');
          formData.append("avatar", image.files[0]);
          axios.patch('http://localhost:8000/api/profile/'+items.user.username, formData, {withCredentials : true},{
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          alert("Save Avatar Successfully ")
          window.location.reload();
        }}>Save Avatar</div>
        <div id="org">{items.org_name}</div>
        <div id="sid">SID:{items.sid}</div>
        <div id="major">Major: {items.major}</div>
        <div id="admission">Admission Year: {items.admission_year}</div>
    </div>
    <div className='right_card'>
        <div id="fullname">Username: <div style={{marginLeft:"52px", fontWeight:"lighter"}}>{items.user.username}</div></div>
        <hr className='profile_line'/>
        <div id="email">Email: <div style={{marginLeft:"113px", fontWeight:"lighter"}}>{items.user.email}</div></div>
        <hr className='profile_line'/>
        <div id="password">Password: <div style={{marginLeft:"57px", fontWeight:"lighter"}}>***************</div><div id="edit_icon" onClick={()=>changePassword(items.user.email)}><Io.IoMdCreate/></div></div>
        <hr className='profile_line'/>
        <div id="birth">Date of Birth: <div style={{marginLeft:"20px", fontWeight:"lighter"}}>{items.date_of_birth}</div></div>
        <hr className='profile_line'/>
        <div id="gender">Gender:<div style={{marginLeft:"93px", fontWeight:"lighter"}}> {gender}</div></div>
    </div>
    </div>
    <section id="org_info_card_container">
    <div className='org_info_card'> 
    <div style={{display:"flex"}}>
    <div id="title">Organiztion Introduction:</div>
    </div>
    <div id="intro">{items.org_intro}</div>
    <div id="title1">Organiztion Website: <div style={{marginLeft:"20px", fontWeight:"lighter"}}>{items.org_url}</div></div>
    <div id="title2">Organiztion Email:<div style={{marginLeft:"20px", fontWeight:"lighter"}}>{items.org_email}</div></div>
    </div>
    </section>
    <section id="exp_card_container">
    <div className='exp_card'>
     
        <div id="title">Enrolled Experiments</div>
        
        <div style={{display:"flex"}}>
            <div id="subtitle1">Title</div>
            <div id="subtitle2">Selected Time</div>
        </div>
        <hr style={{borderColor:"black"}}/>
        {exp.map(item=>(
            <>
        <div style={{display:"flex"}}>
        
            <div id="exp_title">{item.experiment.title}</div>
            <div id="time">{item.selected_time}</div>
            <div id="cancel" onClick={()=>{if (window.confirm("Are you sure you want to cancel the enrollment of " +item.experiment.title)) {
                                              axios.delete('http://localhost:8000/api/enroll/'+item.id, {withCredentials : true});
                                              window.location.reload();
                                            }
                                            else {
                                              ;
                                            }
                                              }}>Cancel</div>
        </div>
        <div className='exp_card_line'><hr id="line"/></div>
        </>))}
    </div>
    </section>

    <section id="team_card_container">
    <div className='team_card'>
     
        <div id="title">Leading team</div>
        
        <div style={{display:"flex"}}>
            <div id="subtitle1">Title</div>
        </div>
        <hr style={{borderColor:"black"}}/>
        {leadingTeams.map(item=>(
            <>
        <div style={{display:"flex"}}>
        
            <div id="team_title">{item.title}</div>
            <div id="cancel" onClick={()=>{if (window.confirm("Are you sure you want to cancel the team of " +item.title+"? (The post will be deleted)")) {
                                              axios
                                              .delete("http://localhost:8000/api/teamformation/" + item.id, {withCredentials:true});
                                              window.location.reload();
                                            }
                                            else {
                                              ;
                                            }
                                              }}>Cancel</div>
        </div>
        <div className='team_card_line'><hr id="line"/></div>
        </>))}
    </div>
    </section>

    <section id="enroll_team_card_container">
    <div className='team_card'>
     
        <div id="title">Enrolled team</div>
        
        <div style={{display:"flex"}}>
            <div id="subtitle1">Title</div>
        </div>
        <hr style={{borderColor:"black"}}/>
        {teams.map(item=>(
            <>
        <div style={{display:"flex"}}>
        
            <div id="team_title">{item.team.title}</div>
            <div id="cancel" onClick={()=>{if (window.confirm("Are you sure you want to quit the team of " +item.team.title+"?")) {
                                              axios
                                              .post('http://localhost:8000/api/teamformation/'+item.team.id+"/cancel_application",null, {withCredentials : true})
                                              .then((res) => window.location.reload())
                                              .catch((err) => {alert(err.response.data.message)})
                                            }
                                            else {
                                              ;
                                            }
                                              }}>Cancel</div>
        </div>
        <div className='team_card_line'><hr id="line"/></div>
        </>))}
    </div>

    </section>
    <Hide/>
    </>
  )

    }catch(e){
      return("")
  }
}
function Hide(){
    const [items, setItems] = useState([{}]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/profile/me", {withCredentials : true}).then((response) => {
      setItems(response.data);
      });
    }, []);
    try{
    if(items.user.identity=="student user"){
        document.getElementById("org").style.display="none";
        document.getElementById("org_info_card_container").style.display="none";
    }else{
        document.getElementById("sid").style.display="none";
        document.getElementById("major").style.display="none";
        document.getElementById("admission").style.display="none";
        document.getElementById("exp_card_container").style.display="none"
        document.getElementById("team_card_container").style.display="none"
        document.getElementById("enroll_team_card_container").style.display="none"
    }

    return("")
}catch(e){
    return("")
}
}

export default Profile

function changePassword(email){
  if(window.confirm("upon clicking reset password, you are forced to log out and an email for changing password will be sent to your sign up email. Are you sure?")){
    let payload = {email : email}
    axios
    .post("http://localhost:8000/api/password_reset/", payload)
    .then((res) => {
      if(res.data.status == "OK"){
        window.alert("Email has been successfully sent to your mailbox. Please check!")
        axios
        .post("http://localhost:8000/api/logout", null, {withCredentials : true})
        .then((res)=>{
            window.location.pathname="/";
        })
      }
    })
  }
}
