import Football from "../../components/courts/football/Football"
import Paleta from '../../components/courts/pelotaPaleta/Paleta'
import Paddle from '../../components/courts/paddle/Paddle'
import Squash from '../../components/courts/squash/Squash'
import { useNavigate, useLocation } from "react-router-dom"
import { useContext, useEffect } from "react"
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