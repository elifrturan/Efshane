import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Start from './pages/start/Start';
import SignUp from './pages/signup/SignUp';
import SignIn from './pages/signin/SignIn';
import EmailConfirm from './pages/password/EmailConfirm';
import CodeVerification from './pages/password/CodeVerification';
import PasswordRenewal from './pages/password/PasswordRenewal';
import CategorySelection from './pages/categoryselection/CategorySelection';
import Home from './pages/home/Home';

const routes = createBrowserRouter([
  { path: '/', element: <Start/>, errorElement: <h1>Page not found</h1>},
  { path: '/signup', element: <SignUp/>},
  { path: '/signin', element: <SignIn/>},
  { path: '/emailconfirm', element: <EmailConfirm/>},
  { path: '/emailconfirm/codeverification', element: <CodeVerification/>},
  { path: '/emailconfirm/codeverification/passwordrenewal', element: <PasswordRenewal/>},
  { path: '/categoryselection', element: <CategorySelection/>},
  { path: '/home', element: <Home/>},
])

function App() {

  return (
    <RouterProvider router={routes}/>
  )
}

export default App