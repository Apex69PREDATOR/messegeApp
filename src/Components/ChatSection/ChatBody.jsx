import {useEffect,useState,useContext} from 'react';
import { UserContext } from '../../Context/UserProvider';


const ChatBody = (props) => {
  const {currentTalk,randomImage} = useContext(UserContext)
  const [seenArr,setSeenArr] = useState([])
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
  return (
    <section id='chatSection' className="w-[70%] h-[50vh] overflow-auto flex flex-col gap-4 p-4 noScrollBar z-2">
      {props?.allMessage?.map((msgObj,i) => {
        const isSelf = msgObj?.senderId === props.userDetails._id;
        const isSeenBySelf = msgObj?.seenBy?.includes(props.userDetails._id)
        const isSeenByOther = msgObj?.seenBy?.includes(currentTalk)
  
        return (
          <div
            key={msgObj._id}
            id={msgObj._id}
            className={`flex ${isSelf ? 'justify-end' : 'justify-start'} ${length-1 === i?'lastMsg': null} ${isSelf ? null:isSeenBySelf?null:'msgReceived'}`}
          >
            <p
              className={`max-w-md  px-4 py-3 relative`}
            >
             <span className={`max-w-md overflow-y-hidden px-2 py-2 rounded-lg text-sm shadow-md ${
                isSelf
                  ? 'bg-blue-500 text-white rounded-tr-none'
                  : 'bg-gray-200 text-black rounded-tl-none'
              }`}> {msgObj?.text}  </span>
              {isSelf?seenArr.includes(msgObj._id) || isSeenByOther?<span className='absolute bottom-[0%] right-[3%]'><img
          src={currentTalk?.profilePic || randomPic}
          alt="Profile"
          className="w-5 h-5 object-cover rounded-full border"
        /></span>:null:null}
            </p>
          </div>
        );
      })}
    </section>
  );
};

export default ChatBody;
