const path=require('path');
const http=require('http');
const express=require('express');
const socketio=require('socket.io');
const Filter=require('bad-words');
const {generateMessage,genrateLocationMessage}=require('./utils/messages');

const {addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users');

const app=express();
const server=http.createServer(app);
const io=socketio(server);

const port=8000;

const publicDirectoryPath =path.join(__dirname,'../public');

app.use(express.static(publicDirectoryPath));


io.on('connection',(socket)=>{

  console.log('New web socket');
   
   socket.on('join',({username,Room},callback)=>
   {
       
       const {user,error} =addUser({id: socket.id,username,Room});
        console.log(user);
         if(error)
        {
         return callback(error);
        }

      
      socket.join(user.Room);

      socket.emit('message',generateMessage('admin','Welcome'));

   socket.broadcast.to(user.Room).emit('message',generateMessage('admin',`${user.username} has joined`));
    
      io.to(user.Room).emit('roomData',
      {
          Room:user.Room,
          users:getUsersInRoom(user.Room)
      });
     callback();

     });

   socket.on('sendMessage',(message,callback)=>{

     const user=getUser(socket.id);
     console.log(user);

       const filter=new Filter();
     if(filter.isProfane(message))
     {
        return callback('bad words not allowed');
     }
    io.to(user.Room).emit('message',generateMessage(user.username,message));
    callback();
   });

   
   socket.on('disconnect',()=>{
    const user=removeUser(socket.id);
    if(user)
    {
            io.to(user.Room).emit('message',generateMessage('admin',`${user.username} has left`));
            io.to(user.Room).emit('roomData',
            {
                Room:user.Room,
                users:getUsersInRoom(user.Room)
            });
    
        } 

    
    });

  socket.on('sendLocation',(coords,callback)=>
  {
      const user=getUser(socket.id);
      io.to(user.Room).emit('locationMessage',genrateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
      callback();
  });
});

server.listen(port,function(err)
{
    if(err)
    {
        console.log('Error in running server:',err);
    }
    console.log('server is running on port',port);
});