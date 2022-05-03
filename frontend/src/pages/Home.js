import React, { Component, useState ,useEffect} from 'react'
import sample from '../Global/sample.jpg'
import './Home.css'
import axios from "axios";
import member5 from '../components/5-people.png'
import member4 from '../components/4-people.png'
import member3 from '../components/3-people.png'
import member2 from '../components/2-people.png'
import longquestionimg from '../components/LongQ.png'
import mcimg from '../components/MC.png'
import scoringimg from '../components/scoring.jpg'
import googleFormimg from '../components/googleForm.jfif'

function Home() {
  return (
    <div className='home'>
        <div className='title'> CU Crowd</div>
        <div className='username'>Welcome User : &nbsp;<div id='username1' onClick={()=>{window.location.pathname='/profile';}}> <Name/></div></div>
        <hr className="line1"/>
        <div className='intro'>Here are the latest posts in each function </div>
        <div className="background1" >
        <div className='title-sub'>Experiments:</div>
        <div className='container'>
        <div className='row'>
            <Exp_list/>
        </div>
        <button className='viewmore' onClick={()=>{window.location.pathname='/experiments';}}>View More</button>
        </div>
        </div>
        <div className='title-sub'>Questionnaires:</div>
        <div className='container'>
        <div className='row'>
            <Quest_list/>            
        </div>
        <button className='viewmore' onClick={()=>{window.location.pathname='/question';}}>View More</button>
        </div>
        <div className="background1" >
        <div className='title-sub'>Team Formation:</div>
        <div className='container'>
        <div className='row'>
              <Team_list/>
            </div>
            <button className='viewmore' onClick={()=>{window.location.pathname='/team';}}>View More</button>
        </div>
        </div>
    </div>
  )
}


//return the top three latest post from experiment section
class Exp_list extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            items: [],
        };
    }
    //get all the experiment from database
    componentDidMount() {
    fetch(
        "http://localhost:8000/api/experiment/")
        .then((res) => res.json())
        .then((json) => {
            this.setState({items: json,});
        })
    }
    
    //render the top 3 post only
    render(){
        try{
            return(
                <div >     
                
                        <>
                        {this.state.items.length > 0 && <div className='column'>
                            <div className='postauthor' onClick={()=>{window.location.pathname='/experiments/'+this.state.items[0].id;}}>{this.state.items[0].title.substring(0,200)}</div>
                            <div className='postphoto'><img src={this.state.items[0].exp_img==null? sample:this.state.items[0].exp_img} width="95%" height="95%" ></img></div>
                            <div className='home_line'><hr id="line"/></div>
                            <div className='description'>{this.state.items[0].description.substring(0,200) + "..."}</div>
                        </div>}
                        {this.state.items.length > 1 && <div className='column'>
                            <div className='postauthor' onClick={()=>{window.location.pathname='/experiments/'+this.state.items[1].id;}}>{this.state.items[1].title.substring(0,200)}</div>
                            <div className='postphoto'><img src={this.state.items[1].exp_img==null? sample:this.state.items[1].exp_img} width="95%" height="95%" ></img></div>
                            <div className='home_line'><hr id="line"/></div>
                            <div className='description'>{this.state.items[1].description.substring(0,200) + "..."}</div>
                        </div>}
                        {this.state.items.length > 2 && <div className='column'>
                            <div className='postauthor' onClick={()=>{window.location.pathname='/experiments/'+this.state.items[2].id;}}>{this.state.items[2].title.substring(0,200)}</div>
                            <div className='postphoto'><img src={this.state.items[2].exp_img==null? sample:this.state.items[2].exp_img} width="95%" height="95%" ></img></div>
                            <div className='home_line'><hr id="line"/></div>
                            <div className='description'>{this.state.items[2].description.substring(0,200) + "..."}</div>
                        </div>}
                        </>
                </div>
            );
        }catch(e){
            return(""+e)
        }
    }
}


//return the username of the current user
function Name(){
    
    const [items, setItems] = useState([{}]);

    
    useEffect(() => {
        axios.get("http://localhost:8000/api/login", {withCredentials : true}).then((response) => {
        setItems(response.data);
        });
    }, []);
      
    return(
            <>
            {items.username}
            </>
    )
}

export default Home


