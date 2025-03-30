import './profile.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/esm/Stack';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import { useState, useRef, useEffect } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import TextareaAutosize from 'react-textarea-autosize';
import Image from 'react-bootstrap/Image';
import axios from 'axios';
import {useLocation } from 'react-router-dom';

function Profile(){
    useEffect(()=>{
        getCurrUserDertails();
        getAllConnections();
    },[]);


    const [showMediaModal, setShowMediaModal] = useState(false);

    const openMediaModal =()=>{
        setShowMediaModal(true);
    }

    const closeMediaModal = ()=>{
        setShowMediaModal(false);
    }


    const[currUserDetails, setCurrUserDetails] = useState([]);
    const getCurrUserDertails = async() =>{
        const username  =  sessionStorage.getItem('session_user');
        const data = { username };
        try {
            const response =  await axios.post(`${window.BASE_URL}/getUserDetails`, data);
            if (response.status === 200) {
                setCurrUserDetails(response.data.userInfo);
                console.log("Successfully retrieved current user details");
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during retriving current user details: ",error);
        }
    }

  
    const [connections, setConnections] =  useState([]);
    const getAllConnections = async() =>{
        try {
            const response =  await axios.get(`${window.BASE_URL}/getConnectedUsers`,{ params: {userId: currUserDetails.id}});
            if (response.status === 200) {
                setConnections(response.data);
                console.log("Successfully retrieved all connections");
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during retriving all connections: ",error);
        }
    }



    const [showProfileCanvas, setShowProfileCanvas] = useState(false);

    const openProfileCanvas =()=>{
        setShowProfileCanvas(true);
    }

    const closeProfileCanvas = ()=>{
        setShowProfileCanvas(false);
    }

    const [connectedUserDetails, setConnectedUserDetails ] = useState([]);

    useEffect(()=>{
        console.log("connected users details is ", connectedUserDetails.userInfo);
    },[showProfileCanvas]);

    
    const getConnectedUserDetails = async(user) =>{
        const username  =  user;
        const data = { username };
        try {
            const response =  await axios.post(`${window.BASE_URL}/getUserDetails`, data);
            if (response.status === 200) {
                setConnectedUserDetails(response.data);
                console.log("Successfully retrieved connected  user details",connectedUserDetails);
                openProfileCanvas();
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during retriving connected user details: ",error);
        }
    }


    const [showMessageCanvas, setShowMessageCanvas] = useState(false); 

    const openMessageCanvas =()=>{
        closeProfileCanvas();
        setShowMessageCanvas(true);
    }

    const closeMessageCanvas = ()=>{
        setShowMessageCanvas(false);
    }

    const [currUsername, setCurrUsername] = useState('');
    const [currName, setCurrName] = useState('');
    const [currAvatar, setCurrAvatar] = useState('');
    const [allMessages, setAllMessages] = useState([]);

    useEffect(()=>{
        console.log("Successfully retrived all messages", allMessages);
    },[showMessageCanvas]);

    const getAllMessages = async(connectedUserId) =>{ 
        try {
            const response =  await axios.get(`${window.BASE_URL}/getAllMessages`, {
                params:{
                    currUser: sessionStorage.getItem('session_user') ,
                    otherUser : connectedUserId
                }
            });
            if (response.status === 200) {
                setAllMessages(response.data);
                console.log("Successfully retrieved all messages",setAllMessages);
                openMessageCanvas();
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during retriving all messages: ",error);
        }
    }


    const [showOverlay, setShowOverlay] = useState(false); 
    const target = useRef(null);


    const showPreview =(text, num)=>{
        const words = text.split(' ');
        return words.slice(0, num).join(' ')+" . . . . . . . .";
    }

    const [popularUsers, setPopularUsers] =  useState([]);
    const getAllPopularUsers = async() =>{
        const username  =  sessionStorage.getItem('session_user');
        try {
            const response =  await axios.get(`${window.BASE_URL}/activeUsers`, {
                params:{
                    currUser : username
                }
            });
            if (response.status === 200) {
                setPopularUsers(response.data);
                console.log("Successfully retrieved all popular users",response.data);
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during retriving all popular users: ",error);
        }
    }

    const [allPopularChannels, setAllPopularChannels] = useState([]);
    const getAllPopularChannels = async() =>{
        try {
            const response =  await axios.get(`${window.BASE_URL}/activeChannels`);
            if (response.status === 200) {
                setAllPopularChannels(response.data);
                console.log("Successfully retrieved all popular channels details");
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during retriving all popular channels details: ",error);
        }
    }

    useEffect(()=>{
        getAllPopularChannels();
        getAllPopularUsers();
    })

    const openCanvasOnOtherPage = (username)=>{
        const params = {
            userFromState: username,
        }
        navigateTo('/profile',{state:params});
    }

    return(
        <div className='profile-page'>
           <div className='first-container'>
                <h6 style={{fontWeight:'bold', marginLeft:'0.5vw'}}> # Suggested People for you</h6>
                <p style={{margin:'0', fontSize:'small',marginLeft:'0.5vw'}}>Discover and connect with professionals who align with your interests.</p>
                <ListGroup variant="flush" >
                    {popularUsers.length > 0 && popularUsers.map((user)=>(
                        <ListGroup.Item className='message-item'>
                            <img src={user.avatar} style={{width:'2vw', marginRight:'0.5vw'}}></img>
                            <p style={{margin:'0'}}>{user.name}<p className="view-profile-button" onClick={()=>getselectedUserDetails(user.username)}>View Profile</p></p>
                            <p className='ms-auto view-profile-button'  onClick={()=>openCanvasOnOtherPage(user.username)} >Message</p>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <hr></hr>
                <h6 style={{fontWeight:'bold', marginLeft:'0.5vw'}}> # Suggested Channels for you</h6>
                <p style={{margin:'0', fontSize:'small',marginLeft:'0.5vw'}}>Discover content from channels you'll love and engage with.</p>
                <ListGroup variant="flush" className='profile-channel-list'>
                    {allPopularChannels.length > 0 && allPopularChannels.map((channel)=>(
                         <ListGroup.Item className='channel-item'># • {channel.name}</ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
            <div className='profile-div'>
                <img src="1.png" style={{width:'7vw', margin:'1vw'}}></img>
                <Button className='edit-profile-btn'> Edit Profile</Button>
                <Stack direction="horizontal" className='info-stack' style={{marginTop:"2vw"}}>
                        <Stack className='info-block'> 
                            <p style={{margin:'0', fontWeight:'bold'}}>30</p>
                            <p>Posts</p>
                        </Stack>
                        <Stack className='info-block'>
                            <p style={{margin:'0', fontWeight:'bold'}}>30</p>
                            <p>Connections</p>
                        </Stack>
                       
                    </Stack>
                <div className='social-media-block'>
                    <Stack direction='horizontal'>
                        <p style={{fontWeight:'bold', margin:'0'}}># Add Scial Media</p>
                        <Nav.Link className='ms-auto' onClick={openMediaModal}><span class="material-symbols-outlined icons" >add</span></Nav.Link>
                        <Modal
                            show={showMediaModal} 
                            onHide={closeMediaModal}
                            size="md"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                            >
                            <Form className='join-form'>
                                <Stack direction='horizontal' gap={2} className='title_stack'>
                                    <span class="material-symbols-outlined icons" style={{fontSize:'2vw'}}>groups</span>
                                    Add Social Media Account 
                                </Stack>
                                <Form.Group className='form-group'>
                                    <Form.Label >
                                        Media 
                                    </Form.Label>
                                    <Form.Select aria-label="Default select example" style={{borderColor:'blue'}}>
                                        <option>Select media</option>
                                        <option value="1">Instagram</option>
                                        <option value="2">facebook</option>
                                        <option value="3">LinkedIn</option>
                                        <option value="4">Reddit</option>
                                        <option value="5">Youtube</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className='form-group'>
                                    <Form.Label >
                                        Account Link
                                    </Form.Label>
                                    <Form.Control style={{borderColor:'red'}}/>
                                </Form.Group>
                                <Stack direction='horizontal' gap={4}>
                                    <Button className='channel-form-button' onClick={closeMediaModal}>
                                        Cancel
                                    </Button>
                                    <Button className='channel-form-button' onClick={closeMediaModal}>
                                        Add
                                    </Button>
                                </Stack>
                            </Form>
                        </Modal>
                    </Stack>
                    <hr></hr>
                    <Stack direction='horizontal' className='media-item-stack'>
                        <img src="1.png" style={{width:'1.5vw', marginRight:'0.5vw'}}></img>
                        <p style={{margin:'0'}}>http/wjfhej/jrhdfgjher</p>
                        <Nav.Link className=' ms-auto'><span class="material-symbols-outlined icons" style={{fontSize:'1vw'}}>remove</span></Nav.Link>
                    </Stack>
                    <Stack direction='horizontal'className='media-item-stack'>
                        <img src="2.png" style={{width:'1.5vw', marginRight:'0.5vw'}}></img>
                        <p style={{margin:'0'}}>http/wjfhej/jrhdfgjher</p>
                        <Nav.Link className=' ms-auto'><span class="material-symbols-outlined icons" style={{fontSize:'1vw'}}>remove</span></Nav.Link>
                    </Stack>
                    <Stack direction='horizontal' className='media-item-stack'>
                        <img src="3.png" style={{width:'1.5vw', marginRight:'0.5vw'}}></img>
                        <p style={{margin:'0'}}>http/wjfhej/jrhdfgjher</p>
                        <Nav.Link className=' ms-auto'><span class="material-symbols-outlined icons" style={{fontSize:'1vw'}}>remove</span></Nav.Link>
                    </Stack>
                </div>
            </div>
            <div className='editable-profile'>
                <Form>
                    <Row className='mb-3'>
                        <Form.Group md='6' as={Col}>
                            <Form.Label>Name</Form.Label>
                            <Form.Control  
                                type="text"
                                placeholder="First name"
                                defaultValue="Mark"
                            />
                        </Form.Group>
                        <Form.Group md='4'  as={Col}>
                            <Form.Label>Username</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>@</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Username"
                                    required
                                />
                            </InputGroup>
                        </Form.Group>
                    </Row>
                    <Row className='mb-3'>
                        <Form.Group md='4' as={Col}>
                            <Form.Label>Email</Form.Label>
                            <Form.Control  
                                type="text"
                                placeholder="First name"
                                defaultValue="Mark"
                            />
                        </Form.Group>
                        <Form.Group md='4' as={Col}>
                            <Form.Label>Profession</Form.Label>
                            <Form.Control  
                                type="text"
                                placeholder="First name"
                                defaultValue="Mark"
                            />
                        </Form.Group>
                        <Form.Group md='4' as={Col}>
                            <Form.Label>Experties</Form.Label>
                            <Form.Control  
                                type="text"
                                placeholder="First name"
                                defaultValue="Beginner"
                            />
                        </Form.Group>
                    </Row>     
                    <Row className='mb-3'>
                        <Form.Group md='12' as={Col}>
                            <Form.Label>Skills</Form.Label>
                            <Form.Control  
                                type="text"
                                placeholder="First name"
                                defaultValue="Mark"
                            />
                        </Form.Group>
                    </Row>     
                </Form>
                <hr style={{marginBottom:'1vw', marginTop:'2vw'}}></hr>
                <p style={{fontWeight:'bold'}}># Activity History</p>
                <ListGroup className='history-list'>
                    <ListGroup.Item as="li" className='activity-list-item'>
                        <div className="fw-bold" style={{color:'#d84434'}}>channel name here </div>
                        <p style={{fontSize:'small'}} >mwjhfgwqhf wkfr kjwbfj fjh .......</p>
                    </ListGroup.Item>
                </ListGroup>
            </div>
        </div>
    )
}

export default Profile;