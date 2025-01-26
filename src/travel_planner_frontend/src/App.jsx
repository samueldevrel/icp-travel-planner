import { useState } from 'react';
//import { travel_planner_backend } from 'declarations/travel_planner_backend';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import TravelAIGuide from './components/welcome';
import MainPage from './components/mainpage';
import { AuthProvider } from './auth/authetication';
function App() {


  return (
    <BrowserRouter>
     <AuthProvider>
        <Routes>
          <Route path='/' element={<TravelAIGuide/>}/>
          <Route path='/main' element={<MainPage/>}/>
        </Routes>
        </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
