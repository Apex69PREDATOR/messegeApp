import {useState,useEffect,useContext} from 'react'
import { Button} from '@mui/material'
import {useForm} from 'react-hook-form'
import WelcomeMessage from './WelcomeMessage'
import ChatHeader from './ChatHeader'
import { UserContext } from '../../Context/UserProvider'
import ChatBody from './ChatBody'


const CurrentChat = (props) => {
  const [wait,setWait] = useState(false)
  const [allMessage , setAllMessage] = useState([])
  const {register,handleSubmit} = useForm()

  const {currentTalk,currentName,onlineArr,setOnlineArr,recentSearchedForOnline,userDetails} = useContext(UserContext)
  
    async function throughWS(data){
     const repeat = setInterval(()=>{
      data.type = 'sendMessage'
        if(props.socket.readyState === WebSocket.OPEN){
          props.socket.send(JSON.stringify(data))
          clearInterval(repeat)
        }
        },100)
  }


  const sendMessage=(data)=>{
    data.to = currentTalk
     throughWS(data)
     document.getElementById("message").value=''
  }
  useEffect(() => {
    if (!props.socket) return;

    props.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'status') {
       if(data.isOnline){
        setOnlineArr(prev=>{
          if(!prev.includes(data.onlineId)){
               return [...prev,data.onlineId]
          }
          return prev
        })
       }
       else{
        setOnlineArr(prev=>(prev.filter(id=>(id!==data.onlineId))))
       }
      

        data.previousMessages &&  setAllMessage((Array.isArray(data?.previousMessages) ? data.previousMessages : []))
      } else if (data.message && (data.from === currentTalk || data.from === userDetails._id)) {

        setAllMessage(prev=>{
          return [...prev,data.message]})
      }
    };
  }, [props.socket,currentTalk]);

  const checkOnline=(id)=>{
    if (props?.socket.readyState === WebSocket.OPEN) {
    props.socket.send(JSON.stringify({type:'status',id,requestFrom:props?.userDetails?._id}));
    recentSearchedForOnline.current.add(id)
  } else {
    const interval = setInterval(() => {
      if (props?.socket.readyState === WebSocket.OPEN) {
        props.socket.send(JSON.stringify({type:'status',id,requestFrom:props?.userDetails?._id}));
    recentSearchedForOnline.current.add(id)
        clearInterval(interval);
      }
    }, 100);
     setTimeout(() => clearInterval(interval), 5000)
  }
  } 
 
  useEffect(()=>{ 
    if (currentTalk && props.socket) {
    checkOnline(currentTalk);
  }
},
[currentTalk,props.socket])


  
    
  return (
    <form className=" w-[65vw]  relative gap-10 items-center flex flex-col  bg-blue-100 rounded-md bg-[url('https://marketplace.canva.com/EAFd04X_x50/1/0/900w/canva-black-aesthetic-cat-phone-wallpaper-XriLrueECN4.jpg')] bg-center bg-no-repeat" onSubmit={handleSubmit(sendMessage)}>
     {currentTalk?<ChatHeader name={currentName} currentTalk={currentTalk} onlineArr={onlineArr}/>:<WelcomeMessage userDetails={props?.userDetails}/>}
     <ChatBody allMessage={allMessage} userDetails={props?.userDetails} socket={props.socket}/>
     <input className='bg-white p-[20px] w-[60%] rounded'  {...register('message',{required:true})} id="message" placeholder='write a message 🗨️'/>
     <Button type='submit' color='primary'  style={{padding:'15px 70px'}}  variant='contained' disabled={wait} >{wait?'Generating...':"Send"}</Button>

    </form>
  )
}

export default CurrentChat
