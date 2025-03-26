
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
import axios from 'axios';

function Channels(){

    useEffect(()=>{
        getCurrUserDertails();
        getAllChannels();
        getAllConnections();
    },[]);



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


    const[channels, setChannels] = useState([]);

    const getAllChannels = async() =>{
        try {
            const response =  await axios.get(`${window.BASE_URL}/getAllChannels`);
            if (response.status === 200) {
                setChannels(response.data);
                console.log("Successfully retrieved all channels details");
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during retriving all channels details: ",error);
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



    const [showChannelModal, setShowChannelModal] = useState(false);
    
    const openChannelModal =()=>{
        setShowChannelModal(true);
    }

    const closeChannelModal = ()=>{
        setShowChannelModal(false);
    }

    const [showPostModal, setShowPostModal] = useState(false);
    
    const openPostModal =()=>{
        setShowPostModal(true);
    }

    const closePostModal = ()=>{
        setShowPostModal(false);
    }

    const [showProfileCanvas, setShowProfileCanvas] = useState(false);

    const openProfileCanvas =()=>{
        closeMessageCanvas();
        setShowProfileCanvas(true);
    }

    const closeProfileCanvas = ()=>{
        setShowProfileCanvas(false);
    }

    const [showMessageCanvas, setShowMessageCanvas] = useState(false); 

    const openMessageCanvas =()=>{
        closeProfileCanvas();
        setShowMessageCanvas(true);
    }

    const closeMessageCanvas = ()=>{
        setShowMessageCanvas(false);
    }


    const [showOverlay, setShowOverlay] = useState(false); 
    const target = useRef(null);

    return(

       <div className="channel-page">
            <Modal
                show={showChannelModal} 
                onHide={closeChannelModal}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Form className='join-form'>
                    <Stack direction='horizontal' gap={2} className='title_stack'>
                        <span class="material-symbols-outlined icons" style={{fontSize:'2vw'}}>groups</span>
                        Create new Channel
                    </Stack>
                    <Form.Group className='form-group'>
                        <Form.Label >
                            Channel Name
                        </Form.Label>
                        <Form.Control style={{borderColor:'red'}}/>
                    </Form.Group>
                   
                    <Stack direction='horizontal' gap={4}>
                        <Button className='channel-form-button' onClick={closeChannelModal}>
                            Cancel
                        </Button>
                        <Button className='channel-form-button' onClick={closeChannelModal}>
                            Create
                        </Button>
                    </Stack>
                </Form>
            </Modal>
            <div className='small-container'>
                <Button className='channel-button' onClick={openChannelModal}> <span class="material-symbols-outlined"> add </span>  New Channel</Button>
                <ListGroup variant="flush" className='channel-list'>
                    <ListGroup.Item> # • All Channels</ListGroup.Item>
                    {channels.length > 0 && channels.map((channel)=>(
                         <ListGroup.Item className='channel-item'># • {channel.name}</ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
            <div className='large-container'>
                <Modal
                    show={showPostModal} 
                    onHide={closePostModal}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    >
                    <Form className='join-form'>
                        <Stack direction='horizontal' gap={2} className='title_stack'>
                            <span class="material-symbols-outlined icons" style={{fontSize:'2vw'}}>groups</span>
                            Create new Post 
                        </Stack>
                        <p>Channel : <span style={{fontWeight:'bold'}}># Channel name </span></p>
                        <Form.Group className='post-form-group'>
                            <Form.Label className='post-form-label'>
                                Post Topic
                                <span class="material-symbols-outlined icons ms-auto" >add_reaction</span>
                            </Form.Label>
                            <Form.Control style={{borderColor:'red'}}/>
                        </Form.Group>
                        <Form.Group className='post-form-group'>
                            <Form.Label className='post-form-label'>
                                Post Data
                                <span class="material-symbols-outlined icons ms-auto" >add_reaction</span>
                            </Form.Label>
                            <Form.Control as="textarea" rows={4} style={{borderColor:'blue'}}/>
                        </Form.Group>
                        <Form.Group className='post-form-group'>
                            <Form.Control type="file" multiple style={{borderColor:'#dedb85'}} />
                        </Form.Group>
                        <Stack direction='horizontal' gap={4}>
                            <Button className='channel-form-button' onClick={closePostModal}>
                                Cancel
                            </Button>
                            <Button className='channel-form-button' onClick={closePostModal}>
                                Create
                            </Button>
                        </Stack>
                    </Form>
                </Modal>
                <div className='new-post-block'>
                    <h4 style={{fontWeight:'bold'}}># • Channel Name </h4>
                    <Button className='ms-auto new-post-button' onClick={openPostModal}>What's on Your Mind?</Button>
                </div>
            </div>
            <div className='small-container'>
                {currUserDetails ? 
                    <div className='profile-block'>
                        <img src={currUserDetails.avatar} style={{width:'30%'}}></img>
                        <p style={{margin:'0'}}>{currUserDetails.username}</p>
                        <p style={{fontWeight:'bold'}}>{currUserDetails.name}</p>
                        <Stack direction="horizontal" className='info-stack'>
                            <Stack className='info-block'> 
                                <p style={{margin:'0', fontWeight:'bold'}}>{currUserDetails.totalPosts}</p>
                                <p>Posts</p>
                            </Stack>
                            <Stack className='info-block'>
                                <p style={{margin:'0', fontWeight:'bold'}}>{currUserDetails.connections}</p>
                                <p>Connections</p>
                            </Stack>
                            <Stack className='info-block'>
                                <p style={{margin:'0', fontWeight:'bold'}}>Begginer</p>
                                <p>Experties</p>
                            </Stack>
                        </Stack>
                        <Button className='profile-button'>View Profile</Button>
                    </div> 
                    :<></>
                }
                <div className='message-list-block'>
                    <ListGroup variant="flush" >
                        <ListGroup.Item style={{fontWeight:'bold'}}># • Direct Messages</ListGroup.Item>
                        {connections.length > 0 && connections.map((user)=>(
                             <ListGroup.Item className='message-item'>
                                <img src={user.avatar} style={{width:'2vw', marginRight:'0.5vw'}}></img>
                                <p style={{margin:'0'}}>{user.name}<p className="view-profile-button" onClick={openProfileCanvas}>View Profile</p></p>
                                <p className='ms-auto view-profile-button' onClick={openMessageCanvas}>Message</p>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <Offcanvas show={showProfileCanvas} onHide={closeProfileCanvas} placement='end'>
                        <Offcanvas.Header >
                        <Offcanvas.Title style={{fontWeight:'bold'}}># User's Profile</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body className='profile-canvas-body'>
                            <img src="Group301.png" className='canvas-img'></img>
                            <p style={{fontWeight:'bold', margin:'0'}}>@username</p>
                            <p>usre name here</p>
                            <p>hellp curent! 👋 Nice to meet you.I am profession! Lets connect and share our ideas.</p>
                            <Button className='send-message-button'>Send Message</Button>
                            <hr style={{width:'90%'}}></hr>
                            <p style={{fontWeight:'bold'}}>Here are some details about me:</p>
                            <Stack direction="horizontal" className='info-stack'>
                                <Stack className='info-block'> 
                                    <p style={{margin:'0', fontWeight:'bold'}}>30</p>
                                    <p>Posts</p>
                                </Stack>
                                <Stack className='info-block'>
                                    <p style={{margin:'0', fontWeight:'bold'}}>30</p>
                                    <p>Connections</p>
                                </Stack>
                                <Stack className='info-block'>
                                    <p style={{margin:'0', fontWeight:'bold'}}>Begginer</p>
                                    <p>Experties</p>
                                </Stack>
                            </Stack>
                            <p style={{fontWeight:'bold', marginTop:'1vw'}}>You can follow me on </p>
                            <Stack direction='horizontal' style={{marginBottom:'1vw'}}>
                                <Nav.Link >
                                    <Image  src="1.png"  className="social-media-img"  roundedCircle />
                                </Nav.Link>
                                <Nav.Link >
                                    <Image  src="2.png"  className="social-media-img"  roundedCircle />
                                </Nav.Link>
                                <Nav.Link >
                                    <Image  src="3.png"  className="social-media-img"  roundedCircle />
                                </Nav.Link>
                            </Stack>
                            <hr style={{width:'90%'}}></hr>
                            <p style={{fontWeight:'bold', marginTop:'0.5vw'}}>Check Out My Journey</p>
                            <ListGroup className='history-list'>
                                <ListGroup.Item as="li" className='activity-list-item'>
                                    <div className="fw-bold" style={{color:'#d84434'}}>channel name here </div>
                                    <p style={{fontSize:'small'}} >mwjhfgwqhf wkfr kjwbfj fjh .......</p>
                                </ListGroup.Item>
                            </ListGroup>
                        </Offcanvas.Body>
                    </Offcanvas>

                    <Offcanvas show={showMessageCanvas} onHide={closeMessageCanvas} placement='end' style={{width:'30%'}}>
                        <Offcanvas.Header>
                            <Stack direction='horizontal'>
                                <img src='Group301.png' style={{width:'12%', marginRight:'0.5vw'}}></img>
                                <p style={{margin:0}}>user name here<p style={{margin:0, fontWeight:'bold', fontSize:'small'}}>@username</p></p>
                            </Stack>
                        </Offcanvas.Header>
                        <hr style={{width:'100%', margin:'0'}}></hr>
                        <Offcanvas.Body>
                            <div>
                                <div className='received-msg'>
                                    <p>jhjehfjh</p>
                                </div>
                                <div className='sent-msg'>
                                    <p>jhfbjehfjhe</p>
                                </div>

                            </div>
                           <Stack direction='horizontal' className='textarea-stack'>
                           <Nav.Link onClick={()=>setShowOverlay(!showOverlay)} ref={target}>
                                <span class="material-symbols-outlined icons" style={{fontSize:'1.5vw'}}>add</span>
                            </Nav.Link>
                            <Overlay target={target.current} show={showOverlay} placement="top">
                                <Tooltip  >
                                    <Nav.Link className='tooltip-text'> Add reaction</Nav.Link> 
                                    
                                    <Nav.Link className='tooltip-text'> Attach File</Nav.Link>  
                                </Tooltip>                     
                            </Overlay>
                            <TextareaAutosize  
                                placeholder="Add your message here"  
                                className='textarea-block '
                                />
                                <Nav.Link><span class="material-symbols-outlined icons" style={{fontSize:'1.5vw'}}>send</span></Nav.Link>
                           </Stack>                 
                        </Offcanvas.Body>
                    </Offcanvas>


                </div>
                
            </div>

       </div>
    )
}

export default Channels;