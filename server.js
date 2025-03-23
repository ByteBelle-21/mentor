const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const PORT = 4000;
const app = express();


app.use(cors({
       origin: 'https://psutar9920-3000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai'
}));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



/************************************************************************************************************************************
                                        Functionality Related to the Database and Tables Creation 

************************************************************************************************************************************/

// Create connection with MYSQL server 
var db = mysql.createPool({
    host: 'mysql-image',
    user: 'root',
    password: 'zxcvbnm'
});


// Create database postForum
// Create user, channel, post, media, file, message tables 
db.getConnection((err,connection)=>{
    if (err){
        console.log("Error connecting to mysql: ",err);
        process.exit(1);
    }
    else{
        console.log("Connected Successfully to MYSQL");
    }

    connection.query(`CREATE DATABASE IF NOT EXISTS postForum`, error=>{
        if(error){
            console.log("Error while creating database postForum: ", error);
        }
        else{
            console.log("Successfully created postForum database");
        }
    });

    connection.query(`USE postForum`, error=>{
        if(error){
            console.log("Error while using database postForum: ", error);
        }
        else{
            console.log("Successfully accessed postForum database");
        }
    });

    connection.query(`CREATE TABLE IF NOT EXISTS userTable
                    ( id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                      username VARCHAR(50) NOT NULL,
                      email VARCHAR(50) NOT NULL,
                      password VARCHAR(50) NOT NULL,
                      name VARCHAR(100) NOT NULL,
                      profession VARCHAR(50) NOT NULL,
                      skills TEXT NOT NULL,
                      avatar VARCHAR(100) NOT NULL,
                      totalPosts INT NOT NULL,
                      connections INT NOT NULL
                    )`,error=>{
                        if(error){
                            console.log("Error occured while creating user table : ", error);
                            return;
                        }
                        else{
                            console.log("Successfully created user table");
                        }
    });

    connection.query(`CREATE TABLE IF NOT EXISTS mediaTable
                    ( id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                      userId INT NOT NULL,
                      type TEXT NOT NULL,
                      link TEXT NOT NULL
                    )`,error=>{
                        if(error){
                            console.log("Error occured while creating media table : ", error);
                            return;
                        }
                        else{
                            console.log("Successfully created media table");
                        }
    });

    connection.query(`CREATE TABLE IF NOT EXISTS channelTable
                    ( id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                      name VARCHAR(100) NOT NULL
                    )`,error=>{
                        if(error){
                            console.log("Error occured while creating channel table : ", error);
                            return;
                        }
                        else{
                            console.log("Successfully created channel table");
                        }
    });

    connection.query(`CREATE TABLE IF NOT EXISTS postTable
                    ( id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                      userId INT NOT NULL,
                      channelId INT NOT NULL,
                      replyTo INT NOT NULL,
                      topic TEXT NOT NULL,
                      data TEXT NOT NULL,
                      datetime DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
                      level INT
                    )`,error=>{
                        if(error){
                            console.log("Error occured while creating post table : ", error);
                            return;
                        }
                        else{
                            console.log("Successfully created post table");
                        }
    });

    connection.query(`CREATE TABLE IF NOT EXISTS fileTable
                    ( id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                      postId INT,
                      messageId INT,
                      fileName TEXT NOT NULL,
                      fileType TEXT NOT NULL,
                      file LONGBLOB NOT NULL,
                    )`,error=>{
                        if(error){
                            console.log("Error occured while creating file table : ", error);
                            return;
                        }
                        else{
                            console.log("Successfully created file table");
                        }
    });

    connection.query(`CREATE TABLE IF NOT EXISTS messageTable
                    ( id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                      senderId INT NOT NULL,
                      receiverId INT NOT NULL,
                      message TEXT NOT NULL,
                      datetime DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
                    )`,error=>{
                        if(error){
                            console.log("Error occured while creating message table : ", error);
                            return;
                        }
                        else{
                            console.log("Successfully created message table");
                        }
    });

});




/************************************************************************************************************************************
                                        Functionality Related to homepage 

************************************************************************************************************************************/


// Sign up functionality 
app.post('/signup', (request,response)=>{
    db.query(`SELECT * FROM userTable WHERE email=?`,[request.body.signupEmail],(error, emailResult)=>{
        if(error){
            response.status(500).send("Server error during retriving user info  associated with email for sign up");
            return;
        }
        if(emailResult.length != 0){
            response.status(401).send("Provided email is already associate with other account");
            return;
        }
        db.query(`SELECT * FROM userTable WHERE username=?`,[request.body.signupUsername],(error, usernameResult)=>{
            if(error){
                response.status(500).send("Server error during retriving user info  associated with username for sign up");
                return;
            }
            if(usernameResult.length != 0){
                response.status(401).send("Provided username is already associate with other account");
                return;
            }
            db.query(`INSERT INTO userTable
                    ( username,
                      email,
                      password,
                      name,
                      profession,
                      skills,
                      avatar,
                      totalPosts,
                      connections)
                      VALUES (?,?,?,?,?,?,?,?,?)`,
                    [ request.body.signupUsername,
                      request.body.signupEmail,
                      request.body.signupPassword,
                      request.body.signupName,
                      request.body.signupProfession,
                      request.body.signupSkills,
                      request.body.signupAvatar,
                      0,
                      0
                    ],error=>{
                        if(error){
                            response.status(500).send("Server error during adding new user to user table");
                            return;
                        }
                        response.status(200).send("Successfully signed up");
                    })    
        })
    }) 
})


