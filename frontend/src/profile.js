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

    const [connectedUserDetails, setConnectedUserDetails] =  useState([]);
    const getConnectedUserDetails = async(user) =>{
        const username  =  user;
        const data = { username };
        try {
            const response =  await axios.post(`${window.BASE_URL}/getUserDetails`, data);
            if (response.status === 200) {
                setConnectedUserDetails(response.data);
                openProfileCanvas();
                console.log("Successfully retrieved connected  user details");
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during retriving connected user details: ",error);
        }
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
        <div className='profile-page'>
            <div className='first-container'>
                <ListGroup variant="flush" >
                    <ListGroup.Item style={{fontWeight:'bold'}}># • Direct Messages</ListGroup.Item>
                    {connections.length > 0 && connections.map((user)=>(
                            <ListGroup.Item className='message-item'>
                            <img src={user.avatar} style={{width:'2vw', marginRight:'0.5vw'}}></img>
                            <p style={{margin:'0'}}>{user.name}<p className="view-profile-button" onClick={()=>getConnectedUserDetails(user.username)}>View Profile</p></p>
                            <p className='ms-auto view-profile-button' onClick={openMessageCanvas}>Message</p>
                        </ListGroup.Item>
                    ))}
                        <ListGroup.Item className='message-item'>
                            <img src="1.png" style={{width:'2vw', marginRight:'0.5vw'}}></img>
                            <p style={{margin:'0'}}>name jr<p className="view-profile-button" onClick={openProfileCanvas}>View Profile</p></p>
                            <p className='ms-auto view-profile-button' onClick={openMessageCanvas}>Message</p>
                        </ListGroup.Item>
                </ListGroup>
                <Offcanvas show={showProfileCanvas} onHide={closeProfileCanvas} placement='end'>
                    <Offcanvas.Header >
                    <Offcanvas.Title style={{fontWeight:'bold'}}># User's Profile</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body className='profile-canvas-body'>
                        <img src="Group301.png" className='canvas-img'></img>
                        <p style={{fontWeight:'bold', margin:'0'}}>@{connectedUserDetails.userInfo.username}</p>
                        <p>{connectedUserDetails.userInfo.name}</p>
                        <p>hellp {currUserDetails.username}! 👋 Nice to meet you.I am {connectedUserDetails.userInfo.profession}! Lets connect and share our ideas.</p>
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
                        <p style={{fontWeight:'bold', marginTop:'1vw'}}>You can follow me on </p>
                        <Stack direction='horizontal' style={{marginBottom:'1vw'}}>
                            {connectedUserDetails.media.length >  0 && connectedUserDetails.media.map((account)=>{
                                <Nav.Link >
                                    <Image  src={account.image}  className="social-media-img"  roundedCircle />
                                </Nav.Link>
                            })}
                        </Stack>
                        <hr style={{width:'90%'}}></hr>
                        <p style={{fontWeight:'bold', marginTop:'0.5vw'}}>Check Out My Journey</p>
                        <ListGroup className='history-list'>
                            {connectedUserDetails.post.length > 0 && connectedUserDetails.post.map((eachPost)=>{
                                <ListGroup.Item as="li" className='activity-list-item'>
                                    <div className="fw-bold" style={{color:'#d84434'}}>kekr </div>
                                    <p style={{fontSize:'small'}} >mwjhfgwqhf wkfr kjwbfj fjh .......</p>
                                </ListGroup.Item>
                            })}
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