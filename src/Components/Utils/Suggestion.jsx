import {useContext, useState} from 'react'
import { PersonAdd } from '@mui/icons-material'
import { Alert } from '@mui/material'
import { UserContext } from '../../Context/UserProvider'
import { useNavigate } from 'react-router-dom'

const Suggestion = (props) => {
  const nav = useNavigate()
  const {userDetails,randomImage,setViewDetailsId} = useContext(UserContext)
  const [message,setMessage] = useState(null)
  const [color,setColor] = useState(null)
  const [loadingAccount,setLoadingAccount] = useState([])
  const token = localStorage.getItem(import.meta.env.VITE_USER_AUTH_TOKEN)
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
    <>
    {message && <Alert color={color} closeText='close' sx={{padding:'10px',boxShadow:'5px 5px 10px black'}} variant='standard' onClose={()=>{setMessage(null) }} className='fixed top-[10%] left-[45%] z-5'><b>{message}</b></Alert>}
    <div id='suggestion' className='absolute top-[100%] gap-[20px] bg-white w-[27vw] p-[20px] flex flex-col shadow-md z-3'>
      {props?.users?.map(val=>(
        <p key={val._id} id={val._id} className='p-[15px] relative shadow-md hover:shadow-lg bg-[#f7f7f7] flex items-center gap-4 cursor-pointer' onClick={()=>{
          setViewDetailsId(val._id)
          nav('/viewProfile')
        }} > <img
          src={val.profilePic || randomImage[Math.floor(Math.random() * randomImage.length)]}
          alt="Profile"
          className="w-12 h-12 object-cover rounded-full border"
        /><span>{val.fname + ' ' + val.lname}</span> {!loadingAccount.includes(val._id) ? <PersonAdd onClick={(e)=>{
          e.stopPropagation()
          addFriend(val._id)
        }} className='text-gray-400 cursor-pointer hover:text-gray-600  absolute right-[5%]'/>:<span className='loader absolute right-[5%]'></span> } </p>
      ))}
      {props.users.length===0?<p className='p-[10px]'>Not found</p>:null}
    </div>
    </>
  )
}

export default Suggestion
