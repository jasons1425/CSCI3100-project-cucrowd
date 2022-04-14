import './Team_response.css'
import * as Ri from "react-icons/ri";
import * as Ti from "react-icons/ti";
import * as Fa from "react-icons/fa"
import * as Im from "react-icons/im";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


function Team_response() {
    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState()
    const {id} = useParams();

    var date = new Date();
    var year = date.getFullYear();
    if (date.getMonth()+1 >= 9){
        year = year + 1;
    }

    function AcceptTeam(userid, user){
        const payload = {
            id : userid,
            state : "accepted"
        }
        if(window.confirm("Are you sure to accept " + user + " into your team?")){
            axios
            .post("http://localhost:8000/api/teamformation/" + id + "/update_state", payload, {withCredentials:true})
            .then((res) => {
                alert("You have successfully added " + user + " into your team")
                window.location.reload()
            })
            .catch((err) => {
                alert(err.response.data.message)
            })
        }
    }

    function RejectTeam(userid, user){
        const payload = {
            id : userid,
            state : "rejected"
        }
        if(window.confirm("Are you sure to reject " + user + " into your team?")){
            axios
            .post("http://localhost:8000/api/teamformation/" + id + "/update_state", payload, {withCredentials:true})
            .then((res) => {
                alert("You have successfully rejected " + user + " into your team")
                window.location.reload()
            })
            .catch((err) => {
                alert(err.response.data.message)
            })
        }
    }

    useEffect(()=>{
        axios
            .get("http://localhost:8000/api/teamformation/" + id, {withCredentials:true})
            .then((res)=>{
                setData(res.data)
                setLoading(false)
            })
    },[])

    if(isLoading){
        return (<>is Loading</>)
    }

    if(!isLoading){
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

            <section className="team_select">
                <div className="team_select_title">
                    <p>Students Request</p>
                    <button type="button" className="team_back_button" onClick={()=> window.location.pathname="/team/edit"}>Back</button>
                </div>
                <hr className="team_select_line"></hr>
                <table className="team_select_table">
                    <tr className="team_select_table_title">
                        <td>Username</td>
                        <td>Sid</td>
                        <td>Major</td>
                        <td>Year of study</td>
                        <td>State</td>
                        <td></td>
                        <td></td>
                    </tr>
                    {data.members.filter((element)=> data.host.username != element.info.user.username).map((element)=><tr><td onClick={() => window.location.pathname="/profile/"+element.info.user.username+"/team_edit/"+id}><button className="table_name">{element.info.user.username}</button></td><td>{element.info.sid}</td><td>{element.info.major}</td><td>{element.info.user.identity == 'student user' ? "Year " + (year - element.info.admission_year.slice(0,4)) : ''}</td><td>{element.state==="accepted" && <Ti.TiTick className="tick"/>}{element.state==="pending" && <Fa.FaQuestion/>}{element.state==="rejected" && <Im.ImCross className="cross"/>}</td><td>{element.state == "pending" && <button className="accept_button" type="button" onClick={()=>AcceptTeam(element.id, element.info.user.username)}>Accept</button>}</td><td>{element.state == "pending" && <button type="button" className="reject_button" onClick={()=>RejectTeam(element.id, element.info.user.username)}>Reject</button>}</td></tr>)}
                </table>
            </section>
        </div>
        )
    }
  }
  
  export default Team_response;



