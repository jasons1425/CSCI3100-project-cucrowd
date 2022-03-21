import React from 'react'
import './Team.css'
import * as Ri from "react-icons/ri";
import sample from '../components/sample.jpg'
import {useState} from 'react'

function Team() {
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

      <section>
        <TeamPost id="1" title="Hackathon 2021" vacancy="5" description="To elevate passenger experience" target="Computer Science student, year 3" closing="19-Mar-2022"/>
        <TeamPost id="2" title="Final year project 1" vacancy="2" description="To do final year project" target="Finanace student, year 4" closing="19-Mar-2022"/>
        <TeamPost id="3" title="Competition 2" vacancy="2" description="work with me" target="Business student" closing="19-Mar-2022"/>
        <TeamPost id="4" title="Competition 3" vacancy="2" description="work with me" target="GPA > 3.75" closing="19-Mar-2022"/>
        <TeamPost id="5"/>
        <teamPost id="6"/>
      </section>
    </div>
  )
}

export default Team;

function TeamPost({title, id, vacancy, description, target, closing}){
  const [selected, setSelected] = useState(-1)

  return(
    <div onMouseEnter={() => setSelected(1)} onMouseLeave={() => setSelected(-1)}>
      <div className="team_post" style={selected === 1 ? {"marginLeft" : "0"} : {}}>
        <div className="team_img">
          <img src={sample}/>
        </div>
        <div className="team_post_content">
          <ul>
            <li className="team_post_title">{title}</li>
            <li>Vacancies: {vacancy}</li>
            <li>Target members: {target}</li>
            <li>Description: {description}</li>
            <li>Post closing date: {closing}</li>
            <li><a href={"http://localhost:3000/team/id=" + id}>More..</a></li>
          </ul>
        </div>
        {selected === 1 && <TeamMember />}
      </div>
      <hr className="team_post_line" style={selected === 1 ? {"marginLeft" : "11.5vw", "marginRight": "36vw"} : {}}/>
    </div>
  )
}

function TeamMember(){
  return(
    <div className="team_member">
      <p><b>Team member</b></p>
      <table>
        <tbody>
          <tr>
            <td>1155142376</td>
            <td>Year 3</td>
            <td>Computer Science</td>
          </tr>
          <tr>
            <td>1122334455</td>
            <td>Year 3</td>
            <td>Business</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
