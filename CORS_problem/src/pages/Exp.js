import React  from 'react'
import * as Ai from "react-icons/ai";
import './Exp.css'
import sample from '../Global/sample.jpg'
import {useNavigate, useParams} from 'react-router-dom';
    

function Exp(){
    

        return(
            <>
            <div className="banner"> 
            <div className='icon'><Ai.AiTwotoneExperiment /> </div>
            <div className='title1'>Experiements</div>
            </div>
            <div><List /></div>
            </>
        );
    
}


class List extends React.Component{
    constructor(props) {
    super(props);

    this.state = {
        items: [],
        DataisLoaded: false
    };
}

  componentDidMount() {
  fetch(
      "http://localhost:8000/api/experiment/")
      .then((res) => res.json())
      .then((json) => {
          this.setState({
              items: json,
              DataisLoaded: true
          });
      })
  }
  
  

  render(){
    const { DataisLoaded, items } = this.state;
    return(
      <div >
          <div className='exp_space'></div>
      {
          items.map((item) => ( 
            <>
            <ul className='exp_list'>
                <li className='picture'><img src={sample} width="90%" height="85%" ></img></li>
                <li className='exp_item'>
                <div id='exp_date'>{item.post_date}</div>
                <div id='exp_title'>{item.title}</div>
                <div id='exp_condition'>{item.description}</div>
                <div id='exp_duration'>Duration: {item.duration}</div>
                <div id='exp_reward'>Reward: {item.salary} </div>
                <div id='exp_vacancy'>Vacancy: {item.vacancy} </div>
                <div id='exp_more' ><a href={"http://localhost:3000/experiments/" + item.id}>More..</a></div>
                </li>
            </ul>
            <hr className='exp_line'/>
            </>
          ))
      }
  </div>
    );
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