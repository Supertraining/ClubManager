import './App.css'
import Navbar from './components/navbar/Navbar'
import Home from './pages/home/Home';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Reserves from './pages/reserves/Reserves';
import Login from './components/login/Login';



function App() {

  return (
    <div className="App">

      <Router>
        <Navbar />
        <Routes>
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/' element={<Home />} />
          <Route exact path='/reserves/:id' element={<Reserves />} />
        </Routes>
      </Router>

    </div>
  )
}

export default App
