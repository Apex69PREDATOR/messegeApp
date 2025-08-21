import Auth from './Components/Auth'
import Individual from './Components/ChatSection/Individual'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import EditAcount from './Components/Accounts/EditAcount'
const App = () => {
  const Route=createBrowserRouter([
    {
      path: '/authorize',
      element: <Auth/>
    },
    {
      path: '/',
      element: <Individual/>
    },
    {
      path: '/editAccount',
      element: <EditAcount/>
    }
  ])
  return (
    <RouterProvider router={Route}/>
  )
}

export default App
