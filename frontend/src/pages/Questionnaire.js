import React from 'react'
import './Questionnaire.css'
import * as Ri from "react-icons/ri";
import * as Io from "react-icons/io";
import * as Ai from "react-icons/ai";
import sample from '../components/sample.jpg'

function Questionnaire() {
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
          <input className="questionnaire_search_bar" type="text" placeholder="Search..." 
            onChange={(e)=>{
              let SearchItemsLowerCase = e.target.value.toLowerCase();
              setSearchItems(SearchItemsLowerCase);}}/>
          <div className="questionnaire_search_edit_icon" onClick={()=>{window.location.pathname='/question/edit';}}><Io.IoMdCreate/></div>
      </div>

      <section>
        <QuestionnairePost id="1" type="MC"/>
        <QuestionnairePost id="2" type="google_form"/>
        <QuestionnairePost id="3" type="Long_question"/>
        <QuestionnairePost id="4" type="scoring"/>
        <QuestionnairePost id="5"/>
      </section>

    </div>
  )
}

export default Questionnaire


function QuestionnairePost({id, type}){
  return(
    <div>
      <div className="questionnaire_post">
          <div className="questionnaire_img">
            <img src={sample}/>
          </div>
          <div className="questionnaire_post_content">
            <ul>
              <li className="questionnaire_post_title">title</li>
              <li>question type: <b>{type}</b></li>
              <li>expected finishing time: <b>10 mins</b></li>
              <li><a href={"http://localhost:3000/question/" + id}>More..</a></li>
            </ul>
          </div>
        </div>
        <hr className="questionnaire_post_line"/>
    </div>
  )
}

function setSearchItems(){
  
}