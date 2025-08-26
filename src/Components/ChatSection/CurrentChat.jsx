import {useState,useEffect,useContext,useRef} from 'react'
import { Button,Alert} from '@mui/material'
import { Send , AttachFile,Cancel} from '@mui/icons-material'
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
  const [otherProfile,setOtherProfile] = useState(null)
  const [alertMessage,setAlertMessage] = useState(null)
  const {register,handleSubmit} = useForm()
  const randomBackGroundArr = ['https://images.pexels.com/photos/9539474/pexels-photo-9539474.jpeg','https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg','https://images.pexels.com/photos/1645668/pexels-photo-1645668.jpeg','https://i.pinimg.com/736x/5c/0c/3a/5c0c3a646d366e220c445d2a0d7cef46.jpg','https://png.pngtree.com/background/20240824/original/pngtree-blue-and-purple-neon-star-3d-art-background-with-a-cool-picture-image_10210904.jpg','https://cdn.wallpapersafari.com/43/82/Z9szGWV.webp','https://plus.unsplash.com/premium_photo-1681426327290-1ec5fb4d3dd8?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29vbCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D&ixlib=rb-4.1.0&q=60&w=3000'] 

  const randomBackGround = randomBackGroundArr[Math.floor(Math.random() * randomBackGroundArr.length)] 
  const {currentTalk,currentName,onlineArr,setOnlineArr,recentSearchedForOnline,userDetails,friends} = useContext(UserContext)
  
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
    const ifMoreThan198 = fileArr.find(file=>(file.size>150*1024*1024))
    
    if(ifMoreThan198){
      setAlertMessage('each file size should not me more than 150 mb')
      return
    }

    if(fileArr.length>0){
     data.files = await Promise.all(fileArr.map(fileToBase64))  
    }
      data.type = 'sendMessage'

     throughWS(data)
     document.getElementById("message").value=''
     setFileArr([])
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
  const picObj=friends?.find(val=>(val._id===currentTalk))
  picObj && setOtherProfile(picObj?.profilePic)
},
[currentTalk,props.socket])


  const handleFileChange=(e)=>{
      const Attach_files = Array.from(e.target.files)
      setFileArr(prev=>([...prev,...Attach_files])) 
  } 
    
  return (
    <form className={`w-[70vw]  relative gap-10 items-center flex flex-col  bg-blue-100 rounded-md`} onSubmit={handleSubmit(sendMessage)}>
      <img src={randomBackGround} alt=""  className='absolute top-[0] left-[0] w-[100%] h-[87vh] z-0 rounded-md'/>
      {alertMessage && <Alert  variant='standard' sx={{padding:'15px'}} className='absolute z-3  top-[10%] left-[30%]' closeText='ok' color='error' onClose={()=>{setAlertMessage(null) }} >{alertMessage}</Alert>}
      <div className="sheet absolute bg-black opacity-65 z-1 w-[100%] h-[87vh] rounded-md"></div>
     {currentTalk?<ChatHeader profilePic={otherProfile} name={currentName}  currentTalk={currentTalk} onlineArr={onlineArr}/>:<WelcomeMessage userDetails={props?.userDetails}/>}
     <ChatBody allMessage={allMessage} otherProfile={otherProfile} userDetails={props?.userDetails} socket={props.socket}/>
     <div className='w-[60%] flex z-2 p-2 mb-2 bg-white rounded'>
      {fileArr.length > 0 && (
  <div className="files flex absolute gap-3 overflow-x-auto bottom-[12%] p-2 max-w-[80%] rounded-lg bg-white/70 backdrop-blur-sm shadow-md">
    {fileArr.map((file, index) => {
      // Detect file type for icon
      const fileType = file.type.split("/")[0];
      let icon = "📄";
      if (fileType === "image") icon = "🖼️";
      else if (file.type.includes("mp4")) icon = "▶️";
      else if (file.type.includes("pdf")) icon = "📕";
      else if (file.type.includes("zip") || file.type.includes("rar")) icon = "🗜️";

      return (
        <div
          key={index}
          className="relative flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm border border-gray-200 min-w-[160px] hover:shadow-lg transition-shadow"
        >
          <span className="text-2xl">{icon}</span>
          <div className="flex flex-col text-sm max-w-[100px] overflow-hidden">
            <span className="truncate font-medium">{file.name}</span>
            <span className="text-gray-500 text-xs">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
          <Cancel
            color="error"
            className="absolute top-1 right-1 cursor-pointer hover:scale-110 transition-transform"
            onClick={() =>
              setFileArr((prev) => prev.filter((_, i) => i !== index))
            }
          />
        </div>
      );
    })}
  </div>
)}

     <input className='bg-white p-2 w-[65%] rounded'  {...register('message',{required:true})} id="message" placeholder={fileArr.length<=0?'write a message 🗨️ or attach a file 📂':'Enter a description for the files'}/>
     <Button  endIcon={<AttachFile/>} type='button'  color='primary'  style={{padding:'10px 10px'}} onClick={()=>{fileElement.current.click()}}  />
     <Button  startIcon={<Send/>} type='submit'  color='primary'  style={{padding:'10px 30px'}}  variant='outlined' disabled={wait} >{wait?'Generating...':"Send"}</Button>
     </div>
     <input type="file" multiple style={{display:"none"}} onChange={handleFileChange} ref={fileElement}/>
    </form>
  )
}

export default CurrentChat
