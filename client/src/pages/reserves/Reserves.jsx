import Football from "../../components/football/Football"
import Paleta from '../../components/pelotaPaleta/Paleta'
import Paddle from '../../components/paddle/Paddle'
import Squash from '../../components/squash/Squash'
import { useNavigate, useLocation } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../components/context/AuthContext"


const Reserves = () => {
  const { user } = useContext(AuthContext)
  
  const location = useLocation()
  const id = location.state?.court
  const navigate = useNavigate()
  
  useEffect(() => {

    if (!id || !user) navigate('/')

  }, [user])


  return (
    <>
      {id === 'futbol' && <Football court={id} />}
      {id === 'paleta' && <Paleta court={id} />}
      {id === 'paddle' && <Paddle court={id} />}
      {id === 'squash' && <Squash court={id} />}
    </>
  )
}

export default Reserves