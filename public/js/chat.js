const socket=io();

const messageForm=document.querySelector('#message-form');
const messageFormInput=messageForm.querySelector('input');
const messageFormButton=messageForm.querySelector('button');

const sendlocation=document.querySelector('#send-location');

const messagediv=document.querySelector('#message');

//template
const messageTemplate=document.querySelector('#message-template').innerHTML;
const locationMessageTemplate=document.querySelector('#locationMessage-template').innerHTML;
const sideBarTemplate=document.querySelector('#sidebar-template').innerHTML;

//Options
const {username,Room}=Qs.parse(location.search,{ignoreQueryPrefix :true});

const autoscroll=()=>
{
   const newMessage=messagediv.lastElementChild

   //height of new message
   const newMessageStyles=getComputedStyle(newMessage);
   const newMessageMargin=parseInt(newMessageStyles.marginBottom);
   const newMessageHeight=newMessage.offsetHeight + newMessageMargin

   //height of visible chat
   const visibleHeight=messagediv.offsetHeight

   //height of container
   const containerHeight=messagediv.scrollHeight;

   //how far have i scroled
   const scrollOffset=messagediv.scrollTop +visibleHeight

   if(containerHeight-newMessageHeight <=scrollOffset)
   {
      messagediv.scrollTop=messagediv.scrollHeight
   }
    
}

socket.on('message',(message)=>{
   console.log(message);
   const html=Mustache.render(messageTemplate,{
      username:message.username,

      message:message.text,
      createdAt:moment(message.createdAt).format('h:mm a')
   });
   messagediv.insertAdjacentHTML('beforeend',html);

   autoscroll();
});
socket.on('locationMessage',(message)=>
{
   console.log(message);
   const html=Mustache.render(locationMessageTemplate,{
      username:message.username,
     url:message.url,
     createdAt:moment(message.createdAt).format('h:mm a')
   });
   messagediv.insertAdjacentHTML('beforeend',html);

   autoscroll();
})

socket.on('roomData',({Room,users})=>{
   const html=Mustache.render(sideBarTemplate,{
      Room,
      users
   });
   document.querySelector('#sidebar').innerHTML=html;
})
messageForm.addEventListener('submit',(e)=>{

   e.preventDefault();

   messageFormButton.setAttribute('disabled','disabled');

   const message=e.target.elements.message.value;//const message=document.querySelector('input').value;

   socket.emit('sendMessage',message,(error)=>
   {

      messageFormButton.removeAttribute('disabled');
      messageFormInput.value='';
      messageFormInput.focus();
      if(error)
      {
        return console.log(error);
      }
      console.log('message delivered');
   });

});
sendlocation.addEventListener('click',()=>
{
   
   if(!navigator.geolocation)
   {
      return alert('geo location is not supported by your browser');
   }
   sendlocation.setAttribute('disabled','disabled');
   navigator.geolocation.getCurrentPosition((position)=>
   {
      socket.emit('sendLocation',{
        latitude: position.coords.latitude,
        longitude: position.coords.longitude

       },()=>
       {
         sendlocation.removeAttribute('disabled');
          console.log('location shared');
       });
       
   });

});


socket.emit('join',{username,Room},(error)=>
{
   if(error)
   {
      alert(error);
      return '/';
   }

});