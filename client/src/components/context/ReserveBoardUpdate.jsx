import { createContext, useState } from "react";
import PropTypes from 'prop-types';

export const ReserveBoardContext = createContext();

export const ReserveBoardProvider = ({ children }) => {

  const [reserveDeleted, setReserveDeleted] = useState(false)

  return (

    <ReserveBoardContext.Provider value={{ setReserveDeleted, reserveDeleted: reserveDeleted }}>
      {children}
    </ReserveBoardContext.Provider>
    
  )
} 

ReserveBoardContext.propTypes = {
  children: PropTypes.node
}