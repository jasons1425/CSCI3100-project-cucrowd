import './Questionnaire_edit.css'
import * as Ri from "react-icons/ri";
import * as Io from "react-icons/io";
import * as Im from "react-icons/im";
import * as Md from "react-icons/md";
import sample from '../components/sample.jpg'

function Questionnaire_edit() {
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
        
        <div className='questionnaire_post_created'>
            <div id="questionnaire_post_created_title">Post Created</div>
            <div id='questionnaire_post_created_icon' onClick={()=> window.location.pathname="/question/add"}><Md.MdPostAdd/> Create New Post</div>
            <hr id='questionnaire_post_created_line'/>  
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
  
export default Questionnaire_edit;

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
              </ul>
              <div className='questionnaire_button'>
                <div id='edit'><Io.IoMdCreate/>&nbsp;Edit</div>
                <div id='delete'><Im.ImBin/>&nbsp;Delete</div>
                </div>
              </div>
          </div>
          <hr className="questionnaire_post_line"/>
      </div>
    )
}