import {useState,useContext, useEffect, useRef} from 'react'
import { Button,Badge} from '@mui/material'
import { Person} from '@mui/icons-material'
import { UserContext } from '../../Context/UserProvider'
import { useNavigate } from 'react-router-dom'
import SearchBox from '../Utils/SearchBox'
import getRequests from '../Utils/UsefullFunctions'
import ShowFriends from '../FriendSection/ShowFriends'
import CurrentChat from './CurrentChat'
import LeftBar from './LeftBar'
const Individual = () => {
  const nav=useNavigate()
  const token =  localStorage.getItem('AIchatToken')
 
  const {userDetails,setUserDetails,totalRequests,totalFriends,requests} = useContext(UserContext)
  const socket = useRef(null)
  
  const [seeFriends,setSeeFriends] = useState(false)
    const verify=()=>{
       fetch(`${import.meta.env.VITE_SERVER_URL}/auth/validate`,{method:"GET",headers:{
      'Authorization':`Bearer ${token}`
    }}).then(response=>(response.json()).then(result=>{
      if(response.ok && result.success){
      setUserDetails(result.userDih)
      }
      else
        nav('/authorize')
    }))
    }
    
 useEffect(()=>{
  verify()
 },[])
 useEffect(()=>{
  if(userDetails){
    getRequests(userDetails?._id,token,totalRequests,totalFriends)
  socket.current = new WebSocket(`${import.meta.env.VITE_WS_URL}?userId=${userDetails?._id}`)
  }

 },[userDetails])

 const addIncommingRequests=()=>{

    if(!socket.current)
      return
    const handleRequest=(event)=>{ 

      const data = JSON.parse(event.data)
      if(data.type==='incommingRequests'){
          totalRequests(prev=>([...prev,data?.requestedUserObj]))
      }
      if(data.type==='newFriend'){
          totalFriends(prev=>([...prev,data?.requestedUserObj]))
      }

    }
    socket.current.addEventListener('message',handleRequest)
  }

  useEffect(()=>{
   addIncommingRequests()
  },[socket.current])
  return (
    <section className='w-[100%] flex  evenly'>
      <LeftBar socket={socket.current}/>
    <div className='w-[72%] flex  items-center flex-col gap-[2vh]'>
    {seeFriends && <ShowFriends socket={socket.current} setSeeFriends={setSeeFriends}/>}
    <div className='flex items-center gap-[5vw] w-[80%] p-[1vw]' ><Button variant={seeFriends?"contained":"outlined"} sx={{position:'relative'}} onClick={()=>{setSeeFriends(!seeFriends)}} startIcon={<Person />} color='primary'>
  All Friends
  <Badge
          badgeContent={requests?.length}
          color='info'
          overlap='circular'
          showZero={false}
          sx={{position:'absolute',top:0,left:0}}
          ></Badge>
</Button><SearchBox/></div>
<CurrentChat socket={socket.current} userDetails={userDetails} />
    </div>
    </section>
    
  )
}

export default Individual
