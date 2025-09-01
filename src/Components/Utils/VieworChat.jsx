import {React,useContext} from 'react'
import { RemoveRedEye, Message,} from '@mui/icons-material'
import { Button } from '@mui/material'
import { setCurrentPerson } from '../Utils/UsefullFunctions';
import { UserContext } from '../../Context/UserProvider';
import { useNavigate } from 'react-router-dom';

const VieworChat = (props) => {
  const nav = useNavigate()
  const {setCurrentTalk,setCurrentName,setViewDetailsId} = useContext(UserContext)
  const openChat=(id)=>{
    setCurrentPerson(id,setCurrentTalk,setCurrentName,props?.name)
  }
  const viewProfile=()=>{
      setViewDetailsId(props?.id)
      nav('/viewProfile')
  }
  return (
    <div className='flex flex-col absolute top-[55%] left-[45%] z-2'>
       <Button startIcon={<Message/>}  sx={{
                textTransform: 'none',
                backgroundColor: '#2d2e2e',
                padding :'0.8vw',
                color:'#d7d9d7',
                width:'200px',
                borderRadius:'0',
                '&:hover': { backgroundColor: '#202121' },
              }} variant='text' onClick={()=>{openChat(props?.id)}}>Chat with {props?.name}</Button>
       <Button onClick={viewProfile} startIcon={<RemoveRedEye/>} sx={{
                textTransform: 'none',
                backgroundColor: '#2d2e2e',
                padding: '0.8vw',
                width:'200px',
                borderTop: '1px solid white',
                color:'#d7d9d7',
                borderRadius:'0',
                '&:hover': { backgroundColor: '#202121' },
              }} variant='text'>View Profile</Button>
    </div>
  )
}

export default VieworChat
    