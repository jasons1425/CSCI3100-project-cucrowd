import './App.css';
import axios from "axios";
import Sidebar from './components/sidebar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom' 
import Home from './pages/Home'; 
import Quest from './pages/Questionnaire';
import Exp from './pages/Exp';
import Exp_detail from './pages/Exp_detail'
import Login from './pages/Login'
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
    return <div></div>
  }

  if(!login){
    return (
      <div id="main">
      <div className='Login'> 
        <Login />
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
            <Route path='/experiments' element={<Exp/>} />
            <Route path='/experiments/:id' element={<Exp_detail/>} />
            <Route path='/question' element={<Quest/>} />
          </Routes>
        </Router>
      </div> 
      </>
    );

  }
}
export default App;
