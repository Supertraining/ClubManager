import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
const Login = () => {

  const [credentials, setCredentials] = useState({
		username: undefined,
		password: undefined,
	})
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleClick = async() => {

    try {

      const res = await axios.post('http://localhost:8080/login', credentials)
   
      console.log(res)
      navigate('/')
      

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <input className="form-control mt-2"
        id="username"
        name='username'
        placeholder="username"
        type="email"
        onChange={handleChange}
        required />
      <input className="form-control mt-2" id="password"
        name='password'
        placeholder="password"
        type="password"
        onChange={handleChange}
        required />
      <button className="btn btn-success mt-2" onClick={handleClick}>Log In</button>
      <small><Link>Register</Link></small>
    </div>
  )
}

export default Login