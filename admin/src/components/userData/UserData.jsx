import './UserData.css'
const UserData = ({ user }) => {

  return (
    <div>

      <ul
        className='list-unstyled'>
        
        <li>
          {user.nombre}
        </li>

        <li>
          {user.apellido}
        </li>
        
        <li>
          {user.edad}
        </li>

        <li>
          {user.telefono}
        </li>

      </ul>
      
    </div>
  )
}

export default UserData