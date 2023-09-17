// formDataSlice.js
import { createSlice } from '@reduxjs/toolkit';

const formDataSlice = createSlice({
  name: 'formData',
  initialState: {
    name: '',
    email: '',
    subject: '',
    message: '',
    recruiter: '',
    timeSlot: '',
  },
  reducers: {
    setFormField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    clearForm: (state) => {
      return {
        name: '',
        email: '',
        subject: '',
        message: '',
        recruiter: '',
        timeSlot: '',
      };
    },
  },
});

export const { setFormField, clearForm } = formDataSlice.actions;
export default formDataSlice.reducer;
