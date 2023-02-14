
import './App.css';
import Info from './components/Info';
import After from './components/After';
import NotFound from './components/NotFound';
import Decoder from './components/Decoder';
import {Routes, Route, NavLink } from 'react-router-dom'



const setActive = ({isActive}) => isActive ? 'activeLink' : '';

const App = () => {


  return (
<div className="App">
  <header>DecoderToABP</header>
  <main>
  <div className='Routing'>
  <NavLink to="/decoder" className={setActive}><a>Decoder</a></NavLink>
    <NavLink to="/info" className={setActive}><a>Что такое Vin</a></NavLink>
    <NavLink to="/after" className={setActive}><a>Afterwords</a></NavLink>
  </div>
  <Routes>
  <Route path="/decoder" element={<Decoder/>}/>
   <Route path="/info" element={<Info/>} />
   <Route path="/after" element={<After/>} />
   <Route path='*' element={<NotFound/>} />
  </Routes>
  </main>
  <footer>Тз для собеседования</footer>
</div>
  );
}

export default App;
