import React, { useReducer } from 'react'
import './Team.css'
import * as Ri from "react-icons/ri";
import * as Io from "react-icons/io";
import * as Ai from "react-icons/ai";
import member5 from '../components/5-people.png'
import member4 from '../components/4-people.png'
import member3 from '../components/3-people.png'
import member2 from '../components/2-people.png'
import {useState, useEffect} from 'react'
import axios from 'axios';

function Team() {
  const [data, setData] = useState()
  const [isLoading, setLoading] = useState(true);
  const [isLoadingUser, setLoadingUser] = useState(true);
  const [User, setUser] = useState();
  const [dataArray, setDataArray] = useState();

  
  function teamSearch(){
      let x = document.getElementById("team_search_bar").value
      x = x.toLowerCase()
      setDataArray(data.filter((element)=>{
          return element.title.includes(x);
      }))
  }


  useEffect(()=>{
    axios
        .get("http://localhost:8000/api/teamformation")
        .then((res)=>{
          setData(res.data)
          setDataArray(res.data)
          setLoading(false)
        })
        .catch((err)=>{
          alert("Loading error")
        })
    axios
        .get("http://localhost:8000/api/login", {withCredentials:true})
        .then((res)=>{
          setUser(res.data)
          setLoadingUser(false)
        })
  },[])

  if(isLoading || isLoadingUser){
    return (<>Loading</>)
  }

  if(!isLoading && !isLoadingUser){
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

        <div className="team_search">
          <div className="team_search_icon"><Ai.AiOutlineSearch /></div>
            <input className="team_search_bar" type="text" id="team_search_bar" placeholder="Search..." onChange={(e)=>{teamSearch()}}></input>
            {User.sid != null && <div className="team_search_edit_icon" onClick={()=>{window.location.pathname='/team/edit';}}><Io.IoMdCreate/></div>}
        </div>

        <section>
          {dataArray.map((element,index) => <TeamPost key={index} id={element.id} title={element.title} vacancy={element.teamsize} target={element.requirements} closing={element.deadline} members={element.members} description={element.description}/>)}
        </section>
      </div>
    )
  }
}

export default Team;

function TeamPost({title, id, vacancy, target, closing, members, index, description}){
  const [selected, setSelected] = useState(-1)

  return(
    <div onMouseEnter={() => setSelected(1)} onMouseLeave={() => setSelected(-1)}>
      <div className="team_post">
        <div className="team_img">
          {vacancy == 2 && <img src={member2}/>}
          {vacancy == 3 && <img src={member3}/>}
          {vacancy == 4 && <img src={member4}/>}
          {vacancy == 5 && <img src={member5}/>}
        </div>
        <div className="team_post_content">
          <ul>
            <li className="team_post_title">{title}</li>
            <div className='team_post_description'>
            <li>Description: {description}</li>
            <li>Vacancies: {vacancy}</li>
            <li>Target members: {target}</li>
            <li>Post closing date: {closing}</li>
            </div>
            <li><a href={"http://localhost:3000/team/" + id}>More..</a></li>
          </ul>
        </div>
          {selected === 1 && <TeamMember key={index} members={members}/>}
      </div>
      <hr className="team_post_line"/>
    </div>
  )
}

function TeamMember({members}){
  var date = new Date();
  var year = date.getFullYear();
  if (date.getMonth()+1 >= 9){
    year = year + 1;
  }
  return(
    <div className="team_member popout">
      <p><b>Team member</b></p>
      <table>
        <tbody>
          {members.map((element,index) => <tr key={index}><td>{element.info.sid}</td><td>Year {year - element.info.admission_year.slice(0,4)}</td><td>{element.info.major}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}
