import './Questionnaire_add.css'
import * as Ri from "react-icons/ri";
import {useState} from 'react'
import axios from 'axios'

function Questionnaire_add() {
    const [type, setType] = useState(1);
    const [number, setNumber] = useState(1);


    //determine the question number
    function changeQuestionNumber(){
        let x = document.getElementById("questionnaire_number").value;
        if(x > 10){
            setNumber(10);
        }else{
            setNumber(x);
        }
    }


    //determine the type of questionnaire
    function changeType(){
        let x = document.getElementById("questionnaire_type").value;
        if(x === "MC"){
            setType(1);
        }else if(x === "longQ"){
            setType(2);
        }else if(x === "scoring"){
            setType(3);
        }else if(x === "googleForm"){
            setType(4);
        }
    }


    //html questionnaire form
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
        <div className="questionnaire_add_button">
            <button className="questionnaire_edit_back_button" onClick={()=> window.location.pathname="/question/edit"}>Back</button>
            <button className="questionnaire_edit_add_button" onClick={()=>addPost(type, number)}>Add New Post</button>
        </div>
      </div>
    )
}

export default Questionnaire_add;


//interface of MC question
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


//interface of long questions
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


//interface of google form
function Form(){
    return(
        <div className="add_question">  
            <label htmlFor="googleForm">Link</label>
            <input type="text" name="googleForm" id="googleForm"></input> 
        </div>
    )
}


//make request to server to create new post
function addPost(type, number){
    var question = "";
    let error = [];
    let check = 1;

    if(document.getElementById("questionnaire_title").value == ""){
        document.getElementById("questionnaire_title").style.borderColor="red"
        check = 0
        error.push("title");
    }else{
        document.getElementById("questionnaire_title").style.borderColor="black"
    }

    if(document.getElementById("questionnaire_purpose").value == ""){
        document.getElementById("questionnaire_purpose").style.borderColor="red"
        check = 0
        error.push("description");
    }else{
        document.getElementById("questionnaire_purpose").style.borderColor="black"
    }

    if(document.getElementById("questionnaire_deadline").value == ""){
        document.getElementById("questionnaire_deadline").style.borderColor="red"
        check = 0
        error.push("deadline");
    }else{
        document.getElementById("questionnaire_deadline").style.borderColor="black"
    }

    if(document.getElementById("questionnaire_eft").value == ""){
        document.getElementById("questionnaire_eft").style.borderColor="red"
        error.push("expected finishing time");
        check = 0
    }else{
        document.getElementById("questionnaire_eft").style.borderColor="black"
    }



    if (type == 1){
        var questiontype = "mc"
        for(var x = 0; x < number; x++){
            if(x != 0){
                question = question + ";"
            }

            if (document.getElementById(""+(x+1)).value == "" || document.getElementById(""+(x+1)).value.includes(";")){
                check = 0;
                error.push("question "+(x+1));
                document.getElementById(""+(x+1)).style.borderColor="red"
            }else{
                document.getElementById(""+(x+1)).style.borderColor="black"
            }

            if (document.getElementById(""+(x+1)+"A").value == "" || document.getElementById(""+(x+1)+"A").value.includes(";") || document.getElementById(""+(x+1)+"A").value.includes(",")){
                check = 0;
                error.push(""+(x+1)+"A");
                document.getElementById(""+(x+1)+"A").style.borderColor="red"
            }else{
                document.getElementById(""+(x+1)+"A").style.borderColor="black"
            }


            if (document.getElementById(""+(x+1)+"B").value == "" || document.getElementById(""+(x+1)+"B").value.includes(";") || document.getElementById(""+(x+1)+"B").value.includes(",")){
                check = 0;
                error.push(""+(x+1)+"B");
                document.getElementById(""+(x+1)+"B").style.borderColor="red"
            }else{
                document.getElementById(""+(x+1)+"B").style.borderColor="black"
            }


            if (document.getElementById(""+(x+1)+"C").value == "" || document.getElementById(""+(x+1)+"C").value.includes(";") || document.getElementById(""+(x+1)+"C").value.includes(",")){
                check = 0;
                error.push(""+(x+1)+"C");
                document.getElementById(""+(x+1)+"C").style.borderColor="red"
            }else{
                document.getElementById(""+(x+1)+"C").style.borderColor="black"
            }


            if (document.getElementById(""+(x+1)+"D").value == "" || document.getElementById(""+(x+1)+"D").value.includes(";") || document.getElementById(""+(x+1)+"D").value.includes(",")){
                check = 0;
                error.push(""+(x+1)+"D");
                document.getElementById(""+(x+1)+"D").style.borderColor="red"
            }else{
                document.getElementById(""+(x+1)+"D").style.borderColor="black"
            }

            question = question + document.getElementById(""+(x+1)).value + "," + document.getElementById(""+(x+1)+"A").value + "," + document.getElementById(""+(x+1)+"B").value + "," + document.getElementById(""+(x+1)+"C").value + "," + document.getElementById(""+(x+1)+"D").value;
        }


    }else if (type == 2 || type == 3){
        if(type == 2){
            var questiontype = "lq"
        }else if(type == 3){
            var questiontype = "sc"
        }
        for(var x = 0; x < number; x++){

            if(x != 0){
                question = question + ";"
            }

            if (document.getElementById(""+(x+1)).value == "" || document.getElementById(""+(x+1)).value.includes(";")){
                check = 0;
                error.push(""+(x+1));
                document.getElementById(""+(x+1)).style.borderColor="red"
            }else{
                document.getElementById(""+(x+1)).style.borderColor="black"
            }

            question = question + document.getElementById(""+(x+1)).value;
        }



    }else if (type == 4){
        var questiontype = "gf"
        if (document.getElementById("googleForm").value == ""){
            check = 0;
            error = "link of google form";
            document.getElementById("googleForm").style.borderColor="red"
        }else{
            document.getElementById("googleForm").style.borderColor="black"
        }

        question = question + document.getElementById("googleForm").value;
    }


    if(check == 0 && questiontype != "mc"){
        alert(error + " cannot be empty or contain ';' symbol");
        return
    }else if(check == 0 && questiontype == "mc"){
        alert(error + " cannot be empty or contain ';'/',' symbol");
        return
    }

    let payload = {
        title : document.getElementById("questionnaire_title").value,
        description : document.getElementById("questionnaire_purpose").value,
        deadline : document.getElementById("questionnaire_deadline").value,
        questionsize : number,
        questiontype : questiontype,
        question : question,
        exp_finish : document.getElementById("questionnaire_eft").value
    }

    axios
        .post("http://localhost:8000/api/questionnaire", payload, {withCredentials:true})
        .then((res) => {
            alert("Post is successfully published");
            window.location.pathname='/question';
        })
        .catch((err) => {
            let message = ""
            if(err.response.data.title){
                message += "Title: " + err.response.data.title + "\n"
                document.getElementById("questionnaire_title").style.borderColor="red"
            }
            if(err.response.data.description){
                message += "Description: " + err.response.data.description + "\n"
                document.getElementById("questionnaire_purpose").style.borderColor="red"
            }
            if(err.response.data.deadline){
                message += "Deadline: " + err.response.data.deadline + "\n"
                document.getElementById("questionnaire_deadline").style.borderColor="red"
            }
            if(err.response.data.message){
                message += err.response.data.message + "\n"
            }
            alert(message)
        })
    
}
