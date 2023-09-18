// formDataSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { date } from 'yup';

const formDataSlice = createSlice({
  name: 'formData',
  initialState: {
    name: '',
    email: '',
    subject: '',
    message: '',
    recruiter: '',
    timeSlot: '',
    date:''
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
        date:''
      };
    },
    setDate:(state,action)=>{
      state[date] = action.payload
    }
  },
});

export const { setFormField, clearForm ,setDate} = formDataSlice.actions;
export default formDataSlice.reducer;
