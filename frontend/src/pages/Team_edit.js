import React, { useEffect } from 'react'
import './Team_edit.css'
import * as Ri from "react-icons/ri";
import * as Io from "react-icons/io";
import * as Im from "react-icons/im";
import * as Md from "react-icons/md";
import * as Bi from "react-icons/bi";
import member5 from '../components/5-people.png'
import member4 from '../components/4-people.png'
import member3 from '../components/3-people.png'
import member2 from '../components/2-people.png'
import axios from 'axios';
import {useState} from 'react'

function Team_edit() {
    const [loading, isLoading] = useState(true);
    const [data, setData] = useState();

    useEffect(()=>{
      axios
          .get("http://localhost:8000/api/profile/me/leading_team", {withCredentials:true})
          .then((res)=>{
            setData(res.data)
            isLoading(false)
          })
    },[])


    if(loading){
      return(<>Loading</>)
    }

    if(!loading){
      return (
        <div className="team_page">
    
          <header className="team_header">
            <div className="team_icon">
              <Ri.RiTeamFill />
            </div>
            <div className="team_title">
              Team Formation
            </div>
          </header>
    
          <div className="team_space">
            &nbsp;
          </div>
          
          <div className='team_post_created'>
              <div id="team_post_created_title">Post Created</div>
              <div id='team_post_created_icon' onClick={()=>window.location.pathname="/team/add"}><Md.MdPostAdd/> Create New Post</div>
              <hr id='team_post_created_line'/>  
          </div>

          <section>
            {data.map((element,index) => <Team_edit_post key={index} id={element.id} title={element.title} vacancy={element.teamsize} target={element.requirements} closing={element.deadline} description={element.description}/>)}
          </section>
        </div>
      )
    }
  }
  
export default Team_edit;

function Team_edit_post({title, vacancy, target, closing, id, description}){
    return(
        <div>
            <div className="team_post">
                <div className="team_edit_img">
                  {vacancy == 2 && <img src={member2}/>}
                  {vacancy == 3 && <img src={member3}/>}
                  {vacancy == 4 && <img src={member4}/>}
                  {vacancy == 5 && <img src={member5}/>}
                </div>
                <div className="team_post_content">
                    <ul>
                    <li className="team_post_title">{title}</li>
                    <li className='team_post_description'>Description: {description}</li>
                    <li>Vacancies: {vacancy}</li>
                    <li>Target members: {target}</li>
                    <li>Post closing date: {closing}</li>
                    </ul>
                    <div className='team_button'>
                        <div id='response' onClick={()=>responseTeam(id)}><Bi.BiCommentCheck/>&nbsp;Response</div>
                        <div id='edit' onClick={()=>editTeam(id)}><Io.IoMdCreate/>&nbsp;Edit</div>
                        <div id='delete' onClick={()=>deleteTeam(id, title)}><Im.ImBin/>&nbsp;Delete</div>
                    </div>
                </div>
            </div>
            <hr className="team_post_line"/>
        </div>
    )
}

function deleteTeam(id, title){
    if(window.confirm("Are you sure to delete this post:" + title + "?")){
      axios
      .delete("http://localhost:8000/api/teamformation/" + id, {withCredentials:true})
      .then((res)=>{
          alert("The team is successfully deleted.")
          window.location.pathname="/team/edit"
      })
      .catch((err)=>{
          alert("Error occurs. The team cannot be deleted.")
          alert(err.response.data.message)
      })
    }
}

function editTeam(id){
    window.location.pathname ="/team/edit/" + id; 
}

function responseTeam(id){
      window.location.pathname="/team/response/" + id;
}