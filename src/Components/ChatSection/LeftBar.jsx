import {React,useEffect, useContext,useState} from 'react'
import { UserContext } from '../../Context/UserProvider'
import { TextField } from '@mui/material'
import { setCurrentPerson } from '../Utils/UsefullFunctions'

const LeftBar = ({socket}) => {
  const months = ['Jan','Feb','Mar',"Apr",'May',"Jun","Jul","Aug","Sep",'Oct',"Nov",'Dec']
  const [lastMessages,setLastMessages] = useState(new Map())
  const {userDetails,friends,onlineArr,setCurrentTalk,setCurrentName,recentChats,setRecentChats,recentSearchedForOnline,randomImage} = useContext(UserContext)
    
    const findRecentChats=()=>{
      if(!socket)
        return
       if(socket?.readyState === WebSocket.OPEN)
      socket.send(JSON.stringify({type:'recentChats'}))
    else {
    const interval = setInterval(() => {
        
      if (socket?.readyState === WebSocket.OPEN) {

        socket.send(JSON.stringify({type:'recentChats'}));
        clearInterval(interval);
      }
    }, 100);
     setTimeout(() => clearInterval(interval), 5000)
  }
    }
    
 const getRecentChats = ()=>{
  if(!socket)
    return
      const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.data); // `event` here is a MessageEvent
      if (data.type === 'recentChats') {
        setRecentChats(data?.otherMembers);
        setLastMessages(prev=>{
           data?.otherMembers?.forEach((members,i)=>(prev.set(members?.id,data?.recentMessages[i])))
           return prev
        })
    
      }
    } catch (err) {
      console.error('WebSocket parse error:', err);
    }
  };
  socket.addEventListener('message', handleMessage);
  }

  

    useEffect(()=>{
      findRecentChats()
      getRecentChats()
    },[socket])

    function calculateDate(date){
       const checkDate = new Date(date)
       const presentDate  = new Date()
       if(checkDate.getFullYear() === presentDate.getFullYear()){
            if(checkDate.getMonth() === presentDate.getMonth()){
                if(checkDate.getDate() === presentDate.getDate()){
                        return (checkDate.getHours() + ' : ' + checkDate.getMinutes())
                }
                return (checkDate.getDate() + ' '  + months[checkDate.getMonth()])
            }
            return months[checkDate.getMonth()]
       }
       return checkDate.getFullYear()
    }

  return ( 
    <section className='flex flex-col w-[20%] gap-8 p-3'>
    <div className="profile flex items-center gap-4"><div className="relative w-15 h-15">
        <img
          src={userDetails?.profilePicture || randomImage[Math.floor(Math.random() * randomImage.length)]}
          alt="Profile"
          className="w-full h-full object-cover rounded-full border"
        />
      </div>
      <p>{userDetails?.fname + " " + userDetails?.lname}</p>
      </div>
     <TextField variant='standard' name='Find friends'/>
    <div className="chats flex flex-col w-[100%]">
      {
        recentChats?.map(val=>{
         return friends?.map((val2)=>{
             if(val.id==val2._id){
              const lastMessage = lastMessages?.get(val2._id)
              return <div onClick={()=>{
                setCurrentPerson(val2._id,setCurrentTalk,setCurrentName,val2?.fname)
              }} key={val2._id} style={{cursor:'pointer'}} className='flex items-center p-2 gap-4 w-[100%]'>
               <div className="relative w-12 h-12 min-h-12 min-w-12">
        <img
          src={val2.profilePicture || randomImage[Math.floor(Math.random() * randomImage.length)]}
          alt="Profile"
          className="w-full h-full object-cover rounded-full border"
        />
        <span
          className={`absolute bottom-1 right-0 w-3 h-3 rounded-full border-2 border-white ${
            recentSearchedForOnline.current.has(val2._id)?  onlineArr.includes(val2._id) ? 'bg-green-500' : 'bg-red-500':null
          }`}
        ></span>
      </div>
               <p> {val2.fname + ' ' + val2.lname} 
                <br />
                <p className='text-[#757575] w-[15vw] flex between'>
                  <span className='w-[75%]'>{
                  (lastMessage?.senderId===userDetails?._id?'You : ':`${val2?.fname} : `) + lastMessage?.text.substring(0,25)}</span>
                  <span className='w-[25%]'>{calculateDate(lastMessage?.sendAt)}</span>
                </p>
               </p>
              </div>
          
        }})

})
      }

    </div>
    </section>
  )
}

export default LeftBar
