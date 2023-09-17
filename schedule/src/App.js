import React from 'react';
import { Provider } from 'react-redux';
import store from './app/store'
import ModalForm from './Components/ModalForm';
import MyTable from './Components/MyTable';
import CalendarView from './Components/CalendarView';
function App() {
  return (
   <>
   <Provider store={store}>
    <ModalForm />
   </Provider>
    <CalendarView />
   </>
  );
}

export default App;
