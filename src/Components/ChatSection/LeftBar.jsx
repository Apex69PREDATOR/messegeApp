import { React, useEffect, useContext, useState } from 'react'
import { UserContext } from '../../Context/UserProvider'
import { TextField } from '@mui/material'
import { setCurrentPerson } from '../Utils/UsefullFunctions'
import SearchAmongFriends from './SearchAmongFriends'

const LeftBar = ({ socket }) => {
  const months = ['Jan', 'Feb', 'Mar', "Apr", 'May', "Jun", "Jul", "Aug", "Sep", 'Oct', "Nov", 'Dec']
  const { userDetails, friends, onlineArr, setCurrentTalk, setCurrentName, recentChats, setRecentChats, recentSearchedForOnline, randomImage, lastMessages, setLastMessages } = useContext(UserContext)
  const [searchedFriend,setSearchedFriend] = useState('')

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
    <section className="flex flex-col w-[22%] bg-white border-r border-gray-200 h-screen overflow-hidden">
      
      {/* Profile Section */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="relative w-14 h-14">
          <img
            src={userDetails?.profilePicture || randomImage[Math.floor(Math.random() * randomImage.length)]}
            alt="Profile"
            className="w-full h-full object-cover rounded-full border border-gray-300"
          />
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
      <div className="flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
        {!searchedFriend ?
        recentChats?.map(val =>
          friends?.map((val2) => {
            if (val.id == val2._id) {
              const lastMessage = lastMessages?.get(val2._id)
              return (
                <div
                  key={val2._id}
                  onClick={() => {
                    setCurrentPerson(val2._id, setCurrentTalk, setCurrentName, val2?.fname)
                  }}
                  className="flex items-center px-4 py-3 gap-4 hover:bg-gray-100 cursor-pointer transition-colors duration-200 border-b border-gray-100"
                >
                  {/* Profile Image */}
                  <div className="relative w-12 h-12 min-w-12 min-h-12">
                    <img
                      src={val2.profilePicture || randomImage[Math.floor(Math.random() * randomImage.length)]}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full border border-gray-300"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        recentSearchedForOnline.current.has(val2._id)
                          ? onlineArr.includes(val2._id)
                            ? 'bg-green-500'
                            : 'bg-red-500'
                          : 'hidden'
                      }`}
                    ></span>
                  </div>

                  {/* Chat Info */}
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-900">{val2.fname} {val2.lname}</p>
                      <span className="text-xs text-gray-500">{calculateDate(lastMessage?.sendAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {(lastMessage?.senderId === userDetails?._id ? 'You: ' : `${val2?.fname}: `) + lastMessage?.text.substring(0,20)}
                    </p>
                  </div>
                </div>
              )
            }
          })
        ):<SearchAmongFriends str={searchedFriend} calculateDate={calculateDate}/>
      }
      </div>
    </section>
  )
}

export default LeftBar
