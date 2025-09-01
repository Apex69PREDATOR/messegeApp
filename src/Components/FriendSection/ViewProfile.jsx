import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../../Context/UserProvider";
import { Button, Divider,Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { setCurrentPerson } from "../Utils/UsefullFunctions";

import {
  Message,
  PersonAdd,
  Mail,
  PhoneAndroidRounded,
  PeopleAlt,
} from "@mui/icons-material";

const ViewProfile = () => {
  const nav= useNavigate()
  const { randomImage, viewDetailsId,setViewDetailsId, userDetails,setUserDetails, friends,setCurrentTalk,setCurrentName,totalFriends } =
    useContext(UserContext);

  useEffect(()=>{
    if(userDetails){
      localStorage.setItem('selfDetails',JSON.stringify(userDetails))
    }
    if(friends){
      localStorage.setItem('selfFriends',JSON.stringify(friends))
    }
    if(viewDetailsId){
      localStorage.setItem('viewId',viewDetailsId)
    }
  },[friends,userDetails,viewDetailsId])

  useEffect(()=>{
     setUserDetails(JSON.parse(localStorage.getItem('selfDetails')))
     totalFriends(JSON.parse(localStorage.getItem('selfFriends')))
     setViewDetailsId (localStorage.getItem('viewId'))
  },[])

  const [viewUser, setViewUser] = useState(null);
  const [userFriends, setUserFriends] = useState(null);
  const [mutualFriends, setMutualFriends] = useState(0);
  const [loadingAccount, setLoadingAccount] = useState([]);
  const [message, setMessage] = useState(null);
  const [color, setColor] = useState(null);
  const isFriend = useRef(false);
  const token = localStorage.getItem(import.meta.env.VITE_USER_AUTH_TOKEN);

  const get_Details = async () => {

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/beSocial/viewProfile/${viewDetailsId}/${userDetails._id}`,
      { method: "GET", headers: { Authorization: `Bearer ${token}` } }
    );
    const result = await response.json();
    if (response.ok && result.success) {
      setViewUser(result?.profileDetails);
      setUserFriends(result?.profileFriendsDetails);
      isFriend.current = result?.profileFriendsDetails?.some(
        (friend) => friend._id === userDetails._id
      );
      
      
      friends.forEach((ownerfriend) => {
        const isThere = result?.profileFriendsDetails?.some(
          (friend) => ownerfriend._id === friend._id
        );
        if (isThere) {
          setMutualFriends((prev) => prev + 1);
        }
      });
    }
  };

  useEffect(() => {
    get_Details();
  }, [viewDetailsId]);

   const addFriend=async(receiverId)=>{
          setLoadingAccount(prev=>([...prev,receiverId]))
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/beSocial/add`,{method:"POST",headers:{
      'Content-type':'application/json',
      'Authorization':`Bearer ${token}`
    },body:JSON.stringify({receiverId,senderId:userDetails?._id})})
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
  return (
    <main
      id="viewProfile"
      className="flex flex-col w-full relative items-center p-6 gap-8 bg-gray-50 min-h-screen"
    >
      {message && <Alert className="fixed top-[10%] left [35%]" style={{boxShadow:'5px 5px 5px black'}} onClose={()=>{setMessage(null)}} color={color}>{message}</Alert>}
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-3/4 bg-white shadow-md rounded-2xl p-6">
        {/* Profile Image */}
        <div className="w-32 h-32 md:w-40 md:h-40">
          <img
            src={
              viewUser?.profilePic ||
              randomImage[Math.floor(Math.random() * randomImage?.length)]
            }
            alt="Profile"
            className="w-full h-full object-cover rounded-full border-4 border-blue-500 shadow-lg"
          />
        </div>

        {/* Profile Info */}
        <div className="flex flex-col gap-3 flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800">
            {viewUser?.fname + " " + viewUser?.lname}
          </h2>
          <p className="italic text-gray-500">~ {viewUser?.about}</p>
          <p className="flex items-center gap-2 text-gray-700">
            <Mail className="text-blue-500" /> {viewUser?.email}
          </p>
          <p className="flex items-center gap-2 text-gray-700">
            <PhoneAndroidRounded className="text-green-500" /> {viewUser?.phone?viewUser.phone:viewUser?._id===userDetails?._id?userDetails?.phone:'Add me to see my number'}
          </p>

          <div className="mt-2">
            {viewUser?._id!==userDetails?._id?isFriend.current ? (
              <Button variant="contained" onClick={()=>{
                setCurrentPerson(viewUser._id,setCurrentTalk,setCurrentName,(viewUser.fname))
                nav('/')
              }}  startIcon={<Message />}>
                Message
              </Button>
            ) : (
              <Button variant="contained" onClick={()=>{addFriend(viewUser._id)}} startIcon={<PersonAdd />}>
                Add Friend
              </Button>
            ):null}
          </div>
        </div>
      </div>

      {/* Friends Section */}
      <div className="flex flex-col gap-4 w-full md:w-3/4 bg-white shadow-md rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <PeopleAlt className="text-blue-500" /> Friends
          </p>
          <span className="text-sm text-gray-600">
            Total: {userFriends?.length || 0} | Mutual: {mutualFriends}
          </span>
        </div>
        <Divider />

        <div className="flex flex-wrap gap-6 overflow-auto max-h-[40vh] p-2">
          {userFriends?.map((friend) => {
            let isFriend = friends.some((f) => f._id === friend._id);
            let isSelf = friend._id === userDetails._id;
              return (
                <div
                  key={friend._id}
                  id={friend._id}
                  className="flex flex-col items-center gap-2 w-40 p-4 rounded-xl shadow-sm bg-gray-100 hover:shadow-md transition cursor-pointer"
                  onClick={()=>{
                    setViewDetailsId(friend._id)
                    setMutualFriends(0);
                  }}
                >
                  <img
                    src={
                      friend?.profilePic ||
                      randomImage[Math.floor(Math.random() * randomImage?.length)]
                    }
                    alt="Profile"
                    className="w-16 h-16 object-cover rounded-full border border-gray-300 shadow-md"
                    loading="lazy"
                  />
                  <span className="font-medium text-gray-800">
                    {isSelf?'You':(friend.fname + " " + friend.lname)}
                  </span>
                  <span className="text-xs text-gray-500">{friend.email}</span>
                  {!isSelf?isFriend ? (
                    <Button size="small" variant="contained" onClick={(e)=>{
                      e.stopPropagation()
                setCurrentPerson(friend._id,setCurrentTalk,setCurrentName,(friend.fname))
                nav('/')
              }}  startIcon={<Message />}>
                      Message
                    </Button>
                  ) : (
                    <Button onClick={(e)=>{
                      e.stopPropagation()
                      addFriend(friend._id)}} size="small" variant="contained" startIcon={<PersonAdd />}>
                      {loadingAccount.includes(friend._id)?<span style={{border:'12px solid'}} className="loader"> </span>: 'Add'}
                    </Button>
                  ):null}
                </div>
              );
          })}
        </div>
      </div>
    </main>
  );
};

export default ViewProfile;
