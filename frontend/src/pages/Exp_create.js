import React from 'react'
import * as Ai from "react-icons/ai";
import './Exp_create.css'
import axios from "axios";
function Exp_create() {

  const job=[                                             
    {"code":"Architecture_Surveying", "display":"Architecture / Surveying"},
    {"code":"Accounting_Auditing_Taxation", "display":"Accounting / Auditing / Taxation"},
    {"code":"Administration_Management", "display":"Administration / Management"},
    {"code":"Advertising_Public Relations", "display":"Advertising / Public Relations"},
    {"code":"Art_Design", "display":"Art / Design"},
    {"code":"Banking_Finance","display": "Banking / Finance"},           
    {"code":"Business_Consultant","display": "Business Consultant"},            
    {"code":"Civil_Engineering","display": "Civil Engineering"},                                        
    {"code":"Clerical_Assistant_Office Routine","display": "Clerical / Assistant / Office Routine"},
    {"code":"Community_Service", "display":"Community Service"},
    {"code":"Computer_Engineering_Informatio_Technology_eBusiness","display": "Computer Engineering / Information Technology / eBusiness"},
    {"code":"Customer_Service","display": "Customer Service"},
    {"code":"Disciplined_Services","display": "Disciplined Services"},
    {"code":"Electrical_Electronic_Engineering", "display":"Electrical / Electronic Engineering"},
    {"code":"Environmental_Protection","display": "Environmental Protection"},
    {"code":"Healthcare", "display":"Healthcare"},
    {"code":"Human_Resources_Training","display": "Human Resources / Training"},
    {"code":"Industrial_Engineering","display": "Industrial Engineering"},            
    {"code":"Insurance","display": "Insurance"},            
    {"code":"Legal_Services","display": "Legal Services"},            
    {"code":"Logistics_Transportation", "display":"Logistics / Transportation"},            
    {"code":"Mechanical_Engineering", "display":"Mechanical Engineering"},           
    {"code":"Media_Communication_Authors_Journalist", "display":"Media / Communication / Authors / Journalist"},
    {"code":"Other_Professional_Services", "display":"Other Professional Services"},                                        
    {"code":"Pharmacy", "display":"Pharmacy"},
    {"code":"Programming_System Analysis", "display":"Programming / System Analysis"},
    {"code":"Property_Real Estate Management", "display":"Property / Real Estate Management"},
    {"code":"Publication","display": "Publication"},
    {"code":"Purchasing_Merchandizing","display": "Purchasing / Merchandizing"},
    {"code":"Office_Routine","display": "Office Routine"},
    {"code":"Religious_Work","display": "Religious Work"},
    {"code":"Retail_Management","display": "Retail Management"},
    {"code":"Sales_Marketing","display": "Sales & Marketing"},
    {"code":"Scientific_Research_Work","display": "Scientific & Research Work"},
    {"code":"Secretarial_Executive_Assistant_Personal Assistant", "display":"Secretarial / Executive Assistant / Personal Assistant"},
    {"code":"Social_Work","display": "Social Work"},
    {"code":"Statistics","display": "Statistics"},
    {"code":"Teaching_Others","display": "Teaching: Others"},
    {"code":"Teaching_Primary","display":"Teaching: Primary"},
    {"code":"Teaching_Private_Tuition","display": "Teaching: Private Tuition"},
    {"code":"Teaching_Secondary","display": "Teaching: Secondary"},
    {"code":"Technical_Support","display": "Technical Support"},
    {"code":"Telecommunication_Engineering","display": "Telecommunication Engineering"},
    {"code":"Translation","display": "Translation"},
    {"code":"others","display": "others"},
]

function create(){
  let missing=0;
  if (document.getElementById("exp_title").value==""){
    document.getElementById("exp_title").style.borderColor="red";
    missing=1;
  }else{
    document.getElementById("exp_title").style.borderColor="black";
  }
  if (document.getElementById("subtitle").value==""){
    document.getElementById("subtitle").style.borderColor="red";
    missing=1;
  }else{
    document.getElementById("subtitle").style.borderColor="black";
  }
  if (document.getElementById("target").value==""){
    document.getElementById("target").style.borderColor="red";
    missing=1;
  }else{
    document.getElementById("target").style.borderColor="black";
  }
  if (document.getElementById("jobs").value==""){
    document.getElementById("jobs").style.borderColor="red";
    missing=1;
  }else{
    document.getElementById("jobs").style.borderColor="black";
  }
  if (document.getElementById("types").value==""){
    document.getElementById("types").style.borderColor="red";
    missing=1;
  }else{
    document.getElementById("types").style.borderColor="black";
  }
  if (document.getElementById("duration").value==""){
    document.getElementById("duration").style.borderColor="red";
    missing=1;
  }else{
    document.getElementById("duration").style.borderColor="black";
  }
  if (document.getElementById("salary").value==""){
    document.getElementById("salary").style.borderColor="red";
    missing=1;
  }else{
    document.getElementById("salary").style.borderColor="black";
  }
  if (document.getElementById("venue").value==""){
    document.getElementById("venue").style.borderColor="red";
    missing=1;
  }else{
    document.getElementById("venue").style.borderColor="black";
  }
  if (document.getElementById("deadline").value==""){
    document.getElementById("deadline").style.borderColor="red";
    missing=1;
  }else{
    document.getElementById("deadline").style.borderColor="black";
  }
  if (document.getElementById("vacancy").value==""){
    document.getElementById("vacancy").style.borderColor="red";
    missing=1;
  }else{
    document.getElementById("vacancy").style.borderColor="black";
  }
  if (document.getElementById("description").value==""){
    document.getElementById("description").style.borderColor="red";
    missing=1;
  }else{
    document.getElementById("description").style.borderColor="black";
  }
  if (document.getElementById("timeslot").value==""){
    document.getElementById("timeslot").style.borderColor="red";
    missing=1;
  }else{
    document.getElementById("timeslot").style.borderColor="black";
  }




  //console.log(job);
  console.log(document.getElementById("exp_title").value);
  console.log(document.getElementById("subtitle").value);
  console.log(document.getElementById("target").value);
  console.log(document.getElementById("jobs").value);
  console.log(document.getElementById("types").value);
  console.log(document.getElementById("duration").value);
  console.log(document.getElementById("salary").value);
  console.log(document.getElementById("venue").value);
  console.log(document.getElementById("deadline").value);
  console.log(document.getElementById("vacancy").value);
  console.log(document.getElementById("description").value);
  console.log(document.getElementById("timeslot").value);

  if(missing==1){
   alert("Missing required fields")
  }
  if(missing==0){
  submit_exp();
  }
}
function submit_exp(){

  let payload;
  if(document.getElementById("requirements").value==""){
      payload = {
      title: document.getElementById("exp_title").value,
      subtitle: document.getElementById("subtitle").value,
      target: document.getElementById("target").value,
      job_nature: document.getElementById("jobs").value,
      type: document.getElementById("types").value,
      duration: document.getElementById("duration").value,
      salary: document.getElementById("salary").value,
      venue: document.getElementById("venue").value,
      deadline: document.getElementById("deadline").value,
      vacancy:document.getElementById("vacancy").value,
      description: document.getElementById("description").value,
      timeslots:document.getElementById("timeslot").value,
  };
  }else{
    payload = {
      title: document.getElementById("exp_title").value,
      subtitle: document.getElementById("subtitle").value,
      target: document.getElementById("target").value,
      job_nature: document.getElementById("jobs").value,
      type: document.getElementById("types").value,
      duration: document.getElementById("duration").value,
      salary: document.getElementById("salary").value,
      venue: document.getElementById("venue").value,
      deadline: document.getElementById("deadline").value,
      vacancy:document.getElementById("vacancy").value,
      description: document.getElementById("description").value,
      timeslots:document.getElementById("timeslot").value,
      requirements:document.getElementById("requirements").value,
  }
}
  
  axios.post('http://localhost:8000/api/experiment/', payload, {withCredentials : true})
  .then((response)=>{
    console.log(response.data.id)
    let formData = new FormData();
    let image = document.querySelector('#image');
    formData.append("exp_img", image.files[0]);
    axios.put('http://localhost:8000/api/experiment/'+response.data.id, formData, {withCredentials : true},{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    alert("Created Post Successfully ")
    window.location.pathname='/experiments/add';
  })
  .catch((error)=>{
    console.log(error)
    if(error.response.data.vacancy!=null&&error.response.data.timeslots!=null&&error.response.data.deadline!=null){
    alert("Vancancy: "+ error.response.data.vacancy+"\n"+"TimeSlots: "+error.response.data.timeslots+"\n"+"Deadline: "+error.response.data.deadline
      )
    }
    if(error.response.data.vacancy!=null&&error.response.data.timeslots!=null&&error.response.data.deadline==null){
      alert("Vancancy: "+ error.response.data.vacancy+"\n"+"TimeSlots: "+error.response.data.timeslots+"\n"
        )
      }
      if(error.response.data.vacancy!=null&&error.response.data.deadline!=null&&error.response.data.timeslots==null){
        alert("Vancancy: "+ error.response.data.vacancy+"\n"+"Deadline: "+error.response.data.deadline+"\n"
          )
        }
        if(error.response.data.deadline!=null&&error.response.data.timeslots!=null&&error.response.data.vacancy==null){
          alert("TimeSlots: "+ error.response.data.timeslots+"\n"+"Deadline: "+error.response.data.deadline+"\n"
            )
          }
          if(error.response.data.vacancy!=null&&error.response.data.deadline==null&&error.response.data.timeslots==null){
            alert("Vancancy: "+ error.response.data.vacancy
              )
            }
            if(error.response.data.timeslots!=null&&error.response.data.deadline==null&&error.response.data.vacancy==null){
              alert("TimeSlots: "+ error.response.data.timeslots
                )
              }
              if(error.response.data.deadline!=null&&error.response.data.timeslots==null&&error.response.data.vacancy==null){
                alert("deadline: "+ error.response.data.deadline
                  )
                }
  })
}

  function reset(){
    document.getElementById("exp_title").value="";
    document.getElementById("subtitle").value="";
    document.getElementById("target").value="";
    document.getElementById("jobs").value="";
    document.getElementById("types").value="";
    document.getElementById("duration").value="";
    document.getElementById("salary").value="";
    document.getElementById("venue").value="";
    document.getElementById("deadline").value="";
    document.getElementById("vacancy").value="";
    document.getElementById("description").value="";
    document.getElementById("timeslot").value="";
    document.getElementById("requirements").value="";
  }

  try{
  return (
      <>
    <div className="banner">
      <div className='icon'><Ai.AiTwotoneExperiment /> </div>
      <div className='title1'>Experiments</div>
    </div>

    <div className='exp_form'>
        <div id='icon'>CU CROWD</div>
        <form>
        <label>Title:
        <input type="text" name="title" id="exp_title"  required/>
        </label><br/>

        <label >Subtitle:
        <input type="text" name="subtitle" id="subtitle" required/>
        </label><br/>

        <label >Target:
        <input type="text" name="target" id="target" required/>
        </label>

        <label style={{marginLeft:"0.8vw"}}>Duration:
        <input type="text" name="duration" id="duration" required/>
        </label><br/>

        <label>Job Nature:</label>
        <select name="jobs" id="jobs" form="jobform" style={{margin:"0.8vw"}} required>
        {job.map(item=>(
        <option value={item.code}>{item.display}</option>
        ))}
        </select>

        <label style={{marginLeft:"0.8vw"}}>Type:</label>
        <select name="types" id="types" form="typeform" style={{margin:"0.8vw"}} required>
        <option value="FT">FullTime</option>
        <option value="PT">PartTime</option>
        <option value="Intern">Internship</option>
        <option value="NA">Other</option>
        </select><br/>

        <label>Salary:
        <input type="text" name="salary" id="salary" required/>
        </label>

        <label style={{marginLeft:"0.8vw"}}>Deadline</label>
        <input type="date" id="deadline" name="deadline"
        min="2022-04-01" max="2023-3-31" required/><br/>

        <label >Venue:
        <input type="text" name="venue" id="venue" required/>
        </label><br/>
        
        <label>Vacancy:
        <input type="text" name="vacancy" id="vacancy" required/>
        </label>

        <label style={{marginLeft:"0.8vw"}} for="image">Image:</label>
        <input type="file" name="image" id="image" /><br />

        
        <label>Description:</label><br/>
        <textarea rows="15" cols="165" name="description" id="description" form="usrform" required></textarea>
        <br/>

        <label>Requirements: </label> <br/>
        <textarea rows="10" cols="165" name="requirements" id="requirements" form="requirementform"></textarea><br/>
        
        <label>TimeSlot (Enter each allowed time delimited by `;`, e.g. 2022-03-27-16:00;2022-03-28-17:00):</label><br/>
        <textarea rows="12" cols="165" name="timeslot" id="timeslot" form="timeslotform" required></textarea>
        <br/>

        
        </form>
        <div style={{display:"flex"}}>
        <button className='back_exp' onClick={()=>{window.location.pathname='/experiments/add';}}>Back</button>
        <button className='reset_exp' onClick={()=>reset()}>Reset</button>
        <button className='create_exp' onClick={()=>create()}>Create</button>
        </div>
    </div> 
    </>
  )
}catch(e){
  return("");
}
}

export default Exp_create
