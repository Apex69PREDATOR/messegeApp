import {useState,useEffect,useContext,useRef} from 'react'
import { Button} from '@mui/material'
import { Send , AttachFile} from '@mui/icons-material'
import {useForm} from 'react-hook-form'
import WelcomeMessage from './WelcomeMessage'
import ChatHeader from './ChatHeader'
import { UserContext } from '../../Context/UserProvider'
import ChatBody from './ChatBody'


const CurrentChat = (props) => {
  const [wait,setWait] = useState(false)
  const fileElement = useRef()
  const [allMessage , setAllMessage] = useState([])
  const [fileArr,setFileArr] = useState([])
  const {register,handleSubmit} = useForm()
  const randomBackGroundArr = ['https://images.pexels.com/photos/9539474/pexels-photo-9539474.jpeg','https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg','https://images.pexels.com/photos/1645668/pexels-photo-1645668.jpeg','https://i.pinimg.com/736x/5c/0c/3a/5c0c3a646d366e220c445d2a0d7cef46.jpg','https://png.pngtree.com/background/20240824/original/pngtree-blue-and-purple-neon-star-3d-art-background-with-a-cool-picture-image_10210904.jpg','https://cdn.wallpapersafari.com/43/82/Z9szGWV.webp','https://plus.unsplash.com/premium_photo-1681426327290-1ec5fb4d3dd8?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29vbCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D&ixlib=rb-4.1.0&q=60&w=3000'] 

  const randomBackGround = randomBackGroundArr[Math.floor(Math.random() * randomBackGroundArr.length)] 
  const {currentTalk,currentName,onlineArr,setOnlineArr,recentSearchedForOnline,userDetails} = useContext(UserContext)
  
    async function throughWS(data){
     const repeat = setInterval(()=>{
        if(props.socket.readyState === WebSocket.OPEN){
          props.socket.send(JSON.stringify(data))
          clearInterval(repeat)
        }
        },100)
  }
  const fileToBase64=(file)=>{  
  return new Promise((resolve,reject)=>{
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = ()=>{
      resolve({name:file.name,type:file.type,size:file.size,data:reader.result})
    }
    reader.onerror=reject
   })

  }

  const sendMessage=async (data)=>{
    data.to = currentTalk
    if(fileArr.length>0){
     data.files = await Promise.all(fileArr.map(fileToBase64))  
    }
      data.type = 'sendMessage'

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


  const handleFileChange=(e)=>{
      const Attach_files = Array.from(e.target.files)
      setFileArr(prev=>([...prev,...Attach_files])) 
  } 
    
  return (
    <form className={`w-[65vw]  relative gap-10 items-center flex flex-col  bg-blue-100 rounded-md`} onSubmit={handleSubmit(sendMessage)}>
      <img src={randomBackGround} alt=""  className='absolute top-[0] left-[0] w-[100%] h-[82vh] z-0 rounded-md'/>
      <div className="sheet absolute bg-black opacity-65 z-1 w-[100%] h-[82vh] rounded-md"></div>
     {currentTalk?<ChatHeader name={currentName} currentTalk={currentTalk} onlineArr={onlineArr}/>:<WelcomeMessage userDetails={props?.userDetails}/>}
     <ChatBody allMessage={allMessage} userDetails={props?.userDetails} socket={props.socket}/>
     <div className='w-[60%] flex z-2 p-2 bg-white rounded'>
     <input className='bg-white p-[10px] w-[70%] rounded'  {...register('message',{required:true})} id="message" placeholder='write a message 🗨️'/>
     <Button  endIcon={<AttachFile/>} type='button'  color='primary'  style={{padding:'10px 10px'}} onClick={()=>{fileElement.current.click()}}  />
     <Button  startIcon={<Send/>} type='submit'  color='primary'  style={{padding:'15px 30px'}}  variant='outlined' disabled={wait} >{wait?'Generating...':"Send"}</Button>
     </div>
     <input type="file" multiple style={{display:"none"}} onChange={handleFileChange} ref={fileElement}/>
    </form>
  )
}

export default CurrentChat
