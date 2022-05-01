import './Questionnaire_response.css'
import * as Ri from "react-icons/ri";
import * as Ti from "react-icons/ti";
import * as Fa from "react-icons/fa"
import * as Im from "react-icons/im";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


function Quest_response() {
    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState()
    const [isLoadingQuest, setLoadingQuest] = useState(true)
    const [quest, setQuest] = useState()
    const {id} = useParams();
    const [answers, setAnswer] = useState()
    var answer = [];
    var type;
    var number

    useEffect(()=>{
        axios
            .get("http://localhost:8000/api/questionnaire/"+id)
            .then((res) => {
                setQuest(res.data)
                type = res.data.questiontype;
                number = res.data.questionsize;
                setLoadingQuest(false)
            })

        axios
            .get("http://localhost:8000/api/questionnaire/" + id + "/answered", {withCredentials:true})
            .then((res)=>{
                setData(res.data)
                if(type == "mc"){
                    for(var i = 0; i < number; i++){
                        answer[i] = {
                            A : 0,
                            B : 0,
                            C : 0,
                            D : 0,
                            total : 0
                        }
                    }
                    for(var i = 0 ; i < number; i++){
                        for(var j = 0; j < res.data.length; j++){
                            if(res.data[j].Ans.split(";")[i] == "A"){
                                answer[i].A += 1
                                answer[i].total += 1
                            }else if(res.data[j].Ans.split(";")[i] == "B"){
                                answer[i].B += 1
                                answer[i].total += 1
                            }else if(res.data[j].Ans.split(";")[i] == "C"){
                                answer[i].C += 1
                                answer[i].total += 1
                            }else if(res.data[j].Ans.split(";")[i] == "D"){
                                answer[i].D += 1
                                answer[i].total += 1
                            }
                        }
                    } 
                }

                if(type == "sc"){
                    for(var i = 0; i < number; i++){
                        answer[i] = {
                            "1" : 0,
                            "2" : 0,
                            "3" : 0,
                            "4" : 0,
                            "5" : 0,
                            "6" : 0,
                            "7" : 0,
                            "8" : 0,
                            "9" : 0,
                            "10" : 0,
                            total : 0
                        }
                    }
                    for(var i = 0 ; i < number; i++){
                        for(var j = 0; j < res.data.length; j++){
                            if(res.data[j].Ans.split(";")[i] == "1"){
                                answer[i]["1"] += 1
                                answer[i].total += 1
                            }else if(res.data[j].Ans.split(";")[i] == "2"){
                                answer[i]["2"] += 1
                                answer[i].total += 2
                            }else if(res.data[j].Ans.split(";")[i] == "3"){
                                answer[i]["3"] += 1
                                answer[i].total += 3
                            }else if(res.data[j].Ans.split(";")[i] == "4"){
                                answer[i]["4"] += 1
                                answer[i].total += 4
                            }else if(res.data[j].Ans.split(";")[i] == "5"){
                                answer[i]["5"] += 1
                                answer[i].total += 5
                            }else if(res.data[j].Ans.split(";")[i] == "6"){
                                answer[i]["6"] += 1
                                answer[i].total += 6
                            }else if(res.data[j].Ans.split(";")[i] == "7"){
                                answer[i]["7"] += 1
                                answer[i].total += 7
                            }else if(res.data[j].Ans.split(";")[i] == "8"){
                                answer[i]["8"] += 1
                                answer[i].total += 8
                            }else if(res.data[j].Ans.split(";")[i] == "9"){
                                answer[i]["9"] += 1
                                answer[i].total += 9
                            }else if(res.data[j].Ans.split(";")[i] == "10"){
                                answer[i]["10"] += 1
                                answer[i].total += 10
                            }
                        }
                    } 
                }

            })
            .then(() => {
                setAnswer(answer)
                setLoading(false)
            })
    },[])


    if(isLoading || isLoadingQuest){
        return (<>is Loading</>)
    }

    if(!isLoading && !isLoadingQuest){
        var number = quest.questionsize;
        var type = quest.questiontype;
        var question = quest.question.split(";")

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

            <section className="quest_response">

                <div className="quest_select_title">
                    <p>Questionnaire Analysis</p>
                    <button type="button" className="quest_back_button" onClick={()=> window.location.pathname="/question/edit"}>Back</button>
                </div>

                <hr className="quest_select_line"></hr>
                {type == "sc" && data.length == 0 && <div className="quest_no_response">No response</div>}
                {type == "sc" && data.length != 0 && <div style={{"textAlign" : "center", "marginTop": "2vw"}}>Respondent: {data.length}</div>}
                {type == "sc" && data.length != 0 && question.map((element, index) => 
                <div className="quest_analysis">
                    <table className="sc_question">
                        <tbody>
                            <tr>
                                <td>Question {index+1}:</td>
                                <td>{element}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="quest_sc_analysis">
                        <tbody>
                        <tr>
                            <td>Score</td>
                            <td>1</td>
                            <td>2</td>
                            <td>3</td>
                            <td>4</td>
                            <td>5</td>
                            <td>6</td>
                            <td>7</td>
                            <td>8</td>
                            <td>9</td>
                            <td>10</td>
                            <td>Mean</td>
                        </tr><tr>
                            <td>no. of respondent</td>
                            <td>{answers[index]["1"]}</td>
                            <td>{answers[index]["2"]}</td>
                            <td>{answers[index]["3"]}</td>
                            <td>{answers[index]["4"]}</td>
                            <td>{answers[index]["5"]}</td>
                            <td>{answers[index]["6"]}</td>
                            <td>{answers[index]["7"]}</td>
                            <td>{answers[index]["8"]}</td>
                            <td>{answers[index]["9"]}</td>
                            <td>{answers[index]["10"]}</td>
                            <td>{(answers[index].total/data.length).toFixed(2)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                )}
                

                {type == "lq" && data.length == 0 && <div className="quest_no_response">No response</div>}
                {type == "lq" && data.length != 0 && <div style={{"textAlign" : "center", "marginTop": "2vw"}}>Respondent: {data.length}</div>}
                {type == "lq" && data.length != 0 && question.map((element, index) => 
                    <div className="quest_analysis">
                        <table className="quest_lq_analysis">
                            <tbody>
                                <tr>
                                    <td>Question {index + 1}:</td>
                                    <td>{element}</td>
                                </tr>
                                <tr>
                                    <td>Response</td>
                                    <td></td>
                                </tr>
                                {data.map((elementAns, indexAns) => 
                                    <tr>
                                        <td>{indexAns + 1}</td>
                                        <td>{elementAns.Ans.split(";")[index]}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}


                
                {type == "mc" && answers[0].total == 0 && <div className="quest_no_response">No response</div>}
                {type == "mc" && answers[0].total != 0 && <div style={{"textAlign" : "center", "marginTop": "2vw"}}>Respondent: {answers[0].total}</div>}
                {type == "mc" && answers[0].total != 0 && question.map((element, index) => 
                
                <div className="quest_analysis">
                    <table className="quest_mc_analysis">
                        <tbody>
                        <tr>
                            <td>Question {index + 1}:</td>
                            <td>{element.split(",")[0]}</td>
                            <td>Selected</td>
                        </tr>
                        <tr>
                            <td>A</td>
                            <td>{element.split(",")[1]}</td>
                            <td>{((answers[index].A/answers[index].total) * 100).toFixed(2) + "%"}</td>
                        </tr>
                        <tr>
                            <td>B</td>
                            <td>{element.split(",")[2]}</td>
                            <td>{((answers[index].B/answers[index].total) * 100).toFixed(2) + "%"}</td>
                        </tr>
                        <tr>
                            <td>C</td>
                            <td>{element.split(",")[3]}</td>
                            <td>{((answers[index].C/answers[index].total) * 100).toFixed(2) + "%"}</td>
                        </tr>
                        <tr>
                            <td>D</td>
                            <td>{element.split(",")[4]}</td>
                            <td>{((answers[index].D/answers[index].total) * 100).toFixed(2) + "%"}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                )}

            </section>
        </div>
        )
    }
  }
  
  export default Quest_response;



