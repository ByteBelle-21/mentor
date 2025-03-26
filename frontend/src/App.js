import './App.css';
import Homepage from './homepage';
import Channels from './channels';
import Navlink from './navlink';
import Profile from './profile';
import { Navigate } from 'react-router-dom'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';

function App() {
    window.BASE_URL = 'https://psutar9920-4000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/';

    const [access, setAccess] = useState(false);
    const [user, setUser] = useState('');

    const authenticate = (hasAccess, currUser)=>{
        setAccess(hasAccess);
        setUser(currUser);
    }

    const removeAuthentication = () =>{
        setAccess(false);
        setUser('');
        sessionStorage.removeItem('session_user');
    }

    useEffect(()=>{
        if(user){
            sessionStorage.setItem('session_user', user);
        }
        else{
            sessionStorage.removeItem('session_user');
        }
    });


    return (
        <>
            <Router>
            <Navlink removeAccess={removeAuthentication}></Navlink> 
            <Routes>
                <Route path="/" element={<Homepage  giveAccess={authenticate}/>}/>
                <Route path="/channels" element={ access ? <Channels/> : <Navigate to="/"/>}/>
                <Route path="/profile" element={access ? <Profile/> :<Navigate to="/"/> }/>
            </Routes>
            </Router>
        </>
  );
}

export default App;
