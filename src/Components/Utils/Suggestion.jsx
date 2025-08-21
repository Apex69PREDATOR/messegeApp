import {React,useContext} from 'react'
import { PersonAdd } from '@mui/icons-material'
import { UserContext } from '../../Context/UserProvider'
const Suggestion = (props) => {
  const {userDetails} = useContext(UserContext)
  const token = localStorage.getItem('AIchatToken')
  const addFriend=async(receiverId)=>{
      const response = await fetch('http://localhost:5000/beSocial/add',{method:"POST",headers:{
      'Content-type':'application/json',
      'Authorization':`Bearer ${token}`
    },body:JSON.stringify({receiverId,senderId:userDetails?._id})})
  }
  return (
    <div id='suggestion' className='absolute top-[100%] gap-[20px] bg-white w-[27vw] p-[20px] flex flex-col shadow-md z-3'>
      {props.users.map(val=>(
        <p key={val._id} id={val._id} className='p-[15px] relative shadow-md hover:shadow-lg bg-[#f7f7f7]'>{val.fname + ' ' + val.lname} <PersonAdd onClick={(e)=>{
          addFriend(val._id)
        }} className='text-gray-400 cursor-pointer hover:text-gray-600  absolute right-[5%]'/> </p>
      ))}
      {props.users.length===0?<p className='p-[10px]'>Not found</p>:null}
    </div>
  )
}

export default Suggestion
