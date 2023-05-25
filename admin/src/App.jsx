import './App.css'
import Home from './pages/home/Home'
import {
  Route,
  BrowserRouter as Router, Routes,
} from 'react-router-dom'

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route exact path='*' element={<Home />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
