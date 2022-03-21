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
    <div className="banner"> 
            <div>id:{params.id}</div>
            <div className='icon'><Ai.AiTwotoneExperiment /> </div>
            <div className='title1'>Experiements</div>
            </div>

    <div className='exp_space'></div>
    <div className='exp_detail'>
      <div id='picture'><img src={sample} width="90%" height="85%" ></img></div>
      <ul className='exp_detail_list'>
      <li id='exp_date'>19/3/2022</li>
      <li id='exp_title'>Participants Recruitment in Psychology Experiment (40min, 50HK) 誠邀參與心理學實驗</li>
      </ul>
    </div>
    <div className='exp_detail1'>
    <ul className='exp_detail_list'>
      <li className='sub-title'>Description:</li>
      <li id='description'>Professor CHAN Wai of the Department of Psychology and Professor CHEUNG Him from the Education University of 
                Hong Kong are now conducting a series of experiments to investigate the knowledge learning progress in human. 
                In this study, you will answer questions about general world knowledge according to your existing knowledge and
                 information provided. If you don’t know the answers to them, you are strongly encouraged to guess. During the 
                 experiment, internet search or any help from the third-party are not allowed. Participants are required to work 
                 on a set of online questionnaire for around 40 minutes.</li>
      <li className='sub-title'>Duration: 40min</li>
      <li className='sub-title'>Reward: 50HKD supermarket coupons </li>

      <button className='enroll' onClick={()=>{window.location.pathname='/experiments';}}>Enroll</button>
    </ul>
    </div>
    </>
  )
    
}

function List(id){
console.log(id.id);

      const [items, setItems] = useState({});
    
      useEffect(() => {
        axios.get("http://localhost:8000/api/experiment/"+id.id, {withCredentials : true}).then((response) => {
          setItems(response.data);
        });
      }, []);
    

  return(
    <div >
        <div className='exp_space'>test area</div>
        <div>{items.title}</div>
</div>
  );

  }
export default Exp_detail