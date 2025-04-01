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

    const navigateTo = useNavigate();
    const [selectedUser, setSelectedUser] = useState('');
    const [currUserId, setCurrUserId] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(0);

    const location = useLocation();
    const personFromState = location?.state?.personFromState;

    useEffect(()=>{
        getCurrUserDertails();
         if(personFromState){
            setSelectedUser(personFromState);
            getConnectedUserDetails(personFromState);
        }
    },[]);

   


    const[currUserDetails, setCurrUserDetails] = useState([]);
    const getCurrUserDertails = async() =>{
        const username  =  sessionStorage.getItem('session_user');
        const data = { username };
        try {
            const response =  await axios.post(`${window.BASE_URL}/getUserDetails`, data);
            if (response.status === 200) {
                setCurrUserDetails(response.data.userInfo);
                setCurrUserId(response.data.userInfo.id);
                getAllConnections(response.data.userInfo.id);
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
    const getAllConnections = async(currUser) =>{
        try {
            const response =  await axios.get(`${window.BASE_URL}/getConnectedUsers`,{ params: {userId: currUser}});
            if (response.status === 200) {
                setConnections(response.data);
                if(!personFromState){
                    setSelectedUser(response.data[0].username);
                    getConnectedUserDetails(response.data[0].username);
                }
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
                setSelectedUserId(response.data.userInfo.id);
                getAllMessages(response.data.userInfo.id);
                console.log("Successfully retrieved connected  user details",connectedUserDetails);
               
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during retriving connected user details: ",error);
        }
    }



    const [allMessages, setAllMessages] = useState([]);

    useEffect(() => {
        console.log("All messages updated: ", allMessages);
      }, [allMessages]);

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
                setMessage("");
                console.log("Successfully retrieved all messages", allMessages);
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during retriving all messages: ",error);
        }
    }


    const msgEmojiTarget =  useRef(null);
    const [showMsgEmoji, setShowMsgEmoji] = useState(false);
    const msgTextAreaRef = useRef(null);
    const [message, setMessage] = useState('');
    const [showFileMsgPopover, setShowFileMsgPopover] =  useState(false);
    const [msgFiles, setMsgFiles] =  useState([]);

    const msgFileRef = useRef(null);
    const msgFilePopoverTarget = useRef(null);

    const handleFileInput =(event)=>{
        const files = event.target.files;
        if (files) {
            setMsgFiles(prev =>[...prev,...Array.from(files)]);
        }
    }

    const handleFileDelete =(fileName) =>{
        if (msgFiles) {
                setMsgFiles((prev) => prev.filter((file) => file.name !== fileName));  
        }
    }
    useEffect(()=>{
        if(msgFiles.length === 0){
            setShowFileMsgPopover(false);
        }  
    },[msgFiles.length])


    const handleMsgEmojiInput =(emoji) =>{
        const cursor = msgTextAreaRef.current.selectionStart;
        const newData = message.slice(0,cursor) + emoji.native + message.slice(cursor);
        setMessage(newData);
        msgTextAreaRef.current.setSelectionRange(cursor + emoji.native.length, cursor + emoji.native.length);
        msgTextAreaRef.current.focus();
    }

    const handleNewMessage = async() =>{
        if(!message ){
            return;
        }
        const senderId = currUserId;
        const receiverId = selectedUserId;
        const requestData = { senderId,receiverId,message };
        try {
            const response =  await axios.post(`${window.BASE_URL}/addMessage`, requestData);
            if (response.status === 200) {
                handleFileUpload(response.data.messageId);
                getAllMessages(currUserId);
                console.log("Successfully added new message");
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during adding new message: ",error);
        }
    }


    const handleFileUpload = async (message)=>{
        if(msgFiles.length === 0){
            return;
        }
        const formData = new FormData();
        formData.append('messageId',message);
       
        msgFiles.forEach((file)=>{
            formData.append('allFiles',file)
        });
        
        try {
            const response = await axios.post(`${window.BASE_URL}/uploadFiles`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                setMsgFiles([]);
                console.log("Files uploaded successfully");
            }
        } catch (error) {
            console.error("Error while uploading files:", error);
        }
    }



    const showPreview =(text, num)=>{
        const words = text.split(' ');
        return words.slice(0, num).join(' ')+" . . . . . . . .";
    }

    const goToSearchedPost =(channel, postId) =>{
        const params = {
            channelFromState: channel,
            postFromState: postId
        }
        navigateTo('/channels',{state:params});
    }

    
    const createURL = (fileData, fileType) =>{
        const file = new Uint8Array(fileData.data);
        const blob = new Blob([file], { type: fileType });
        return URL.createObjectURL(blob);
    }

    return(
        <div className="message-page">    
            <div className='small-container'>
                <ListGroup variant="flush" className='channel-list' >
                    <ListGroup.Item style={{fontWeight:'bold'}}># • Direct Messages</ListGroup.Item>
                    {connections.length > 0 && connections.map((user)=>(
                        <ListGroup.Item className='message-item' onClick={()=>setSelectedUser(user.username)}>
                            <img src={user.avatar} style={{width:'2vw', marginRight:'0.5vw'}}></img>
                            <p style={{margin:'0'}}>{user.name}<p className="view-profile-button">{user.username}</p></p>
                            <p className='ms-auto view-profile-button'>View Message</p>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
            <div className='messsage-large-container'>
                <div className='message-container'>
                    {allMessages && allMessages.map((message)=>{
                        return(
                            message.senderId === connectedUserDetails.userInfo.id ?
                            <div className='received-msg'>
                                <p>{message.message}</p>
                                <Stack direction="horizontal" gap={3}>
                                    {message.files.map(file => (
                                        <a href={createURL(file.file, file.fileType)}
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={{ fontSize: 'small', textDecoration: 'none' }}>
                                            {file.fileName}
                                        </a>
                                    
                                    ))}
                                </Stack>
                            </div>
                            :
                            <div className='sent-msg'>
                                <p>{message.message}</p>
                                <Stack direction="horizontal" gap={3}>
                                    {message.files.map(file => (
                                        <a href={createURL(file.file, file.fileType)}
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={{ fontSize: 'small', textDecoration: 'none' }}>
                                            {file.fileName}
                                        </a>
                                    
                                    ))}
                                </Stack>
                            </div>
                        );   
                        })
                    }
                </div>
                <div className='textarea-msg-block'>      
                    {msgFiles.length > 0 &&
                        <Nav.Link 
                            className='ms-auto' style={{fontSize:'small', color:'white'}} 
                            onClick={()=>setShowFileMsgPopover(!showFileMsgPopover)}
                            ref={msgFilePopoverTarget}>
                            <Badge bg="warning" text="dark">
                                {msgFiles.length}
                            </Badge>
                        </Nav.Link>
                    }

                    <Overlay target={msgFilePopoverTarget} show={showFileMsgPopover} placement='top'>
                        <Popover id="popover-basic"> 
                            <ListGroup as="ol" numbered> 
                            {msgFiles.length > 0 && msgFiles.map((file)=>(
                                <ListGroup.Item
                                as="li"
                                className="d-flex justify-content-between align-items-start"
                                >                                        
                                    <div className="fw-bold">{file.name}</div>                                
                                    <Nav.Link style={{marginLeft:'2vw'}} onClick={()=>handleFileDelete(file.name, true, false, false)} >
                                        <span class="material-symbols-outlined icons" style={{fontSize:'small'}}>close</span>
                                    </Nav.Link>
                                </ListGroup.Item>
                            ))}     
                            </ListGroup>
                        </Popover>
                    </Overlay>
                    <Nav.Link className='file-link' 
                        style={{color:'black', marginRight:'1vh', opacity:'70%'}} 
                          onClick={() => msgFileRef.current.click()}
                        >
                        <span class="material-symbols-outlined">add</span>
                    </Nav.Link> 
                     <input 
                        type='file' 
                        style={{ display: 'none' }}
                        ref={msgFileRef}
                        onChange={(e) => handleFileInput(e)}
                    />
                     <Nav.Link 
                        style={{color:'black', marginRight:'1vh', opacity:'70%'}} 
                        ref={msgEmojiTarget} 
                        onClick={()=> setShowMsgEmoji(!showMsgEmoji)}>
                        <span class="material-symbols-outlined">add_reaction</span>
                    </Nav.Link> 
                    <Overlay target={msgEmojiTarget} show={showMsgEmoji} placement='top'>
                        <Popover id="popover-basic">
                            <Picker  onEmojiSelect={handleMsgEmojiInput} />
                        </Popover>
                    </Overlay>
                    <TextareaAutosize  
                        placeholder="Add your message here"  
                        className='text-area-formcontrol' 
                        ref = {msgTextAreaRef}
                        onChange={(e)=>setMessage(e.target.value)}
                        value={message}
                    />

                    <Nav.Link style={{color:'black', marginLeft:'1vh'}} className='text-area-links' onClick={()=>handleNewMessage()} >
                        <span class="material-symbols-outlined" >send</span>
                    </Nav.Link> 
               </div>
            </div>
            <div className='small-container'>
                {connectedUserDetails.userInfo &&
                    <>
                        <img src={connectedUserDetails.userInfo.avatar} className='canvas-img'></img>
                        <p style={{fontWeight:'bold', margin:'0'}}>@{connectedUserDetails.userInfo.username}</p>
                        <p>{connectedUserDetails.userInfo.name}</p>
                        <p>Hello {currUserDetails.name}! 👋 Nice to meet you.I am {connectedUserDetails.userInfo.profession}! Lets connect and share our ideas.</p>
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
                                <p style={{margin:'0', fontWeight:'bold'}}>{connectedUserDetails.userInfo.expertise}</p>
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
                                    <ListGroup.Item as="li" className='activity-list-item' onClick={()=>goToSearchedPost(post.channel, post.id)}>
                                        <div className="fw-bold" style={{color:'#d84434'}}>{post.channel}</div> 
                                        <p style={{fontSize:'small'}} >{showPreview(post.data,10)}</p>  
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