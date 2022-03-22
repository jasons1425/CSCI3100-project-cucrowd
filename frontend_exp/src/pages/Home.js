import React, { Component } from 'react'
import sample from '../Global/sample.jpg'
import './Home.css'
function Home() {
  return (
    <div className='home'>
        <div className='title'> CU Crowd</div>
        <div className='intro'><h5>Here are the latest posts in each functions </h5></div>
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
    const {items } = this.state;
    return(
      <div >     
      {
          items.map((item) => ( 
            <>
            <div className='column'>
                <div className='postauthor'>{item.title}</div>
                <div className='postphoto'><img src={sample} width="400px" height="400px" ></img></div>
                <div className='description'>{item.description}</div>
            </div>
            </>
          ))
      }
  </div>
    );
  }
}
export default Home