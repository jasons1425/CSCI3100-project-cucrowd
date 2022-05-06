import React, { useState ,useEffect} from 'react'
import './Exp_detail.css'
import * as Ai from "react-icons/ai";
import sample from '../Global/sample.jpg'
import {useLocation,useParams} from 'react-router-dom';
import axios from "axios";

function Exp_detail(){

  //get the experiment id from the URL by params
  const params=useParams();
    return (
    <>
    <List id={params.id}/>
    </>
  )
    
}

//look up corresponding experiment by the retrivied experiment id and display all the information detailly
function List(id){

  const [items, setItems] = useState({});
  
  //get the specific experiment by id
  useEffect(() => {
    axios.get("http://localhost:8000/api/experiment/"+id.id+"/", {withCredentials : true}).then((response) => {
      setItems(response.data);
      });
    }, []);
    
  

  function enroll(){
    //conduct post request about the enrollment to backend
    let selected = document.getElementById("exp_time");
    let payload = {experiment : id.id, selected_time : selected.value};
    axios.post('http://localhost:8000/api/enroll', payload, {withCredentials : true})
    .then((response)=>{
      alert("successfull enrollment")
      back()
    })
    .catch((error)=>{
      alert(error.response.data.message)
      back();
    })
  
  }
  //back to experiment listing page
  function back(){
    window.location.pathname='/experiments';
  }

  try{
    const timesplit=items.timeslots.split(';');
    console.log(timesplit[0])

    let job;
    if (items.type=="FT"){
      job="FullTime"
    }
    if (items.type=="Intern"){
      job="internship"
    }
    if (items.type=="PT"){
      job="PartTime"
    }
    if (items.type=="NA"){
      job="others"
    }

    //render the information of the experiment in formatted pattern.
  return(
    <>
    <div >
      <div className="banner"> 
            <div className='icon'><Ai.AiTwotoneExperiment /> </div>
            <div className='title1'>Experiments</div>
            </div>
        <div className='exp_space'></div>
        <div className='exp_detail'>
      <div id='picture'><img src={items.exp_img==null? sample:items.exp_img} width="90%" height="85%" ></img></div>
      <ul className='exp_detail_list'>
      <li id='exp_date'>{items.post_date.substring(0,10)}</li>
      
      <li id='exp_title'>{items.title}</li>
      <li id='exp_title'>{items.subtitle}</li>
      <li id='host'>Created by:&nbsp;&nbsp; <div id='exp_host'onClick={()=>{window.location.pathname='/experiments/'+id.id+'/'+items.host.username;}}> {items.host.username}</div></li>
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
      <li className='sub-title'><div style={{fontWeight:"bold"}}>Type:</div> &nbsp;&nbsp;{job}</li>
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

  return("Sorry, something went wrong")
}

  }
export default Exp_detail
