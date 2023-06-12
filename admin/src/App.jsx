import './App.css'
import Login from './components/login/Login'
import Home from './pages/home/Home'
import FailLogin from './components/faillogin/FailLogin'
import {
  Route,
  BrowserRouter as Router, Routes,
} from 'react-router-dom'
import CreateUser from './components/createUser/CreateUser'

function App() {

  return (
    <div>
      <Router>
        <Routes>

          <Route
            exact path='/login'
            element={ <Login/> }
          />

          <Route
            exact path='*'
            element={<Home />}
          />

          <Route
            exact path='/failLogin'
            element={<FailLogin />}
          />
          
        </Routes>
      </Router>
    </div>
  )
}

export default App
