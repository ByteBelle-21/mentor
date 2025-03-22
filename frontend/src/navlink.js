import { use } from 'react';
import { useLocation } from 'react-router-dom'; 
import './homepage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Carousel from 'react-bootstrap/Carousel';
import { useState, useRef } from 'react';
import Nav from 'react-bootstrap/Nav';


function Navlink(){
    const location = useLocation();
    const isLandingPage = location.pathname === "/";


    const [showSearchModal, setShowSearchModal] = useState(false);

    const openSearchModal =()=>{
        setShowSearchModal(true);
    }

    const closeSearchModal = ()=>{
        setShowSearchModal(false);
    }

    return(
        <>
         {!isLandingPage ?  
            <Stack direction='horizontal' className='second-navbar' style={{alignItems:'center', height:'6vh'}}>
                <span class="material-symbols-outlined icons" style={{fontSize:'2vw', margin:'0', padding:'0', color:'#f86714'}}>groups</span>
                <Nav.Link style={{fontFamily:'Spicy Rice', fontSize:'1.4vw', margin:'0', paddingLeft:'0.3vw', color:'#fc0380'}}>AskMentor</Nav.Link >
                <Nav.Link  className='ms-auto' style={{ margin:'0',paddingLeft:'4vw', fontWeight:'bold'}}>All Channels</Nav.Link >
                <Nav.Link  style={{ margin:'0', paddingLeft:'2vw', fontWeight:'bold'}}>Messages</Nav.Link >
                <Nav.Link  style={{ margin:'0', paddingLeft:'2vw', fontWeight:'bold'}}>Profile</Nav.Link >
                <Nav.Link  style={{ margin:'0', paddingLeft:'2vw',paddingRight:'2vw', fontWeight:'bold'}} onClick={openSearchModal}>Search</Nav.Link >
                <Modal
                    show={showSearchModal} 
                    onHide={closeSearchModal}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    >
                    <Form className='join-form'>
                        <Stack direction='horizontal' gap={2} className='title_stack' >
                            <span class="material-symbols-outlined icons" style={{fontSize:'2vw'}}>groups</span>
                            Search Post, Channel and People
                        </Stack>
                        <Form.Group className='form-group' style={{marginTop:'1vw'}}>
                            <Form.Label >
                                Select Category
                            </Form.Label>
                            <Form.Select aria-label="Default select example" style={{borderColor:'blue'}}>
                                <option>Open this select menu</option>
                                <option value="1">Post</option>
                                <option value="2">People</option>
                                <option value="3">Channel</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className='form-group'>
                            <Form.Label >
                                Put what you remember 
                            </Form.Label>
                            <Form.Control style={{borderColor:'red'}}/>
                        </Form.Group>
                        <div className='search-results'>
                            <p style={{fontWeight:'bold'}}># Search Results</p>
                            <hr style={{margin:'0'}}></hr>
                            <div className='search-result-block'>

                            </div>
                        </div>
                    </Form>
                   
                </Modal>
                <Button className='logout-button'>Log Out</Button>
            </Stack>    
            
            :<></>}
        </>
       
    )
}

    

export default Navlink;