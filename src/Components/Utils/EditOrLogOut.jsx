
import { Divider } from '@mui/material'
import { Edit,Logout } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../../Context/UserProvider'

const EditOrLogOut = () => {
    const {userDetails} = useContext(UserContext)
    const nav = useNavigate()
    const signOff=()=>{
       localStorage.removeItem(import.meta.env.VITE_USER_AUTH_TOKEN)
       localStorage.removeItem('currentP')
       localStorage.removeItem('currentN')
       nav('/authorize')
    }
    const setUpEdit=()=>{
        localStorage.setItem('efname',userDetails?.fname)
            localStorage.setItem('elname',userDetails?.lname)
            localStorage.setItem('eabout',userDetails?.about)
            localStorage.setItem('email',userDetails?.email)
            localStorage.setItem('ephone',userDetails?.phone)
            localStorage.setItem('ePic',userDetails?.profilePic)
        nav('/editAccount')

    }
  return (
    <div className='p-4 absolute top-[100%] w-40 left-[100%] z-10 py-4 bg-white flex flex-col gap-4 rounded-md shadow-md'>
      <span className='cursor-pointer hover:text-blue-500' onClick={setUpEdit} >
        <Edit className='mx-1'/> Edit Account
      </span>
      <Divider/>
      <span className='cursor-pointer hover:text-red-500' onClick={signOff} >
      <Logout className='mx-2'/> Sign Off
      </span>
    </div>
  )
}

export default EditOrLogOut
