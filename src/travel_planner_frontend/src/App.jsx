import {BrowserRouter, Route, Routes} from "react-router-dom"
import TravelAIGuide from './pages/welcome';
import MainPage from './pages/mainpage';
import { AuthProvider } from './components/authetication';
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