//return the top three latest post from team section
class Team_list extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            items: [],
        };
    }

    //get all the team from database
    componentDidMount() {
    fetch("http://localhost:8000/api/teamformation")
    .then((res) => res.json())
    .then((json) => {this.setState({items: json,});
    })
  }
  
    //render the top 3 post only
    render(){
        try{
            return(
                <div >     
                        <>
                        {this.state.items.length > 0 && <div className='column'>
                            <div className='postauthor' onClick={() => {window.location.href = "http://localhost:3000/team/" + this.state.items[0].id}}>{this.state.items[0].title.substring(0,200) + "..."}</div>
                            {this.state.items[0].teamsize == 2 && <div className='postphoto'><img src={member2} width="95%" height="95%" ></img></div>}
                            {this.state.items[0].teamsize == 3 && <div className='postphoto'><img src={member3} width="95%" height="95%" ></img></div>}
                            {this.state.items[0].teamsize == 4 && <div className='postphoto'><img src={member4} width="95%" height="95%" ></img></div>}
                            {this.state.items[0].teamsize == 5 && <div className='postphoto'><img src={member5} width="95%" height="95%" ></img></div>}      
                            <div className='home_line'><hr id="line"/></div>
                            <div className='description'>{this.state.items[0].description.substring(0,200) + "..."}</div>
                        </div>}
                        {this.state.items.length > 1 && <div className='column'>
                            <div className='postauthor' onClick={() => {window.location.href = "http://localhost:3000/team/" + this.state.items[1].id}}>{this.state.items[1].title.substring(0,200) + "..."}</div>
                            {this.state.items[1].teamsize == 2 && <div className='postphoto'><img src={member2} width="95%" height="95%" ></img></div>}
                            {this.state.items[1].teamsize == 3 && <div className='postphoto'><img src={member3} width="95%" height="95%" ></img></div>}
                            {this.state.items[1].teamsize == 4 && <div className='postphoto'><img src={member4} width="95%" height="95%" ></img></div>}
                            {this.state.items[1].teamsize == 5 && <div className='postphoto'><img src={member5} width="95%" height="95%" ></img></div>}
                            <div className='home_line'><hr id="line"/></div>
                            <div className='description'>{this.state.items[1].description.substring(0,200) + "..."}</div>
                        </div>}
                        {this.state.items.length > 2 && <div className='column'>
                            <div className='postauthor' onClick={() => {window.location.href = "http://localhost:3000/team/" + this.state.items[2].id}}>{this.state.items[2].title.substring(0,200) + "..."}</div>
                            {this.state.items[2].teamsize == 2 && <div className='postphoto'><img src={member2} width="95%" height="95%" ></img></div>}
                            {this.state.items[2].teamsize == 3 && <div className='postphoto'><img src={member3} width="95%" height="95%" ></img></div>}
                            {this.state.items[2].teamsize == 4 && <div className='postphoto'><img src={member4} width="95%" height="95%" ></img></div>}
                            {this.state.items[2].teamsize == 5 && <div className='postphoto'><img src={member5} width="95%" height="95%" ></img></div>}
                            <div className='home_line'><hr id="line"/></div>
                            <div className='description'>{this.state.items[2].description.substring(0,200) + "..."}</div>
                        </div>}
                        </>
                    
                
                </div>
            );
        }catch(e){
            return(""+e)
        }
    }
}


//return the top three latest post from Questionnaire section
class Quest_list extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            items: [],
        };
    }
    //get all the questionnaire from database
  componentDidMount() {
  fetch(
      "http://localhost:8000/api/questionnaire/ongoing")
      .then((res) => res.json())
      .then((json) => {
          this.setState({items: json,});
      })
  }
  
  //render the top 3 post only
  render(){
    try{  
    return(
      <div >     
            <>
            {this.state.items.length > 0 && <div className='column'>
                <div className='postauthor' onClick={() => {window.location.href = "http://localhost:3000/question/" + this.state.items[0].id}}>{this.state.items[0].title.substring(0,200)}</div>
                {this.state.items[0].questiontype == "mc" && <div className='postphoto'><img src={mcimg} width="95%" height="95%" ></img></div>}
                {this.state.items[0].questiontype == "gf" && <div className='postphoto'><img src={googleFormimg} width="95%" height="95%" ></img></div>}
                {this.state.items[0].questiontype == "sc" && <div className='postphoto'><img src={scoringimg} width="95%" height="95%" ></img></div>}
                {this.state.items[0].questiontype == "lq" && <div className='postphoto'><img src={longquestionimg} width="95%" height="95%" ></img></div>}
                <div className='home_line'><hr id="line"/></div>
                <div className='description'>{this.state.items[0].description.substring(0,200) + "..."}</div>
            </div>}
            {this.state.items.length > 1 && <div className='column'>
                <div className='postauthor'> onClick={() => {window.location.href = "http://localhost:3000/question/" + this.state.items[1].id}} {this.state.items[1].title.substring(0,200)}</div>
                {this.state.items[1].questiontype == "mc" && <div className='postphoto'><img src={mcimg} width="95%" height="95%" ></img></div>}
                {this.state.items[1].questiontype == "gf" && <div className='postphoto'><img src={googleFormimg} width="95%" height="95%" ></img></div>}
                {this.state.items[1].questiontype == "sc" && <div className='postphoto'><img src={scoringimg} width="95%" height="95%" ></img></div>}
                {this.state.items[1].questiontype == "lq" && <div className='postphoto'><img src={longquestionimg} width="95%" height="95%" ></img></div>}                
                <div className='home_line'><hr id="line"/></div>
                <div className='description'>{this.state.items[1].description.substring(0,200) + "..."}</div>
            </div>}
            {this.state.items.length > 2 && <div className='column'>
                <div className='postauthor' onClick={() => {window.location.href = "http://localhost:3000/question/" + this.state.items[2].id}} >{this.state.items[2].title.substring(0,200)}</div>
                {this.state.items[2].questiontype == "mc" && <div className='postphoto'><img src={mcimg} width="95%" height="95%" ></img></div>}
                {this.state.items[2].questiontype == "gf" && <div className='postphoto'><img src={googleFormimg} width="95%" height="95%" ></img></div>}
                {this.state.items[2].questiontype == "sc" && <div className='postphoto'><img src={scoringimg} width="95%" height="95%" ></img></div>}
                {this.state.items[2].questiontype == "lq" && <div className='postphoto'><img src={longquestionimg} width="95%" height="95%" ></img></div>}         
                <div className='home_line'><hr id="line"/></div>
                <div className='description'>{this.state.items[2].description.substring(0,200) + "..."}</div>
            </div>}
            </>
         
      
  </div>
    );
    }catch(e){
        return(""+e)
 }
  }
}
