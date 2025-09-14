import {useContext} from 'react'
import { UserContext } from '../../Context/UserProvider'
import { setCurrentPerson } from '../Utils/UsefullFunctions'
const SearchAmongFriends = ({str,calculateDate}) => {
    const {friends,lastMessages,randomImage,recentSearchedForOnline,onlineArr,userDetails,setCurrentTalk, setCurrentName} = useContext(UserContext)
  return (
                <>
                {
                friends.map(friend=>{
                const name = friend.fname + ' ' + friend.lname
                const lastMessage = lastMessages?.get(friend._id)
                if(name.toLowerCase().includes(str.toLowerCase()))
                return <div
                     key={friend._id}
                      onClick={() => {
                        setCurrentPerson(friend._id, setCurrentTalk, setCurrentName, friend?.fname)
                      }}
                      className={`flex md:flex-row flex-col md:justify-center justify-evenly md:px-4 px-3 py-3 gap-4 hover:'bg-gray-100' cursor-pointer transition-colors duration-200 border-b border-gray-100 rounded shadow-md md:h-auto h-[140px] md:w-auto w-[150px] flex-shrink-0`}
                    >
                      {/* Profile Image */}
                      <div className="relative w-12 h-12 min-w-12 min-h-12">
                        <img
                          src={friend.profilePic || randomImage[Math.floor(Math.random() * randomImage.length)]}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-full border border-gray-300"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            recentSearchedForOnline.current.has(friend._id)
                              ? onlineArr.includes(friend._id)
                                ? 'bg-green-500'
                                : 'bg-red-500'
                              : 'hidden'
                          }`}
                        ></span>
                      </div>
    
                      {/* Chat Info */}
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-gray-900">{friend.fname} {friend.lname}</p>
                          <span className="text-xs text-gray-500">{calculateDate(lastMessage?.sendAt)}</span>
                        </div>
                        {lastMessage && <p className="text-sm text-gray-600 truncate">
                          {(lastMessage?.senderId === userDetails?._id ? 'You: ' : `${friend?.fname}: `) + lastMessage?.text.substring(0,20)}
                        </p> }
                      </div>
                    </div>
                }
                )
}
                    </>
  )
}

export default SearchAmongFriends
