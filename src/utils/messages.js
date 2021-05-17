const generateMessage = (username,text)=>{

    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const genrateLocationMessage=(username,url)=>
{
    return{
        username,
       url,
       createdAT:new Date().getTime()
    }
}

module.exports ={
    generateMessage,
    genrateLocationMessage
}
