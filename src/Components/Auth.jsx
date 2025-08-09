import  { useState } from 'react'
import Login from './Login'
import Signup from './Signup'

const Auth = () => {
  const [show, setShow] = useState(true)

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-2xl md:w-[35%] w-[95%]  p-6">
        {/* Tabs */}
        <div className="flex justify-around mb-6 border-b-2 border-gray-200">
          <button
            onClick={() => setShow(true)}
            className={`w-full text-center py-2 font-semibold transition ${
              show ? 'border-b-4 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setShow(false)}
            className={`w-full text-center py-2 font-semibold transition ${
              !show ? 'border-b-4 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <div>{show ? <Login /> : <Signup />}</div>
      </div>
    </section>
  )
}

export default Auth
