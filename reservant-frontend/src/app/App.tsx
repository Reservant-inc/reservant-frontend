import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from '../components/routeComponents/ProtectedRoute';
import './App.css';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const updateStatus = () => {
    setIsLoggedIn((prev) => !prev);
  };

fetch

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login updateStatus={updateStatus} />} />
          <Route path='/register' element={<Register updateStatus={updateStatus} />} />
          <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
          
          </Route>
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;