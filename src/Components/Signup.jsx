import {useContext,useState} from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@mui/material'
import { UserContext } from '../Context/UserProvider'

const Signup = () => {
  const { register, handleSubmit } = useForm()
   const {setUserDetails} = useContext(UserContext)
   const [loading,setLoading]  = useState(false)
  const signIn = (data) => {
    // Handle registration logic here
    setLoading(true)
     fetch(`${import.meta.env.VITE_SERVER_URL}/auth/signup`,{method:"POST",headers:{
      'Content-type':'application/json'
    },body:JSON.stringify(data)}).then(response=>(response.json()).then(result=>{
      if(response.ok && result.success){
     localStorage.setItem('AIchatToken',result?.token)
      delete data.password
      delete data.cpassword
      setUserDetails(data)
      }
      alert(result.message)
      setLoading(false)
    })).catch(err=>setLoading(false))
  }

  return (
    <form
      onSubmit={handleSubmit(signIn)}
      className="flex flex-col gap-4 bg-[#0d0d2b] text-white p-6 rounded-xl shadow-md"
    >
      <h2 className="text-2xl font-semibold text-center mb-2 text-cyan-400">Create Your Account 🤖</h2>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="First Name"
          {...register('fname', { required: true })}
          className="w-1/2 p-3 rounded-lg bg-[#1a1a40] border border-[#2e2e6d] focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <input
          type="text"
          placeholder="Last Name"
          {...register('lname', { required: true })}
          className="w-1/2 p-3 rounded-lg bg-[#1a1a40] border border-[#2e2e6d] focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <input
        type="email"
        placeholder="Email"
        {...register('email', { required: true })}
        className="p-3 rounded-lg bg-[#1a1a40] border border-[#2e2e6d] focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />

      <input
        type="text"
        placeholder="Phone Number"
        {...register('phone', { required: true })}
        className="p-3 rounded-lg bg-[#1a1a40] border border-[#2e2e6d] focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />

      <input
        type="password"
        placeholder="Strong Password"
        {...register('password', { required: true })}
        className="p-3 rounded-lg bg-[#1a1a40] border border-[#2e2e6d] focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />

      <input
        type="password"
        placeholder="Repeat Password"
        {...register('cpassword', { required: true })}
        className="p-3 rounded-lg bg-[#1a1a40] border border-[#2e2e6d] focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{
          bgcolor: '#00FFFF',
          color: '#0d0d2b',
          '&:hover': {
            bgcolor: '#00cccc',
          },
        }}
      >
        {loading?<span className='logloader'></span>:'Register'}
      </Button>
    </form>
  )
}

export default Signup
