import './Questionnaire_details.css'
import * as Ri from "react-icons/ri";
import { BiCaretLeft, BiCaretRight } from "react-icons/bi";
import {useState, useEffect, us} from 'react'

function Questionnaire_details() {
    const[type, setType] = useState(-1);
    const[number, setNumber] = useState(1);
    const maxno = 2;

    useEffect(()=> {
        let x = window.location.pathname.split("/")
        if(x[2] == 1){
            setType(2);
        }else if(x[2] == 2){
            setType(4);
        }else if(x[2] == 3){
            setType(1)
        }else if(x[2] == 4){
            setType(3)
        }
    },[])


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
                                <td>I am a title</td>
                            </tr>
                            <tr>
                                <td><b>Expected Finishing Time</b></td>
                                <td>I am expected time</td>
                            </tr>
                            <tr>
                                <td><b>Deadline</b></td>
                                <td>I am deadline</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="questionnaire_details_description">      
                        <h4><b>Purpose/ description</b></h4>
                        <p>sssss</p>
                    </div>
                </div>

                {type !== 4 && <div className="progress_bar">
                    <div className="bar" id="bar" style={{width: (100/maxno)*number + "%"}}></div>
                </div>
                }

                <div className="questionnaire">
                    <div className="questionnaire_left_icon">{number !== 1 && <BiCaretLeft onClick={()=> setNumber(number - 1)}/>}</div>
                    <div className="question">
                        {type === 1 && <LongQ number={number}/>}
                        {type === 2 && <MC number={number}/>}
                        {type === 3 && <Scoring number={number}/>}
                        {type === 4 && <GoogleForm/>}
                       
                    </div>
                    <div className="questionnaire_right_icon">{number !== maxno && <BiCaretRight onClick={()=> setNumber(number + 1)}/>}</div>
                </div>
                
                <div>
                    <button className="questionnaire_back_button" type="button" onClick={()=> window.location.pathname="/question"}>Back</button>
                {type !==4 &&
                    <button className="questionnaire_submit_button" type="button">Submit</button>
                }
                </div>
            </div>
        </div>
    )
}

function LongQ({number}){
    return(
        <div className="LongQ">
            <p>
                Question {number}:
            </p>
            <textarea type="text" name={number} id={number} placeholder="type your answer here"></textarea>
        </div>
    )
}

function MC({number}){
    return(
        <div className="MC">
            <p>Question {number}: </p>
            <div className="MC_choice">
                <div>
                    <input type="radio" name={number} id={number+'A'}></input>
                    <label htmlFor={number+'A'}>A: </label>
                </div>
                <div>
                    <input type="radio" name={number} id={number+'B'}></input>
                    <label htmlFor={number+'B'}>B: </label>
                </div>   
                <div>
                    <input type="radio" name={number} id={number+'C'}></input>
                    <label htmlFor={number+'C'}>C: </label>
                </div>   
                <div>
                    <input type="radio" name={number} id={number+'D'}></input>
                    <label htmlFor={number+'D'}>D: </label>
                </div>
            </div>
        </div>
    )
}

function Scoring({number}){
    return(
        <div className="scoring">
                <p>Question {number}:</p>
                <input type="range" defaultValue="1" min="1" max="10" className="slider" name={number} id={number} onChange={()=> update(number)}></input>
                <div className="bubble">
                    <div className="bubble_img" id="bubble_img" style={{marginLeft : "-0.5%"}}>
                        {1}
                    </div>
                </div>
        </div>
    )
}

function GoogleForm(){
    return(
        <div className="googleForm">
            <a href=" ">Click to Goole Form</a>
        </div>
    )
}

function update(number){
    let x = document.getElementById(number).value;
    let y = document.getElementById("bubble_img");
    y.innerHTML = x;
    y.style.marginLeft = (-0.5 + (x-1) * (97/9)) + "%";
}

  
export default Questionnaire_details;