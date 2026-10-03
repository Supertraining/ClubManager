import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';

import Home from './pages/home/Home';
import Reserves from './pages/reserves/Reserves';
import Activities from './pages/activities/Activities';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Account from './pages/account/Account';
import NotFound from './pages/notFound/NotFound';

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/reserves' element={<Reserves />} />
          <Route path='/activities' element={<Activities />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/account' element={<Account />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer
        position='top-right'
        autoClose={4000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        theme='light'
      />
    </Router>
  );
}

export default App;
