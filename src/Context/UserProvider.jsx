import {createContext,useState,useRef} from 'react'

export const  UserContext = createContext()

const UserProvider = ({children}) => {
  const [userDetails,setUserDetails] = useState(null)
  const [requests,totalRequests] = useState(null)
  const [friends,totalFriends] = useState(null)
  const [currentTalk,setCurrentTalk] = useState(localStorage.getItem('currentP'))
  const [currentName,setCurrentName] = useState(localStorage.getItem('currentN'))
  const [onlineArr,setOnlineArr] = useState([])
  const [recentChats,setRecentChats] = useState([])
  const recentSearchedForOnline = useRef(new Set())
  const randomImage = ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiEeu6aQtfz9r_5kXr5jMr9KT_9YS46ehigdu0nNcq1DVQg9bY3DZMGiMsuZHme0_oX1Q&usqp=CAU','https://i.pinimg.com/236x/01/fc/93/01fc93a67be17d87f27e3ececafc9a5e.jpg','https://i.pinimg.com/736x/c8/ec/05/c8ec0552d878e70bd29c25d0957a6faf.jpg','https://i.pinimg.com/1200x/3d/cd/4a/3dcd4af5bc9e06d36305984730ab7888.jpg','https://wallpapercave.com/wp/wp12696574.jpg']
  
  return (
    <UserContext value={{userDetails,setUserDetails,requests,totalRequests,friends,totalFriends,currentTalk,setCurrentTalk,currentName,setCurrentName,onlineArr,setOnlineArr,recentChats,setRecentChats,recentSearchedForOnline,randomImage}}>
      {children}
    </UserContext>
  )
}

export default UserProvider
