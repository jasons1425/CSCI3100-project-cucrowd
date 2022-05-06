import './Questionnaire_details.css'
import * as Ri from "react-icons/ri";
import * as Gi from "react-icons/gi";
import { BiCaretLeft, BiCaretRight } from "react-icons/bi";
import {useState, useEffect, } from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios';


function Questionnaire_details() {
    const [number, setNumber] = useState(1);
    const [data, setData] = useState();
    const [loading, isLoading] = useState(true);
    const {id} = useParams();
    const [maxno, setNo] = useState(0);
    const [answer, setAnswer] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [profile, setProfile] = useState();

    //get all the questionnaire detail
    useEffect(()=> {
        axios
            .get("http://localhost:8000/api/questionnaire/"+id)
            .then((res) => {
                setData(res.data)
                setNo(res.data.questionsize)
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


    //html code of a detailed questionnaire post
    if(!loading && !loadingProfile){
        return(
            <div className="questionnaire_details">
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

                <div className="questionnaire_details_content">
                    <div className="questionnaire_detials_info">
                        <table className="questionnaire_details_title">
                            <tbody>
                                <tr>
                                    <td><b>Title</b></td>
                                    <td>{data.title}</td>
                                </tr>
                                <tr>
                                    <td><b>Expected Finishing Time</b></td>
                                    <td>{data.exp_finish}</td>
                                </tr>
                                <tr>
                                    <td><b>Deadline</b></td>
                                    <td>{data.deadline}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="questionnaire_details_description">      
                            <h4><b>Purpose/ description</b></h4>
                            <p>{data.description}</p>
                        </div>
                    </div>
                    {data.questiontype === "gf" && <GoogleForm key={number} question={data.question}/>}
                    {data.questiontype !== "gf" && <><div className="progress_bar">
                        <div className="bar" id="bar" style={{width: (100/maxno)*number + "%"}}></div>
                    </div>
                    
                    <div className="questionnaire">
                        <div className="questionnaire_left_icon">{number !== 1 && <BiCaretLeft onClick={()=> {
                            if(data.questiontype == "mc"){
                                updateQuestionAnswer(data.questiontype, number)
                                setNumber(number - 1)
                                return
                            }
                            if(document.getElementById(""+number).value.includes(";") && data.questiontype == "lq"){
                                alert("You cannot include ';' symbol in your answer")
                                return
                            }else{
                                updateQuestionAnswer(data.questiontype, number)
                                setNumber(number - 1)}}}/>}</div>
                        <div className="question">
                            {data.questiontype === "lq" && <LongQ key={number} number={number} question={data.question.split(";")[number-1]}/>}
                            {data.questiontype === "mc" && <MC key={number} number={number} question={data.question.split(";")[number-1]}/>}
                            {data.questiontype === "sc" && <Scoring key={number} number={number} question={data.question.split(";")[number-1]}/>}
                        
                        </div>
                        <div className="questionnaire_right_icon">{number !== maxno && <BiCaretRight onClick={()=> {
                            if(data.questiontype == "mc"){
                                updateQuestionAnswer(data.questiontype, number)
                                setNumber(number + 1)
                                return
                            }
                            if(document.getElementById(""+number).value.includes(";") && data.questiontype == "lq"){
                                alert("You cannot include ';' symbol in your answer")
                                return
                            }else{
                                updateQuestionAnswer(data.questiontype, number)
                                setNumber(number + 1)}}}/>}</div>
                    </div></>}
                    
                    <div>
                        <button className="questionnaire_back_button" type="button" onClick={()=> window.location.pathname="/question"}>Back</button>
                    {data.questiontype !== "gf" &&
                        <button className="questionnaire_submit_button" type="button" onClick={() => submitQuest(number)}>Submit</button>
                    }
                    </div>
                </div>
            </div>
        )
    }


    //Interface of long questions
    function LongQ({number, question}){
        return(
            <div className="LongQ">
                <p>
                    Question {number}: <br/> {question}
                </p>
                <textarea className="text" type="text" name={number} id={number} defaultValue={answer[number-1]} placeholder="type your answer here"></textarea>
            </div>
        )
    }


    //Interface of MC questions
    function MC({number, question}){
        useEffect(() => {
            if(answer[number-1] == "A"){
                document.getElementById(number+'A').setAttribute("checked","")
            }else if(answer[number-1] == "B"){
                document.getElementById(number+'B').setAttribute("checked","")
            }else if(answer[number-1] == "C"){
                document.getElementById(number+'C').setAttribute("checked","")
            }else if(answer[number-1] == "D"){
                document.getElementById(number+'D').setAttribute("checked","")
            }
        },[])
        return(
            <div className="MC">
                <p>Question {number}: <br/>{question.split(",")[0]}</p>
                <div className="MC_choice">
                    <div>
                        <input type="radio" name={number} id={number+'A'} onClick={() => updateMCAnswer("A", number)}></input>
                        <label htmlFor={number+'A'}>A: &nbsp; {question.split(",")[1]}</label>
                    </div>
                    <div>
                        <input type="radio" name={number} id={number+'B'} onClick={() => updateMCAnswer("B", number)}></input>
                        <label htmlFor={number+'B'}>B: &nbsp; {question.split(",")[2]}</label>
                    </div>   
                    <div>
                        <input type="radio" name={number} id={number+'C'} onClick={() => updateMCAnswer("C", number)}></input>
                        <label htmlFor={number+'C'}>C: &nbsp; {question.split(",")[3]}</label>
                    </div>   
                    <div>
                        <input type="radio" name={number} id={number+'D'} onClick={() => updateMCAnswer("D", number)}></input>
                        <label htmlFor={number+'D'}>D: &nbsp; {question.split(",")[4]}</label>
                    </div>
                </div>
            </div>
        )
    }


    //Interface of scoring questions
    function Scoring({number, question}){
        if(answer[number-1] == undefined){
            answer[number-1] = 1;
        }
        return(
            <div className="scoring">
                    <p>Question {number}: <br/> {question}</p>
                    <input type="range" defaultValue={answer[number-1]} min="1" max="10" className="slider" name={number} id={number} onChange={()=> update(number)}></input>
                    <div className="bubble">
                        <div className="bubble_img" id="bubble_img" style={{marginLeft : (-0.5 + (answer[number-1] -1) * (97/9)) + "%"}}>
                            {answer[number-1]}
                        </div>
                    </div>
            </div>
        )
    }


    //Interface of google form
    function GoogleForm({question}){
        return(        
            <div className="googleForm" onClick={() => window.open(question, "_blank")}>
                <Gi.GiClick/>
                <span>Click to Google Form</span>
            </div>
        )
    }


    //update the process bar
    function update(number){
        let x = document.getElementById(number).value;
        let y = document.getElementById("bubble_img");
        y.innerHTML = x;
        y.style.marginLeft = (-0.5 + (x-1) * (97/9)) + "%";
    }


    //update the MC answers 
    function updateMCAnswer(newAnswer, number){
        let temp_state = [...answer];
        let temp_element = {...temp_state[number-1]};
        temp_element = newAnswer;
        temp_state[number-1] = temp_element;
        setAnswer(temp_state);
    }


    //update the long question answer
    function updateQuestionAnswer(type, number){
        if(type !== "mc"){
            let temp_state = [...answer];
            let temp_element = {...temp_state[number-1]};
            temp_element = document.getElementById("" + number).value;
            if(temp_element == ""){
                temp_element = undefined
            }
            temp_state[number-1] = temp_element;
            setAnswer(temp_state);
        }
    }


    //make request to server to save and submit the answer 
    function submitQuest(number){
        var check = true;
        var check_array = [];
        var answerString = "";
        var empty = false;
        var error = "You have not finished question ";

        if(data.questiontype != "mc"){
            if(document.getElementById("" + number).value.includes(";")){
                alert("You cannot include ';' symbol in your answer")
                return
            }
        }

        for (var i = 0; i < maxno; i++){
            if(i != 0){
                answerString = answerString + ";";
            }
            if (data.questiontype !== "mc" && data.questiontype !== "gf" && i == number-1){
                if(document.getElementById("" + number).value == ""){
                    empty = true;
                }
                answerString = answerString + document.getElementById("" + number).value;
            }else{
                answerString = answerString + answer[i];
            }

            if((answer[i] == undefined || answer[i] == null) && (i != number-1 || empty) && (data.questiontype == "lq" || data.questiontype == "sc")){
                check_array.push(i+1);
                check = false;
            }else if((answer[i] == undefined || answer[i] == null) && data.questiontype == "mc"){
                check_array.push(i+1);
                check = false;
            }
        }

        if (!check){
            for (var i = 0; i < check_array.length; i++){
                if (i != 0){
                    error = error + ", ";
               }
                error = error + check_array[i];
            }
            alert(error);
            return;
        }

        let payload = {
            Ans : answerString,
            questionnaire : data.id
        }

            axios
            .post("http://localhost:8000/api/answer/", payload, {withCredentials : true})
            .then((res) => {
                alert("Your response has submitted");
                window.location.pathname = "/question";
            })
            .catch((err) => {
                alert(err.response.data.message);
            })
        
    }
}
  
export default Questionnaire_details;