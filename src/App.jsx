import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Start from './pages/start/Start';
import SignUp from './pages/signup/SignUp';
import SignIn from './pages/signin/SignIn';

const routes = createBrowserRouter([
  { path: '/', element: <Start/>},
  { path: '/signup', element: <SignUp/>},
  { path: '/signin', element: <SignIn/>}
])

function App() {

  return (
    <RouterProvider router={routes}/>
  )
}

export default App
