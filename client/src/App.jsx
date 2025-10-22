// import React from "react";
import {BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import OTP from "./pages/OTP";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";;
import {ToastContainer, toast} from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./store/slices/authSlice";
import { fetchAllUsers } from "./store/slices/userSlice";
import { fetchAllBooks } from "./store/slices/bookSlice";
import { fetchAllBorrowedBooks, fetchUserBorrowedBooks } from "./store/slices/borrowSlice";

const AppContent = () => {
  const {user, isAuthenticated} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(getUser());
    dispatch(fetchAllBooks());

    if(isAuthenticated && user?.role === "User") {
      console.log("THE LOGGED IN USER IS AN USER");
      dispatch(fetchUserBorrowedBooks());
    }
    if(isAuthenticated && user?.role === "Admin") {
      console.log("THE LOGGED IN USER IS AN ADMIN");
      dispatch(fetchAllUsers());
      dispatch(fetchAllBorrowedBooks());
    }
  }, [isAuthenticated, dispatch, user?.role]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('login') === 'success') {
      toast.success('Google authentication successful!');
      // Clean up URL
      window.history.replaceState({}, '', '/');
    }
    if (params.get('error') === 'authentication_failed') {
      toast.error('Google authentication failed. Please try again.');
      window.history.replaceState({}, '', '/login');
    }
    if (params.get('error') === 'no_user_found') {
      toast.error('Unable to authenticate with Google. Please try again.');
      window.history.replaceState({}, '', '/login');
    }
  }, [location]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/password/forgot" element={<ForgotPassword/>}></Route>
        <Route path="/otp-verification/:email" element={<OTP/>}></Route>
        <Route path="/password/reset/:token" element={<ResetPassword/>}></Route>
      </Routes>
      <ToastContainer theme="dark"/>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
