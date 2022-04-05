import React,{ useState ,useEffect} from 'react'
import './Profile.css'
import * as Cg from "react-icons/cg";
import axios from "axios";
import * as Io from "react-icons/io";


function Profile() {
    const [items, setItems] = useState([{}]);

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
        <div id="org">The Chinese University of Hong Kong</div>
        <div id="sid">SID:{items.sid}</div>
        <div id="major">Major: {items.major}</div>
        <div id="admission">Admission Year: {items.admission_year}</div>
    </div>
    <div className='right_card'>
        <div id="fullname">Username: <div style={{marginLeft:"52px", fontWeight:"lighter"}}>{items.user.username}</div></div>
        <hr className='profile_line'/>
        <div id="email">Email: <div style={{marginLeft:"113px", fontWeight:"lighter"}}>{items.user.email}</div></div>
        <hr className='profile_line'/>
        <div id="password">Password: <div style={{marginLeft:"57px", fontWeight:"lighter"}}>***************</div> <div id="edit_icon" onClick={()=>{;}}><Io.IoMdCreate/></div></div>
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
    }

    return("")
}catch(e){
    return("")
}
}

export default Profile