import React, { useState ,useEffect} from 'react'
import './Exp_detail.css'
import * as Ai from "react-icons/ai";
import sample from '../Global/sample.jpg'
import {useLocation,useParams} from 'react-router-dom';
import axios from "axios";

function Exp_detail(){

  const params=useParams();
    return (
    <>
    <List id={params.id}/>
    </>
  )
    
}

function List(id){
//console.log(id.id);

  const [items, setItems] = useState({});
    
  useEffect(() => {
    axios.get("http://localhost:8000/api/experiment/"+id.id+"/", {withCredentials : true}).then((response) => {
      setItems(response.data);
      });
    }, []);
    
  function enroll(){
    let selected = document.getElementById("exp_time");
    let payload = {experiment : id.id, selected_time : selected.value};
    axios.post('http://localhost:8000/api/enroll', payload, {withCredentials : true})
    .then((response)=>{
      alert("successfull enrollment")
      back()
    })
    .catch(()=>{
      alert("You cannot enroll in same experiment twice ")
      back()
    })
    
    
  }

  function back(){
    window.location.pathname='/experiments';
  }
  try{
    const timesplit=items.timeslots.split(';');
    console.log(timesplit[0])
  return(
    <>
    <div >
      <div className="banner"> 
            <div className='icon'><Ai.AiTwotoneExperiment /> </div>
            <div className='title1'>Experiements</div>
            </div>
        <div className='exp_space'></div>
        <div className='exp_detail'>
      <div id='picture'><img src={items.exp_img} width="90%" height="85%" ></img></div>
      <ul className='exp_detail_list'>
      <li id='exp_date'>{items.post_date.substring(0,10)}</li>
      <li id='exp_title'>{items.title}</li>
      <li id='exp_title'>{items.subtitle}</li>
      </ul>
    </div>
    <div className='exp_detail1'>
    <ul className='exp_detail_list'>
      <li className='sub-title' style={{fontWeight:"bold"}}>Description:</li>
      <li id='description'>{items.description}</li>
      <li className='sub-title' style={{fontWeight:"bold"}}>Requierments:</li>
      <li id='description'>{items.requirements}</li>
      <li className='sub-title'><div style={{fontWeight:"bold"}}>Target:</div> &nbsp;&nbsp;{items.target}</li>
      <li className='sub-title'><div style={{fontWeight:"bold"}}>Job Nature:</div> &nbsp;&nbsp;{items.job_nature}</li>
      <li className='sub-title'><div style={{fontWeight:"bold"}}>Type:</div> &nbsp;&nbsp;{items.type}</li>
      <li className='sub-title'><div style={{fontWeight:"bold"}}>Duration:</div> &nbsp;&nbsp;{items.duration}</li>
      <li className='sub-title'><div style={{fontWeight:"bold"}}>Reward:</div> &nbsp;&nbsp;{items.salary}</li>
      <li className='sub-title'><div style={{fontWeight:"bold"}}>Venue:</div> &nbsp;&nbsp;{items.venue}</li>
      <li className='sub-title'><div style={{fontWeight:"bold"}}>Deadline:</div> &nbsp;&nbsp;{items.deadline}</li>
      <li className='sub-title'><div style={{fontWeight:"bold"}}>Vacancy:</div> &nbsp;&nbsp;{items.vacancy}</li>
      
      <form className='time_container'>
      <label for="exp_timeslot">Choose a TimeSlot to Enroll:</label>
      <div id='menu'>
      <select name="exp_time" id="exp_time">
        {timesplit.map(item=>(
      <option value={item}>{item}</option>))}
      </select>
      </div>
      </form>
      <div className='grid'>
      <button className='back' onClick={()=>back()}>Back</button>
      <button className='enroll' onClick={()=>enroll()}>Enroll</button>
      </div>
    </ul>
    </div>
</div>
</>
  );
}catch(e){
  console.log("hi")
  return("")
}

  }
export default Exp_detail