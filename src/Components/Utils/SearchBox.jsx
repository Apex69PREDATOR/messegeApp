import {React,useState} from 'react'
import Suggestion from './Suggestion'
import { TextField } from '@mui/material'
const SearchBox = () => {
  const [users,SearchedUsers] = useState(null)
    const search=async(param)=>{
        if(param){
        const response = await fetch('http://localhost:5000/find/search',{method:"POST",headers:{
      'Content-type':'application/json'
    },body:JSON.stringify({param})})
    const result = await response.json()
    if(result.users)
      SearchedUsers(result.users)
}
    }
  return (
     <div className='relative'>
     <TextField variant='standard' label='Search by name or email'  onKeyDownCapture={(e)=>{
        if(e.key==='Enter')
        search(e.target.value)
        if(e.key==='Backspace' && e.target.value.length<=1)
          SearchedUsers(null)
      }  
      }
      id="search"/>
        {users && <Suggestion users={users}/>}
        </div>
  )
}

export default SearchBox
