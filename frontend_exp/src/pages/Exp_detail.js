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
    });
    
  function enroll(){
    //still modifying
    axios.post('http://localhost:8000/api/enroll', {withCredentials : true},{
      experiment: id.id,
      selected_time:'2022-03-24-10:00'
    })
  }

  function back(){
    window.location.pathname='/experiments';
  }

  return(
    <div >
      <div className="banner"> 
            <div className='icon'><Ai.AiTwotoneExperiment /> </div>
            <div className='title1'>Experiements</div>
            </div>
        <div className='exp_space'></div>
        <div className='exp_detail'>
      <div id='picture'><img src={sample} width="90%" height="85%" ></img></div>
      <ul className='exp_detail_list'>
      <li id='exp_date'>{items.post_date}</li>
      <li id='exp_title'>{items.title}</li>
      </ul>
    </div>
    <div className='exp_detail1'>
    <ul className='exp_detail_list'>
      <li className='sub-title'>Description:</li>
      <li id='description'>{items.description}</li>
      <li className='sub-title'>{items.subtitle}</li>
      <li className='sub-title'>Target: {items.target}</li>
      <li className='sub-title'>Job Nature: {items.job_nature}</li>
      <li className='sub-title'>Type: {items.type}</li>
      <li className='sub-title'>Duration: {items.duration}</li>
      <li className='sub-title'>Reward: {items.salary}</li>
      <li className='sub-title'>Venue: {items.venue}</li>
      <li className='sub-title'>Deadline: {items.deadline}</li>
      <li className='sub-title'>Vacancy: {items.vacancy}</li>
      <div className='grid'>
      <button className='back' onClick={()=>back()}>Back</button>
      <button className='enroll' onClick={()=>enroll()}>Enroll</button>
      </div>
    </ul>
    </div>
</div>
  );

  }
export default Exp_detail