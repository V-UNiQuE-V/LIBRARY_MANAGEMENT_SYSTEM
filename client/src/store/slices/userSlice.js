import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {toast} from "react-toastify";
import { toggleAddNewAdminPopup } from "./popUpSlice";


const userSlice = createSlice({
    name: "user",
    initialState: {
        users: [],
        loading: false,
    },
    reducers: {
        fetchAllUsersRequest: (state) => {
            state.loading = true;
        },
        fetchAllUsersSuccess: (state, action) => {
            state.loading = false;
            state.users = action.payload;
        },
        fetchAllUsersFailed: (state) => {
            state.loading = false;
        },
        addNewAdminRequest: (state) => {
            state.loading = true;
        },
        addNewAdminSuccess: (state) => {
            state.loading = false;
        },
        addNewAdminFailed: (state) => {
            state.loading = false;
        },
    },
});

export const fetchAllUsers = () => async (dispatch) => {
    dispatch(userSlice.actions.fetchAllUsersRequest());
    await axios.get("http://localhost:4000/api/v1/user/all", {
        withCredentials: true,
    }).then((res) => {
        dispatch(userSlice.actions.fetchAllUsersSuccess(res.data.users));
    }).catch((err) => {
        dispatch(userSlice.actions.fetchAllUsersFailed(err.response.data.message));
    });
};


//text format: "Content-Type": "application/json", 
//file posting, updation: "Content-Type": "multipart/form-data", 
export const addNewAdmin = (data) => async (dispatch) => {
    dispatch(userSlice.actions.addNewAdminRequest());
    await axios.post("http://localhost:4000/api/v1/user/add/new-admin", data, {
        withCredentials: true,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }).then((res) => {
        dispatch(userSlice.actions.addNewAdminSuccess());
        toast.success(res.data.message);
        dispatch(toggleAddNewAdminPopup());
    }).catch((err) => {
        let errorMessage = "Network Error: Server Unreachable or Connection Lost.";
        
        if (err.response) {
            // Server responded with an error (4xx or 5xx), so err.response is defined.
            // Use the specific message from the server if available, otherwise a generic error.
            errorMessage = err.response.data.message || "An error occurred on the server.";
        }
        
        dispatch(userSlice.actions.addNewAdminFailed(errorMessage));
        toast.error(errorMessage);
    });
}


export default userSlice.reducer;