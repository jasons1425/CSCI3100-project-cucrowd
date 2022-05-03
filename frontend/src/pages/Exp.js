import React ,{ useState ,useEffect} from 'react'
import * as Ai from "react-icons/ai";
import * as Io from "react-icons/io";
import './Exp.css'
import sample from '../Global/sample.jpg'
import {useNavigate, useParams} from 'react-router-dom';
import axios from "axios";
    

function Exp(){
    
    //used to store the inputted keyword in search bar
    const [SearchItems, setSearchItems] = useState("");
    
   try{
        return(
            <>
                <div className="banner"> 
                <div className='icon'><Ai.AiTwotoneExperiment /> </div>
                <div className='title1'>Experiments</div>
                </div>
                <div className="search">
                <div id="icon"><Ai.AiOutlineSearch /></div>
                {/* get the inputted keyword in search bar and convert it to lower case then store it to "SearchItems" */}
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
        return("Sorry, Something went wrong")
    }
    
}
    

function List(props){

    //used to store the account type of current user
    const [identity, setIdentity] = useState([{}]);

    //get the account type of current user
    useEffect(() => {
        axios.get("http://localhost:8000/api/profile/me", {withCredentials : true}).then((response) => {
            setIdentity(response.data);
        });
        }, []);
    try{
        //hide the post management button if the current user is student user
        if(identity.user.identity=="student user"){
            document.getElementById("edit_icon").style.display="none";
        }
    }catch(e){
        console.log("error occur")
    }

    //used to store all experiments
    const [items, setItems] = useState([{}]);

    //get all experiments from database
    useEffect(() => {
        axios.get("http://localhost:8000/api/experiment/").then((response) => {
        setItems(response.data);
        });
        }, []);
    
    //filter out experiment that not match with the keyword inputted by user in search bar
    const matchData = items.filter((item) => {
        if (props.input === '') {
            return item;
        }
        else {
            return item.title.toLowerCase().includes(props.input);
        }
    })

    try{
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
                return("Sorry, Something went wrong");
    }
}

export default Exp
