import React, { useState, useEffect } from 'react';
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from 'react-router-dom';
import Start from './pages/start/Start';
import SignUp from './pages/signup/SignUp';
import SignIn from './pages/signin/SignIn';
import EmailConfirm from './pages/password/EmailConfirm';
import CodeVerification from './pages/password/CodeVerification';
import PasswordRenewal from './pages/password/PasswordRenewal';
import CategorySelection from './pages/categoryselection/CategorySelection';
import Home from './pages/home/Home';
import CategoriesList from './pages/categories/categorylist/CategoriesList';
import CategoryDetails from './pages/categories/categorydetails/CategoryDetails';
import Notifications from './pages/notifications/Notifications';
import Messages from './pages/messages/Messages';
import MessageDetails from './pages/messages/MessageDetails';
import NewMessage from './pages/messages/NewMessage';
import AddSection from './pages/addsection/AddSection';
import NewSection from './pages/addsection/newsection/NewSection';
import CreateStory from './pages/storyWrite/CreateStory';
import ContactUs from './pages/contactus/ContactUs';
import AboutUs from './pages/aboutus/AboutUs';
import AddVoice from './pages/addvoicesection/AddVoice';
import Edit from './pages/addsection/edit/Edit';
import MyStories from './pages/mystories/MyStories';
import Feed from './pages/feed/Feed';
import Profile from './pages/profile/Profile';
import UserProfile from './pages/userprofile/UserProfile';
import BookDetails from './pages/bookdetails/BookDetails';
import AudioBookDetails from './pages/audiobookdetails/AudioBookDetails';
import ReadBook from './pages/readbook/ReadBook';
import ListenAudioBook from './pages/listenaudiobook/ListenAudioBook';
import CustomNavbar from './layouts/navbar/Navbar';
import { UserProvider } from './User.Context';

function Layout() {
  const location = useLocation();

  const noNavbarRoutes = ['/', '/signup', '/signin', '/emailconfirm', '/emailconfirm/codeverification', '/emailconfirm/codeverification/passwordrenewal, /categoryselection'];

  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <CustomNavbar />}
      <Outlet /> 
    </>
  );
}

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Start /> },
      { path: '/signup', element: <SignUp /> },
      { path: '/signin', element: <SignIn /> },
      { path: '/emailconfirm', element: <EmailConfirm /> },
      { path: '/emailconfirm/codeverification', element: <CodeVerification /> },
      { path: '/emailconfirm/codeverification/passwordrenewal', element: <PasswordRenewal /> },
      { path: '/categoryselection', element: <CategorySelection /> },
      { path: '/home', element: <Home /> },
      { path: '/categories', element: <CategoriesList /> },
      { path: '/categories/categoryDetails/:categoryName', element: <CategoryDetails /> },
      { path: '/notifications', element: <Notifications /> },
      { path: '/messages', element: <Messages /> },
      { path: '/messages/:username', element: <MessageDetails /> },
      { path: '/newmessage', element: <NewMessage /> },
      { path: '/createstory', element: <CreateStory /> },
      { path: '/addsection/:bookTitle', element: <AddSection /> },
      { path: '/addsection/:bookTitle/newsection', element: <NewSection /> },
      { path: '/addsection/edit/:bookTitle/:chapterTitle', element: <Edit /> },
      { path: '/contact-us', element: <ContactUs /> },
      { path: '/about-us', element: <AboutUs /> },
      { path: '/add-voice-section/:bookTitle', element: <AddVoice /> },
      { path: '/my-stories', element: <MyStories /> },
      { path: '/feed', element: <Feed /> },
      { path: '/profile/:username', element: <Profile /> },
      { path: '/user/:username', element: <UserProfile /> },
      { path: '/book-details/:bookName', element: <BookDetails /> },
      { path: '/audio-book-details/:bookName', element: <AudioBookDetails/>},
      { path: '/read-book/:bookName', element: <ReadBook/>},
      { path: '/listen-audio-book/:bookName', element: <ListenAudioBook/>},
    ],
  },
]);

function App() {
  return (
    <UserProvider>
      <RouterProvider router={routes} />
    </UserProvider>
  );
}

export default App;