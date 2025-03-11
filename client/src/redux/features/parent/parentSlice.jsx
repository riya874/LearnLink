import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    parent: {
        _id: null,
        userId: null,
        children: {
            name: null,
            school: null,
            grade: null
        },
        preferences: {
            subjects: null,
            teachingStyle: null,
            languagePreference: null,
            tutorGender: null
        },
    },
    loading: false,
    error: null
};

export const parentSlice = createSlice({
    name: "parentProfile",
    initialState,
    reducers: {
        profile: (state, action) => {
            const { _id, userId, children, preferences } = action.payload;
            state.parent._id = _id;
            state.parent.userId = userId;
            state.parent.children = children;
            state.parent.preferences = preferences;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

// Export actions
export const { profile, setError, setLoading } = parentSlice.actions;

// Selectors
export const selectParent = (state) => state.parentProfile;
export const selectParentInfo = (state) => state.parentProfile.parent;
export const selectChildren = (state) => state.parentProfile.parent.children;

export default parentSlice.reducer;
