import './App.css';
import React from 'react';

import Home from './pages/Home';
import PainInfo from './pages/painInfo/painInfo';
import UserInfo from './pages/userInfo/userInfo';
import MedicineInfo from './pages/medicineInfo/medicineInfo';
import LocationInfo from './pages/locationInfo/locationInfo';

import FindMedicine from './pages/findmedicine/findmedicine';
import ResultMap from './pages/resultMap/resultMap';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/painInfo" element={<PainInfo />}></Route>
        <Route path="/userInfo" element={<UserInfo />}></Route>
        <Route path="/medicineInfo" element={<MedicineInfo />}></Route>
        <Route path="/locationInfo" element={<LocationInfo />}></Route>
        <Route path="/findMedicine" element={<FindMedicine />}></Route>
        <Route path="/resultMap" element={<ResultMap />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
