import './App.css';
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import Home from './pages/home/Home';
import Reserves from './pages/reserves/Reserves';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import NotFound from './pages/notFound/NotFound';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

function App() {
  return (
    <div className='App col-12'>
      <Router>
        <Navbar />

        <main>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/reserves' element={<Reserves />} />
            <Route exact path='/login' element={<Login />} />
            <Route exact path='/register' element={<Register />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
