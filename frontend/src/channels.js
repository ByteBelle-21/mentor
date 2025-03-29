
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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Picker from '@emoji-mart/react';
import Popover from 'react-bootstrap/Popover';
import Badge from 'react-bootstrap/Badge';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

function Channels(){

    const navigateTo = useNavigate();

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
    const [channelName, setChannelName] = useState('');
    const [channelError, setChannelError] = useState(false);
    const [channel401Error, setChannel401Error] = useState(false);
    const [channel500Error, setChannel500Error] = useState(false);

    const openChannelModal =()=>{
        setShowChannelModal(true);
    }

    const closeChannelModal = ()=>{
        closeChannelErrors();
        setShowChannelModal(false);
    }

    const closeChannelErrors= () =>{
        setChannel401Error(false);
        setChannel500Error(false);
        setChannelError(false);
    }

    const addChannel= async()=>{
        if(!channelName){
            setChannelError(true);
            return;
        }
        const data = { channelName };
        try {
            const response =  await axios.post(`${window.BASE_URL}/addChannel`, data);
            if (response.status === 200) {
                setChannelName('');
                closeChannelModal();
                getAllChannels();
                console.log("Successfully added new channel");
            } 
            else if(response.status === 401){
                setChannel401Error(true);
            }
        } catch (error) {
            setChannel500Error(true);
            console.error("Catched axios error during adding new channel: ",error);
        }
    }


    const [showPostModal, setShowPostModal] = useState(false);
    const [showTopicEmoji, setShowTopicEmoji] = useState(false);
    const [showPostEmoji, setShowPostEmoji] = useState(false);
    const [showFilePopover, setShowFilePopover] = useState(false);
    const [post500Error, setPost500Error] = useState(false);
    const [postError, setPostError] = useState(false);
    const topicEmojiTarget = useRef(null);
    const topicTextAreaRef = useRef(null);
    const postEmojiTarget = useRef(null);
    const dataTextAreaRef = useRef(null);
    const fileTarget = useRef(null);
    const [topic, setTopic] = useState('');
    const [data, setData] = useState('');
    const [files, setFiles] = useState([]);
    

    const closePostErrors = () =>{
        setPostError(false);
        setPost500Error(false);
    }
    
    const openPostModal =()=>{
        setShowPostModal(true);
    }

    const closePostModal = ()=>{
        setTopic('');
        setData('');
        setFiles([]);
        setShowPostEmoji(false);
        setShowTopicEmoji(false);
        setShowFilePopover(false);
        closePostErrors();
        setShowPostModal(false);
    }

    const clickTopicEmoji = ()=>{
        setShowPostEmoji(false);
        setShowFilePopover(false);
        setShowTopicEmoji(!showTopicEmoji);
    }

    const clickPostEmoji = ()=>{
        setShowTopicEmoji(false);
        setShowFilePopover(false);
        setShowPostEmoji(!showPostEmoji);
    }

    const clickFilePopover = ()=>{
        setShowTopicEmoji(false);
        setShowPostEmoji(false);
        setShowFilePopover(!showFilePopover);
    }

    const handleTopicEmojiInput =(emoji) =>{
        const cursor = topicTextAreaRef.current.selectionStart;
        const newTopic = topic.slice(0,cursor) + emoji.native + topic.slice(cursor);
        setTopic(newTopic);
        topicTextAreaRef.current.setSelectionRange(cursor + emoji.native.length, cursor + emoji.native.length);
        topicTextAreaRef.current.focus();
    }

    const handleDataEmojiInput =(emoji) =>{
        const cursor = dataTextAreaRef.current.selectionStart;
        const newData = data.slice(0,cursor) + emoji.native + data.slice(cursor);
        setData(newData);
        dataTextAreaRef.current.setSelectionRange(cursor + emoji.native.length, cursor + emoji.native.length);
        dataTextAreaRef.current.focus();
    }

    const handleFileInput =(event)=>{
        const files = event.target.files;
        if (files) {
           setFiles(prev =>[...prev,...Array.from(files)]);
        }
    }

    const handleFileDelete =(fileName) =>{
        setFiles((prev) => prev.filter((file) => file.name !== fileName));
    }


    const handleNewPost = async() =>{
        if(!topic || !data ){
            setPostError(true);
            return;
        }
        const userId = currUserDetails.id;
        const channelId = 0;
        const replyTo = 0;
        const requestData = { userId,channelId, replyTo, topic, data };
        try {
            const response =  await axios.post(`${window.BASE_URL}/addPost`, requestData);
            if (response.status === 200) {
                closePostModal();
                console.log("Successfully added new post");
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during adding new post: ",error);
        }
    }


    const [channel, setChannel] = useState("Homepage");

    const [showCommentInput, setShowCommentInput] = useState(0);

    const openCommentInput = () =>{
        setShowCommentInput(1);
    }

    const closeCommentInput = () =>{
        setShowCommentInput(0);
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
                    {channelError ? <p style={{fontSize:'small', color:'red', margin:'0', padding:'0'}}> Please fill out Channel name field</p>:<></>}
                    {channel500Error ? <p style={{fontSize:'small', color:'red', margin:'0', padding:'0'}}> Server error occured : Try again !</p>:<></>}
                    {channel401Error ? <p style={{fontSize:'small', color:'red', margin:'0', padding:'0'}}> Channel with given name already exists</p>: <></>}
                    <Form.Group className='form-group'>
                        <Form.Label >
                            Channel Name
                        </Form.Label>
                        <Form.Control 
                            type='text'
                            style={{borderColor:'red'}}
                            onChange={(e)=>{setChannelName(e.target.value),closeChannelErrors()}}    
                        />
                    </Form.Group>
                   
                    <Stack direction='horizontal' gap={4}>
                        <Button className='channel-form-button' onClick={closeChannelModal}>
                            Cancel
                        </Button>
                        <Button className='channel-form-button' onClick={addChannel}>
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
                        {channel === "Homepage" ? 
                            <Stack direction='horizontal' gap={2} className='title_stack'>
                                <span class="material-symbols-outlined icons" style={{fontSize:'2vw'}}>groups</span>
                                How to Create New Post 
                            </Stack>
                        :
                            <>
                                <Stack direction='horizontal' gap={2} className='title_stack'>
                                    <span class="material-symbols-outlined icons" style={{fontSize:'2vw'}}>groups</span>
                                    Create new Post 
                                </Stack>
                                <p>Channel : <span style={{fontWeight:'bold'}}>{channel}</span></p>
                            </>
                        }
                        {postError ? <p style={{fontSize:'small', color:'red', margin:'0', padding:'0'}}> Please fill out all required field</p>:<></>}
                        {post500Error ? <p style={{fontSize:'small', color:'red', margin:'0', padding:'0'}}> Server error occured : Try again !</p>:<></>}
                        <Form.Group className='post-form-group'>
                            <Form.Label className='post-form-label'>
                                Post Topic
                                <Nav.Link className='ms-auto' onClick={()=>clickTopicEmoji()} ref={topicEmojiTarget}>
                                    <span class="material-symbols-outlined icons" >add_reaction</span>
                                </Nav.Link>
                                <Overlay target={topicEmojiTarget} show={showTopicEmoji} placement='right'>
                                    <Popover id="popover-basic">
                                        <Picker data={data} onEmojiSelect={handleTopicEmojiInput} />
                                    </Popover>
                                </Overlay>
                            </Form.Label>
                            <Form.Control 
                                type='text'
                                ref={topicTextAreaRef}
                                style={{borderColor:'red'}} 
                                onChange={(e)=>{setTopic(e.target.value),closePostErrors()}} 
                                value={topic}
                                placeholder={channel === "Homepage" && "Add post's topic here. You can also add emoji"}
                                readOnly = {channel === "Homepage" ? true :  false}
                            />
                        </Form.Group>
                        <Form.Group className='post-form-group'>
                            <Form.Label className='post-form-label'>
                                Post Data
                                <Nav.Link className='ms-auto' onClick={()=>clickPostEmoji()} ref={postEmojiTarget}>
                                    <span class="material-symbols-outlined icons" >add_reaction</span>
                                </Nav.Link>
                                <Overlay target={postEmojiTarget} show={showPostEmoji} placement='right'>
                                    <Popover id="popover-basic">
                                        <Picker data={data} onEmojiSelect={handleDataEmojiInput} />
                                    </Popover>
                                </Overlay>
                            </Form.Label>
                            <Form.Control 
                                type='text'
                                ref={dataTextAreaRef}
                                as="textarea" 
                                rows={4} 
                                style={{borderColor:'blue'}}
                                onChange={(e)=>{setData(e.target.value), closePostErrors()}}
                                value={data}
                                placeholder={channel === "Homepage" && "Add post's data here. You can also add emoji"}
                                readOnly = {channel === "Homepage" ? true :  false}
                            />
                        </Form.Group>
                        <Form.Group className='post-form-group file-group'>
                            <Form.Control 
                                type="file" 
                                multiple 
                                style={{borderColor:'#dedb85', marginRight:'0.5vw'}} 
                                onChange={handleFileInput}
                            />
                            <Nav.Link onClick={()=>{ if(files.length > 0) clickFilePopover();}} ref={fileTarget}>
                                <Badge pill bg="success">
                                    <h6 style={{margin:'0', padding:'0', fontWeight:'bold'}}>{files.length}</h6>
                                </Badge>
                            </Nav.Link>
                            <Overlay target={fileTarget} show={showFilePopover} placement='right'>
                                <Popover id="popover-basic"> 
                                    <ListGroup as="ol" numbered>
                                        {files.length > 0 && files.map((file)=>(
                                            <ListGroup.Item
                                            as="li"
                                            className="d-flex justify-content-between align-items-start"
                                            >                                        
                                                <div className="fw-bold">{file.name}</div>                                
                                                <Nav.Link style={{marginLeft:'2vw'}} onClick={()=>handleFileDelete(file.name)} >
                                                    <span class="material-symbols-outlined icons" style={{fontSize:'small'}}>close</span>
                                                </Nav.Link>
                                            </ListGroup.Item>
                                        ))}       
                                    </ListGroup>
                                </Popover>
                            </Overlay>
                        </Form.Group>
                        <Stack direction='horizontal' gap={4}>
                            { channel !== "Homepage" ? 
                                <>
                                    <Button className='channel-form-button' onClick={closePostModal}>
                                        Cancel
                                    </Button>
                                    <Button className='channel-form-button' onClick={handleNewPost}>
                                        Create
                                    </Button>
                                </>
                                :
                                <Button className='channel-form-button' onClick={closePostModal}>
                                        Close
                                </Button>
                            }
                        </Stack>
                    </Form>
                </Modal>
                <div className='new-post-block'>
                    <h4 style={{fontWeight:'bold'}}># • {channel} </h4>
                    {channel === "Homepage" 
                        ?
                        <Button className='ms-auto new-post-button' onClick={openPostModal}>How to Create New Post?</Button>
                        :   
                        <Button className='ms-auto new-post-button' onClick={openPostModal}>What's on Your Mind?</Button> 
                    }
                    
                </div>
                {channel !== "Homepage" ? 
                    <div className='homepage-channel'>
                        <span class="material-symbols-outlined icons" style={{fontSize:'2vw', margin:'0', padding:'0', color:'#f86714'}}>groups</span>
                        <h5 style={{fontWeight:'bold'}}>Welcome to AskMentor</h5>
                        <p>Start engaging with other members by creating channels, posting, replying, and now... messaging!</p>
                        <ul>
                            <li><strong>Create a new channel:</strong> Start a fresh topic!</li>
                            <li><strong>Add a new post:</strong> Share your thoughts in any of the channels.</li>
                            <li><strong>Reply to posts:</strong> Join in and keep the conversation alive!</li>
                            <li><strong>Send direct messages:</strong> Want to talk privately? Send a direct message.</li>
                        </ul>
                        <p style={{fontWeight:'bold'}}>Start Browsing Now</p>
                    </div>
                    :
                    <div className='channel-posts'>
                        <div className="post-block">
                            <Stack direction='horizontal' style={{marginBottom:'0.5vw'}}>
                                <img src="1.png" style={{width:'2vw'}}></img>
                                <div className="ms-2 me-auto" style={{fontSize:'small'}}>
                                    <div className="fw-bold">User's name </div>
                                    Username
                                </div>
                                <p className="ms-auto" style={{fontSize:'small'}}> posted on fuexmwkwjdn</p>
                            </Stack>
                            <hr></hr>
                            <p style={{fontWeight:'bold'}}>What is the difference between stack and heap memory in computer science?</p>
                            <p>In summary, the stack is ideal for storing small, temporary data that doesn't need to 
                                persist beyond the function call, while the heap is more flexible and used for 
                                dynamically allocated memory that can persist throughout the program's lifetime.
                            </p>
                            <Stack direction='horizontal' gap={3}>
                                <Nav.Link>
                                    <span 
                                        class="material-symbols-outlined icons" 
                                        style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714', fill:'#f86714'}}>
                                            thumb_up
                                    </span>
                                </Nav.Link>
                                <Nav.Link>
                                    <span 
                                        class="material-symbols-outlined icons" 
                                        style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714'}}>
                                            thumb_down
                                    </span>
                                </Nav.Link>
                                <Nav.Link onClick={openCommentInput}>
                                    <span 
                                        class="material-symbols-outlined icons" 
                                        style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714'}}>
                                            reply
                                    </span>
                                </Nav.Link>
                                {showCommentInput === 1 && 
                                    <>
                                        <Nav.Link style={{fontSize:'small', color:'#f86714'}} className='ms-auto'>
                                            <span 
                                                class="material-symbols-outlined icons" 
                                                style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714'}}>
                                                    note_add
                                            </span>
                                        </Nav.Link>
                                        <Nav.Link style={{fontSize:'small', color:'#f86714'}}>
                                            <span 
                                                class="material-symbols-outlined icons" 
                                                style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714'}}>
                                                    add_reaction
                                            </span>
                                        </Nav.Link>
                                        <Nav.Link style={{fontSize:'small', color:'#f86714', fontWeight:'bold'}} onClick={closeCommentInput}>                          
                                            Cancel
                                        </Nav.Link>
                                        <Nav.Link style={{fontSize:'small', color:'#f86714' , fontWeight:'bold'}}>
                                            Send
                                        </Nav.Link>
                                    </>
                                }
                            </Stack>
                            {showCommentInput === 1 &&
                                <FloatingLabel controlId="xyz" label="Comments" style={{position:'relative'}}>
                                    <Form.Control
                                        as="textarea"
                                        style={{ height: '70px' }}
                                    />
                                </FloatingLabel> 
                            }   
                            <hr></hr>
                            <p style={{fontWeight:'bold', fontSize:'small'}}>All replies : </p>
                            <div className="reply-block" style={{marginLeft:'3vw'}}>
                                <Stack direction='horizontal' style={{marginBottom:'0.5vw'}}>
                                    <img src="1.png" style={{width:'2vw'}}></img>
                                    <div className="ms-2 me-auto" style={{fontSize:'small'}}>
                                        <div className="fw-bold">User's name </div>
                                        Username
                                    </div>
                                    <p className="ms-auto" style={{fontSize:'small'}}> posted on fuexmwkwjdn</p>
                                </Stack>
                                <p>In summary, the stack is ideal for storing small, temporary data that doesn't need to 
                                    persist beyond the function call, while the heap is more flexible and used for 
                                    dynamically allocated memory that can persist throughout the program's lifetime.
                                </p>
                                <Stack direction='horizontal' gap={3}>
                                    <Nav.Link>
                                        <span 
                                            class="material-symbols-outlined icons" 
                                            style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714', fill:'#f86714'}}>
                                                thumb_up
                                        </span>
                                    </Nav.Link>
                                    <Nav.Link>
                                        <span 
                                            class="material-symbols-outlined icons" 
                                            style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714'}}>
                                                thumb_down
                                        </span>
                                    </Nav.Link>
                                    <Nav.Link style={{fontSize:'small', color:'#f86714'}} onClick={openCommentInput}>
                                        <span 
                                            class="material-symbols-outlined icons" 
                                            style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714'}}>
                                                reply
                                        </span>
                                    </Nav.Link>
                                    {showCommentInput === 1 && 
                                    <>
                                        <Nav.Link style={{fontSize:'small', color:'#f86714'}} className='ms-auto'>
                                            <span 
                                                class="material-symbols-outlined icons" 
                                                style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714'}}>
                                                    note_add
                                            </span>
                                        </Nav.Link>
                                        <Nav.Link style={{fontSize:'small', color:'#f86714'}}>
                                            <span 
                                                class="material-symbols-outlined icons" 
                                                style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714'}}>
                                                    add_reaction
                                            </span>
                                        </Nav.Link>
                                        <Nav.Link style={{fontSize:'small', color:'#f86714', fontWeight:'bold'}} onClick={closeCommentInput}>                          
                                            Cancel
                                        </Nav.Link>
                                        <Nav.Link style={{fontSize:'small', color:'#f86714' , fontWeight:'bold'}}>
                                            Send
                                        </Nav.Link>
                                    </>
                                    }
                                </Stack>
                                {showCommentInput === 1 &&
                                    <FloatingLabel controlId="xyz" label="Comments" style={{position:'relative'}}>
                                        <Form.Control
                                            as="textarea"
                                            style={{ height: '70px' }}
                                        />
                                    </FloatingLabel> 
                                }         
                            </div>
                        </div>
                    </div>
                }
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
                        <Button className='profile-button' onClick={()=> navigateTo('/profile')}>View Profile</Button>
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