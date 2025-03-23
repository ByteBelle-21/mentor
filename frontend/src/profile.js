import './profile.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/esm/Stack';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';

function Profile(){
    const [showMediaModal, setShowMediaModal] = useState(false);

    const openMediaModal =()=>{
        setShowMediaModal(true);
    }

    const closeMediaModal = ()=>{
        setShowMediaModal(false);
    }

    return(
        <div className='profile-page'>
            <div className='first-container'>
                <h6 style={{fontWeight:'bold', marginLeft:'0.5vw'}}> # Suggested People for you</h6>
                <p style={{margin:'0', fontSize:'small',marginLeft:'0.5vw'}}>Discover and connect with professionals who align with your interests.</p>
                <ListGroup variant="flush" >
                    <ListGroup.Item className='message-item'>
                        <img src="Group 301.png" style={{width:'2vw', marginRight:'0.5vw'}}></img>
                        <p style={{margin:'0'}}>hsdgf hefefg<p className="view-profile-button" >View Profile</p></p>
                        <p className='ms-auto view-profile-button' >Message</p>
                    </ListGroup.Item>
                    <ListGroup.Item className='message-item'>
                        <img src="Group 301.png" style={{width:'2vw', marginRight:'0.5vw'}}></img>
                        <p style={{margin:'0'}}>hsdgf hefefg<p className="view-profile-button" >View Profile</p></p>
                        <p className='ms-auto view-profile-button' >Message</p>
                    </ListGroup.Item>
                    <ListGroup.Item className='message-item'>
                        <img src="Group 301.png" style={{width:'2vw', marginRight:'0.5vw'}}></img>
                        <p style={{margin:'0'}}>hsdgf hefefg<p className="view-profile-button" >View Profile</p></p>
                        <p className='ms-auto view-profile-button' >Message</p>
                    </ListGroup.Item>
                    <ListGroup.Item className='message-item'>
                        <img src="Group 301.png" style={{width:'2vw', marginRight:'0.5vw'}}></img>
                        <p style={{margin:'0'}}>hsdgf hefefg<p className="view-profile-button" >View Profile</p></p>
                        <p className='ms-auto view-profile-button' >Message</p>
                    </ListGroup.Item>
                    <ListGroup.Item className='message-item'>
                        <img src="Group 301.png" style={{width:'2vw', marginRight:'0.5vw'}}></img>
                        <p style={{margin:'0'}}>hsdgf hefefg<p className="view-profile-button" >View Profile</p></p>
                        <p className='ms-auto view-profile-button' >Message</p>
                    </ListGroup.Item>
                </ListGroup>
                <hr></hr>
                <h6 style={{fontWeight:'bold', marginLeft:'0.5vw'}}> # Suggested Channels for you</h6>
                <p style={{margin:'0', fontSize:'small',marginLeft:'0.5vw'}}>Discover content from channels you'll love and engage with. Personalized recommendations to expand your network.</p>
                <ListGroup variant="flush" className='profile-channel-list'>
                    <ListGroup.Item className='channel-item'># • Data Structures</ListGroup.Item>
                    <ListGroup.Item className='channel-item'># • Algorithms</ListGroup.Item>
                    <ListGroup.Item className='channel-item'># • Operating Systems</ListGroup.Item>
                    <ListGroup.Item className='channel-item'># • Databases</ListGroup.Item>
                    <ListGroup.Item className='channel-item'># • Computer Networks</ListGroup.Item>
                    <ListGroup.Item className='channel-item'># • Artificial Intelligence</ListGroup.Item>
                    <ListGroup.Item className='channel-item'># • Machine Learning</ListGroup.Item>
                    <ListGroup.Item className='channel-item'># • Software Engineering</ListGroup.Item>
                </ListGroup>
            </div>
            <div className='profile-div'>
                <img src="Group 301.png" style={{width:'7vw', margin:'1vw'}}></img>
                <Button className='edit-profile-btn'> Edit Profile</Button>
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