import './App.css'
import Navbar from './components/navigation/pages/navbar/Navbar'
import Home from './pages/home/Home';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Reserves from './pages/reserves/Reserves';
import Footer from './components/footer/components/Footer';
import Register from '../src/pages/register/Register';



function App() {

  return (
    <div className="App col-12">

      <Router>

        <Navbar />
        
        <Routes>

          <Route
            exact path='/'
            element={<Home />}
          />

          <Route
            exact path='/reserves'
            element={<Reserves />}
          />

          <Route
            exact path='/register'
            element={<Register />}
          />

          <Route
            path="*"
            element={<Navigate to="/" replace={true} />}
          />

        </Routes>

        <Footer />

      </Router>

    </div>
  )
}

export default App
