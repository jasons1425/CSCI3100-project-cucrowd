import React,{ useState ,useEffect} from 'react'
import './Profile.css'
import * as Cg from "react-icons/cg";
import axios from "axios";
import * as Io from "react-icons/io";


function Profile() {
    const [items, setItems] = useState([{}]);
    const [teams, setTeams] = useState(0);
    const [question, setQuestion] = useState(0);
    const [leadingTeams, setLeadingTeams] = useState(0);
    const [avatar, setAvatar] = useState();

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

  useEffect(() => {
    axios
        .get("http://localhost:8000/api/questionnaire", {withCredentials:true})
        .then((res)=>{
          setQuestion(res.data);
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
        <div id="avatar"><img id="avatar1" src={"http://localhost:8000"+items.avatar} width="100%" height="100%"/></div>
        <div id="imgpreview" style={{"display":"none"}}><img id="imgpreview1" src="" width="100%" height="100%" /></div>
        <label>
        <input type="file" name="image" id="changeavatar" accept ="image/*" onChange={(e)=>{Imgpreview(e);}}/>
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
        <div id="fullname">Username: <div style={{marginLeft:"2.184vw", fontWeight:"lighter"}}>{items.user.username}</div></div>
        <hr className='profile_line'/>
        <div id="email">Email: <div style={{marginLeft:"4.746vw", fontWeight:"lighter"}}>{items.user.email}</div></div>
        <hr className='profile_line'/>
        <div id="password">Password: <div style={{marginLeft:"2.394vw", fontWeight:"lighter"}}>***************</div><div id="edit_icon" onClick={()=>changePassword(items.user.email)}><Io.IoMdCreate/></div></div>
        <hr className='profile_line'/>
        <div id="birth">Date of Birth: <div style={{marginLeft:"0.84vw", fontWeight:"lighter"}}>{items.date_of_birth}</div></div>
        <hr className='profile_line'/>
        <div id="gender">Gender:<div style={{marginLeft:"3.906vw", fontWeight:"lighter"}}> {gender}</div></div>
        <div id="notif">* If you need to modify the personal information, please send an email to csci3100cucrowd@gmail.com</div>
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
        {leadingTeams == 0 && <>
            <div style={{display:"flex"}}>
        
            <div id="team_title">Empty</div>
            </div>
            </>
        }
        {leadingTeams != 0 && leadingTeams.map(item=>(
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
        {teams == 0 && <>
            <div style={{display:"flex"}}>
        
            <div id="team_title">Empty</div>
            </div>
            </>
        }
        {teams != 0 && teams.map(item=>(
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

    <section id="questionnaire_container">
    <div className='question_card'>
     
        <div id="title">Posted questionnaire</div>
        
        <div style={{display:"flex"}}>
            <div id="subtitle1">Title</div>
        </div>
        <hr style={{borderColor:"black"}}/>
        {question == 0 &&
          <>
            <div style={{display:"flex"}}>
        
            <div id="question_title">Empty</div>
          </div>
          </>
        }
        {question != 0 && question.map(item=>(
            <>
        <div style={{display:"flex"}}>
        
            <div id="question_title">{item.title}</div>
            <div id="cancel" onClick={{}}>Cancel</div>
        </div>
        <div className='question_card_line'><hr id="line"/></div>
        </>))}
    </div>
    </section>
    <Hide/>
    </>
  )

    }catch(e){
      return("")
  }

  function Imgpreview(e){
    console.log("hi");
    document.getElementById("imgpreview").removeAttribute("style");
    document.getElementById("avatar").setAttribute("style", "display:none");
    document.getElementById("imgpreview1").src=URL.createObjectURL(e.target.files[0]);
  
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
        document.getElementById("changeavatar").style.display="none";
        document.getElementById("uploadimg").style.display="none";
        document.getElementById("saveimg").style.display="none";
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
