import React, { Component } from 'react';
import './Application.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'
import Login from './pages/Login'
import App from './App'

class Application extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path='/login' element={<Login />}>{}</Route>
          <Route path='/home' element={<App />}>{}</Route>
        </Routes>
      </Router>
    )
  }
}

export default Application;

