import './Questionnaire_details.css'
import * as Ri from "react-icons/ri";
import {useState, useEffect} from 'react'

function Questionnaire_details() {
    const[type, setType] = useState(-1);

    useEffect(()=> {
        /* ... */
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
                    <div className="questionnaire_details_title">
                        <p>Title</p>
                        <p>expected finishing time</p>
                        <p>deadline</p>
                    </div>
                    <div className="questionnaire_details_description">
                        <p>Purpose/ description</p>
                    </div>
                </div>
                <div className="questionnaire">
                    {type === 1 && <LongQ number="1"/>}
                    {type === 2 && <MC number="1"/>}
                    {type === 3 && <Scoring number="1"/>}
                    {type === 4 && <GoogleForm/>}
                </div>
                <div>
                    <button className="questionnaire_submit_button" type="button">Submit</button>
                </div>
            </div>
        </div>
    )
}
  
export default Questionnaire_details;

function LongQ({number}){
    return(
        <div className="LongQ">
            <p>
                Question:
            </p>
            <label htmlFor={number}>Answer:<br/></label>
            <textarea type="text" name={number} id={number}></textarea>
        </div>
    )
}

function MC({number}){
    return(
        <div className="MC">
            <p>Question: </p>
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
    )
}

function Scoring({number}){
    return(
        <div className="scoring">
                <p>
                    Question:
                </p>
                <div className="score_mark">
                    <label className="scoring_1" htmlFor="1">1</label>
                    <label className="scoring_5" htmlFor="5">5</label>
                    <label className="scoring_10" htmlFor="10">10</label>
                </div>
                <input type="range" min="1" max="10" className="slider" name={number} id={number} onChange={()=> update(number)}></input>
                <p id="score_value">Value: </p>
        </div>
    )
}

function GoogleForm(){
    return(
        <div className="googleForm">
            <a href=" ">Link to goole form</a>
        </div>
    )
}

function update(number){
    let x = document.getElementById(number).value;
    let y = document.getElementById("score_value");
    y.innerHTML = "Value: " + x;
}