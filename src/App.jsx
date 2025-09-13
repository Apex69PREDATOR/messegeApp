import Auth from './Components/Auth'
import Individual from './Components/ChatSection/Individual'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import EditAcount from './Components/Accounts/EditAcount'
import ViewProfile from './Components/FriendSection/ViewProfile'
import AddPeople from './Components/FriendSection/AddPeople'
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
    },
    {
      path: '/viewProfile',
      element: <ViewProfile/>
    },
    {
      path: '/addPeople',
      element: <AddPeople/>
    }
  ])
  return (
    <RouterProvider router={Route}/>
  )
}

export default App
