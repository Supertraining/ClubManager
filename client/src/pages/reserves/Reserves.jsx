import Football from "../../components/Football/Football"
import Paleta from '../../components/pelotaPaleta/Paleta'
import Paddle from '../../components/paddle/Paddle'
import Squash from '../../components/squash/Squash'
import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"


const Reserves = () => {

  const location = useLocation()
  const id = location.state?.court
  const navigate = useNavigate()
  
  useEffect(() => {

    !id && navigate('/')

  }, [])


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