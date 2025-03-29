
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
        getAllPopularUsers();
    },[]);


    const [allChannels, setAllChannels] = useState([]);
    const getAllChannels = async() =>{
        try {
            const response =  await axios.get(`${window.BASE_URL}/getAllChannels`);
            if (response.status === 200) {
                setAllChannels(response.data);
                console.log("Successfully retrieved all channels details");
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during retriving all channels details: ",error);
        }
    }


   
    const [channel, setChannel] = useState("Homepage");
    const [currChannelId, setCurrChannelId] = useState(0);
    const [currentChannelDetails, setCurrentChannelDetails] = useState([]);

    const handleChannelSelection = async (channelId, channelName) =>{
        setChannel(channelName);
        setCurrChannelId(channelId);
        try {
            const response = await axios.get(`${window.BASE_URL}/getChannelPosts`,
            { params: {channel:channelId}});
            if (response.status === 200) {
                setCurrentChannelDetails(response.data);
                console.log(response.data);
            } 
            else if(response.status === 401){
                console.log(response.message)
            }
        } catch (error){
            console.error("Catched axios error during retriving channel post: ",error);
        }
    }


    
    const [showCommentInput, setShowCommentInput] = useState(0);

    const closeCommentInput = () =>{
        setReply('');
        setReplyFiles([]);
        setShowFileReplyPopover(false);
        setShowCommentInput(0);
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

    const topicEmojiTarget = useRef(null);
    const postEmojiTarget = useRef(null);
    const replyEmojiTarget = useRef(null);
    const msgEmojiTarget =  useRef(null);

    const [showTopicEmoji, setShowTopicEmoji] = useState(false);
    const [showPostEmoji, setShowPostEmoji] = useState(false);
    const [showReplyEmoji, setShowReplyEmoji] = useState(false);
    const [showMsgEmoji, setShowMsgEmoji] = useState(false);
   
    const topicTextAreaRef = useRef(null);
    const dataTextAreaRef = useRef(null);
    const replyTextAreaRef = useRef(null);
    const msgTextAreaRef = useRef(null);
  
    const [topic, setTopic] = useState('');
    const [data, setData] = useState('');
    const [reply, setReply] =  useState('');
    const [message, setMessage] = useState('');

    const [showFilePopover, setShowFilePopover] = useState(false);
    const [showFileReplyPopover, setShowFileReplyPopover] =  useState(false);
    const [showFileMsgPopover, setShowFileMsgPopover] =  useState(false);

    const [files, setFiles] = useState([]);
    const [replyFiles, setReplyFiles] = useState([]);
    const [msgFiles, setMsgFiles] =  useState([]);

    const replyFilePopoverTarget = useRef(null);
    const postFilePopoverTarget = useRef(null);
    const msgFilePopoverTarget = useRef(null);

    const [post500Error, setPost500Error] = useState(false);
    const [postError, setPostError] = useState(false);
    
    const fileReplyRef = useRef(null);
   
    

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


    const handleReplyEmojiInput =(emoji) =>{
        const cursor = replyTextAreaRef.current.selectionStart;
        const newData = reply.slice(0,cursor) + emoji.native + reply.slice(cursor);
        setReply(newData);
        replyTextAreaRef.current.setSelectionRange(cursor + emoji.native.length, cursor + emoji.native.length);
        replyTextAreaRef.current.focus();
    }

   

    const handleFileInput =(event, isPost, isReply, isMsg)=>{
        const files = event.target.files;
        if (files) {
            if(isPost){
                setFiles(prev =>[...prev,...Array.from(files)]);
            }
            else if(isReply){
                setReplyFiles(prev =>[...prev,...Array.from(files)]);
            }
            else if(isMsg){
                setMsgFiles(prev =>[...prev,...Array.from(files)]);
            }
        }
    }

    const handleFileDelete =(fileName, isPost, isReply, isMsg) =>{
         if (files) {
            if(isPost){
                setFiles((prev) => prev.filter((file) => file.name !== fileName));
                if(files.length === 0){
                    setShowFilePopover(false);
                }
            }
            else if(isReply){
               setReplyFiles((prev) => prev.filter((file) => file.name !== fileName));
                if(replyFiles.length === 0){
                    setShowFileReplyPopover(false);
                }
            }
            else if(isMsg){
                setMsgFiles((prev) => prev.filter((file) => file.name !== fileName));
                if(msgFiles.length === 0){
                    setShowFileMsgPopover(false);
                }
            }
        }
    }


    const handleNewPost = async() =>{
        if(!topic || !data ){
            setPostError(true);
            return;
        }
        const userId = currUserDetails.id;
        const channelId = currChannelId;
        const replyTo = 0;
        const requestData = { userId,channelId, replyTo, topic, data };
        try {
            const response =  await axios.post(`${window.BASE_URL}/addPost`, requestData);
            if (response.status === 200) {
                closePostModal();
                handleChannelSelection(channelId, channel);
                console.log("Successfully added new post");
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during adding new post: ",error);
        }
    }

    const handleNewReply = async(replyToPost) =>{
        if(!reply){
            return;
        }
        const userId = currUserDetails.id;
        const channelId = currChannelId;
        const replyTo = replyToPost;
        const data = reply;
        const requestData = { userId,channelId, replyTo, topic, data };
        try {
            const response =  await axios.post(`${window.BASE_URL}/addPost`, requestData);
            if (response.status === 200) {
                closeCommentInput();
                console.log("Successfully added new reply");
            } 
            else{
                console.log(response.message)
            }
        } catch (error) {
            console.error("Catched axios error during adding new reply: ",error);
        }
    }


    const showPreview =(text, num)=>{
        const words = text.split(' ');
        return words.slice(0, num).join(' ')+" . . . . . . . .";
    }


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
                <ListGroup variant="flush" className='channel-list' >
                    <ListGroup.Item> # • All Channels</ListGroup.Item>
                    <ListGroup.Item 
                        className='channel-item' 
                        onClick={()=>setChannel("Homepage")}>
                            # • Homepage
                    </ListGroup.Item>
                    {allChannels.length > 0 && allChannels.map((channel)=>(
                         <ListGroup.Item 
                            className='channel-item' 
                            onClick={()=>handleChannelSelection(channel.id, channel.name)}>
                                # • {channel.name}
                        </ListGroup.Item>
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
                                onChange={(e) => handleFileInput(e, true, false, false)}
                            />
                            <Nav.Link onClick={()=>{ if(files.length > 0) clickFilePopover();}} ref={postFilePopoverTarget}>
                                <Badge pill bg="success">
                                    <h6 style={{margin:'0', padding:'0', fontWeight:'bold'}}>{files.length}</h6>
                                </Badge>
                            </Nav.Link>
                            <Overlay target={postFilePopoverTarget} show={showFilePopover} placement='right'>
                                <Popover id="popover-basic"> 
                                    <ListGroup as="ol" numbered>
                                        {files.length > 0 && files.map((file)=>(
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
                {channel === "Homepage" ? 
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
                        {currentChannelDetails && currentChannelDetails.length > 0 && (()=>{
                            const postsStructure = [];
                            let i = 0;
                            while(i < currentChannelDetails.length){
                                const post = currentChannelDetails[i];
                                if(post.level === 0){
                                    postsStructure.push(
                                        <div  className="post-block">
                                            <Stack direction='horizontal' style={{marginBottom:'2vw'}}>
                                                <img src="1.png" style={{width:'2vw'}}></img>
                                                <div className="ms-2 me-auto" style={{fontSize:'small'}}>
                                                    <div className="fw-bold">{post.name} </div>
                                                    {post.username}
                                                </div>
                                                <p className="ms-auto" style={{fontSize:'small'}}> posted on {new Date(post.datetime).toLocaleString()}</p>
                                            </Stack>
                                            <hr></hr>
                                            <p style={{fontWeight:'bold'}}>{post.topic}</p>
                                            <p> {post.data}</p>
                                            <Stack direction='horizontal' gap={3} style={{ alignItems:'center'}}>
                                                <Nav.Link  style={{ margin:'0', padding:'0', display:'flex', flexDirection:'row',alignItems:'center' }}>
                                                    <span>
                                                        <Badge pill bg="info">
                                                            {post.likes ?  post.likes : 0}
                                                        </Badge>
                                                    </span>
                                                    <span 
                                                        class="material-symbols-outlined icons" 
                                                        style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714', fill:'#f86714'}}>
                                                            thumb_up
                                                    </span>
                                                </Nav.Link>
                                                <Nav.Link  style={{ margin:'0', padding:'0', display:'flex', flexDirection:'row',alignItems:'center' }}>
                                                    <span>
                                                        <Badge pill bg="info">
                                                            {post.dislikes ? post.dislikes : 0}
                                                           
                                                        </Badge>
                                                    </span>
                                                    <span 
                                                        class="material-symbols-outlined icons" 
                                                        style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714'}}>
                                                            thumb_down
                                                    </span>
                                                </Nav.Link>
                                                <Nav.Link onClick={()=>setShowCommentInput(post.id)} style={{ margin:'0', padding:'0'}}>
                                                    <span 
                                                        class="material-symbols-outlined icons" 
                                                        style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714'}}>
                                                            reply
                                                    </span>
                                                </Nav.Link>
                                                {showCommentInput === post.id && 
                                                    <>     
                                                        {replyFiles.length > 0 &&
                                                            <Nav.Link 
                                                                className='ms-auto' style={{fontSize:'small', color:'white'}} 
                                                                onClick={()=>setShowFileReplyPopover(!showFileReplyPopover)}
                                                                ref={replyFilePopoverTarget}>
                                                                <Badge bg="warning" text="dark">
                                                                    Attached files {replyFiles.length}
                                                                </Badge>
                                                            </Nav.Link>
                                                        }
                                                        <Overlay target={replyFilePopoverTarget} show={showFileReplyPopover} placement='top'>
                                                            <Popover id="popover-basic"> 
                                                                <ListGroup as="ol" numbered>
                                                                    {replyFiles.length > 0 && replyFiles.map((file)=>(
                                                                        <ListGroup.Item
                                                                        as="li"
                                                                        className="d-flex justify-content-between align-items-start"
                                                                        style={{fontSize:'small'}}
                                                                        >                                        
                                                                            <div className="fw-bold">{file.name}</div>                                
                                                                            <Nav.Link style={{marginLeft:'2vw'}} onClick={()=>handleFileDelete(file.name, false, true, false)} >
                                                                                <span class="material-symbols-outlined icons" style={{fontSize:'small'}}>close</span>
                                                                            </Nav.Link>
                                                                        </ListGroup.Item>
                                                                    ))}       
                                                                </ListGroup>
                                                            </Popover>
                                                        </Overlay>
                                                        <Nav.Link 
                                                            style={{fontSize:'small', color:'#f86714'}}
                                                            onClick={()=> fileReplyRef.current.click()}
                                                            className={replyFiles.length > 0 ? "" : "ms-auto"}>
                                                            <span 
                                                                class="material-symbols-outlined icons" 
                                                                style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714'}}>
                                                                    note_add
                                                            </span>
                                                        </Nav.Link>
                                                        <input 
                                                            type='file' 
                                                            style={{ display: 'none' }}
                                                            ref={fileReplyRef}
                                                            onChange={(e)=> handleFileInput(e,false, true, false)}
                                                        />
                                                        <Nav.Link 
                                                            style={{fontSize:'small', color:'#f86714'}} 
                                                            ref={replyEmojiTarget} 
                                                            onClick={()=> setShowReplyEmoji(!showReplyEmoji)}>
                                                            <span 
                                                                class="material-symbols-outlined icons" 
                                                                style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714'}}>
                                                                    add_reaction
                                                            </span>
                                                        </Nav.Link>
                                                        <Overlay target={replyEmojiTarget} show={showReplyEmoji} placement='top'>
                                                            <Popover id="popover-basic">
                                                                <Picker data={data} onEmojiSelect={handleReplyEmojiInput} />
                                                            </Popover>
                                                        </Overlay>
                                                        <Nav.Link style={{fontSize:'small', color:'#f86714', fontWeight:'bold'}} onClick={closeCommentInput}>                          
                                                            Cancel
                                                        </Nav.Link>
                                                        <Nav.Link style={{fontSize:'small', color:'#f86714' , fontWeight:'bold'}} onClick={()=>handleNewReply(post.id)}>
                                                            Send
                                                        </Nav.Link>
                                                    </>
                                                }
                                            </Stack>
                                            {showCommentInput === post.id &&
                                                <FloatingLabel controlId="xyz" label="Comments" style={{marginTop:'0.5vw'}}>
                                                    <Form.Control
                                                        as="textarea"
                                                        style={{ height: '70px' }}
                                                        ref = {replyTextAreaRef}
                                                        onChange={(e)=>setReply(e.target.value)}
                                                        value={reply}
                                                    />
                                                </FloatingLabel> 
                                            }
                                            <hr></hr>
                                            <p style={{fontWeight:'bold', fontSize:'small'}}>All replies : </p>
                                            {(()=>{
                                                const nestedReplies = [];
                                                i = i + 1;
                                                while(i < currentChannelDetails.length && currentChannelDetails[i].level != 0){
                                                    const childPost = currentChannelDetails[i];
                                                    nestedReplies.push(
                                                        <div className="reply-block" style={{marginLeft:`${childPost.level * 3}vw`, marginTop:'2vw'}}>
                                                            <Stack direction='horizontal' style={{marginBottom:'0.5vw'}}>
                                                                <img src={childPost.avatar} style={{width:'1.5vw'}}></img>
                                                                <div className="ms-2 me-auto" style={{fontSize:'small'}}>
                                                                    <div className="fw-bold">{childPost.name} </div>
                                                                    {childPost.username}
                                                                </div>
                                                                <p className="ms-auto" style={{fontSize:'small'}}> posted on { new Date(childPost.datetime).toLocaleString()}</p>
                                                            </Stack>
                                                            <p>{childPost.data}</p>
                                                                <Stack direction='horizontal' gap={3}>
                                                                    <Nav.Link  style={{ margin:'0', padding:'0', display:'flex', flexDirection:'row',alignItems:'center' }}>
                                                                        <span>
                                                                            <Badge pill bg="info">
                                                                                {childPost.likes ?  childPost.likes : 0}
                                                                            </Badge>
                                                                        </span>
                                                                        <span 
                                                                            class="material-symbols-outlined icons" 
                                                                            style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714', fill:'#f86714'}}>
                                                                                thumb_up
                                                                        </span>
                                                                    </Nav.Link>
                                                                    <Nav.Link  style={{ margin:'0', padding:'0', display:'flex', flexDirection:'row',alignItems:'center' }}>
                                                                        <span>
                                                                            <Badge pill bg="info">
                                                                                {childPost.dislikes ? childPost.dislikes : 0}
                                                                            
                                                                            </Badge>
                                                                        </span>
                                                                        <span 
                                                                            class="material-symbols-outlined icons" 
                                                                            style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714'}}>
                                                                                thumb_down
                                                                        </span>
                                                                    </Nav.Link>
                                                                    <Nav.Link style={{fontSize:'small', color:'#f86714'}} onClick={()=>setShowCommentInput(childPost.id)}>
                                                                        <span 
                                                                            class="material-symbols-outlined icons" 
                                                                            style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714'}}>
                                                                                reply
                                                                        </span>
                                                                    </Nav.Link>
                                                                    {showCommentInput === childPost.id && 
                                                                        <>     
                                                                            {replyFiles.length > 0 &&
                                                                                <Nav.Link 
                                                                                    className='ms-auto' style={{fontSize:'small', color:'white'}} 
                                                                                    onClick={()=>setShowFileReplyPopover(!showFileReplyPopover)}
                                                                                    ref={replyFilePopoverTarget}>
                                                                                    <Badge bg="warning" text="dark">
                                                                                        Attached files {replyFiles.length}
                                                                                    </Badge>
                                                                                </Nav.Link>
                                                                            }
                                                                            <Overlay target={replyFilePopoverTarget} show={showFileReplyPopover} placement='top'>
                                                                                <Popover id="popover-basic"> 
                                                                                    <ListGroup as="ol" numbered>
                                                                                        {replyFiles.length > 0 && replyFiles.map((file)=>(
                                                                                            <ListGroup.Item
                                                                                            as="li"
                                                                                            className="d-flex justify-content-between align-items-start"
                                                                                            style={{fontSize:'small'}}
                                                                                            >                                        
                                                                                                <div className="fw-bold">{file.name}</div>                                
                                                                                                <Nav.Link style={{marginLeft:'2vw'}} onClick={()=>handleFileDelete(file.name, false, true, false)} >
                                                                                                    <span class="material-symbols-outlined icons" style={{fontSize:'small'}}>close</span>
                                                                                                </Nav.Link>
                                                                                            </ListGroup.Item>
                                                                                        ))}       
                                                                                    </ListGroup>
                                                                                </Popover>
                                                                            </Overlay>
                                                                            <Nav.Link 
                                                                                style={{fontSize:'small', color:'#f86714'}}
                                                                                onClick={()=> fileReplyRef.current.click()}
                                                                                className={replyFiles.length > 0 ? "" : "ms-auto"}>
                                                                                <span 
                                                                                    class="material-symbols-outlined icons" 
                                                                                    style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714'}}>
                                                                                        note_add
                                                                                </span>
                                                                            </Nav.Link>
                                                                            <input 
                                                                                type='file' 
                                                                                style={{ display: 'none' }}
                                                                                ref={fileReplyRef}
                                                                                onChange={(e)=> handleFileInput(e,false, true, false)}
                                                                            />
                                                                            <Nav.Link 
                                                                                style={{fontSize:'small', color:'#f86714'}} 
                                                                                ref={replyEmojiTarget} 
                                                                                onClick={()=> setShowReplyEmoji(!showReplyEmoji)}>
                                                                                <span 
                                                                                    class="material-symbols-outlined icons" 
                                                                                    style={{fontSize:'1vw', margin:'0', padding:'0', color:'#f86714'}}>
                                                                                        add_reaction
                                                                                </span>
                                                                            </Nav.Link>
                                                                            <Overlay target={replyEmojiTarget} show={showReplyEmoji} placement='top'>
                                                                                <Popover id="popover-basic">
                                                                                    <Picker data={data} onEmojiSelect={handleReplyEmojiInput} />
                                                                                </Popover>
                                                                            </Overlay>
                                                                            <Nav.Link style={{fontSize:'small', color:'#f86714', fontWeight:'bold'}} onClick={closeCommentInput}>                          
                                                                                Cancel
                                                                            </Nav.Link>
                                                                            <Nav.Link style={{fontSize:'small', color:'#f86714' , fontWeight:'bold'}} onClick={()=>handleNewReply(childPost.id)}>
                                                                                Send
                                                                            </Nav.Link>
                                                                        </>
                                                                    }
                                                                </Stack>
                                                                {showCommentInput === childPost.id &&
                                                                    <FloatingLabel controlId="xyz" label="Comments" style={{marginTop:'0.5vw'}}>
                                                                        <Form.Control
                                                                            as="textarea"
                                                                            style={{ height: '70px' }}
                                                                            ref = {replyTextAreaRef}
                                                                            onChange={(e)=>setReply(e.target.value)}
                                                                            value={reply}
                                                                        />
                                                                    </FloatingLabel> 
                                                                }   
                                                        </div>
                                                    )
                                                    i = i + 1;
                                                }
                                                return nestedReplies;
                                            })()}
                                        </div>
                                    )
                                }
                            }
                            return postsStructure; 
                        })()}
                        
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
                        <ListGroup.Item style={{fontWeight:'bold'}}># • Suggested Connections For You</ListGroup.Item>
                        {popularUsers.length > 0 && popularUsers.map((user)=>(
                             <ListGroup.Item className='message-item'>
                                <img src={user.avatar} style={{width:'2vw', marginRight:'0.5vw'}}></img>
                                <p style={{margin:'0'}}>{user.name}<p className="view-profile-button" onClick={()=>getConnectedUserDetails(user.username)}>View Profile</p></p>
                                <p className='ms-auto view-profile-button' >Message</p>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <Offcanvas show={showProfileCanvas} onHide={closeProfileCanvas} placement='end'>
                        <Offcanvas.Header >
                        <Offcanvas.Title style={{fontWeight:'bold'}}># User's Profile</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body className='profile-canvas-body'>
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
>                                                <p style={{fontSize:'small'}} >{showPreview(post.data,10)}</p>
                                            </ListGroup.Item>
                                        })}
                                    </ListGroup>
                                    </>
                                }
                            </>
                        }
                        </Offcanvas.Body>
                    </Offcanvas>

        

                </div>
                
            </div>

       </div>
    )
}

export default Channels;