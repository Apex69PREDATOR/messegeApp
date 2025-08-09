import React from 'react'
import Auth from './Components/Auth'
import Individual from './Components/ChatSection/Individual'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
const App = () => {
  const Route=createBrowserRouter([
    {
      path: '/authorize',
      element: <Auth/>
    },
    {
      path: '/',
      element: <Individual/>
    }
  ])
  return (
    <RouterProvider router={Route}/>
  )
}

export default App
