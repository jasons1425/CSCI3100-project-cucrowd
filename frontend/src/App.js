import './App.css';
import axios from "axios";
import Sidebar from './components/sidebar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom' 
import Home from './pages/Home'; 
import Questionnaire from './pages/Questionnaire'
import Questionnaire_details from './pages/Questionnaire_details'
import Exp from './pages/Exp';
import Login from './pages/Login';
import Forgotpw from './pages/Forgotpw';
import Resetpw from './pages/Resetpw'
import Signup from './pages/Signup'
import Team from './pages/Team'
import Team_details from './pages/Team_details'
import Team_edit from './pages/Team_edit'
import Questionnaire_edit from './pages/Questionnaire_edit'
import Questionnaire_add from './pages/Questionnaire_add'
import Team_add from './pages/Team_add'
import Team_edit_post from './pages/Team_edit_post'
import Exp_add from './pages/Exp_add';
import Exp_create from './pages/Exp_create';
import Exp_edit from './pages/Exp_edit';
import Exp_response from './pages/Exp_response'
import Exp_detail from './pages/Exp_detail'
import Team_response from './pages/Team_response'
import Profile from './pages/Profile'
import Stu_profile from './pages/Stu_profile';
import Org_profile from './pages/Org_profile';
import Quest_response from './pages/Questionnaire_response'

import { useEffect, useState } from 'react';

function App() {
  const [isLoading, setLoading] = useState(true);
  const [login, setLogin] = useState();
  
  useEffect(() => {
    axios
        .get("http://localhost:8000/api/login", {withCredentials : true})
        .then((res) => {
            setLogin(res.data.isAuthenticated);
            setLoading(false);
        })
  },[])
  
  if(isLoading){
    return <div>Is Loading~ Please wait</div>
  }

  if(!login){
    return (
      <div>
        <div>
          <Router>
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/forgetpd' element={<Forgotpw />} />
              <Route path='/resetpassword' element={<Resetpw />} />
              <Route path='*' element={<Not_Found/>} />
            </Routes>
          </Router>
        </div>
      </div>
    )
  }else{
    return (
      <>
      <div className='App'>
        <Router>
          <Sidebar />
          <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/profile' element={<Profile/>} />
            <Route path='/profile/:username/:feature/:id' element={<Stu_profile/>} />
            <Route path='/experiments/:id/:username' element={<Org_profile/>} />
            <Route path='/experiments' element={<Exp/>} />
            <Route path='/experiments/:id' element={<Exp_detail/>} />
            <Route path='/experiments/add' element={<Exp_add/>} />
            <Route path='/experiments/add/create' element={<Exp_create/>} />
            <Route path='/experiments/add/edit:id' element={<Exp_edit/>} />
            <Route path='/experiments/add/response:id' element={<Exp_response/>} />
            <Route path='/question' element={<Questionnaire/>} />
            <Route path='/question/:id' element={<Questionnaire_details/>} />
            <Route path='/question/edit' element={<Questionnaire_edit/>} />          
            <Route path='/question/add' element={<Questionnaire_add/>} /> 
            <Route path='/question/response/:id' element={<Quest_response/>} /> 
            <Route path='/team' element={<Team/>} />
            <Route path='/team/:id' element={<Team_details/>} />
            <Route path='/team/edit' element={<Team_edit/>} />
            <Route path='/team/add' element={<Team_add/>} />
            <Route path='/team/edit/:id' element={<Team_edit_post/>} />
            <Route path='/team/response/:id' element={<Team_response/>} />
            
            <Route path='/resetpassword' element={<Resetpw />} />
            <Route path='*' element={<div style={{"margin-left": "11vw"}}>404 Not Found</div>} />
          </Routes>
        </Router>
      </div> 
      </>
    );

  }
}
export default App;

function Not_Found(){
  window.location.pathname="/";
}