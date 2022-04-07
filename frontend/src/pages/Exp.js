import React ,{ useState ,useEffect} from 'react'
import * as Ai from "react-icons/ai";
import * as Io from "react-icons/io";
import './Exp.css'
import sample from '../Global/sample.jpg'
import {useNavigate, useParams} from 'react-router-dom';
import axios from "axios";
    

function Exp(){
    
    const [SearchItems, setSearchItems] = useState("");
    
   try{
    return(
        
        <>
            <div className="banner"> 
            <div className='icon'><Ai.AiTwotoneExperiment /> </div>
            <div className='title1'>Experiements</div>
            </div>
            <div className="search">
            <div id="icon"><Ai.AiOutlineSearch /></div>
            <input id="bar" type="text" placeholder="Search..." 
            onChange={(e)=>{
                let SearchItemsLowerCase = e.target.value.toLowerCase();
                setSearchItems(SearchItemsLowerCase);}}/>
                <div id="edit_icon" onClick={()=>{window.location.pathname='/experiments/add';}}><Io.IoMdCreate/></div>
            </div>
            <div><List input={SearchItems}/></div>
        </>
    );
}catch(e){
        return("")
    }
    
            
}
    

function List(props){

    const [identity, setIdentity] = useState([{}]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/profile/me", {withCredentials : true}).then((response) => {
        setIdentity(response.data);
      });
    }, []);
    try{
    if(identity.user.identity=="student user"){
        document.getElementById("edit_icon").style.display="none";
    }
}catch(e){
    console.log("hi")
}
  const [items, setItems] = useState([{}]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/experiment/").then((response) => {
      setItems(response.data);
      });
    }, []);

    const matchData = items.filter((item) => {
        if (props.input === '') {
            return item;
        }
        else {
            return item.title.toLowerCase().includes(props.input);
        }
    })
    
    //console.log(matchData[0].host.username);
    try{
        return (
            <>
            {matchData.map(item=>(
            <><div className='container1'>
            <ul className='exp_list'>
                <li className='picture'><img src={item.exp_img} width="300px" height="280px"></img></li>
            <li className='exp_item'>
                    <div id='exp_date'>{item.post_date.substring(0,10)}</div>
                    <div id='exp_title'>{item.title.substring(0,200)}</div>
                    <div id='exp_subtitle' >{item.subtitle.substring(0,100)}</div>
                    <div id='exp_condition'>{item.description.substring(0,400)} ...</div>
                    <div id='exp_duration'>Duration: {item.duration}</div>
                    <div id='exp_reward'>Reward: {item.salary} </div>
                    <div id='exp_vacancy'>Vacancy: {item.vacancy} </div>
                    <div id='exp_more'><a href={"http://localhost:3000/experiments/" + item.id}>More..</a></div>
                </li>
                
                </ul>
                </div>
                <div className='line_block'><hr className='exp_line'/></div></>))}
            
            </>
            
        );
            }catch(e){
                console.log("hi");
                return("");
            }
    
    
    
    }

   


class Demo extends React.Component{
    render(){
        return(
            <>
            <ul className='exp_list'>
                <li className='picture'><img src={sample} width="90%" height="85%" ></img></li>
                <li className='exp_item'>
                <div id='exp_date'>19/3/2022</div>
                <div id='exp_title'>Participants Recruitment in Psychology Experiment (40min, 50HK) 誠邀參與心理學實驗</div>
                <div id='exp_condition'>
                Professor CHAN Wai of the Department of Psychology and Professor CHEUNG Him from the Education University of 
                Hong Kong are now conducting a series of experiments to investigate the knowledge learning progress in human. 
                In this study, you will answer questions about general world knowledge according to your existing knowledge and
                 information provided. If you don’t know the answers to them, you are strongly encouraged to guess. During the 
                 experiment, internet search or any help from the third-party are not allowed. Participants are required to work 
                 on a set of online questionnaire for around 40 minutes.
                </div>
                <div id='exp_duration'>Duration: 40min</div>
                <div id='exp_reward'>Reward: 50HKD supermarket coupons </div>
                </li>
            </ul>
            <hr className='exp_line'/>
            </>
        )
    }
}

export default Exp