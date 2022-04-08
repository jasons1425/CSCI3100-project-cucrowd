import React, { Component, useState ,useEffect} from 'react'
import sample from '../Global/sample.jpg'
import './Home.css'
import axios from "axios";
import member5 from '../components/5-people.png'
import member4 from '../components/4-people.png'
import member3 from '../components/3-people.png'
import member2 from '../components/2-people.png'

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
            <div className='column'>
                <div className='postauthor'>postauthor</div>
                <div className='postphoto'>photo</div>
                <div className='description'>this is description</div>
            </div>
            <div className='column'>
            <div className='postauthor'>postauthor</div>
                <div className='postphoto'>photo</div>
                <div className='description'>this is description</div>
                
            </div>
            <div className='column'>
                <div className='postauthor'>postauthor</div>
                <div className='postphoto'>photo</div>
                <div className='description'>this is description</div>
                
            </div>
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

class Exp_list extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            items: [],
        };
    }

  componentDidMount() {
  fetch(
      "http://localhost:8000/api/experiment/")
      .then((res) => res.json())
      .then((json) => {
          this.setState({items: json,});
      })
  }
  
  render(){
    try{
        //console.log(items[0].id);
     
    return(
      <div >     
     
            <>
            {this.state.items.length > 0 && <div className='column'>
                <div className='postauthor'>{this.state.items[0].title.substring(0,200)}</div>
                <div className='postphoto'><img src={this.state.items[0].exp_img} width="440px" height="390px" ></img></div>
                <div className='home_line'><hr id="line"/></div>
                <div className='description'>{this.state.items[0].description}</div>
            </div>}
            {this.state.items.length > 1 && <div className='column'>
                <div className='postauthor'>{this.state.items[1].title.substring(0,200)}</div>
                <div className='postphoto'><img src={this.state.items[1].exp_img} width="440px" height="390px" ></img></div>
                <div className='home_line'><hr id="line"/></div>
                <div className='description'>{this.state.items[1].description}</div>
            </div>}
            {this.state.items.length > 2 && <div className='column'>
                <div className='postauthor'>{this.state.items[2].title.substring(0,200)}</div>
                <div className='postphoto'><img src={this.state.items[2].exp_img} width="440px" height="390px" ></img></div>
                <div className='home_line'><hr id="line"/></div>
                <div className='description'>{this.state.items[2].description}</div>
            </div>}
            </>
         
      
  </div>
    );
    }catch(e){
        return(""+e)
 }
  }
}


function Name(){
    
    const [items, setItems] = useState([{}]);
  
    useEffect(() => {
      axios.get("http://localhost:8000/api/login", {withCredentials : true}).then((response) => {
        setItems(response.data);
        });
      }, []);
      
     console.log(items.username);
      return(
          <>
          {items.username}
        </>
      )
      }

export default Home


class Team_list extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            items: [],
        };
    }

  componentDidMount() {
  fetch(
      "http://localhost:8000/api/teamformation")
      .then((res) => res.json())
      .then((json) => {
          this.setState({items: json,});
      })
  }
  
  render(){
    try{
        //console.log(items[0].id);
     
    return(
      <div >     
            <>
            {this.state.items.length > 0 && <div className='column'>
                <div className='postauthor'>{this.state.items[0].title.substring(0,200)}</div>
                {this.state.items[0].teamsize == 2 && <div className='postphoto'><img src={member2} width="440px" height="390px" ></img></div>}
                {this.state.items[0].teamsize == 3 && <div className='postphoto'><img src={member3} width="440px" height="390px" ></img></div>}
                {this.state.items[0].teamsize == 4 && <div className='postphoto'><img src={member4} width="440px" height="390px" ></img></div>}
                {this.state.items[0].teamsize == 5 && <div className='postphoto'><img src={member5} width="440px" height="390px" ></img></div>}
                <div className='home_line'><hr id="line"/></div>
                <div className='description'>{this.state.items[0].description}</div>
            </div>}
            {this.state.items.length > 1 && <div className='column'>
                <div className='postauthor'>{this.state.items[1].title.substring(0,200)}</div>
                {this.state.items[1].teamsize == 2 && <div className='postphoto'><img src={member2} width="440px" height="390px" ></img></div>}
                {this.state.items[1].teamsize == 3 && <div className='postphoto'><img src={member3} width="440px" height="390px" ></img></div>}
                {this.state.items[1].teamsize == 4 && <div className='postphoto'><img src={member4} width="440px" height="390px" ></img></div>}
                {this.state.items[1].teamsize == 5 && <div className='postphoto'><img src={member5} width="440px" height="390px" ></img></div>}
                <div className='home_line'><hr id="line"/></div>
                <div className='description'>{this.state.items[1].description}</div>
            </div>}
            {this.state.items.length > 2 && <div className='column'>
                <div className='postauthor'>{this.state.items[2].title.substring(0,200)}</div>
                {this.state.items[2].teamsize == 2 && <div className='postphoto'><img src={member2} width="440px" height="390px" ></img></div>}
                {this.state.items[2].teamsize == 3 && <div className='postphoto'><img src={member3} width="440px" height="390px" ></img></div>}
                {this.state.items[2].teamsize == 4 && <div className='postphoto'><img src={member4} width="440px" height="390px" ></img></div>}
                {this.state.items[2].teamsize == 5 && <div className='postphoto'><img src={member5} width="440px" height="390px" ></img></div>}
                <div className='home_line'><hr id="line"/></div>
                <div className='description'>{this.state.items[2].description}</div>
            </div>}
            </>
         
      
  </div>
    );
    }catch(e){
        return(""+e)
 }
  }
}