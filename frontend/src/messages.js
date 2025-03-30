import './messages.css';
import './channels.css';
import Button from 'react-bootstrap/Button';
import './homepage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import TextareaAutosize from 'react-textarea-autosize';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Picker from '@emoji-mart/react';
import Popover from 'react-bootstrap/Popover';
import Badge from 'react-bootstrap/Badge';               
import FloatingLabel from 'react-bootstrap/FloatingLabel';


function Messages(){

    const location = useLocation();
    const {username, userId, currUserId} = location.state || {};

    const [connections, setConnections] =  useState([]);
    const getAllConnections = async(currUser) =>{
        try {
            const response =  await axios.get(`${window.BASE_URL}/getConnectedUsers`,{ params: {userId: currUser}});
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


    const [connectedUserDetails, setConnectedUserDetails ] = useState([]);

    useEffect(()=>{
        console.log("connected users details is ", connectedUserDetails.userInfo);
    },[]);    

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

    const [allMessages, setAllMessages] = useState([]);

    useEffect(()=>{
        console.log("Successfully retrived all messages", allMessages);
    },[]);

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



    useEffect(()=>{
        getAllConnections(currUserId);
        getConnectedUserDetails(username);
        getAllMessages(userId);
    })

    const showPreview =(text, num)=>{
        const words = text.split(' ');
        return words.slice(0, num).join(' ')+" . . . . . . . .";
    }

    return(
        <div className="message-page">    
            <div className='small-container'>
                <ListGroup variant="flush" className='channel-list' >
                    <ListGroup.Item style={{fontWeight:'bold'}}># • Direct Messages</ListGroup.Item>
                    {connections.length > 0 && connections.map((user)=>(
                        <ListGroup.Item className='message-item'>
                            <img src={user.avatar} style={{width:'2vw', marginRight:'0.5vw'}}></img>
                            <p style={{margin:'0'}}>{user.name}<p className="view-profile-button">{user.name}</p></p>
                            <p className='ms-auto view-profile-button'>Message</p>
                        </ListGroup.Item>
                    ))}
                     <ListGroup.Item className='message-item'>
                        <img src="/Avatars.png" style={{width:'2vw', marginRight:'0.5vw'}}></img>
                        <p style={{margin:'0'}}>rgewrgw<p className="view-profile-button">rvwtertebtew</p></p>
                        <p className='ms-auto view-profile-button'>View messages</p>
                    </ListGroup.Item>
                </ListGroup>
            </div>
            <div className='large-container'>
                  
            {allMessages.length > 0 && allMessages.map((message)=>{
                return(
                    message.senderId === connectedUserDetails.userInfo.id ?
                    <div className='received-msg'>
                        <p>{message.message}</p>
                    </div>
                    :
                    <div className='sent-msg'>
                        <p>{message.message}</p>
                    </div>
                );   
            })
            }
            </div>
            <div className='small-container'>
            {connectedUserDetails.userInfo &&
                    <>
                        <img src={connectedUserDetails.userInfo.avatar} className='canvas-img'></img>
                        <p style={{fontWeight:'bold', margin:'0'}}>@{connectedUserDetails.userInfo.username}</p>
                        <p>{connectedUserDetails.userInfo.name}</p>
                        <p>Hello {currUserDetails.name}! 👋 Nice to meet you.I am {connectedUserDetails.userInfo.profession}! Lets connect and share our ideas.</p>
                        <Button className='send-message-button'>Send Message</Button>
                        <hr style={{width:'90%'}}></hr>
                        <p style={{fontWeight:'bold'}}>Here are some details about me:</p>
                        <Stack direction="horizontal" className='info-stack'>
                            <Stack className='info-block'> 
                                <p style={{margin:'0', fontWeight:'bold'}}>{connectedUserDetails.userInfo.totalPosts}</p>
                                <p>Posts</p>
                            </Stack>
                            <Stack className='info-block'>
                                <p style={{margin:'0', fontWeight:'bold'}}>{connectedUserDetails.userInfo.connections}</p>
                                <p>Connections</p>
                            </Stack>
                            <Stack className='info-block'>
                                <p style={{margin:'0', fontWeight:'bold'}}>Begginer</p>
                                <p>Experties</p>
                            </Stack>
                        </Stack>
                        {connectedUserDetails.media.length >  0 &&
                            <>
                                <p style={{fontWeight:'bold', marginTop:'1vw'}}>You can follow me on </p>
                                <Stack direction='horizontal' style={{marginBottom:'1vw'}}>
                                    {connectedUserDetails.media.map((account)=>{
                                        <Nav.Link >
                                            <Image  src={account.image}  className="social-media-img"  roundedCircle />
                                        </Nav.Link>
                                        
                                    })}
                                </Stack>
                            </>
                        }
                        <hr style={{width:'90%'}}></hr>
                        {connectedUserDetails.post.length >  0 && 
                            <>
                            <p style={{fontWeight:'bold', marginTop:'0.5vw'}}>Check Out My Journey</p>
                            <ListGroup className='history-list'>
                                {connectedUserDetails.post.map((post)=>{
                                    <ListGroup.Item as="li" className='activity-list-item'>
                                        <div className="fw-bold" style={{color:'#d84434'}}>{post.channel}</div> 
                                        <p style={{fontSize:'small'}} >{showPreview(post.data,10)}</p>                                            <p style={{fontSize:'small'}} >{showPreview(post.data,10)}</p>
                                    </ListGroup.Item>
                                })}
                            </ListGroup>
                            </>
                        }
                    </>
                }
            </div>
        </div>
    );

}

export default Messages;