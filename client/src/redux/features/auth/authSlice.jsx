// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     user: {
//         _id: null,
//         username: null,
//         email: null,
//         isVerified: null,
//         role: null,
//         phone: null,
//         address: null,
//         pincode: null,
//         profilePhoto: null
//     },
//     loading: false,
//     error: null
// };

// export const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers: {
//         login: (state, action) => {
//             const { _id, username, email, isVerified, role, phone, address, pincode, profilePhoto } = action.payload;
//             state.user._id = _id;
//             state.user.username = username;
//             state.user.email = email;
//             state.user.isVerified = isVerified;
//             state.user.role = role;
//             state.user.phone = phone;
//             state.user.address = address;
//             state.user.pincode = pincode;
//             state.user.profilePhoto = profilePhoto;
//             state.loading = false;
//             state.error = null;
//         },
//         logout: (state) => {
//             state.user = {
//                 _id: null,
//                 username: null,
//                 email: null,
//                 isVerified: null,
//                 role: null,
//             };
//             state.loading = false;
//             state.error = null;
//         },
//         setLoading: (state, action) => {
//             state.loading = action.payload;
//         },
//         setError: (state, action) => {
//             state.error = action.payload;
//         }
//     }
// });

// // Export actions
// export const { login, logout, setLoading, setError } = authSlice.actions;

// // Selectors
// export const selectAuth = (state) => state.auth; // Ensure this matches the key in the store
// export const selectUser = (state) => state.auth.user;
// export const selectUserRole = (state) => state.auth.user.role;
// export const selectUserEmail = (state) => state.auth.user.email;
// export const selectIsVerified = (state) => state.auth.user.isVerified;

// export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    _id: null,
    username: null,
    email: null,
    isVerified: null,
    role: null,
    phone: null,
    address: null,
    pincode: null,
    profilePhoto: null,
  },
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { _id, username, email, isVerified, role, phone, address, pincode, profilePhoto } = action.payload;
      state.user._id = _id;
      state.user.username = username;
      state.user.email = email;
      state.user.isVerified = isVerified;
      state.user.role = role;
      state.user.phone = phone;
      state.user.address = address;
      state.user.pincode = pincode;
      state.user.profilePhoto = profilePhoto;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      console.log("Logout action triggered");
      state.user = {
        _id: null,
        username: null,
        email: null,
        isVerified: null,
        role: null,
        phone: null,
        address: null,
        pincode: null,
        profilePhoto: null,
      };
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Export actions
export const { login, logout, setLoading, setError } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth; // Ensure this matches the key in the store
export const selectUser = (state) => state.auth.user;
export const selectUserRole = (state) => state.auth.user.role;
export const selectUserEmail = (state) => state.auth.user.email;
export const selectIsVerified = (state) => state.auth.user.isVerified;

export default authSlice.reducer;
