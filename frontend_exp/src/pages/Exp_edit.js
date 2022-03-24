import React, { useState ,useEffect} from 'react'
import * as Ai from "react-icons/ai";
import * as Io from "react-icons/io";
import * as Im from "react-icons/im";
import * as Md from "react-icons/md";
import './Exp_edit.css'
import axios from "axios";
import sample from '../Global/sample.jpg'

function Exp_edit() {
  return (
    <><div className="banner">
      <div className='icon'><Ai.AiTwotoneExperiment /> </div>
      <div className='title1'>Experiements</div>
    </div>

    <div className='post_created'>
      <div id="title">Post Created</div>
      <div id='icon'><Md.MdPostAdd/> Create New Post</div>
      <hr id='line'/>
      
    </div>
    <List/>
      </>
  )
}

function List(){
    
  const [name, setName] = useState([{}]);
  const [items, setItems] = useState([{}]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/login", {withCredentials : true}).then((response) => {
      setName(response.data);
      });
    }, []);
    
   console.log(name.username);
    
   useEffect(() => {
    axios.get("http://localhost:8000/api/experiment/").then((response) => {
      setItems(response.data);
      });
    }, []);
    try{
    const matchData = items.filter((item) => {
      console.log(item.host.username.includes(name.username));
            return item.host.username.includes(name.username);

    })
    return (
      <>
      {matchData.map(item=>(
      <><div className='container1'>
      <ul className='exp_list'>
          <li className='picture'><img src={sample} width="90%" height="85%"></img></li>
      <li className='exp_item'>
              <div id='exp_date'>{item.post_date}</div>
              <div id='exp_title'>{item.title}</div>
              <div id='exp_condition'>{item.description}</div>
              <div id='exp_duration'>Duration: {item.duration}</div>
              <div id='exp_reward'>Reward: {item.salary} </div>
              <div id='exp_vacancy'>Vacancy: {item.vacancy} </div>
              
          </li>
          
          </ul>
          <div className='exp_button'>
              <div id='edit'><Io.IoMdCreate/>&nbsp;Edit</div>
              <div id='delete'><Im.ImBin/>&nbsp;Delete</div>
              </div>
          </div>
          <hr className='exp_line'/></>))}
      
      </>
      
  );
  }catch(e){
    console.log("hi");
    return("")
  }

    
    }

export default Exp_edit