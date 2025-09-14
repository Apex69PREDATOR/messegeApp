import {useState,useContext, useEffect, useRef,lazy} from 'react'
import { Button,Badge} from '@mui/material'
import { Person,Handshake} from '@mui/icons-material'
import { UserContext } from '../../Context/UserProvider'
import { useNavigate } from 'react-router-dom'
import SearchBox from '../Utils/SearchBox'
import getRequests from '../Utils/UsefullFunctions'
import ShowFriends from '../FriendSection/ShowFriends'
import CurrentChat from './CurrentChat'
import LeftBar from './LeftBar'

const NoFriends = lazy(()=>import('./NoFriends'))
const Individual = () => {

  const nav=useNavigate()
  const token =  localStorage.getItem('AIchatToken')
 
  const {userDetails,setUserDetails,totalRequests,totalFriends,requests,friends} = useContext(UserContext)
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
    <section className='w-[100%] flex md:flex-row  flex-col  evenly'>
      <LeftBar socket={socket.current}/>
    <div className='md:w-[72%] w-[100%] flex relative items-center flex-col gap-2'>
    {seeFriends && <ShowFriends socket={socket.current} setSeeFriends={setSeeFriends}/>}
    <nav className='flex items-center flex-wrap gap-[4vw] md:w-[80%] w-[100%] p-[10px]' >
      <Button variant={seeFriends?"contained":"outlined"} sx={{position:'relative',padding:window.innerWidth>475?'':'5px',fontSize:window.innerWidth>475?'':'0.8em'}} onClick={()=>{setSeeFriends(!seeFriends)}} startIcon={<Person />} color='primary'>
  All Friends
  <Badge
          badgeContent={requests?.length}
          color='info'
          overlap='circular'
          showZero={false}
          sx={{position:'absolute',top:0,left:0}}
          ></Badge>
</Button><SearchBox/> <Button sx={{padding:window.innerWidth>475?'':'5px',fontSize:window.innerWidth>475?'':'0.8em'}} variant='outlined' onClick={()=>{nav('/addPeople')}}  startIcon={<Handshake/>}>Connect with more people</Button> </nav>
{friends?.length?<CurrentChat socket={socket.current} userDetails={userDetails} />:<NoFriends/>}
    </div>
    </section>
    
  )
}

export default Individual
