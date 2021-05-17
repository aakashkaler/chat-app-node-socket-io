const users=[]

//add user,remove user,getUser,get userinroom

const addUser = ({id,username,Room})=>
{
    username=username.trim().toLowerCase();
    Room=Room.trim().toLowerCase();
  
    //validate data
    if(!username||!Room)
    {
        return {
            error: 'username and room required'
        }
    }


const existingUser =users.find((user)=>
{
  return user.Room==Room&&user.username==username
});

//validate usernaem
if(existingUser)
{
    return{
        error:'username is used'
    }
}
  //Store users

  const user={id,username,Room}
  users.push(user);
  
  return { user };
}

const removeUser=(id)=>{
    const index=users.findIndex((user)=>
    {
        return user.id===id;
    }); 

    if(index!==-1)
    {
       return users.splice(index,1)[0]
    }
}

const getUser = (id)=>{

    return users.find((user)=>user.id===id)
}

const getUsersInRoom =(Room)=>{
    return users.filter((user)=>user.Room===Room)
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}


