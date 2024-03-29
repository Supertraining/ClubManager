import './homeText.css';

const HomeText = () => {
  return (
    <div>
      <div className='my-3 p-4 text-center shadow'>
        <h1>Bienvenidos a la app del Ranelagh Club!</h1>
        <h2>Esta es una versión de prueba</h2>
        <p className='my-2 text-primary'>
          Esta App esta desplegada en un servidor gratuito por lo que deberás esperar unos momentos
          hasta que el servidor despierte.
        </p>
        <h5>Por favor, entra al menu, registrate y prueba la app</h5>
        {/* <h2>¡Hacete una cuenta y reserva tu cancha desde donde estés!</h2> */}
        {/* <h5 className='lead text-success d-none d-md-block'>Obtene información sobre las actividades que brindamos en el club o comunicate con nosotros haciendo click en el botón de WhatsApp</h5> */}
      </div>
    </div>
  );
};

export default HomeText;
