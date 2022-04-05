import './Team_edit_post.css'
import React from 'react'
import './Team.css'
import * as Ri from "react-icons/ri";
import {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Team_edit_post() {
    const {id} = useParams();
    const [loadingUser, isLoadingUser] = useState(true);
    const [loadingPost, isLoadingPost] = useState(true)
    const [data, setData] = useState();
    const [user, setUser] = useState();
    const [check,setCheck] = useState();


    useEffect(()=>{
        axios
            .get("http://localhost:8000/api/teamformation/" + id)
            .then((res)=>{
                setData(res.data);
                setCheck(res.data.publishable)
                isLoadingUser(false)
            });
        axios
            .get("http://localhost:8000/api/login", {withCredentials:true})
            .then((res)=>{
                setUser(res.data)
                isLoadingPost(false)
            });
    },[])


    if(loadingUser || loadingPost){
        return(<>Loading</>)
    }

    if(!loadingUser && !loadingPost){
        if(user.username !== data.host.username){
            window.location.pathname="/team/edit"
            return(<></>);
        }else{
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

                    <section className="team_add">
                        <div id='icon'>CU CROWD</div>
                        <div className="team_add_title">
                            <label htmlFor="team_title">Title:</label>
                            <input type="text" placeholder="Type your team formation title here" name="team_title" id="team_title" defaultValue={data.title}></input>
                        </div>
                        <div className="team_add_time">
                            <label htmlFor="team_deadline">Deadline:</label>
                            <input type="date" name="team_deadline" id="team_deadline" defaultValue={data.deadline}></input>
                        </div>
                        <div className="team_add_purpose">
                            <label htmlFor="team_purpose">Purpose / Description:</label>
                        </div>
                        <div>
                            <textarea placeholder="Your purpose and description" name="team_description" id="team_description" defaultValue={data.description}></textarea>
                        </div>
                        <div className="team_add_link">
                            <label htmlFor="team_link">Reference link:</label>
                            <input type="url" placeholder="Reference link" name="team_link" id="team_link" defaultValue={data.link}></input>
                        </div>
                        <div className="team_add_size">
                            <label htmlFor="team_teamsize">Team size:</label>
                            <input type="number" defaultValue={data.teamsize} min="2" max="5" name="team_teamsize" id="team_teamsize" onChange={()=>changesize()}></input>
                        </div>
                        <div className="team_add_requirements">
                            <label htmlFor="team_requirements">Team requirement:</label>
                            <input type="text" placeholder="Type some requirements here" name="team_requirements" id="team_requirements" defaultValue={data.requirements}></input>
                        </div>
                        <div className="team_add_self_intro">
                            <label htmlFor="team_self_intro">Self introduction:</label>
                        </div>
                        <div>
                            <textarea placeholder="Tell somethings about you" name="team_self_intro" id="team_self_intro" defaultValue={data.self_intro}></textarea>
                        </div>
                        <div className="team_add_contact">
                            <label htmlFor="team_contact">Contact:</label>
                            <input type="text" placeholder="Leave your contact" name="team_contact" id="team_contact" defaultValue={data.contact}></input>
                            <label htmlFor="team_publishable" className="teamPub">Publishable: </label>
                            {check && <input type="checkbox" name="team_publishable" id="team_publishable" defaultValue={true} onChange={()=> setCheck(false)} checked></input>}
                            {!check && <input type="checkbox" name="team_publishable" id="team_publishable"  defaultValue={false} onChange={()=>setCheck(true)}></input>}
                        </div>
                        <div className="team_edit_button">
                            <button className="team_edit_back_button" onClick={()=> window.location.pathname="/team/edit"}>Back</button>
                            <button className="team_edit_reset_button" onClick={()=> resetTeam()}>Reset</button>
                            <button className="team_edit_add_button" onClick={()=>saveTeam(id, data)}>Save</button>
                        </div>
                    </section>
                </div>
            )
        }
    }
}

export default Team_edit_post;

function changesize(){
    let size = document.getElementById("team_teamsize").value;
    if(size > 5){
        document.getElementById("team_teamsize").value = 5;
    }else if(size < 2){
        document.getElementById("team_teamsize").value = undefined;
    }
}

function saveTeam(id, post_date){
    let payload = {
      title : document.getElementById("team_title").value,
      self_intro : document.getElementById("team_self_intro").value,
      description : document.getElementById("team_description").value,
      requirements : document.getElementById("team_requirements").value,
      contact : document.getElementById("team_contact").value,
      deadline : document.getElementById("team_deadline").value,
      teamsize : document.getElementById("team_teamsize").value,
      publishable : document.getElementById("team_publishable").value
    }
    for(let x in payload){
        if(payload[x] === ""){
            document.getElementById("team_" + x).style.borderColor="red"
        }else{
            document.getElementById("team_" + x).style.borderColor="black";
        }
    }

    payload.post_date = post_date;
    payload['link'] = document.getElementById("team_link").value;
    
    axios
        .put("http://localhost:8000/api/teamformation/"+ id , payload, {withCredentials:true})
        .then((res)=>{
            alert("Post is successfully modified")
            window.location.pathname='/team'
        })
        .catch((err)=>{
            let message = ""
            if(err.response.data.title){
                message += "Title: " + err.response.data.title + "\n"
            }
            if(err.response.data.self_intro){
                message += "Self introduction: " + err.response.data.self_intro + "\n"
            }
            if(err.response.data.description){
                message += "Description: " + err.response.data.description + "\n"
            }
            if(err.response.data.requirements){
                message += "Requirements: " + err.response.data.requirements + "\n"
            }
            if(err.response.data.contact){
                message += "Contact: " + err.response.data.contact + "\n"
            }
            if(err.response.data.deadline){
                message += "Deadline: " + err.response.data.deadline + "\n"
            }
            if(err.response.data.message){
                message += err.response.data.message + "\n"
            }
            alert(message)
        })
}

function resetTeam(){
    document.getElementById("team_title").value = ""
    document.getElementById("team_self_intro").value = ""
    document.getElementById("team_description").value = ""
    document.getElementById("team_requirements").value = ""
    document.getElementById("team_link").value = ""
    document.getElementById("team_contact").value = ""
    document.getElementById("team_deadline").value = ""
    document.getElementById("team_teamsize").value = ""
}