import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./features/auth/authSlice.jsx";
import { tutorSlice } from "./features/tutor/tutorSlice.jsx";
import { parentSlice } from "./features/parent/parentSlice.jsx";

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        tutorProfile: tutorSlice.reducer,
        parentProfile: parentSlice.reducer,
    }
});

export default store;