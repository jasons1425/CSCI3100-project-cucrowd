import './Team_details.css'
import * as Ri from "react-icons/ri";
import {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';



function Team_details() {
  const [data, setData] = useState();
  const [loading, isLoading] = useState(true);
  const {id} = useParams();

  useEffect(() => {
    axios
        .get("http://localhost:8000/api/teamformation/"+id)
        .then((res) => {
          setData(res.data);
          isLoading(false);
        })
        .catch((err) => {
          alert("Loading error")
        })
  },[])

  if(loading){
    return <>Loading</>;
  }

  if(!loading){
    var date = new Date();
    var year = date.getFullYear();
    if (date.getMonth()+1 >= 9){
      year = year + 1;
    }

    return (
      <div className="team_details">
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

          <aside className="details_team_member">
            <p><u>Team Member</u></p>
            {data.members.map((element, index) => <MemberCard key={index} name={element.info.user.username} sid={element.info.sid} year={year - element.info.admission_year.slice(0,4)} major={element.info.major} avatar={element.info.avator}></MemberCard>)}
            {data.teamsize - data.members.length !== 0 && emptyhandling(data.teamsize - data.members.length)}
          </aside>

          <section className="team_details_info">
            <div>
              <h3>{data.title}</h3>
              <p>{data.title}</p>
              <a>{data.link}</a>
            </div>
          </section>

          <hr className="team_dotted_line"></hr>

          <section className="team_all_details">
            <div className="team_requirements">
              <table>
                <tbody>
                  <tr>
                    <td className="team_table_fr"><b>Target Member</b></td>
                    <td>{data.requirements}</td>
                  </tr>
                  <tr>
                    <td className="team_table_fr"><b>Closing Date</b></td>
                    <td>{data.deadline}</td>
                  </tr>
                </tbody>         
              </table>
            </div>

            <div className="team_info_contact">
              <div className="team_self_intro">
              <h4><u>Introduction of the Leader</u></h4>
              <p>{data.self_intro}</p>
              </div> 
              <div className="team_contact">
                <p>{data.contact}</p>
              </div>
            </div>
          </section>

          <hr className="team_dotted_line"></hr>

          <div>
            <button className="team_back_button" onClick={()=> window.location.pathname='/team'}>Back</button>
            <button className="team_join_button" onClick={()=> jointeam(id)}>Join</button>
          </div>   
      </div>
    )
  }
}
  
export default Team_details;

function MemberCard({name, year, major, sid, avatar}){
  return (
    <div className="membercard" onClick={()=>profile(name)}>
      <img src={avatar!=null ? require("../components/" + avatar) : require("../components/avatar.jpg")} alt="Avatar"></img>
      <div>
        <h4><b>{name}</b></h4>
        <p>{sid}</p>
        <p>{"Year " + year}</p>   
        <p>{major}</p>
      </div>
    </div>
  )
}

function EmptyMemberCard({name, year, major, sid, avatar}){
  return (
    <div className="membercard">
      <img src={avatar!=null ? require("../components/" + avatar) : require("../components/avatar.jpg")} alt="Avatar"></img>
      <div>
        <h4><b>{name}</b></h4>
        <p>{sid}</p>
        <p>{year ? "Year " + year : ""}</p>   
        <p>{major}</p>
      </div>
    </div>
  )
}

function emptyhandling(count){
    let array=[];
    for(let x = 0; x < count; x++){
        array.push(<EmptyMemberCard key={x}></EmptyMemberCard>)
    }
    return array;
} 

function profile(name){
    window.location.href = "http://localhost:3000/profile/" + name
}

function jointeam(id){
    axios
        .post("http://localhost:8000/api/teamformation/"+id+"/apply", null, {withCredentials:true})
        .then((res)=>{
            alert("You have successfully made the request. Please check the updated state in your profile.")
            window.location.pathname="/team"
        })
        .catch((err)=>{
            alert(err.response.data.message)
        })
}