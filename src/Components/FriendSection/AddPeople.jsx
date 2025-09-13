import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../../Context/UserProvider";
import { Button, Typography,Alert } from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import {useNavigate} from "react-router-dom"

const AddPeople = () => {
  const repeat = useRef(false);
  const nav = useNavigate()

  const { userDetails, randomImage, setViewDetailsId } = useContext(UserContext);

  const [exeptFriends, setExeptFriends] = useState([]);
  const [LoadingAccount,setLoadingAccount] = useState([])
  const [message,setMessage] = useState(null)
  const [color,setColor] = useState(null)

  const addFriend=async(receiverId)=>{
        const id = userDetails?._id || JSON.parse(localStorage.getItem('selfDetails'))?._id
          setLoadingAccount(prev=>([...prev,receiverId]))
        const token = localStorage.getItem(import.meta.env.VITE_USER_AUTH_TOKEN)
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/beSocial/add`,{method:"POST",headers:{
      'Content-type':'application/json',
      'Authorization':`Bearer ${token}`
    },body:JSON.stringify({receiverId,senderId:id})})
    const result = await response.json()
    if(result.success && response.ok)
      setColor('success')
    else
      setColor('error')

    setMessage(result?.message)
    setLoadingAccount(prev=>(
      prev.filter(id=>(id!==receiverId))
    ))
  }

  const getNonFriends = async () => {
    const id =
      userDetails?._id ||
      JSON.parse(localStorage.getItem("selfDetails"))?._id;

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/beSocial/morePeople/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_USER_AUTH_TOKEN}`,
        },
      }
    );

    const result = await response.json();

    if (response.ok) setExeptFriends(result?.allUsers);
  };

  useEffect(() => {
    if (!repeat.current) getNonFriends();
    repeat.current = true;
  }, []);

  return (
    <main className="h-screen w-screen flex flex-col items-center py-6 bg-gradient-to-br from-[#f4f4f4] via-[#f9fafb] to-[#e5e7eb]">
      <Typography
        variant="h4"
        className="font-bold text-gray-800 mb-6 drop-shadow-sm"
      >
        🌐 Connect with More People
      </Typography>

      <div className="flex flex-wrap gap-6 justify-center items-center overflow-y-auto h-[80%] w-[90%] md:p-3 p-2 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg relative">
       <Typography variant="h6" className="font-bold text-gray-500 drop-shadow-sm absolute top-[7%]">
            With those that you haven't connected with 🤷‍♂️
          </Typography>
        {exeptFriends?.map((friend) => {
          let isSelf =
            friend._id ===
            (userDetails?._id ||
              JSON.parse(localStorage.getItem("selfDetails"))?._id);
          if (!isSelf)
            return (
              <div
                key={friend._id}
                id={friend._id}
                className="flex flex-col items-center gap-3 w-[200px] p-5 rounded-2xl shadow-md bg-white hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setViewDetailsId(friend?._id);
                  nav('/viewProfile')
                }}
              >
                <img
                  src={
                    friend?.profilePic ||
                    randomImage[
                      Math.floor(Math.random() * randomImage?.length)
                    ]
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-md"
                  loading="eager"
                />
                <div className="flex flex-col items-center text-center">
                  <span className="font-semibold text-gray-800 text-lg">
                    {friend?.fname + " " + friend?.lname}
                  </span>
                  <span className="text-sm text-gray-500">
                    {friend.email}
                  </span>
                </div>
                <Button
                  variant="contained"
                  color="info"
                  endIcon={!LoadingAccount.includes(friend._id)?<PersonAdd />:<span className="loader"></span>}
                  className="rounded-full px-4 py-1"

                  onClick={(e)=>{
                    e.stopPropagation()
                    addFriend(friend._id)
                  }}
                >
                  Add Friend
                </Button>
              </div>
            );
        })}
      </div>
      {message && <Alert className="fixed top-[20%] left-[40%] " sx={{
        boxShadow:"5px 5px 5px black",
        padding:"12px"
      }} color={color} onClose={()=>{setMessage(null)}}>{message}</Alert>}
    </main>
  );
};

export default AddPeople;
