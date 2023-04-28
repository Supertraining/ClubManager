import Football from "../../components/Football/Football"
import Paleta from '../../components/pelotaPaleta/Paleta'
import Paddle from '../../components/paddle/Paddle'
import Squash from '../../components/squash/Squash'

import { useParams } from "react-router-dom"

const Reserves = () => {

  let { id } = useParams()

  return (
    <>
      {id === 'futbol' && <Football id={id} />}
      {id === 'paleta' && <Paleta id={id} />}
      {id === 'paddle' && <Paddle id={id} />}
      {id === 'squash' && <Squash id={id} />}
    </>
  )
}

export default Reserves