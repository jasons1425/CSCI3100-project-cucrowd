import React, { useState ,useEffect} from 'react'
import * as Ai from "react-icons/ai";
import * as Bi from "react-icons/bi";
import * as Io from "react-icons/io";
import * as Im from "react-icons/im";
import * as Md from "react-icons/md";
import './Exp_add.css'
import axios from "axios";
import sample from '../Global/sample.jpg'

//basic layout setting of the post management page
function Exp_add() {
  return (
    <><div className="banner">
      <div className='icon'><Ai.AiTwotoneExperiment /> </div>
      <div className='title1'>Experiments</div>
    </div>

    <div className='post_created'>
      <div id="title">Post Created</div>
      <div id='icon' onClick={()=>{window.location.pathname='/experiments/add/create';}}><Md.MdPostAdd/> Create New Post</div>
      <hr id='line'/>
      
    </div>
    <List/>
      </>
  )
}

//find experiments hosted by the organization user
function List(){
    
  const [name, setName] = useState([{}]);
  const [items, setItems] = useState([{}]);

  //get the username of the cuurent user
  useEffect(() => {
    axios.get("http://localhost:8000/api/login", {withCredentials : true}).then((response) => {
      setName(response.data);
      });
    }, []);
    
    
   //get all the experiments from the database
   useEffect(() => {
    axios.get("http://localhost:8000/api/experiment/").then((response) => {
      setItems(response.data);
      });
    }, []);
    try{
    //filter the experiments by matching with the username of current user
    const matchData = items.filter((item) => {
      console.log(item.host.username.includes(name.username));
            return item.host.username.includes(name.username);

    })
    //return experiment in listing view and add three button which are Create, Edit and Delete in each post
    return (
      <>
      {matchData.map(item=>(
      <><div className='container1'>
      <ul className='exp_list'>
          <li className='picture'><img src={item.exp_img==null? sample:item.exp_img} width="88%" height="88%"></img></li>
      <li className='exp_item'>
              <div id='exp_date'>{item.post_date.substring(0,10)}</div>
              <div id='exp_title'>{item.title.substring(0,200)}</div>
              <div id='exp_subtitle' >{item.subtitle.substring(0,100)}</div>
              <div id='exp_condition'>{item.description.substring(0,400)}</div>
              <div id='exp_duration'>Duration: {item.duration}</div>
              <div id='exp_reward'>Reward: {item.salary} </div>
              <div id='exp_vacancy'>Vacancy: {item.vacancy} </div>
              <div id='exp_more'><a href={"http://localhost:3000/experiments/" + item.id}>More..</a></div>
              
          </li>
          
          </ul>
          <div className='exp_button'>
              <div id='response' onClick={()=>{window.location.pathname='/experiments/add/response'+ item.id;}}><Bi.BiCommentCheck/>&nbsp;Response</div>
              <div id='edit' onClick={()=>{window.location.pathname='/experiments/add/edit'+ item.id;}}><Io.IoMdCreate/>&nbsp;Edit</div>
              <div id='delete'onClick={()=>{if (window.confirm("Are you sure to you want to delete the post: " +item.title)) {
                                              axios.delete('http://localhost:8000/api/experiment/'+item.id, {withCredentials : true});
                                              window.location.reload();
                                            }
                                            else {
                                              ;
                                            }
                                              }}><Im.ImBin/>&nbsp;Delete</div>
              </div>
          </div>
          <hr className='exp_line'/></>))}
      
      </>
      
  );
  }catch(e){
    console.log("Error Occur");
    return("Sorry, Something went wrong")
  }

    
    }

export default Exp_add

