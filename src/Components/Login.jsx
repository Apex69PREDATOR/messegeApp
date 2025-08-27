import { useForm } from 'react-hook-form'
import {  Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../Context/UserProvider'
const Login = () => {
  const nav=useNavigate()
  const {setUserDetails,setCurrentTalk} = useContext(UserContext)
  const { register, handleSubmit } = useForm()

  const logIn = async(data) => {
    // Handle login logic here
     localStorage.removeItem('currentP')
     localStorage.removeItem('currentN')
     await new Promise((resolve)=>(setTimeout(resolve,500)))
     fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login`,{method:"POST",headers:{
      'Content-type':'application/json'
    },body:JSON.stringify(data)}).then(response=>(response.json()).then(result=>{
      alert(result.message)
      if(response.ok && result.success){
     localStorage.setItem('AIchatToken',result?.token)
      delete data.password
      setUserDetails(result.userDih)
      setCurrentTalk(null)
      nav('/')
      }
    }))
  }

  return (
    <form
      onSubmit={handleSubmit(logIn)}
      className="flex flex-col gap-4 bg-[#0d0d2b] text-white p-6 rounded-xl shadow-md"
    >
      <h2 className="text-2xl font-semibold text-center mb-2 text-cyan-400">Welcome Back 👋</h2>

      <input
        type="email"
        placeholder="Email Address"
        {...register('email', { required: true })}
        className="p-3 rounded-lg bg-[#1a1a40] border border-[#2e2e6d] focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />

      <input
        type="password"
        placeholder="Password"
        {...register('password', { required: true })}
        className="p-3 rounded-lg bg-[#1a1a40] border border-[#2e2e6d] focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />

      <p className="text-sm text-cyan-300 hover:underline cursor-pointer text-right">Forgot Password?</p>

      <Button
        type="submit"
        variant="contained"
        sx={{
          bgcolor: '#00FFFF',
          color: '#0d0d2b',
          '&:hover': {
            bgcolor: '#00cccc',
          },
        }}
      >
        Continue
      </Button>
    </form>
  )
}

export default Login
