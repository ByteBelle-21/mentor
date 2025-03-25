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
                      name VARCHAR(100) NOT NULL,
                      totalPosts INT
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
                    [ request.body.signUsername,
                      request.body.signEmail,
                      request.body.signPassword,
                      request.body.signName,
                      request.body.signProfession,
                      request.body.signSkills,
                      request.body.signAvatar,
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
    db.query(`SELECT * FROM userTable WHERE email=? AND username=? AND password=?`,
        [request.body.logEmail, request.body.logUsername, request.body.logPassword],(error, result)=>{
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


// Add new message
app.post('/addMessage',(request, response)=>{
    db.query(`INSERT INTO messageTable(
        senderId,
        receiverId,
        message,
        datetime,
        )
        VALUES (?,?,?,?)`,
      [ request.body.senderId,
        request.body.receiverId,
        request.body.message,
        request.body.datetime,
      ],
      error=>{
          if(error){
              response.status(500).send("Server error while adding new message");
              return;
          }
          afterMsgUpload(request.body.senderId, request.body.receiverId);
          response.status(200).send("New message added successfully!");
      })
})


function afterMsgUpload(sender, receiver){
    db.query(`SELECT * FROM messageTable 
              WHERE (senderId=? AND receiverId=?)
              OR
              (senderId=? AND receiverId=?)`,
            [ sender, receiver, receiver,sender],
            (error, result)=>{
                if(error){
                    response.status(500).send("Server error while checking whether new connection or not");
                    return;
                } 
                if(result.length == 0){
                    db.query(` UPDATE userTable SET connections = IFNULL(connections, 0) + 1 WHERE id = ? OR id =?`,[sender, receiver],error=>{
                        if(error){
                            console.error("Server error during updating connections in userTable");
                            return;
                        }
                        console.log("Successfully updated connections in userTable");
                    });
                }
            })
}


app.post('/addPost',(request, response)=>{
    let parentLevel = -1;
    if(request.body.replyTo != 0){
        db.query(`SELECT level FROM postTable WHERE id =?`,[request.body.replyTo],(error, levelResult)=>{
            if(error){
                response.status(500).send("Server error during retriving parent post level while adding new post");
                return;
            }
            parentLevel = levelResult[0].level;
        })
    }
    db.query(`INSERT INTO postTable(
              userId,
              channelId,
              replyTo,
              topic,
              data,
              datetime,
              level
              )
              VALUES (?,?,?,?,?,?,?)`,
            [ request.body.userId,
              request.body.channelId,
              request.body.replyTo,
              request.body.topic,
              request.body.data,
              request.body.datetime,
              (parentLevel + 1)
            ], 
            error=>{
                if(error){
                    response.status(500).send("Server error while adding new post");
                    return;
                }
                afterPostUpload( request.body.userId, request.body.channelId);
                response.status(200).send("New post added successfully!");
            })
})

app.post('/uploadFiles',(request, response)=>{
    const filePromise = request.body.files.map((file)=>{
        return new Promise((resolve,reject)=>{
            db.query(`INSERT INTO fileTable(
                      postId,
                      messageId,
                      fileName,
                      fileType,
                      file
                    ),VALUES(?,?,?,?,?)`,
                    [
                      request.body.postId,
                      request.body.messageId,
                      file.fileName,
                      file.fileType,
                      file.file
                    ],
                    (error,result)=>{
                        if(error){
                            reject(error);
                        }
                        else{
                            resolve(result);
                        }
                    })
        })
    })

    Promise.all(filePromise).then(()=>{
        response.status(200).send("New files added successfully!");
    })
    .catch(()=>{
        res.status(500).send('Server error while saving files');
    })
    
})


function afterPostUpload(user,channel){
    db.query(` UPDATE channelTable SET totalPosts = IFNULL(totalposts, 0) + 1 WHERE id = ?`,[channel],error=>{
        if(error){
            console.error("Server error during updating total posts in channelTable");
            return;
        }
        console.log("Successfully updated total posts in channelstable");
    });
    db.query(` UPDATE userTable SET totalPosts = IFNULL(totalPosts, 0) + 1 WHERE id = ?`,[user],error=>{
        if(error){
            console.error("Server error during updating total posts in userTable");
            return;
        }
        console.log("Successfully updated total posts in userTable");
    });
}


app.get('/searchChannel',(request, response)=>{
    db.query(` SELECT * FROM channelTable WHERE name LIKE ?`,
            [ `%${request.body.channel}%`],(error, result)=>{
                if(error){
                    response.status(500).send("Server error during searching channel");
                    return;
                }
                response.status(200).json(result);
            })
})


app.get('/searchPost',(request, response)=>{
    db.query(` SELECT * FROM postTable WHERE topic LIKE ? OR data LIKE ?`,
            [ `%${request.body.post}%`, `%${request.body.post}%`],(error, result)=>{
                if(error){
                    response.status(500).send("Server error during searching post");
                    return;
                }
                response.status(200).json(result);
            })
})


app.get('/searchPerson',(request, response)=>{
    db.query(` SELECT * FROM userTable WHERE name LIKE ? OR username LIKE ?`,
            [`%${request.body.person}%`, `%${request.body.person}%`],(error, result)=>{
                if(error){
                    response.status(500).send("Server error during searching people");
                    return;
                }
                response.status(200).json(result);
            })
})






/************************************************************************************************************************************
                                        Functionality Related to profile page

************************************************************************************************************************************/

app.get('/activeUsers', (request, response)=>{
    db.query(`SELECT * from userTable WHERE id!=? ORDER BY totalPosts DESC LIMIT 5`,
            [ request.body.currUser],(error, result)=>{
                if(error){
                    response.status(500).send("Server error during retriving active users");
                    return;
                }
                response.status(200).json(result);
            })
})


app.get('/activeChannels', (request, response)=>{
    db.query(`SELECT * from channelTable ORDER BY totalPosts DESC LIMIT 7`,(error, result)=>{
        if(error){
            response.status(500).send("Server error during retriving active chahnels");
            return;
        }    
        response.status(200).json(result);
    })
})

app.post('/saveChanges',(request, response)=>{
    db.query(`UPDATE userTable 
              SET 
              name= ?, username=?, skills=?,avatar=?, profession=?
              WHERE userId=?`,
            [ request.body.name,
              request.body.username,
              request.body.skills,
              request.body.avatar,
              request.body.profession,
              request.body.id,
            ],error=>{
                if(error){
                    response.status(500).send("Server error during saving changes for profile");
                    return;
                }
                response.status(200).send("Successfully saved changes for profile");
            })
})


app.post('/addMedia',(request, response)=>{
    db.query(`INSERT INTO mediaTable(
              userId,
              type,
              link
            ) VALUES (?,?,?)`,
            [ request.body.userId,
              request.body.type,
              request.body.link,
            ],error=>{
                if(error){
                    response.status(500).send("Server error during adding new media");
                    return;
                }
                response.status(200).send("Successfully added new media");
            })
})


app.post('/removeMedia',(request, response)=>{
    db.query(`DELETE FROM mediaTable WHERE userId=? AND id=?`,
            [ request.body.userId, request.body.mediaId ],error=>{
                if(error){
                    response.status(500).send("Server error during deleting media");
                    return;
                }
                response.status(200).send("Successfully deleted media");
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