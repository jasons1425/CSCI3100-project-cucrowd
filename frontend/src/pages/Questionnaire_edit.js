import './Questionnaire_edit.css'
import * as Ri from "react-icons/ri";
import * as Io from "react-icons/io";
import * as Im from "react-icons/im";
import * as Md from "react-icons/md";
import longquestionimg from '../components/LongQ.png'
import mcimg from '../components/MC.png'
import scoringimg from '../components/scoring.jpg'
import googleFormimg from '../components/googleForm.jfif'
import {useState, useEffect} from 'react'
import axios from 'axios'

function Questionnaire_edit() {
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profile, setProfile] = useState();
  const [data, setData] = useState();
  const [loading, isLoading] = useState(true);

  useEffect(()=> {
        axios
            .get("http://localhost:8000/api/questionnaire/")
            .then((res) => {
                setData(res.data)
                isLoading(false)
            })
            .catch((err) => {
                alert("Error in loading")
            });

        axios
            .get("http://localhost:8000/api/login", {withCredentials: true})
            .then((res) => {
                setProfile(res.data)
                setLoadingProfile(false)
            })
            .catch((err) => {
                alert(err.reponse.data.message)
            })
    },[])
  

  if(loading || loadingProfile){
      return <>Loading</>;
  }

  if(!loading && !loadingProfile){
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
            {data.filter((element) => {return element.host.username == profile.username}).map((element,index) => <QuestionnairePost id={element.id} title={element.title} type={element.questiontype} closing={element.deadline} description={element.description}/>)}
        </section>
      </div>
    )
  }
}

  
export default Questionnaire_edit;

function QuestionnairePost({id, type, title, description}){
    return(
      <div>
        <div className="questionnaire_post">
            <div className="questionnaire_edit_img">
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