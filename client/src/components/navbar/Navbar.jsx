import './navbar.css'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Navbar = () => {
  
  return (
    <div className="navBarContainer">

      <nav className="navbar navbar-dark bg-dark sticky-top h-100">

        <div className="container-fluid">

          <a className="navbar-brand" href="#">Club xxxx</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="offcanvas offcanvas-start text-bg-dark" tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">Dark offcanvas</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>

            <div className="offcanvas-body">

              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Link</a>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Canchas
                  </a>

                  <ul className="dropdown-menu dropdown-menu-dark">
                    <li><Link className="dropdown-item" to='reserves/futbol'>Futbol</Link></li>
                    <li><Link className="dropdown-item" to='reserves/paleta'>Pelota Paleta</Link></li>
                    <li><Link className="dropdown-item" to='reserves/paddle'>Paddle</Link></li>
                    <li><Link className="dropdown-item" to='reserves/squash'>Squash</Link></li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Actividades
                  </a>
                  <ul className="dropdown-menu dropdown-menu-dark">
                    <li><a className="dropdown-item" href="#">Patin</a></li>
                    <li><a className="dropdown-item" href="#">Gimnasia artística</a></li>
                    <li><a className="dropdown-item" href="#">Free dance</a></li>
                    <li><a className="dropdown-item" href="#">Futbol infantil</a></li>
                  </ul>
                </li>
              </ul>

            </div>

          </div>

        </div>

      </nav>

    </div>
  )
}

export default Navbar

