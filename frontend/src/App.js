import logo from './logo.svg';
import './App.css';
import Homepage from './homepage';
import Channels from './channels';
import Navlink from './navlink';
import Profile from './profile';
import { useLocation } from 'react-router-dom'; 

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
    <Router>
      <Navlink></Navlink> 
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/channels" element={<Channels/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
