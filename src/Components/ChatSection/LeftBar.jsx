import {  useEffect, useContext, useState } from 'react'
import { UserContext } from '../../Context/UserProvider'
import { useNavigate } from 'react-router-dom'
import { TextField } from '@mui/material'
import { Edit } from '@mui/icons-material'
import { setCurrentPerson } from '../Utils/UsefullFunctions'
import SearchAmongFriends from './SearchAmongFriends'
import EditOrLogOut from '../Utils/EditOrLogOut'

const LeftBar = ({ socket }) => {
  const navigation = useNavigate()
  const months = ['Jan', 'Feb', 'Mar', "Apr", 'May', "Jun", "Jul", "Aug", "Sep", 'Oct', "Nov", 'Dec']
  const { userDetails, friends, onlineArr, setCurrentTalk, setCurrentName, recentChats, setRecentChats, recentSearchedForOnline, randomImage, lastMessages, setLastMessages,currentTalk } = useContext(UserContext)
  const [searchedFriend,setSearchedFriend] = useState('')
  const [selfProfileClicked,setSelfProfileClicked] = useState(false)

  const findRecentChats = () => {
    if (!socket) return
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'recentChats' }))
    } else {
      const interval = setInterval(() => {
        if (socket?.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'recentChats' }))
          clearInterval(interval)
        }
      }, 100)
      setTimeout(() => clearInterval(interval), 5000)
    }
  }

  const getRecentChats = () => {
    if (!socket) return
    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'recentChats') {
          setRecentChats(data?.otherMembers)
          setLastMessages(prev => {
            data?.otherMembers?.forEach((members, i) => prev.set(members?.id, data?.recentMessages[i]))
            return prev
          })
        }
      } catch (err) {
        console.error('WebSocket parse error:', err)
      }
    }
    socket.addEventListener('message', handleMessage)
  }

  useEffect(() => {
    findRecentChats()
    getRecentChats()
  }, [socket])


  function calculateDate(date) {
    const checkDate = new Date(date)
    const presentDate = new Date()
    if (checkDate.getFullYear() === presentDate.getFullYear()) {
      if (checkDate.getMonth() === presentDate.getMonth()) {
        if (checkDate.getDate() === presentDate.getDate()) {
          return `${checkDate.getHours()}:${checkDate.getMinutes().toString().padStart(2, '0')}`
        }
        return `${checkDate.getDate()} ${months[checkDate.getMonth()]}`
      }
      return months[checkDate.getMonth()]
    }
    return checkDate.getFullYear()
  }

  return (
    <section className="flex flex-col md:w-[25%] w-[99%] bg-white border-r border-gray-200 md:h-screen md:max-h-screen max-h-[40vh] overflow-hidden ">
      
      {/* Profile Section */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="relative w-14 h-14 cursor-pointer" onClick={()=>{
          setSelfProfileClicked(prev=>(!prev))
        }}>
          <img
            src={userDetails?.profilePic || randomImage[Math.floor(Math.random() * randomImage.length)]}
            alt="Profile"
            className="w-full h-full object-cover rounded-full border border-gray-300"
          />
          <Edit className='absolute bottom-[-5%] shadow-md right-[-5%] bg-white rounded-full p-1 cursor-pointer editButton'   color='info' style={{fontSize:'1.6em'}} onClick={(e)=>{
            e.stopPropagation()
            localStorage.setItem('efname',userDetails?.fname)
            localStorage.setItem('elname',userDetails?.lname)
            localStorage.setItem('eabout',userDetails?.about)
            localStorage.setItem('email',userDetails?.email)
            localStorage.setItem('ephone',userDetails?.phone)
            localStorage.setItem('ePic',userDetails?.profilePic)
            navigation('/editAccount')}}/>
            {selfProfileClicked && <EditOrLogOut/>}
        </div>
        <p className="font-medium text-gray-800 text-lg">
          {userDetails?.fname} {userDetails?.lname}
        </p>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-gray-200">
        <TextField
        
          variant="outlined"
          placeholder="Search friends..."
          size="small"
          fullWidth
          className="bg-gray-100 rounded-md"
          onKeyDownCapture={async(e)=>{
            await new Promise((resolve)=>setTimeout(resolve,200))
            setSearchedFriend(e.target.value)}}
        />
      </div>

      {/* Chats List */}
      <div className="flex md:flex-col md:p-0 p-1 md:gap-0 gap-2 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
        {!searchedFriend ?
          recentChats?.map((val) => {
             const recentFound = friends?.find(val2=>(val.id===val2._id))
             if(recentFound){
              const lastMessage = lastMessages?.get(recentFound._id)
              return (
                <div
                  key={recentFound._id}
                  onClick={() => {
                    setCurrentPerson(recentFound._id, setCurrentTalk, setCurrentName, recentFound?.fname)
                  }}
                  className={`flex md:flex-row flex-col md:justify-center justify-evenly md:px-4 px-3 py-3 gap-4 hover:${currentTalk==recentFound._id?'':'bg-gray-100'} cursor-pointer transition-colors duration-200 border-b ${currentTalk==recentFound._id?'bg-[rgba(71,71,71,.7)]':'bg-white'} border-gray-100 rounded shadow-md md:h-auto h-[140px] md:w-auto w-[150px] flex-shrink-0`}
                >
                  {/* Profile Image */}
                  <div className="relative w-12 h-12 min-w-12 min-h-12">
                    <img
                      src={recentFound.profilePic || randomImage[Math.floor(Math.random() * randomImage.length)]}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full border border-gray-300"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        recentSearchedForOnline.current.has(recentFound._id)
                          ? onlineArr.includes(recentFound._id)
                            ? 'bg-green-500'
                            : 'bg-red-500'
                          : 'hidden'
                      }`}
                    ></span>
                  </div>

                  {/* Chat Info */}
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between md:gap-0 gap-2 items-center">
                      <p className={`font-medium ${currentTalk==recentFound._id?'text-gray-300':'text-gray-900'}`} style={{fontSize:window.innerWidth>=769?'1em':'0.9em'}}>{recentFound.fname} {recentFound.lname}</p>
                      <span className={`text-xs ${currentTalk==recentFound._id?'text-gray-300':'text-gray-500'}`}>{calculateDate(lastMessage?.sendAt)}</span>
                    </div>
                    <p className={`text-sm ${currentTalk==recentFound._id?'text-gray-300':'text-gray-600'} truncate`}>
                      {(lastMessage?.senderId === userDetails?._id ? 'You: ' : `${recentFound?.fname}: `) + lastMessage?.text.substring(0,20)}
                    </p>
                  </div>
                </div>
              )
             }
          }):<SearchAmongFriends str={searchedFriend} calculateDate={calculateDate}/>
      }
      </div>
    </section>
  )
}

export default LeftBar
