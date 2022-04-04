import React, { useState ,useEffect} from 'react'
import './Exp_response.css'
import * as Ai from "react-icons/ai";
import {useLocation,useParams} from 'react-router-dom';
import axios from "axios";

function Exp_response() {

  const params=useParams();
  const [items, setItems] = useState([{}]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/experiment/"+params.id+"/enrolled", {withCredentials : true}).then((response) => {
      setItems(response.data);
      });
    }, []);

    try{
  return (<>
    <div className="banner">
      <div className='icon'><Ai.AiTwotoneExperiment /> </div>
      <div className='title1'>Experiements</div>
    </div>

        <div className='post_created'>
        <div id="title">Students Enrolled</div>
        <button className='back_exp1' onClick={()=>{window.location.pathname='/experiments/add';}}>Back</button>
        <hr id='line'/>
        </div>

        <div className='exp_response_format'>
            <div id="username">username</div>
            <div id="email">email</div>
            <div id="time">time selected</div>
        </div>

        {items.map(item=>(
            <>
            <div className='exp_enrolled_list'>
            <div id="username">{item.participant.username}</div>
            <div id="email">{item.participant.email}</div>
            <div id="time">{item.selected_time}</div>
            <div id="cancel" onClick={()=>{if (window.confirm("Are you sure you want to cancel the enrollment of " +item.participant.username)) {
                                              axios.delete('http://localhost:8000/api/enroll/'+item.id, {withCredentials : true});
                                              window.location.reload();
                                            }
                                            else {
                                              ;
                                            }
                                              }}>Cancel</div>
            </div>
            <div className="exp_enrolled_listline"><hr id="line"/></div>
            
            </>
        ))}
        </>
  )}
  catch(e){
      return("")
  }
}

export default Exp_response