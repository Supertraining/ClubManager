import './App.css';
import ClubLayout from './components/club/ClubLayout';
import { clubBase } from './lib/clubRoute';
import Login from './pages/auth/login/Login';
import Home from './pages/home/Home';
import FailLogin from './pages/auth/failLogin/FailLogin';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

function App() {
  return (
    <div>
      <Router basename={clubBase || '/'}>
        <ClubLayout>
        <Routes>
          <Route
            exact
            path='/login'
            element={<Login />}
          />

          <Route
            exact
            path='*'
            element={<Home />}
          />

          <Route
            exact
            path='/failLogin'
            element={<FailLogin />}
          />
        </Routes>
        </ClubLayout>
      </Router>
    </div>
  );
}

export default App;