// Log in functionality 
app.post('/login', (request,response)=>{
    db.query(`SELECT * FROM userTable WHERE email=? AND username=?`,[request.body.loginEmail,request.body.loginUsername],(error, result)=>{
        if(error){
            response.status(500).send("Server error during retriving user info  associated with email for log in");
            return;
        }
        if(result.length == 0){
            response.status(401).send("Provided email is already not associate with any account");
            return;
        }
        response.status(200).send("Successfully Logged in");
    })    
})



/************************************************************************************************************************************
                                        Functionality Related to channels page 

************************************************************************************************************************************/

// Add new channe;
app.post('/addChannel',(request,response)=>{
    db.query(`SELECT * FROM channelTable WHERE name=?`,[request.body.name],(error, channelResult)=>{
        if(error){
            response.status(500).send("Server error during retrieving channel details while adding new channel");
            return;
        }
        if(channelResult.length != 0){
            response.status(401).send("Channel with given name already exists");
            return;
        }
        db.query(`INSERT INTO channelTable (name) VALUES (?)`,[request.body.name], error =>{
            if(error){
                response.status(500).send("Server error while adding new channel");
                return;
            }
            response.status(200).send("Successdully added channel to the table");
        })
    })
})


// Retrieve all channel details
app.get('/getAllChannels',(request,response)=>{
    db.query(`SELECT * FROM channelTable`,(error, result)=>{
        if(error){
            response.status(500).send("Server error during retriving all channel's name");
            return;
        }
        response.status(200).json(result);
    })
})


// Retrive connected users
app.get('/getConnectedUsers',(request,response)=>{
    db.query(`SELECT DISTINCT
              CASE WHEN m.senderId=? THEN u_receiver.username
                   WHEN m.receiverId=? THEN u_sender.username
              END AS username,
              CASE WHEN m.senderId=? THEN u_receiver.name
                   WHEN m.receiverId=? THEN u_sender.name
              END AS name,
              CASE WHEN m.senderId=? THEN u_receiver.avatar
                   WHEN m.receiverId=? THEN u_sender.avatar
              END AS avatar
              FROM messageTable as m
              JOIN userTable u_receiver ON m.receiverId = u_receiver.id
              JOIN userTable u_sender ON m.senderId = u_sender.id
              `,[request.body.userId,request.body.userId,request.body.userId,request.body.userId]
            ,(error, result)=>{
            if(error){
                response.status(500).send("Server error during retriving all connected users");
                return;
            }
            response.status(200).json(result);
    })
})


// Retrive messages between current login user and selected user
app.get('/getAllMessages',(request,response)=>{
    db.query(`SELECT * FROM messageTables 
              WHERE senderId=? AND receiverId=? 
              OR senderId=? AND receiverId=? 
              ORDER BY datetime`,
              [request.body.currUser, request.body.otherUser, request.body.otherUser,request.body.currUser],
              (error, messageResult)=>{
                if(error){
                    response.status(500).send("Server error during retriving all messages");
                    return;
                }
                const messagesPromise =  messageResult.map(message=>{
                    return new Promise((resolve, reject)=>{
                        db.query(`SELECT * FROM fileTable WHERE messageId=?`,[message.id],(error, fileResult)=>{
                            if(error){
                                reject("Server error during retriving all files related to current message");
                            }
                            else{
                                resolve({...message,files:fileResult.length> 0? fileResult:[]})
                            }
                        })
                    })
                })
                Promise.all(messagesPromise)
                .then(messagesWithFiles=>{
                    response.status(200).json(messagesWithFiles);
                })
                .catch(error=>{
                    response.status(500).send("Server error during retriving all messages with their files");
                })
            })
})


/************************************************************************************************************************************
                                        Functionality common to all page 

************************************************************************************************************************************/

// Get all details associated with given user
app.get('/getUserDetails',(request,response)=>{
    db.query(`SELECT * FROM userTable WHERE username=?`,[request.body.username],(error, userResult)=>{
        if(error){
            response.status(500).send("Server error during retriving user details");
            return;
        }
        db.query(`SELECT * FROM mediaTable WHERE userId=?`,[userResult[0].id],(error, mediaResult)=>{
            if(error){
                response.status(500).send("Server error during retriving media info for user details");
                return;
            }
            db.query(`SELECT * FROM postTable WHERE userId=?`,[userResult[0].id],(error, postResult)=>{
                if(error){
                    response.status(500).send("Server error during retriving media info for user details");
                    return;
                }
                response.status(200).json({'userInfo': userResult[0], 'media':mediaResult, 'post':postResult}) 
            })
        })
    })
})


app.listen(PORT,()=>{
    console.log("Server is listening on port ",PORT);
})