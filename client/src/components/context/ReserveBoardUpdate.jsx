import { createContext, useState } from "react";

export const ReserveBoardContext = createContext();

export const ReserveBoardProvider = ({ children }) => {

  const [reserveDeleted, setReserveDeleted] = useState(false)

  return (

    <ReserveBoardContext.Provider value={{ setReserveDeleted, reserveDeleted: reserveDeleted }}>
      {children}
    </ReserveBoardContext.Provider>
    
  )
} 