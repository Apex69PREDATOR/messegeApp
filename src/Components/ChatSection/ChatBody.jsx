import {useEffect,useState,useContext} from 'react';
import { UserContext } from '../../Context/UserProvider';
import { Button } from '@mui/material';
import ReactPlayer from 'react-player'


const ChatBody = (props) => {
  const {currentTalk,randomImage} = useContext(UserContext)
  const [seenArr,setSeenArr] = useState([])
  const [idate,setIdate] = useState(null)

const commonImageFormats = ["jpg","jpeg","png","gif","webp","avif","svg","ico", "bmp"];
const commonDocumentFormats = ["pdf","txt"];

const commonVideoFormats = [
  "mp4",   // MPEG-4, most widely supported
  "webm",  // WebM, modern & open format, good for web
  "ogg",   // Ogg/Theora, older but supported in browsers
  "avi",   // Audio Video Interleave, older format
  "mov",   // QuickTime format (Apple)
  "wmv",   // Windows Media Video (Microsoft)
  "flv",   // Flash Video (older, not widely used now)
  "mkv",   // Matroska, supports multiple codecs
  "3gp",   // Mobile video format
  "mpeg",  // MPEG video files
  "ts",    // Transport Stream, often used in streaming
  "m4v"    // Apple’s variant of MP4
];


const months= ['Jan','Feb','Mar','Apr','May','Jun','Jul',"Aug",'Sep','Oct','Nov','Dec']

  const markSeen=()=>{
    
    if(!props.socket)
      return
    const handleMessage=(event)=>{
      const data = JSON.parse(event.data)
      
      if(data.type === 'seenId'){
        setSeenArr(prev=>([...prev,data.seenId]))
        
      }
    }
    props.socket.addEventListener('message',handleMessage)

    return ()=>{
      props.socket.removeEventListener('message',handleMessage)
    }
  }
  const sendSeen=(message)=>{
    if(props?.socket?.readyState === WebSocket.OPEN){
      
      props.socket.send(JSON.stringify({
        type:'messageSeen',
        message
      }))
    }
  }
  const observeMessageSeen=()=>{
    const observer = new IntersectionObserver((entries)=>{
        entries.forEach(element=>{
          if(element.isIntersecting)
            sendSeen(element.target.id)
          
        })
    })
    const messages=  [...document.getElementsByClassName('msgReceived')]
    messages.forEach(msg=>(
    observer.observe(msg)
    ))
  }
  useEffect(()=>{
      const lastMsg= document.getElementsByClassName("lastMsg")[0]
      if(lastMsg){
        lastMsg.scrollIntoView({behavior:'smooth',block:'end'})
      }
      observeMessageSeen()
  },[props.allMessage])
  useEffect(()=>{
    const cancel=markSeen()
    return cancel
  },[props.socket])
  const randomPic = randomImage[Math.floor(Math.random() * randomImage.length)]
  const length = props?.allMessage?.length
  const MesssageDates = new Set()

   const setSticky=()=>{
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(element=>{
        const id = element.target.id.split('|')[0]
        const neededobj = props.allMessage.find(obj=>(obj._id===id))
        const neededdate = new Date(neededobj.sendAt) 
        
        const txt  = neededdate.getDate() + '-' + months[neededdate.getMonth()] + '-' + neededdate.getFullYear()
        
        
        if(element.isIntersecting){
         setIdate(txt)
          
        }
        else{
          setIdate(null)
          
        }
      })
    })
    const messageDate = document.querySelectorAll('.msgContainer')

     messageDate.forEach(date=>(
      observer.observe(date)))
    return ()=>observer.disconnect()
   }

   

   useEffect(()=>{
    if(!props.allMessage)
      return
    const cleanup=setSticky()
    return cleanup
   },[props.allMessage])

  return (
    <section id='chatSection' className="w-[70%] relative h-[55vh] overflow-auto flex flex-col gap-4 p-4 noScrollBar z-2">
      { idate && <p className='bg-gray-200 p-1 opacity-60 rounded-md fixed top-[24%] left-[56.5%] z-4'>{idate}</p> }
      {props?.allMessage?.map((msgObj,i) => {
        const isSelf = msgObj?.senderId === props.userDetails._id;
        const isSeenBySelf = msgObj?.seenBy?.includes(props.userDetails._id)
        const isSeenByOther = msgObj?.seenBy?.includes(currentTalk)
        const sendDate= new Date(msgObj?.sendAt)
        const todayDate = new Date()
        let displayDate = sendDate.getDate() + '-' + months[sendDate.getMonth()] + '-'  + sendDate.getFullYear()
        if(displayDate === todayDate.getDate() + '-' + months[todayDate.getMonth()] + '-'  + todayDate.getFullYear()){
          displayDate='Today'
        }
        if(MesssageDates.has(displayDate)){
           displayDate=''
        }
        
        else{
          MesssageDates.add(displayDate)
        }
  
        return (
          <div  key={msgObj._id} id={msgObj._id+'|'}   className='msgContainer'>
          {displayDate && <p className='my-6 text-center messageDate'><span className=' bg-gray-200 p-2 opacity-75 rounded-md'>{displayDate}</span></p>}
          <div
            className={`flex ${isSelf ? 'justify-end' : 'justify-start'} ${length-1 === i?'lastMsg': null} ${isSelf ? null:isSeenBySelf?null:'msgReceived'}`}
            id={msgObj._id}
          >
          {
            msgObj.isFile ?
            msgObj.path.map(file=>{
              
              const fileUrl = `http://localhost:5000/uploads/${file}`
              const ArraySeperatedByDots = file?.split('.') 
              const extension = ArraySeperatedByDots[ArraySeperatedByDots.length-1]
              const splitedName = file.split('-')
              const lastName = splitedName[splitedName.length-1] 
                
                return <div key={file} className={`max-w-md  relative overflow-y-hidden px-3 py-4 rounded-lg text-sm shadow-md ${
                isSelf
                  ? 'bg-blue-500 text-white rounded-tr-none'
                  : 'bg-gray-200 text-black rounded-tl-none'
              }`}   style={{cursor:'pointer'}} >
                {commonImageFormats.includes(extension)?<img src={fileUrl} className=' max-w-[350px] max-h-[350px]' alt="not found" />:commonDocumentFormats.includes(extension)? <iframe className='max-h-[350px]'
  src={`${fileUrl}`}  
  width="100%" 
  height="400px"
  ></iframe>:commonVideoFormats.includes(extension)? <ReactPlayer
   src={fileUrl}
   controls
   className=' max-h-[350px]'
  />
   : <div><p className={`text-[${isSelf?'#dedee0':'#503dfc'}] p-2 ${isSelf?'bg-[#2b75ed]':'bg-[#d7d7d9]'} mb-4`}>{lastName.length>25?lastName.substring(0,25)+'...':lastName}</p><a href={fileUrl}  download={lastName}><Button variant='contained' color='secondary' style={{fontSize:'0.8em'}}>Download to see</Button></a></div>

}
                

                <p className={`text-${isSelf?'right':'left'} my-1`}>{msgObj?.text}</p>
                {isSelf?seenArr.includes(msgObj._id) || isSeenByOther?<span className='absolute bottom-[0%] right-[0%]'><img
          src={props?.otherProfile || randomPic}
          alt="Profile"
          className="w-5 h-5 object-cover rounded-full border"
        /></span>:null:null}
              </div>
              
            }):
            <p
              className={`max-w-md  px-4 py-3 relative`}
            >
             <span className={`max-w-md overflow-y-hidden px-2 py-2 rounded-lg text-sm shadow-md ${
                isSelf
                  ? 'bg-blue-500 text-white rounded-tr-none'
                  : 'bg-gray-200 text-black rounded-tl-none'
              }`}> {msgObj?.text}  </span>
              {isSelf?seenArr.includes(msgObj._id) || isSeenByOther?<span className='absolute bottom-[0%] right-[3%]'><img
          src={props?.otherProfile || randomPic}
          alt="Profile"
          className="w-5 h-5 object-cover rounded-full border"
        /></span>:null:null}
            </p>
          }
          </div>
          </div>
        );
      })}
    </section>
  );
};

export default ChatBody;
