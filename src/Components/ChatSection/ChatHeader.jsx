import {useNavigate} from 'react-router-dom'

const ChatHeader = ({ name, profilePic, onlineArr, currentTalk, setViewDetailsId }) => {
    const nav = useNavigate()
    const isOnline = onlineArr.includes(currentTalk) 
    const randomImage = ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiEeu6aQtfz9r_5kXr5jMr9KT_9YS46ehigdu0nNcq1DVQg9bY3DZMGiMsuZHme0_oX1Q&usqp=CAU','https://i.pinimg.com/236x/01/fc/93/01fc93a67be17d87f27e3ececafc9a5e.jpg','https://i.pinimg.com/736x/c8/ec/05/c8ec0552d878e70bd29c25d0957a6faf.jpg','https://i.pinimg.com/1200x/3d/cd/4a/3dcd4af5bc9e06d36305984730ab7888.jpg','https://wallpapercave.com/wp/wp12696574.jpg']
  return (
    <div className="flex z-2 items-center w-[100%]  gap-8 p-4 bg-gradient-to-r from-[#ebebeb] to-[#fcfcfc] shadow-md rounded-md rounded-bl-none rounded-br-none">
      <div className="relative w-15 h-15 cursor-pointer" onClick={()=>{
         setViewDetailsId(currentTalk)
         nav('/viewProfile')
      }}>
        <img
          src={profilePic || randomImage[Math.floor(Math.random() * randomImage.length)]}
          alt="Profile"
          className="w-full h-full object-cover rounded-full border"
        />
        <span
          className={`absolute bottom-1 right-0 w-3 h-3 rounded-full border-2 border-white ${
            isOnline ? 'bg-green-500' : 'bg-red-500'
          }`}
        ></span>
      </div>
      <div>
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className={`text-sm ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;
