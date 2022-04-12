import './Questionnaire_add.css'
import * as Ri from "react-icons/ri";
import {useState} from 'react'

function Questionnaire_add() {
    const [type, setType] = useState(1);
    const [number, setNumber] = useState(1);

    function changeQuestionNumber(){
        let x = document.document.getElementbyId("questionnaire_number").value;
        if(x > 10){
            setNumber(10);
        }else{
            setNumber(x);
        }
    }

    function changeType(){
        let x = document.document.getElementbyId("questionnaire_type").value;
        if(x === "MC"){
            setType(1);
        }else if(x === "LongQ"){
            setType(2);
        }else if(x === "scoring"){
            setType(3);
        }else if(x === "googleForm"){
            setType(4);
        }
    }

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
        
        
        <section className="questionnaire_add">
            <div id='icon'>Create Questionnaire</div>
            <div className="questionnaire_add_title">
                <label htmlFor="questionnaire_title">Title</label>
                <input type="text" placeholder="Type your questionnaire title here" name="questionnaire_title" id="questionnaire_title"></input>
            </div>

            <div className="questionnaire_add_time">
                <label htmlFor="questionnaire_deadline">Deadline</label>
                <input type="date" name="questionnaire_deadline" id="questionnaire_deadline"></input>
                <label htmlFor="questionnaire_eft">Expected Finishing Time</label>
                <input type="text" placeholder="Expected finishing time" name="questionnaire_eft" id="questionnaire_eft"></input>
            </div>

            <div className="questionnaire_add_purpose">
                <label htmlFor="questionnaire_purpose">Purpose / Description</label>
                <textarea placeholder="Your purpose and description" name="questionnaire_purpose" id="questionnaire_purpose"></textarea>
            </div>

            <div className="questionnaire_add_type">
                <label htmlFor="questionnaire_type">Question type</label>
                <select name="questionnaire_type" id="questionnaire_type" onChange={()=>changeType()}>
                    <option value="MC">MC</option>
                    <option value="longQ">Long question</option>
                    <option value="scoring">Scoring</option>
                    <option value="googleForm">Google Form</option>
                </select>
                { type === 4 
                    ? <></> 
                    :   <>
                            <label htmlFor="questionnaire_number">No. of Questions</label>
                            <input id="questionnaire_number" name="questionnaire_number" type="number" min="1" max="10" value={number} onChange={changeQuestionNumber}></input>
                        </>
                }
            </div>

            <div>
                {type == 1 && <MCQ number={number}/>}
                {type == 2 && <Question number={number}/>}
                {type == 3 && <Question number={number}/>}
                {type == 4 && <Form />}    
            </div>
        </section>
        <div>
            <button className="questionnaire_edit_back_button" onClick={()=> window.location.pathname="/question/edit"}>Back</button>
            <button className="questionnaire_edit_add_button" onClick={()=>addPost(type, number)}>Add New Post</button>
        </div>
      </div>
    )
}

export default Questionnaire_add;

function MCQ({number}){
    var all_question = [];
    for(var id = 1; id <= number; id++){
        all_question.push(
            <div className="MCQ_add">  
                <div className="add_question">
                    <label htmlFor={id}>Question {id}: </label>
                    <input type="text" name={id} id={id}></input>
                </div>
                <div>
                    <label htmlFor={id + "A"}>A: </label>
                    <input type="text" name={id + "A"} id={id + "A"}></input>
                </div>
                <div>
                    <label htmlFor={id + "B"}>B: </label>
                    <input type="text" name={id + "B"} id={id + "B"}></input>
                </div>
                <div>
                    <label htmlFor={id + "C"}>C: </label>
                    <input type="text" name={id + "C"} id={id + "C"}></input>
                </div>
                <div>
                    <label htmlFor={id + "D"}>D: </label>
                    <input type="text" name={id + "D"} id={id + "D"}></input>
                </div>    
            </div>
        );
    }
    return all_question
}

function Question({number}){
    var all_question = [];
    for(var id = 1; id <= number; id++){
        all_question.push(
            <div className="add_question">  
                <label htmlFor={id}>Question {id}: </label>
                <input type="text" name={id} id={id}></input> 
            </div>
        );
    }
    return all_question
}

function Form(){
    return(
        <div className="add_question">  
            <label htmlFor="googleForm">Link</label>
            <input type="text" name="googleForm" id="googleForm"></input> 
        </div>
    )
}

function addPost(type, number){
    const question = "";
    let answer = [];
    let error = [];
    let check = 1;
    if (type == 1){
        for(var x = 0; x < number; x++){
            answer.push("" + document.getElementbyId(""+(x+1)).value + "," + document.getElementbyId(""+(x+1)+"A").value + "," + document.getElementbyId(""+(x+1)+"B").value + "," + document.getElementbyId(""+(x+1)+"C").value + "," + document.getElementbyId(""+(x+1)+"D").value + ";");
        }
    }else if (type == 2 || type == 3){
        for(var x = 0; x < number; x++){
            if (document.getElementbyId(""+(x+1)).value == ""){
                check = 0;
                error.push(""+(x+1));
            }
            question = question + document.getElementbyId(""+(x+1)).value + ";";
        }
    }else if (type == 4){
        if (document.getElementbyId(""+(x+1)).value == ""){
            check = 0;
            error = "link of google form";
        }
        question = question + document.getElementbyId("googleForm").value + ";";
    }

    if(check == 0){
        alert("You have not finished " + error);
    }
}
