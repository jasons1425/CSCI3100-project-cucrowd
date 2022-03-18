import './App.css';
import Sidebar from './components/sidebar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom' 
import Home from './pages/Home'; 
import Quest from './pages/Quest';
import Exp from './pages/Exp';
function App() {
  return (
    <>
    <div className='App'>
      <Router>
        <Sidebar />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/experiments' element={<Exp/>} />
          <Route path='/question' element={<Quest/>} />
        </Routes>
      </Router>
    </div> 
    </>
  );
}

export default App;
