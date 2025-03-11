import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tutor: {
        _id: null,
        userId: null,
        qualifications: null,
        subjects: null,
        grades: null,
        experience: null,
        languages: null,
        gender: null,
        teachingMethodology: null,
        availability: null,
        rating: null,
        reviews: null,
        certifications: null
    },
    loading: false,
    error: null
};

export const tutorSlice = createSlice({
    name: "tutorProfile",
    initialState,
    reducers: {
        profile: (state, action) => {
            const { _id, userId, qualifications, subjects, grades, experience, languages, gender, teachingMethodology, availability, rating, reviews, certifications } = action.payload;
            state.tutor._id = _id;
            state.tutor.userId = userId;
            state.tutor.qualifications = qualifications;
            state.tutor.subjects = subjects;
            state.tutor.grades = grades;
            state.tutor.experience = experience;
            state.tutor.languages = languages;
            state.tutor.gender = gender;
            state.tutor.teachingMethodology = teachingMethodology;
            state.tutor.availability = availability;
            state.tutor.rating = rating;
            state.tutor.reviews = reviews;
            state.tutor.certifications = certifications;
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
export const { profile, setError, setLoading } = tutorSlice.actions;

// Selectors
export const selectTutor = (state) => state.tutorProfile;
export const selectTutorInfo = (state) => state.tutorProfile.tutor;
//export const selectTutor = (state) => state.tutor; // Ensure this matches the key in the store
export const selectSubject = (state) => state.tutorProfile.tutor.subjects;

export default tutorSlice.reducer;
