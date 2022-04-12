import React from 'react'
import './Questionnaire.css'
import * as Ri from "react-icons/ri";
import * as Io from "react-icons/io";
import * as Ai from "react-icons/ai";
import longquestionimg from '../components/LongQ.png'
import mcimg from '../components/MC.png'
import scoringimg from '../components/scoring.jpg'
import googleFormimg from '../components/googleForm.jfif'
import {useState, useEffect} from 'react'
import axios from 'axios'

function Questionnaire() {
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(true);
  const [dataArray, setDataArray] = useState();

  function questionnaireSearch(){
    let x = document.getElementById("questionnaire_search_bar").value
    x = x.toLowerCase()
    setDataArray(data.filter((element)=>{
        return element.title.toLowerCase().includes(x);
    }))
  }

  useEffect(() => {
    axios
        .get("http://localhost:8000/api/questionnaire/ongoing")
        .then((res)=>{
          setData(res.data)
          setDataArray(res.data)
          setLoading(false)
        })
        .catch((err)=>{
          alert("Loading error")
        });
  },[])

  if(isLoading){
    return (<>Loading</>)
  }

  if(!isLoading){
    return (
      <div className="questionnaire_page">
        <header className="questionnaire_header">
          <div className="questionnaire_icon">
            <Ri.RiNewspaperLine />
          </div>
          <div className="questionnaire_title">
            Questionnaire
          </div>
        </header>

        <div className="questionnaire_space">
          &nbsp;
        </div>

        <div className="questionnaire_search">
          <div className="questionnaire_search_icon"><Ai.AiOutlineSearch /></div>
            <input id="questionnaire_search_bar" className="questionnaire_search_bar" type="text" placeholder="Search..." onChange={(e)=>{questionnaireSearch()}}/>
            <div className="questionnaire_search_edit_icon" onClick={()=>{window.location.pathname='/question/edit';}}><Io.IoMdCreate/></div>
        </div>

        <section>
          {dataArray.filter((element) => {return element.questiontype = "gf"}).map((element,index) => <QuestionnairePost key={index} id={element.id} title={element.title} type={element.questiontype} closing={element.deadline} description={element.description}/>)}
        </section>

      </div>
    )
  }
}

export default Questionnaire


function QuestionnairePost({id, type, title, description}){
  return(
    <div>
      <div className="questionnaire_post">
          <div className="questionnaire_img">
            {type == "mc" && <img src={mcimg}/>}
            {type == "sc" && <img src={scoringimg}/>}
            {type == "gf" && <img src={googleFormimg}/>}
            {type == "lq" && <img src={longquestionimg}/>}
          </div>
          <div className="questionnaire_post_content">
            <ul>
              <li className="questionnaire_post_title">{title}</li>
              <li>Question type: {type == "mc" && <b>MC</b>} {type == "lq" && <b>Long Question</b>} {type == "gf" && <b>Google Form</b>} {type == "sc" && <b>Scoring</b>}</li>
              <li><div className="questionnaire_decription">Description: {description}</div></li>
              <li>Expected finishing time: <b>10 mins</b></li>
              <li><a href={"http://localhost:3000/question/" + id}>More..</a></li>
            </ul>
          </div>
        </div>
        <hr className="questionnaire_post_line"/>
    </div>
  )
}
